package com.zyx.portfolio.controller;

import com.zyx.portfolio.entity.PortfolioItem;
import com.zyx.portfolio.service.PortfolioService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Resource
    private  PortfolioService service;

    // 获取全部资产
    @GetMapping
    public List<PortfolioItem> getAll() {
        return service.getAll();
    }

    // 添加资产
    @PostMapping
    public PortfolioItem add(@RequestBody PortfolioItem item) {
        return service.addItem(item);
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
}