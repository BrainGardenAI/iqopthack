package ai.braingarden.bonsai.service;

import ai.braingarden.bonsai.model.LK;
import com.google.common.util.concurrent.AtomicDouble;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicReference;

@RestController
public class PortfolioService {

    private AtomicReference<LK> deposit = new AtomicReference<>(new LK());

    @PostMapping("/portfolio/lk")
    public void postLK(@RequestBody LK lk) {
        deposit.set(lk);
    }

    @GetMapping("/portfolio/lk")
    public LK getLK() {
        return deposit.get();
    }


}
