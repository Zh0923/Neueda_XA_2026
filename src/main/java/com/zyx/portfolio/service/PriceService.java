package com.zyx.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.ArrayList;

@Service
public class PriceService {

    @Value("${massive.api.key:}")
    private String apiKey;

    @Value("${massive.api.url:https://api.massive.com/v1}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // 本地资产信息缓存
    private static final Map<String, AssetInfo> ASSET_INFO_CACHE = new HashMap<>();

    static {
        // 初始化常见股票信息
        ASSET_INFO_CACHE.put("AAPL", new AssetInfo("Apple Inc.", "Technology", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("MSFT", new AssetInfo("Microsoft Corp.", "Technology", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("GOOGL", new AssetInfo("Alphabet Inc.", "Technology", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("AMZN", new AssetInfo("Amazon.com Inc.", "Consumer Discretionary", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("TSLA", new AssetInfo("Tesla Inc.", "Automotive", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("META", new AssetInfo("Meta Platforms Inc.", "Communication Services", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("NVDA", new AssetInfo("NVIDIA Corp.", "Technology", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("JPM", new AssetInfo("JPMorgan Chase & Co.", "Financials", "NYSE", "US"));
        ASSET_INFO_CACHE.put("JNJ", new AssetInfo("Johnson & Johnson", "Healthcare", "NYSE", "US"));
        ASSET_INFO_CACHE.put("V", new AssetInfo("Visa Inc.", "Financials", "NYSE", "US"));
        ASSET_INFO_CACHE.put("WMT", new AssetInfo("Walmart Inc.", "Consumer Staples", "NYSE", "US"));
        ASSET_INFO_CACHE.put("PG", new AssetInfo("Procter & Gamble", "Consumer Staples", "NYSE", "US"));
        ASSET_INFO_CACHE.put("DIS", new AssetInfo("Walt Disney Co.", "Communication Services", "NYSE", "US"));
        ASSET_INFO_CACHE.put("NFLX", new AssetInfo("Netflix Inc.", "Communication Services", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("AMD", new AssetInfo("AMD Inc.", "Technology", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("INTC", new AssetInfo("Intel Corp.", "Technology", "NASDAQ", "US"));
        ASSET_INFO_CACHE.put("BABA", new AssetInfo("Alibaba Group", "Consumer Discretionary", "NYSE", "US"));
        ASSET_INFO_CACHE.put("TCEHY", new AssetInfo("Tencent Holdings", "Communication Services", "OTC", "US"));
        
        // A股
        ASSET_INFO_CACHE.put("000001", new AssetInfo("平安银行", "Financials", "SZSE", "CN"));
        ASSET_INFO_CACHE.put("000002", new AssetInfo("万科A", "Real Estate", "SZSE", "CN"));
        ASSET_INFO_CACHE.put("000858", new AssetInfo("五粮液", "Consumer Staples", "SZSE", "CN"));
        ASSET_INFO_CACHE.put("002415", new AssetInfo("海康威视", "Technology", "SZSE", "CN"));
        ASSET_INFO_CACHE.put("600000", new AssetInfo("浦发银行", "Financials", "SSE", "CN"));
        ASSET_INFO_CACHE.put("600519", new AssetInfo("贵州茅台", "Consumer Staples", "SSE", "CN"));
        ASSET_INFO_CACHE.put("600036", new AssetInfo("招商银行", "Financials", "SSE", "CN"));
        ASSET_INFO_CACHE.put("601318", new AssetInfo("中国平安", "Financials", "SSE", "CN"));
        
        // 港股
        ASSET_INFO_CACHE.put("00700", new AssetInfo("腾讯控股", "Technology", "HKEX", "HK"));
        ASSET_INFO_CACHE.put("09988", new AssetInfo("阿里巴巴-SW", "Consumer Discretionary", "HKEX", "HK"));
        ASSET_INFO_CACHE.put("03690", new AssetInfo("美团-W", "Consumer Discretionary", "HKEX", "HK"));
        ASSET_INFO_CACHE.put("01810", new AssetInfo("小米集团-W", "Technology", "HKEX", "HK"));
    }

    /**
     * 批量获取股票价格（带缓存）
     */
    @Cacheable("prices")
    public Map<String, Double> getPrices(Set<String> tickers) {
        if (tickers == null || tickers.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<String, Double> result = new HashMap<>();
        
        for (String ticker : tickers) {
            double price = getPrice(ticker);
            if (price > 0) {
                result.put(ticker, price);
            }
        }

        return result;
    }

    /**
     * 获取单个股票价格
     * 优先调用 massive.com API，失败时使用模拟数据
     */
    public double getPrice(String ticker) {
        if (ticker == null || ticker.trim().isEmpty()) {
            return 0.0;
        }
        
        String upperTicker = ticker.toUpperCase().trim();
        
        // 尝试从 massive.com API 获取
        Double apiPrice = fetchFromMassiveApi(upperTicker);
        if (apiPrice != null && apiPrice > 0) {
            return apiPrice;
        }
        
        // API 失败时使用模拟价格（基于 ticker hash 生成稳定价格）
        return generateMockPrice(upperTicker);
    }

    /**
     * 调用 massive.com API 获取价格
     * 文档: https://massive.com/docs/rest/stocks/trades-quotes/last-trade
     * 认证: apiKey 作为 URL 查询参数
     */
    private Double fetchFromMassiveApi(String ticker) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return null;
        }

        // 先尝试获取最近成交价 /v1/trades/{ticker}/last
        Double tradePrice = fetchLastTrade(ticker);
        if (tradePrice != null && tradePrice > 0) {
            return tradePrice;
        }

        // 再尝试获取最近报价 /v1/last/nbbo/{ticker}
        Double quotePrice = fetchLastQuote(ticker);
        if (quotePrice != null && quotePrice > 0) {
            return quotePrice;
        }

        return null;
    }

    /**
     * 获取最近成交价: GET /v1/trades/{ticker}/last?apiKey=...
     */
    private Double fetchLastTrade(String ticker) {
        try {
            String url = apiUrl + "/trades/" + ticker + "/last?apiKey=" + apiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Map.class
            );

            if (response.getBody() != null) {
                // 响应结构: { "results": { "p": price, ... } }
                Object results = response.getBody().get("results");
                if (results instanceof Map) {
                    Object price = ((Map<?, ?>) results).get("p");
                    if (price instanceof Number) {
                        return ((Number) price).doubleValue();
                    }
                }
            }
        } catch (Exception e) {
            // 忽略异常，尝试下一个端点
        }
        return null;
    }

    /**
     * 获取最近报价 NBBO: GET /v1/last/nbbo/{ticker}?apiKey=...
     */
    private Double fetchLastQuote(String ticker) {
        try {
            String url = apiUrl + "/last/nbbo/" + ticker + "?apiKey=" + apiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, Map.class
            );

            if (response.getBody() != null) {
                // 响应结构: { "results": { "P": askPrice, "p": bidPrice, ... } }
                Object results = response.getBody().get("results");
                if (results instanceof Map) {
                    Map<?, ?> r = (Map<?, ?>) results;
                    // 使用 ask 和 bid 中间价
                    Object ask = r.get("P");
                    Object bid = r.get("p");
                    if (ask instanceof Number && bid instanceof Number) {
                        return (((Number) ask).doubleValue() + ((Number) bid).doubleValue()) / 2.0;
                    }
                    // 只有 ask
                    if (ask instanceof Number) {
                        return ((Number) ask).doubleValue();
                    }
                }
            }
        } catch (Exception e) {
            // 忽略异常
        }
        return null;
    }

    /**
     * 生成模拟价格（基于 ticker 生成稳定的价格）
     */
    private double generateMockPrice(String ticker) {
        // 使用 ticker 的 hashCode 生成稳定的价格
        int hash = ticker.hashCode();
        Random random = new Random(hash);
        
        // 基础价格范围 10-500
        double basePrice = 10 + random.nextDouble() * 490;
        
        // 根据 ticker 调整价格范围（模拟真实股票价格差异）
        if (ticker.equals("BRK.A") || ticker.equals("BRK-A")) {
            basePrice = 500000 + random.nextDouble() * 10000;
        } else if (ticker.equals("AAPL") || ticker.equals("MSFT")) {
            basePrice = 150 + random.nextDouble() * 100;
        } else if (ticker.equals("TSLA")) {
            basePrice = 200 + random.nextDouble() * 100;
        } else if (ticker.equals("NVDA")) {
            basePrice = 400 + random.nextDouble() * 200;
        } else if (ticker.equals("600519")) { // 茅台
            basePrice = 1500 + random.nextDouble() * 200;
        }
        
        return Math.round(basePrice * 100.0) / 100.0;
    }

    /**
     * 获取完整资产信息（名称、行业、交易所、市场）
     */
    public Map<String, Object> getAssetInfo(String ticker) {
        String upperTicker = ticker.toUpperCase().trim();
        AssetInfo info = ASSET_INFO_CACHE.get(upperTicker);
        Map<String, Object> result = new HashMap<>();
        result.put("ticker", upperTicker);
        if (info != null) {
            result.put("name", info.name);
            result.put("sector", info.sector);
            result.put("exchange", info.exchange);
            result.put("market", info.market);
            result.put("found", true);
        } else {
            result.put("name", "");
            result.put("sector", "");
            result.put("exchange", "UNKNOWN");
            result.put("market", "US");
            result.put("found", false);
        }
        // 获取当前价格
        double price = getPrice(upperTicker);
        result.put("currentPrice", price);
        return result;
    }

    /**
     * 获取所有已知资产列表（用于市场行情展示）
     */
    public List<Map<String, Object>> getAllKnownAssets() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, AssetInfo> entry : ASSET_INFO_CACHE.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("ticker", entry.getKey());
            item.put("name", entry.getValue().name);
            item.put("sector", entry.getValue().sector);
            item.put("exchange", entry.getValue().exchange);
            item.put("market", entry.getValue().market);
            list.add(item);
        }
        return list;
    }

    /**
     * 获取资产名称
     */
    public String getAssetName(String ticker) {
        String upperTicker = ticker.toUpperCase().trim();
        AssetInfo info = ASSET_INFO_CACHE.get(upperTicker);
        if (info != null) {
            return info.name;
        }
        return upperTicker;
    }

    /**
     * 获取资产行业
     */
    public String getAssetSector(String ticker) {
        String upperTicker = ticker.toUpperCase().trim();
        AssetInfo info = ASSET_INFO_CACHE.get(upperTicker);
        if (info != null) {
            return info.sector;
        }
        return "Unknown";
    }

    /**
     * 获取交易所
     */
    public String getExchange(String ticker) {
        String upperTicker = ticker.toUpperCase().trim();
        AssetInfo info = ASSET_INFO_CACHE.get(upperTicker);
        if (info != null) {
            return info.exchange;
        }
        return "UNKNOWN";
    }

    /**
     * 获取市场
     */
    public String getMarket(String ticker) {
        String upperTicker = ticker.toUpperCase().trim();
        AssetInfo info = ASSET_INFO_CACHE.get(upperTicker);
        if (info != null) {
            return info.market;
        }
        return "US";
    }

    /**
     * 资产信息内部类
     */
    private static class AssetInfo {
        final String name;
        final String sector;
        final String exchange;
        final String market;

        AssetInfo(String name, String sector, String exchange, String market) {
            this.name = name;
            this.sector = sector;
            this.exchange = exchange;
            this.market = market;
        }
    }
}