package ai.braingarden.bonsai.rest;

import ai.braingarden.bonsai.model.graph.PortfolioItem;
import ai.braingarden.bonsai.model.graph.PortfolioNode;
import ai.braingarden.bonsai.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class GraphRest {

    @Autowired
    private GraphService graphService;

    @GetMapping("/graph/getfordepth/{id}")
    public @ResponseBody PortfolioNode getForDepth(
            @PathVariable("id")    String nodeId,
            @RequestParam("depth") int depth
    ) {
        return graphService.getGraph().getForDepth(nodeId, depth);
    }

    @GetMapping("/graph/root")
    public @ResponseBody PortfolioNode getRoot() {
        return graphService.getGraph().getRoot();
    }

    @GetMapping("/graph/item/{id}")
    public @ResponseBody PortfolioItem getItem(@PathVariable("id") String id) {
        return graphService.getGraph().getItem(id);
    }

    @GetMapping("/graph/leafs/{id}")
    public @ResponseBody List<PortfolioNode> getLeafs(@PathVariable String id) {
        return graphService.getGraph().getLeafsOf(id);
    }

    @PostMapping("/graph/get-items")
    public @ResponseBody List<PortfolioItem> getItems(@RequestBody List<String> ids) {
        return ids.stream().map( graphService.getGraph()::getItem ).collect(Collectors.toList());
    }

    @PostMapping("/graph/node/{parentId}")
    public void putNode(@RequestBody PortfolioNode node, @PathVariable("parentId") String parentId) {
        graphService.getGraph().putNode(node, parentId);
        graphService.saveGraphAsync();
    }


    @PostMapping("/graph/root")
    public void putRoot(@RequestBody PortfolioNode node) {
        graphService.getGraph().putNode(node, null);
        graphService.saveGraphAsync();
    }

    @DeleteMapping("/graph/root")
    public void deleteRoot() {
        graphService.getGraph().deleteRoot();
        graphService.saveGraphAsync();
    }

    @PostMapping("/graph/item")
    public void putItem(@RequestBody PortfolioItem item) {
        graphService.getGraph().putItem(item);
        graphService.saveGraphAsync();
    }

    @PostMapping("/graph/items")
    public void putItems(@RequestBody List<PortfolioItem> items) {
        for(PortfolioItem pi : items)
            graphService.getGraph().putItem(pi);
        graphService.saveGraphAsync();
    }

    @DeleteMapping("/graph/node/{id}")
    public void deleteNode(@PathVariable("id") String id) {
        graphService.getGraph().deleteNode(id);
        graphService.saveGraphAsync();
    }


}
