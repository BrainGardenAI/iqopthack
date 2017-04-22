package ai.braingarden.bonsai.model.graph;

import ai.braingarden.bonsai.utils.AsyncPersistenceManager;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.Serializable;
import java.util.*;


public class PortfolioGraph implements Serializable {

    private PortfolioNode root;

    private Set<String> ids = new HashSet<>();

    private Map<String, PortfolioItem> items = new HashMap<>();

    private Map<String, PortfolioNode> nodes = new HashMap<>();

    public PortfolioItem getItem(String id) {
        if(!ids.contains(id))
            throw new IllegalArgumentException("Graph doesn't contain node " + id);
        return items.get(id);
    }


    /**
     * @param nodeId
     * @param depth copyt depth, starts from 1
     * @return
     */
    public PortfolioNode getForDepth(String nodeId, int depth) {
        if(depth < 0)
            throw new IllegalArgumentException("Depth should be more than 0");

        if ( !ids.contains(nodeId) )
            throw new RuntimeException("Node " + nodeId + " was not found");
        PortfolioNode n = nodes.get(nodeId).copyEmpty();

        Map<PortfolioNode, Set<PortfolioNode>> childrens = new HashMap<>();
        childrens.put(n, nodes.get(nodeId).getChildren());
        for ( int i = 0; i < depth; i++ ) {
            Map<PortfolioNode, Set<PortfolioNode>> newChildrens = new HashMap<>();

            for(Map.Entry<PortfolioNode, Set<PortfolioNode>> parent : childrens.entrySet()) {
                for(PortfolioNode pn : parent.getValue()) {
                    PortfolioNode childCopy = pn.copyEmpty();
                    parent.getKey().getChildren().add(childCopy);
                    newChildrens.put(childCopy, pn.getChildren());
                }
            }

            childrens = newChildrens;
        }

        return n;
    }

    public PortfolioNode getRoot() {
        if(root == null)
            return null;
        return getForDepth(root.getId(), 2);
    }

    public void putNode(PortfolioNode np, String parentId) {

        if(parentId == null)
            this.root = np;

        if(parentId != null) {
            PortfolioNode parent = nodes.get(parentId);
            if(parent == null)
                throw new IllegalArgumentException("There is no node " + parentId);
            parent.getChildren().add(np);
        }

        ids.add(np.getId());

        if ( !items.containsKey(np.getId()) )
            items.put(np.getId(), new PortfolioItem(np.getId()));
        nodes.put(np.getId(), np);
        for(PortfolioNode c : np.getChildren())
            putNode(c, np.getId());
    }

    public boolean deleteNode(String id) {
        if(ids.contains(id)) {
            ids.remove(id);
            PortfolioNode node = nodes.remove(id);
                                 items.remove(id);
            for(PortfolioNode c : node.getChildren())
                deleteNode(c.getId());
            return true;
        }
        return false;
    }

    public void putItem(PortfolioItem item) {
        if(!ids.contains(item.getId()))
            throw new IllegalArgumentException("Graph has no node " + item.getId());
        items.put(item.getId(), item);
    }


    //------------------------------------------------------------------------------------------





}
