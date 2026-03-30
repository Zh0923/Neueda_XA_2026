package com.zyx.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class PortfolioManagerTrainingProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioManagerTrainingProjectApplication.class, args);
    }

}
