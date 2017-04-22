package ai.braingarden.bonsai.model.graph;

import java.util.*;


public class PortfolioGraph {

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

        Map<PortfolioNode, List<PortfolioNode>> childrens = new HashMap<>();
        childrens.put(n, nodes.get(nodeId).getChildren());
        for ( int i = 0; i < depth; i++ ) {
            Map<PortfolioNode, List<PortfolioNode>> newChildrens = new HashMap<>();

            for(Map.Entry<PortfolioNode, List<PortfolioNode>> parent : childrens.entrySet()) {
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
        return getForDepth(root.getId(), 2);
    }

    public void putNode(PortfolioNode np) {
        ids.add(np.getId());
        if ( !items.containsKey(np.getId()) )
            items.put(np.getId(), new PortfolioItem(np.getId()));
        nodes.put(np.getId(), np);
        for(PortfolioNode c : np.getChildren())
            putNode(c);
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

}
