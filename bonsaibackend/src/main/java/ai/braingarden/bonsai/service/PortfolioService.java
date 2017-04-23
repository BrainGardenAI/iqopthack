package ai.braingarden.bonsai.service;

import ai.braingarden.bonsai.model.LK;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@RestController
public class PortfolioService {

    private static final Logger logger = LoggerFactory.getLogger(PortfolioService.class);

    public static final String RUN_PORTFOLIO_URL = "http://192.168.43.176:5000/pot";

    private AtomicReference<LK> deposit = new AtomicReference<>(new LK());

    private AtomicBoolean computed = new AtomicBoolean(false);

    @PostMapping("/portfolio/lk")
    public void postLK(@RequestBody LK lk) {
        deposit.set(lk);
    }

    @GetMapping("/portfolio/lk")
    public LK getLK() {
        return deposit.get();
    }


    @GetMapping("/portfolio/computed")
    public boolean isComputed() {
        return computed.get();
    }

    @PostMapping("/portfolio/computed")
    public void setComputed() {
        logger.info("Portfolio set computed");
        computed.set(true);
    }

    @PostMapping("/portfolio/create")
    public void createPortfolio (
            @RequestParam("money") double money,
            @RequestParam("risk") double risk
    ) {
        logger.info("Create portfolio request");
        computed.set(false);

        CompletableFuture.runAsync( () -> {
            RestTemplate rest = new RestTemplate();
            rest.getForEntity(RUN_PORTFOLIO_URL + "?money=" + money + "&risk=" + risk, Void.class);
        });
    }


}
