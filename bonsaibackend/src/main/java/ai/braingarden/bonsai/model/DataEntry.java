package ai.braingarden.bonsai.model;

import java.time.Instant;

public class DataEntry {

    private String instrumentId;
    private Instant timestamp;
    private double d1;
    private double d2;
    private double d3;
    private double d4;
    private int i;

    public String getInstrumentId() {
        return instrumentId;
    }

    public void setInstrumentId(String instrumentId) {
        this.instrumentId = instrumentId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public double getD1() {
        return d1;
    }

    public void setD1(double d1) {
        this.d1 = d1;
    }

    public double getD2() {
        return d2;
    }

    public void setD2(double d2) {
        this.d2 = d2;
    }

    public double getD3() {
        return d3;
    }

    public void setD3(double d3) {
        this.d3 = d3;
    }

    public double getD4() {
        return d4;
    }

    public void setD4(double d4) {
        this.d4 = d4;
    }

    public int getI() {
        return i;
    }

    public void setI(int i) {
        this.i = i;
    }

    @Override
    public String toString() {
        return "DataEntry{" +
                "instrumentId='" + instrumentId + '\'' +
                ", d1=" + d1 +
                ", d2=" + d2 +
                ", d3=" + d3 +
                ", d4=" + d4 +
                ", i=" + i +
                '}';
    }
}
