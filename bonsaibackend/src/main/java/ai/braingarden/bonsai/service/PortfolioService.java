package ai.braingarden.bonsai.service;

import ai.braingarden.bonsai.model.LK;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@RestController
public class PortfolioService {

    public static final String RUN_PORtFOLIO_URL = "";

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
        computed.set(true);
    }

    @PostMapping("/portfolio/create")
    public void createPortfolio (
            @RequestParam("money") double money
    ) {
        computed.set(false);

        RestTemplate rest = new RestTemplate();
//        rest.postForEntity("")
    }


}
