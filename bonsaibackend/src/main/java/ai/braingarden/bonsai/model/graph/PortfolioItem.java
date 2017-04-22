package ai.braingarden.bonsai.model.graph;

import java.io.Serializable;

/**
 * Created by veter on 22.04.17.
 */
public class PortfolioItem implements Serializable {

    private String id;
    private double global_perc;
    private double local_perc;
    private double day_profit;
    private double week_profit;
    private double month_profit;
    private double current_value;

    public PortfolioItem() {}
    public PortfolioItem(String id) { this.id = id; }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getGlobal_perc() {
        return global_perc;
    }

    public void setGlobal_perc(double global_perc) {
        this.global_perc = global_perc;
    }

    public double getLocal_perc() {
        return local_perc;
    }

    public void setLocal_perc(double local_perc) {
        this.local_perc = local_perc;
    }

    public double getDay_profit() {
        return day_profit;
    }

    public void setDay_profit(double day_profit) {
        this.day_profit = day_profit;
    }

    public double getWeek_profit() {
        return week_profit;
    }

    public void setWeek_profit(double week_profit) {
        this.week_profit = week_profit;
    }

    public double getMonth_profit() {
        return month_profit;
    }

    public void setMonth_profit(double month_profit) {
        this.month_profit = month_profit;
    }

    public double getCurrent_value() {
        return current_value;
    }

    public void setCurrent_value(double current_value) {
        this.current_value = current_value;
    }
}
