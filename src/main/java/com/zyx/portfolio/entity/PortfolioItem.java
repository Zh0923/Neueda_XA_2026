package com.zyx.portfolio.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Data
@Entity
public class PortfolioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ticker is required")
    @Pattern(regexp = "^[A-Za-z0-9.]{1,20}$", message = "ticker format is invalid")
    private String ticker;

    // 资产名称
    private String name;

    // 行业板块
    private String sector;

    @DecimalMin(value = "0.0", inclusive = false, message = "quantity must be greater than 0")
    private double quantity;

    @DecimalMin(value = "0.0", inclusive = false, message = "price must be greater than 0")
    private double price;

    // 当前市价（从 API 获取）
    private Double currentPrice;

    // 日涨跌额
    private Double dayChange;

    // 日涨跌幅%
    private Double dayChangePercent;

    @NotBlank(message = "type is required")
    @Pattern(regexp = "^(STOCK|BOND|CASH|ETF|FUND)$", message = "type must be STOCK, BOND, CASH, ETF or FUND")
    private String type; // STOCK, BOND, CASH, ETF, FUND

    // 货币 (USD, CNY, HKD)
    private String currency;

    // 交易所 (NYSE, NASDAQ, SSE, SZSE等)
    private String exchange;

    // 市场 (US, CN, HK)
    private String market;

    // 购买日期
    private LocalDateTime buyDate;

    // 最后更新时间
    private LocalDateTime lastUpdateTime;

    public void setTicker(String ticker) { this.ticker = ticker; }

    public void setName(String name) { this.name = name; }

    public void setSector(String sector) { this.sector = sector; }

    public void setQuantity(double quantity) { this.quantity = quantity; }

    public void setPrice(double price) { this.price = price; }

    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public void setDayChange(Double dayChange) { this.dayChange = dayChange; }

    public void setDayChangePercent(Double dayChangePercent) { this.dayChangePercent = dayChangePercent; }

    public void setType(String type) { this.type = type; }

    public void setCurrency(String currency) { this.currency = currency; }

    public void setExchange(String exchange) { this.exchange = exchange; }

    public void setMarket(String market) { this.market = market; }

    public void setBuyDate(LocalDateTime buyDate) { this.buyDate = buyDate; }

    public void setLastUpdateTime(LocalDateTime lastUpdateTime) { this.lastUpdateTime = lastUpdateTime; }
}