package com.zyx.portfolio.service;

import com.zyx.portfolio.entity.PortfolioItem;
import com.zyx.portfolio.repository.PortfolioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PortfolioService {

    @Resource
    private PortfolioRepository repository;

    @Resource
    private PriceService priceService;

    public List<PortfolioItem> getAll() {
        List<PortfolioItem> items = repository.findAll();
        // 更新实时价格
        items.forEach(this::updatePriceInfo);
        return items;
    }

    public Page<PortfolioItem> getPage(int page, int size, String sortBy, String direction) {
        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PortfolioItem> result = repository.findAll(pageable);
        // 更新实时价格
        result.getContent().forEach(this::updatePriceInfo);
        return result;
    }

    public PortfolioItem addItem(PortfolioItem item) {
        normalize(item);
        // 设置默认值
        if (item.getCurrency() == null) {
            item.setCurrency("USD");
        }
        if (item.getBuyDate() == null) {
            item.setBuyDate(LocalDateTime.now());
        }
        item.setLastUpdateTime(LocalDateTime.now());
        
        // 尝试获取资产名称和实时价格
        enrichAssetInfo(item);
        
        return repository.save(item);
    }

    public PortfolioItem updateItem(Long id, PortfolioItem item) {
        PortfolioItem current = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Portfolio item not found: " + id));
        
        current.setTicker(item.getTicker());
        current.setName(item.getName());
        current.setSector(item.getSector());
        current.setQuantity(item.getQuantity());
        current.setPrice(item.getPrice());
        current.setType(item.getType());
        current.setCurrency(item.getCurrency());
        current.setExchange(item.getExchange());
        current.setMarket(item.getMarket());
        current.setBuyDate(item.getBuyDate());
        current.setLastUpdateTime(LocalDateTime.now());
        
        normalize(current);
        enrichAssetInfo(current);
        
        return repository.save(current);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    public List<PortfolioItem> getByTicker(String ticker) {
        List<PortfolioItem> items = repository.findByTicker(ticker.toUpperCase(Locale.ROOT));
        items.forEach(this::updatePriceInfo);
        return items;
    }

    public List<PortfolioItem> getByType(String type) {
        List<PortfolioItem> items = repository.findByType(type.toUpperCase(Locale.ROOT));
        items.forEach(this::updatePriceInfo);
        return items;
    }

    public List<PortfolioItem> getByMarket(String market) {
        List<PortfolioItem> items = repository.findByMarket(market.toUpperCase(Locale.ROOT));
        items.forEach(this::updatePriceInfo);
        return items;
    }

    public List<PortfolioItem> getBySector(String sector) {
        List<PortfolioItem> items = repository.findBySectorIgnoreCase(sector);
        items.forEach(this::updatePriceInfo);
        return items;
    }

    /**
     * 更新价格信息
     */
    private void updatePriceInfo(PortfolioItem item) {
        try {
            double currentPrice = priceService.getPrice(item.getTicker());
            if (currentPrice > 0) {
                item.setCurrentPrice(currentPrice);
                double dayChange = currentPrice - item.getPrice();
                item.setDayChange(dayChange);
                if (item.getPrice() > 0) {
                    item.setDayChangePercent((dayChange / item.getPrice()) * 100);
                }
            }
            item.setLastUpdateTime(LocalDateTime.now());
        } catch (Exception e) {
            // 价格更新失败不影响主流程
        }
    }

    /**
     * 丰富资产信息（名称、行业等）
     */
    private void enrichAssetInfo(PortfolioItem item) {
        // 这里可以根据 ticker 从配置或外部 API 获取资产信息
        // 简化处理：根据常见股票代码设置默认名称
        if (item.getName() == null || item.getName().isEmpty()) {
            item.setName(priceService.getAssetName(item.getTicker()));
        }
        if (item.getSector() == null || item.getSector().isEmpty()) {
            item.setSector(priceService.getAssetSector(item.getTicker()));
        }
    }

    private void normalize(PortfolioItem item) {
        item.setTicker(item.getTicker().trim().toUpperCase(Locale.ROOT));
        item.setType(item.getType().trim().toUpperCase(Locale.ROOT));
        if (item.getMarket() != null) {
            item.setMarket(item.getMarket().trim().toUpperCase(Locale.ROOT));
        }
        if (item.getCurrency() != null) {
            item.setCurrency(item.getCurrency().trim().toUpperCase(Locale.ROOT));
        }
    }
}