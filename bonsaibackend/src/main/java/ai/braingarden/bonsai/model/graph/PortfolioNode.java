package ai.braingarden.bonsai.model.graph;

import java.util.ArrayList;
import java.util.List;


public class PortfolioNode {

    private String id;

    private List<PortfolioNode> children = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<PortfolioNode> getChildren() {
        return children;
    }

    public PortfolioNode copyEmpty() {
        PortfolioNode n = new PortfolioNode();
        n.setId(id);
        return n;
    }
}
