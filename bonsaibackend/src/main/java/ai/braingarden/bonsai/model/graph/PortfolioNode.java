package ai.braingarden.bonsai.model.graph;

import java.io.Serializable;
import java.util.*;


public class PortfolioNode implements Serializable {

    private String id;
    private String parentId = null;
    private boolean leaf = true;


    private Set<PortfolioNode> children = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public void addChild(PortfolioNode child) {
        children.add(child);
        child.setParentId(id);
        leaf = false;
    }

    public void removeChild(PortfolioNode child) {
        children.remove(child);
        if(children.isEmpty())
            leaf = true;
    }

    public Set<PortfolioNode> getChildren() {
        return Collections.unmodifiableSet(children);
    }

    public boolean isLeaf() {
        return leaf;
    }


    //--copy-subtree---------------------------------------------------------

    public PortfolioNode copyDepth(int depth) {
        if(depth == 0)
            return copyEmpty();
        else {
            PortfolioNode node = copyEmpty();
            for ( PortfolioNode c : children )
                node.children.add( c.copyDepth(depth - 1) );
            return node;
        }
    }

    public PortfolioNode copyEmpty() {
        PortfolioNode n = new PortfolioNode();
        n.setId(id);
        n.parentId = parentId;
        n.leaf = leaf;
        return n;
    }
}
