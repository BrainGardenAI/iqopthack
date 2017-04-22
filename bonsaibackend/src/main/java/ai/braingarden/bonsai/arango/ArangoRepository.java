package ai.braingarden.bonsai.arango;


import com.arangodb.ArangoDB;
import com.arangodb.ArangoDatabase;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class ArangoRepository {

    public static final String HOST = "localhost";
    public static final int PORT = 8529;
    public static final String DATABASE = "bonsai";
    public static final String COLLECTION_PORTFOLIO = "portfolios";
    public static final String GRAPH_PORTFOLIO = "bonsai1";


    private ArangoDB arango;
    private ArangoDatabase database;

    public void init() {
        arango = new ArangoDB.Builder()
                .host(HOST)
                .port(PORT)
                .build();
        database = arango.db(DATABASE);
    }


    public void createPortfolio(String key, Map<String, String> properties) {
//        database
//                .collection(COLLECTION_PORTFOLIO)
//                .insertDocument()
    }


}
