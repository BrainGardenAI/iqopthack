package ai.braingarden.bonsai.rest;


import ai.braingarden.bonsai.model.DataEntry;
import ai.braingarden.bonsai.repository.DatasetRepository;
import ai.braingarden.bonsai.repository.InstrumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@RestController
public class DataManageRest {

    public static final Logger logger = LoggerFactory.getLogger(DataManageRest.class);

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private InstrumentRepository instrumentRepository;

    final String path = "/home/veter/projects/braingarden/fintechhack/snp/";


    @PostMapping("/testimport")
    public void importData() {
        final File file = new File(path);
        if ( file.isDirectory() ) {
            for ( File f : file.listFiles() ) {
                if ( !f.getName().contains("_")   &&
                     !f.getName().contains("\\(") &&
                     !f.getName().contains("\\)") &&
                     !f.getName().contains("(") ) {

                    String[] fields = f.getName().split("\\.");
                    if(fields.length != 2)
                        continue;

                    String inst = fields[0];

                    boolean created = datasetRepository.createTable(inst);

                    if(!created) {
                        logger.info("skip");
                        continue;
                    }

                    List<DataEntry> entries = readDataset(inst);
                    datasetRepository.insertData(inst, entries);
                }
            }
        }
    }

    private SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm");

    private List<DataEntry> readDataset(String inst) {
        final File file = new File(path + inst + ".txt");
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            List<DataEntry> result = new ArrayList<>();

            String line = null;
            while( (line = br.readLine()) != null) {
                String[] fields = line.split(",");
                Instant ts = sdf
                        .parse(fields[0] + " " + fields[1])
                        .toInstant()
                        .truncatedTo(ChronoUnit.MINUTES);

                double d1 = Double.parseDouble(fields[2]);
                double d2 = Double.parseDouble(fields[3]);
                double d3 = Double.parseDouble(fields[4]);
                double d4 = Double.parseDouble(fields[5]);
                int     i = Integer.parseInt(fields[6]);

                DataEntry de = new DataEntry();
                de.setInstrumentId(inst);
                de.setTimestamp(ts);
                de.setD1(d1);
                de.setD2(d2);
                de.setD3(d3);
                de.setD4(d4);
                de.setI(i);

                result.add(de);
            }

            return result;
        } catch (Exception e) {
            logger.error("Failed read dataset", e);
            throw new RuntimeException(e);
        }
    }

}
