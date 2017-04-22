package ai.braingarden.bonsai.rest;

import ai.braingarden.bonsai.model.DataEntry;
import ai.braingarden.bonsai.repository.DatasetRepository;
import ai.braingarden.bonsai.repository.InstrumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class TickerRest {

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private DatasetRepository datasetRepository;

    @GetMapping(path = "/instruments/getallids")
    public List<String> getAllIds() {
        return instrumentRepository.getAllIds();
    }

    @GetMapping(path = "/instruments/daily/{id}")
    public List<DataEntry> getDayAggregation(@PathVariable("id") String instId) {
        List<DataEntry> minSet = datasetRepository.readData(instId);

        if(minSet.size() == 0)
            return new ArrayList<>();

        List<DataEntry> dayEntries = minSet
                .stream()
                .collect( Collectors.groupingBy( e -> e.getTimestamp().truncatedTo(ChronoUnit.DAYS) ) )
                .entrySet()
                .stream()
                .map( entry -> {
                    Instant day = entry.getKey();
                    DataEntry result = new DataEntry();
                    result.setTimestamp(day);
                    result.setInstrumentId(instId);

                    DataEntry latest   = entry.getValue().get(0);
                    DataEntry earliest = entry.getValue().get(0);
                    double high  = Integer.MIN_VALUE;
                    double low   = Integer.MAX_VALUE;
                    int volumeSum = 0;
                    for(DataEntry e : entry.getValue()) {
                        if(e.getTimestamp().isAfter(latest.getTimestamp()))
                            latest = e;
                        if(earliest.getTimestamp().isAfter(e.getTimestamp()))
                            earliest = e;
                        if(e.getD2() > high)
                            high = e.getD2();
                        if(e.getD3() < low)
                            low  = e.getD3();
                        volumeSum += e.getI();
                    }

                    result.setD1(earliest.getD1());
                    result.setD2(high);
                    result.setD3(low);
                    result.setD4(latest.getD4());
                    result.setI(volumeSum);

                    return result;
                }).collect(Collectors.toList());

        return dayEntries;
    }

}
