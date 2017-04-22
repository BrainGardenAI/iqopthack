package ai.braingarden.bonsai.rest;

import ai.braingarden.bonsai.model.graph.PortfolioGraph;
import ai.braingarden.bonsai.model.graph.PortfolioItem;
import ai.braingarden.bonsai.model.graph.PortfolioNode;
import org.springframework.web.bind.annotation.*;

@RestController
public class GraphRest {

    private PortfolioGraph graph = new PortfolioGraph();

    @GetMapping("/graph/getfordepth/{id}")
    public @ResponseBody PortfolioNode getForDepth(
            @PathVariable("id")    String nodeId,
            @RequestParam("depth") int depth
    ) {
        return graph.getForDepth(nodeId, depth);
    }

    @GetMapping("/graph/root")
    public @ResponseBody PortfolioNode getRoot() {
        return graph.getRoot();
    }

    @GetMapping("/graph/item/{id}")
    public @ResponseBody PortfolioItem getItem(@PathVariable("id") String id) {
        return graph.getItem(id);
    }

    @PostMapping("/graph/item")
    public void putNode(PortfolioNode node) {
        
    }


}
