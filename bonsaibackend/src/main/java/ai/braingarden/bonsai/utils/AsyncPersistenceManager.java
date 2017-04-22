package ai.braingarden.bonsai.utils;

import org.boon.slumberdb.leveldb.SimpleKryoKeyValueStoreLevelDB;

import java.io.Serializable;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class AsyncPersistenceManager<T extends Serializable> {

    private final Class<T> entityType;
    private final String storagePath;

    private final AtomicInteger tasksInQueue = new AtomicInteger(0);

    public AsyncPersistenceManager(Class<T> entityType, String storagePath) {
        this.entityType = entityType;
        this.storagePath = storagePath;
    }

    private ExecutorService executor;
    private SimpleKryoKeyValueStoreLevelDB<T> storage;

    public void start() {
        executor = Executors.newFixedThreadPool(1);
        storage = new SimpleKryoKeyValueStoreLevelDB<T>(storagePath, entityType );
    }

    public void stop() {
        if(executor != null)
            executor.shutdown();
        if(storage != null && !storage.isClosed())
            storage.close();
    }

    public String getStoragePath() {
        return storagePath;
    }

    //--api-------------------------------------------------------------------------------------------------------------

    public CompletableFuture<Void> putObject(String key, T object) {
        return CompletableFuture
                .runAsync(  () -> {
                    tasksInQueue.incrementAndGet();
                    storage.put(key, object);
                    tasksInQueue.decrementAndGet();
                }, executor );
    }

    public CompletableFuture<Void> deleteObject(String sid) {
        return CompletableFuture
                .runAsync( () -> {
                    tasksInQueue.incrementAndGet();
                    storage.remove(sid);
                    tasksInQueue.decrementAndGet();
                }, executor );
    }


    public CompletableFuture<T> loadObject(String key) {
        return CompletableFuture
                .supplyAsync( () -> {
                    tasksInQueue.incrementAndGet();
                    T result = storage.load(key);
                    tasksInQueue.decrementAndGet();
                    return result;
                }, executor );
    }

    public CompletableFuture<Collection<String>> loadKeys() {
        return CompletableFuture
                .supplyAsync( () -> {
                    tasksInQueue.incrementAndGet();
                    Collection<String> result = storage.loadAllKeys();
                    tasksInQueue.decrementAndGet();
                    return result;
                }, executor );
    }

    public CompletableFuture<Collection<T>> loadAllValues() {
        return CompletableFuture
                .supplyAsync( () -> storage.loadAllByKeys(storage.loadAllKeys()).values() );
    }


}
