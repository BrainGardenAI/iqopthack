package ai.braingarden.bonsai.model.graph;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class PortfolioNode implements Serializable {

    private String id;

    private Set<PortfolioNode> children = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<PortfolioNode> getChildren() {
        return children;
    }

    public PortfolioNode copyEmpty() {
        PortfolioNode n = new PortfolioNode();
        n.setId(id);
        return n;
    }
}
