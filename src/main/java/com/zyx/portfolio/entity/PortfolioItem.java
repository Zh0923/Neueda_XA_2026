package com.zyx.portfolio.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
public class PortfolioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticker;

    private double quantity;

    private double price;

    private String type; // STOCK, BOND, CASH

    public void setTicker(String ticker) { this.ticker = ticker; }

    public void setQuantity(double quantity) { this.quantity = quantity; }

    public void setPrice(double price) { this.price = price; }

    public void setType(String type) { this.type = type; }
}