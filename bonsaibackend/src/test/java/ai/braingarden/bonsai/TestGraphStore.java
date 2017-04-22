package ai.braingarden.bonsai;


import ai.braingarden.bonsai.model.graph.PortfolioItem;
import ai.braingarden.bonsai.model.graph.PortfolioNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class TestGraphStore {

    public static void main(String... args) {

        final String host = "http://localhost:8080/";
        RestTemplate rest = new RestTemplate();

        //delete root
        rest.delete(host + "graph/root");

        PortfolioNode root = new PortfolioNode();
        root.setId("c");
        createChildren(root, 6, 5);

        List<PortfolioItem> items = createItems(root);

        rest.postForEntity(host + "graph/root", root, Void.class);
        rest.postForEntity(host + "graph/items", items, Void.class);
    }


    private static void createChildren(PortfolioNode parent, int depth, int branches) {
        if(depth == 0)
            return;

        for(int i=0; i < branches; i++) {
            PortfolioNode child = new PortfolioNode();
            child.setId(parent.getId() + i);
            parent.addChild(child);
            createChildren(child, depth - 1, branches);
        }
    }



    private static List<PortfolioItem> createItems(PortfolioNode root) {

        List<PortfolioItem> result = new ArrayList<PortfolioItem>();
        Random random = new Random();


        List<PortfolioNode> children = Arrays.asList(root);
        while(!children.isEmpty()) {
            List<PortfolioNode> newChildren = new ArrayList<>();
            for(PortfolioNode pn : children) {
                PortfolioItem item = new PortfolioItem();
                item.setId(pn.getId());
                item.setCurrent_value(random.nextDouble());
                item.setDay_profit(random.nextDouble());
                item.setGlobal_perc(random.nextDouble());
                item.setLocal_perc(random.nextDouble());
                item.setMonth_profit(random.nextDouble());
                item.setWeek_profit(random.nextDouble());
                result.add(item);
                newChildren.addAll(pn.getChildren());
            }
            children = newChildren;
        }

        return result;
    }

}
