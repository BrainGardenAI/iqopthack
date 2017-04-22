package ai.braingarden.bonsai.service;

import ai.braingarden.bonsai.model.graph.PortfolioGraph;
import ai.braingarden.bonsai.utils.AsyncPersistenceManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class GraphService {

    public static final Logger logger = LoggerFactory.getLogger(GraphService.class);

    public static final transient String GRAPH_KEY = "GRAPH";
    public static final transient String DB_PATH = "graph.store";

    private transient AsyncPersistenceManager<PortfolioGraph> saver =
            new AsyncPersistenceManager<>(PortfolioGraph.class, DB_PATH);

    private volatile PortfolioGraph graph;

    @PostConstruct
    public void start() {
        saver.start();

        loadTree();
    }

    @PreDestroy
    public void stop() {
        saver.stop();
    }

    public PortfolioGraph getGraph() {
        return graph;
    }

    public void saveGraphAsync() {
        saver.putObject ( GRAPH_KEY, this.graph );
    }

    public void loadTree() {
        saver.loadObject ( GRAPH_KEY )
             .thenAccept( graph -> {
                 if(graph == null)
                     this.graph = new PortfolioGraph();
                 else
                     this.graph = graph;
             }).join();
    }

}
