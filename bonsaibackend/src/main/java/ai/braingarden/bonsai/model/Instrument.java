package ai.braingarden.bonsai.model;


import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Instrument {

    @Id
    private String id;
    private double profitability;
    private double risk;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getProfitability() {
        return profitability;
    }

    public void setProfitability(double profitability) {
        this.profitability = profitability;
    }

    public double getRisk() {
        return risk;
    }

    public void setRisk(double risk) {
        this.risk = risk;
    }


    @Override
    public String toString() {
        return "Instrument{" +
                "id='" + id + '\'' +
                ", profitability=" + profitability +
                ", risk=" + risk +
                '}';
    }
}
