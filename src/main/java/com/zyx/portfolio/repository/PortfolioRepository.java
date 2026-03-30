package com.zyx.portfolio.repository;

import com.zyx.portfolio.entity.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioItem, Long>{
    List<PortfolioItem> findByTicker(String ticker); // Changed from List<PortfolioItem> to List<PortfolioItem>

    List<PortfolioItem> findByType(String type);
}
