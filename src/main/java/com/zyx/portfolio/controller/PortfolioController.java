package com.zyx.portfolio.controller;

import com.zyx.portfolio.entity.PortfolioItem;
import com.zyx.portfolio.service.PortfolioService;
import com.zyx.portfolio.service.PriceService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Resource
    private PortfolioService service;

    @Resource
    private PriceService priceService;

    // 获取全部资产
    @GetMapping
    public List<PortfolioItem> getAll() {
        return service.getAll();
    }

    // 分页和排序查询
    @GetMapping("/page")
    public Page<PortfolioItem> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return service.getPage(page, size, sortBy, direction);
    }

    // 添加资产
    @PostMapping
    public PortfolioItem add(@Valid @RequestBody PortfolioItem item) {
        return service.addItem(item);
    }

    // 更新资产
    @PutMapping("/{id}")
    public PortfolioItem update(@PathVariable Long id, @Valid @RequestBody PortfolioItem item) {
        return service.updateItem(id, item);
    }

    // 删除资产
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteItem(id);
    }

    // 按股票代码查询
    @GetMapping("/ticker/{ticker}")
    public List<PortfolioItem> getByTicker(@PathVariable String ticker) {
        return service.getByTicker(ticker);
    }

    // 按类型查询
    @GetMapping("/type/{type}")
    public List<PortfolioItem> getByType(@PathVariable String type) {
        return service.getByType(type);
    }

    // 按市场查询
    @GetMapping("/market/{market}")
    public List<PortfolioItem> getByMarket(@PathVariable String market) {
        return service.getByMarket(market);
    }

    // 按行业查询
    @GetMapping("/sector/{sector}")
    public List<PortfolioItem> getBySector(@PathVariable String sector) {
        return service.getBySector(sector);
    }

    // 获取实时价格
    @GetMapping("/prices")
    public Map<String, Double> getPrices(@RequestParam Set<String> tickers) {
        return priceService.getPrices(tickers);
    }

    // 获取单个价格
    @GetMapping("/price/{ticker}")
    public Map<String, Object> getPrice(@PathVariable String ticker) {
        double price = priceService.getPrice(ticker);
        Map<String, Object> result = new HashMap<>();
        result.put("ticker", ticker);
        result.put("price", price);
        result.put("name", priceService.getAssetName(ticker));
        result.put("sector", priceService.getAssetSector(ticker));
        result.put("exchange", priceService.getExchange(ticker));
        result.put("market", priceService.getMarket(ticker));
        return result;
    }

    // 查询股票基本信息（用于添加资产时自动填充）
    @GetMapping("/asset-info/{ticker}")
    public Map<String, Object> getAssetInfo(@PathVariable String ticker) {
        return priceService.getAssetInfo(ticker);
    }

    // 获取所有已知资产列表（用于市场行情页面）
    @GetMapping("/known-assets")
    public java.util.List<Map<String, Object>> getKnownAssets() {
        return priceService.getAllKnownAssets();
    }

    // 导出 CSV
    @GetMapping("/export")
    public ResponseEntity<String> exportCsv() {
        String header = "id,ticker,name,sector,quantity,buyPrice,currentPrice,dayChange,dayChangePercent,type,currency,exchange,market,buyDate";
        String rows = service.getAll().stream()
                .map(item -> String.format("%d,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s",
                        item.getId(),
                        escapeCsv(item.getTicker()),
                        escapeCsv(item.getName()),
                        escapeCsv(item.getSector()),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getCurrentPrice() != null ? item.getCurrentPrice() : "",
                        item.getDayChange() != null ? item.getDayChange() : "",
                        item.getDayChangePercent() != null ? item.getDayChangePercent() : "",
                        item.getType(),
                        item.getCurrency(),
                        escapeCsv(item.getExchange()),
                        item.getMarket(),
                        item.getBuyDate() != null ? item.getBuyDate().toString() : ""))
                .collect(Collectors.joining("\n"));
        String csv = header + "\n" + rows;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=portfolio.csv")
                .contentType(MediaType.valueOf("text/csv"))
                .body(csv);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}