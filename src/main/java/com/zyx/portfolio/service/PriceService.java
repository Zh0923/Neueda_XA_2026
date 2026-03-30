package com.zyx.portfolio.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PriceService {

    /**
     * 批量获取股票价格（带缓存）
     */
    @Cacheable("prices")
    public Map<String, Double> getPrices(Set<String> tickers) {

        if (tickers == null || tickers.isEmpty()) {
            return Collections.emptyMap();
        }

        try {
            // ✅ 正确方式：Set → String[]
            String[] symbols = tickers.toArray(new String[0]);

            Map<String, Stock> stockMap = YahooFinance.get(symbols);

            Map<String, Double> result = new HashMap<>();

            for (String ticker : tickers) {

                Stock stock = stockMap.get(ticker);

                double price = extractPrice(stock);

                result.put(ticker, price);
            }

            return result;

        } catch (IOException e) {
            throw new RuntimeException("Yahoo API error", e);
        }
    }

    /**
     * 获取单个股票价格（内部调用批量方法）
     */
    public double getPrice(String ticker) {

        Set<String> tickers = new HashSet<>();
        tickers.add(ticker.toUpperCase());

        return getPrices(tickers)
                .getOrDefault(ticker.toUpperCase(), 0.0);
    }


    /**
     * 提取价格（带容错）
     */
    private double extractPrice(Stock stock) {

        if (stock == null || stock.getQuote() == null) {
            return 0.0;
        }

        BigDecimal price = stock.getQuote().getPrice();

        if (price == null) {
            return 0.0;
        }

        return price.doubleValue();
    }
}