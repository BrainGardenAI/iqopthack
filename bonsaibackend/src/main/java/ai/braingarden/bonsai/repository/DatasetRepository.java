package ai.braingarden.bonsai.repository;


import ai.braingarden.bonsai.model.DataEntry;
import ai.braingarden.bonsai.model.Instrument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class DatasetRepository {

    public static final Logger logger = LoggerFactory.getLogger(DatasetRepository.class);

    @Autowired
    private InstrumentRepository instRepo;

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public boolean createTable(String instId) {
        logger.info("create instrument " + instId);

        if ( instRepo.findOne(instId) != null )
            return false;
        Instrument i = new Instrument();
        i.setId(instId);
        i.setProfitability(0);
        i.setRisk(0);
        instRepo.save(i);

        if ( checkTableExists("inst_" + instId.toLowerCase()) )
            return false;

        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS INST_" + instId +
                    "(ts timestamp without time zone PRIMARY KEY,\n" +
                    " p1 real,\n" +
                    " p2 real,\n" +
                    " p3 real,\n" +
                    " p4 real,\n" +
                    " i integer\n" +
                ")");
        return true;
    }

    public void insertData(String instrumentId, List<DataEntry> dataset) {
        logger.info("insert dataset for inst " + instrumentId + " of size " + dataset.size());

        jdbcTemplate.batchUpdate(
                "INSERT INTO INST_" + instrumentId + " VALUES(?,?,?,?,?,?);",
                dataset.stream().map( e -> new Object[] {
                        LocalDateTime.ofInstant(e.getTimestamp(), ZoneId.of("UTC")),
                        e.getD1(), e.getD2(), e.getD3(), e.getD4(),
                        e.getI()
                }).collect(Collectors.toList())
        );
    }

    public List<DataEntry> readData(String instId) {
        return readData(instId, Instant.ofEpochMilli(0), Instant.now());
    }

    public List<DataEntry> readData(String instId, Instant from, Instant to) {
        return jdbcTemplate.query(
                "select * from inst_" + instId.toLowerCase() + " where ts > ? and ts < ?",
                new Object[] {
                        LocalDateTime.ofInstant(from, ZoneId.of("UTC")),
                        LocalDateTime.ofInstant(to, ZoneId.of("UTC"))
                },
                (resultSet, i) -> {
                        Instant ts = resultSet.getTimestamp(1).toInstant();
                        double d1  = resultSet.getDouble(2);
                        double d2  = resultSet.getDouble(3);
                        double d3  = resultSet.getDouble(4);
                        double d4  = resultSet.getDouble(5);
                        int    in   = resultSet.getInt(6);
                        DataEntry de = new DataEntry();
                        de.setInstrumentId(instId);
                        de.setTimestamp(ts);
                        de.setD1(d1);
                        de.setD2(d2);
                        de.setD3(d3);
                        de.setD4(d4);
                        de.setI(in);
                        return de;
                }
        );
    }

    public boolean checkTableExists(String table) {
        final String query = "SELECT EXISTS (\n" +
                "                SELECT 1\n" +
                "        FROM   information_schema.tables\n" +
                "        WHERE  table_schema = 'public'\n" +
                "        AND    table_name = '" + table + "'\n" +
                "   );";
        Boolean exists = jdbcTemplate.queryForObject(query, Boolean.class);
        return exists;
    }

}
