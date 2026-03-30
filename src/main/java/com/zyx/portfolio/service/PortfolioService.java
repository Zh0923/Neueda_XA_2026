package com.zyx.portfolio.service;

import com.zyx.portfolio.entity.PortfolioItem;
import com.zyx.portfolio.repository.PortfolioRepository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class PortfolioService {

    @Resource
    private PortfolioRepository repository;

    public List<PortfolioItem> getAll() {
        return repository.findAll();
    }

    public PortfolioItem addItem(PortfolioItem item) {
        return repository.save(item);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    public List<PortfolioItem> getByTicker(String ticker) {
        return repository.findByTicker(ticker);
    }

    public List<PortfolioItem> getByType(String type) {
        return repository.findByType(type);
    }
}