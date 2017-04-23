package ai.braingarden.bonsai.model.graph;


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

        PortfolioNode n = nodes.get(nodeId);
        return n.copyDepth(depth);
    }

    public PortfolioNode getRoot() {
        if(root == null)
            return null;
        return getForDepth(root.getId(), 2);
    }

    public void putNode(PortfolioNode np, String parentId) {
        if(parentId == null && root != null)
            throw new IllegalStateException("Root exists, delete it before adding new one");

        if(parentId == null)
            this.root = np;

        if(parentId != null) {
            PortfolioNode parent = nodes.get(parentId);
            if(parent == null)
                throw new IllegalArgumentException("There is no node " + parentId);
            parent.addChild(np);
        }

        ids.add(np.getId());

        //put default item
        if ( !items.containsKey(np.getId()) )
            items.put(np.getId(), new PortfolioItem(np.getId()));

        //put node intself in the registry
        nodes.put(np.getId(), np);

        //add recursively all its children
        for(PortfolioNode c : np.getChildren())
            putNode(c, np.getId());
    }

    public void deleteRoot() {
        ids.clear();
        items.clear();
        nodes.clear();
        root = null;
    }

    public boolean deleteNode(String id) {
        if(ids.contains(id)) {
            ids.remove(id);
            PortfolioNode node = nodes.remove(id);
                                 items.remove(id);
            PortfolioNode parent = nodes.get(node.getId());
            if ( parent != null )
                parent.removeChild(node);

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

    public List<PortfolioNode> getLeafsOf(String nodeId) {
        if(!ids.contains(nodeId))
            throw new IllegalArgumentException("Graph doesn't contain node " + nodeId);

        PortfolioNode node = nodes.get(nodeId);
        List<PortfolioNode> leafs = new ArrayList<>();

        if(node.isLeaf()) {
            leafs.add(node);
            return leafs;
        }

        List<PortfolioNode> children = Arrays.asList(node);
        while(!children.isEmpty()) {
            List<PortfolioNode> newChildren = new ArrayList<>();
            for(PortfolioNode pn : children) {
                for(PortfolioNode ch : pn.getChildren())
                    if ( ch.isLeaf() )
                        leafs.add(ch);
                    else
                        newChildren.add(ch);
            }
            children = newChildren;
        }
        return leafs;
    }

    //------------------------------------------------------------------------------------------





}
