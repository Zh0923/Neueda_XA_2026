# Portfolio Manager / 投资组合管理系统

<div align="center">

![Portfolio Manager](https://img.shields.io/badge/Portfolio-Manager-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.6.6-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**中文 | [English](#english-version)**

一个功能完善的投资组合管理系统，支持多市场、多币种资产配置与跟踪，集成实时行情数据，提供专业的盈亏分析与可视化展示。

</div>

---

## 功能特性

### 核心功能
- **多市场支持**: 美股、A股、港股全覆盖
- **多资产类型**: 股票、ETF、债券、基金、现金
- **实时行情**: 集成 massive.com API 获取实时价格
- **智能填充**: 输入股票代码自动获取名称、行业、市场信息
- **盈亏分析**: 自动计算持仓盈亏、收益率、日涨跌
- **资产配置**: 按类型、行业分布可视化（饼图/柱状图）
- **NAV 走势**: 基于真实持仓的历史净值走势分析
- **数据导出**: 支持 CSV 格式导出

### 界面特性
- **中英双语**: 一键切换中文/English
- **Claude Code 风格**: 暖橙色主题，简洁优雅
- **同花顺布局**: 专业金融数据展示，红涨绿跌
- **响应式设计**: 支持桌面和移动端
- **深色模式**: 一键切换浅色/深色主题

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              用户 (User)                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           前端层 (Frontend)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  React 19   │  │ TypeScript  │  │   Vite      │  │  Recharts   │    │
│  │  组件化 UI   │  │  类型安全   │  │  构建工具   │  │  数据可视化  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                         │
│  功能模块: 投资组合 | 业绩分析 | 市场行情 | 资产添加 | 语言切换          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           后端层 (Backend)                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Spring Boot 2.6.6                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ Controller  │  │   Service   │  │      Repository         │  │   │
│  │  │  REST API   │──│  业务逻辑   │──│    Spring Data JPA      │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  │         │                  │                    │               │   │
│  │         ▼                  ▼                    ▼               │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────────────┐  │   │
│  │  │ PriceService│  │         PortfolioService                │  │   │
│  │  │ 实时价格获取 │  │      资产CRUD / 盈亏计算 / 价格更新      │  │   │
│  │  └─────────────┘  └─────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                    │                           │
                    │                           │
        ┌───────────▼──────────┐    ┌───────────▼──────────┐
        │   外部数据源          │    │     数据存储层        │
        │  ┌────────────────┐  │    │  ┌────────────────┐   │
        │  │ massive.com API│  │    │  │  H2 Database   │   │
        │  │ 实时行情数据    │  │    │  │  内存数据库    │   │
        │  └────────────────┘  │    │  └────────────────┘   │
        └──────────────────────┘    └───────────────────────┘
```

### 架构说明

| 层级 | 技术 | 职责 |
|------|------|------|
| **前端层** | React 19 + TypeScript + Vite | 用户界面、数据可视化、双语切换 |
| **API 网关** | Spring Boot Controller | RESTful API 接口、请求路由 |
| **业务层** | Spring Service | 资产计算、价格更新、盈亏分析 |
| **数据层** | Spring Data JPA + H2 | 数据持久化、CRUD 操作 |
| **外部服务** | massive.com API | 实时行情数据获取 |

---

## 技术栈

### 后端
- **Java 8**
- **Spring Boot 2.6.6**
- **Spring Web + Spring Data JPA**
- **Spring Cache** (价格缓存)
- **H2 内存数据库** (开发环境)
- **Massive.com API** (实时行情)

### 前端
- **React 19**
- **TypeScript**
- **Vite** (构建工具)
- **Recharts** (图表库)
- **Lucide React** (图标)
- **React Router** (路由)

---

## 快速开始

### 环境要求
- JDK 8+
- Node.js 18+
- Maven 3.6+

### 1. 克隆项目

```bash
git clone https://github.com/senmiao1226/PorfolioManage.git
cd PorfolioManage
```

### 2. 启动后端服务

```bash
# 在项目根目录执行
mvn spring-boot:run
```

后端服务默认运行在 `http://localhost:8080`

### 3. 启动前端开发服务器

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务默认运行在 `http://localhost:5173`

### 4. 访问应用

打开浏览器访问 `http://localhost:5173`

---

## API 文档

### REST API 端点

Base URL: `/api/portfolio`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/portfolio` | 获取全部资产 |
| GET | `/api/portfolio/page` | 分页查询资产 |
| POST | `/api/portfolio` | 添加资产 |
| PUT | `/api/portfolio/{id}` | 更新资产 |
| DELETE | `/api/portfolio/{id}` | 删除资产 |
| GET | `/api/portfolio/ticker/{ticker}` | 按代码查询 |
| GET | `/api/portfolio/type/{type}` | 按类型查询 |
| GET | `/api/portfolio/market/{market}` | 按市场查询 |
| GET | `/api/portfolio/sector/{sector}` | 按行业查询 |
| GET | `/api/portfolio/prices?tickers=AAPL,MSFT` | 批量获取价格 |
| GET | `/api/portfolio/price/{ticker}` | 获取单个价格 |
| GET | `/api/portfolio/asset-info/{ticker}` | 获取资产基本信息 |
| GET | `/api/portfolio/known-assets` | 获取所有已知资产 |
| GET | `/api/portfolio/export` | 导出 CSV |

### 请求示例

#### 添加资产
```bash
curl -X POST http://localhost:8080/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "sector": "Technology",
    "quantity": 100,
    "price": 150.00,
    "type": "STOCK",
    "currency": "USD",
    "market": "US"
  }'
```

#### 获取实时价格
```bash
curl "http://localhost:8080/api/portfolio/prices?tickers=AAPL,MSFT,GOOGL"
```

#### 获取资产信息
```bash
curl "http://localhost:8080/api/portfolio/asset-info/AAPL"
```

### Swagger UI

访问 `http://localhost:8080/swagger-ui/index.html` 查看完整 API 文档。

---

## 数据库结构

### PortfolioItem 实体

| 字段 | 类型 | 描述 |
|------|------|------|
| id | Long | 主键 |
| ticker | String | 股票代码 |
| name | String | 资产名称 |
| sector | String | 行业板块 |
| quantity | Double | 持仓数量 |
| price | Double | 买入价格 |
| currentPrice | Double | 当前市价 |
| dayChange | Double | 日涨跌额 |
| dayChangePercent | Double | 日涨跌幅% |
| type | String | 资产类型 (STOCK/ETF/BOND/FUND/CASH) |
| currency | String | 货币 (USD/CNY/HKD) |
| exchange | String | 交易所 |
| market | String | 市场 (US/CN/HK) |
| buyDate | LocalDateTime | 购买日期 |
| lastUpdateTime | LocalDateTime | 最后更新时间 |

### H2 Console

开发环境已启用 H2 Console:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (空)

---

## 配置说明

### 后端配置 (application.yaml)

```yaml
# massive.com API 配置
massive:
  api:
    key: ${MASSIVE_API_KEY:}  # 可选，配置 API Key
    url: ${MASSIVE_API_URL:https://api.massive.com/v1}

# 服务器配置
server:
  port: 8080
```

### 前端代理配置 (vite.config.ts)

已配置开发服务器代理，将 `/api` 请求转发到后端:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

---

## 项目结构

```
.
├── src/main/java/com/zyx/portfolio/    # 后端源码
│   ├── controller/                     # REST API 控制器
│   ├── service/                        # 业务逻辑层
│   │   ├── PortfolioService.java       # 资产服务
│   │   └── PriceService.java           # 价格服务
│   ├── entity/                         # JPA 实体
│   └── repository/                     # 数据访问层
├── src/main/resources/                 # 配置文件
│   └── application.yaml                # 应用配置
├── frontend/                           # 前端源码
│   ├── src/
│   │   ├── App.tsx                     # 主应用组件（双语支持）
│   │   ├── style.css                   # 样式文件
│   │   └── main.tsx                    # 入口文件
│   └── package.json
└── pom.xml                             # Maven 配置
```

---

## 行情数据源

系统使用 **massive.com API** 获取实时行情数据。

### 配置 API Key (可选)

1. 在 [massive.com](https://massive.com) 注册并获取 API Key
2. 设置环境变量:
   ```bash
   export MASSIVE_API_KEY=your_api_key_here
   ```

### 无 API Key 模式

未配置 API Key 时，系统会自动生成模拟价格数据，便于开发和测试。

---

## 开发计划

- [x] 基础 CRUD 功能
- [x] 多市场支持 (US/CN/HK)
- [x] 实时行情集成 (massive.com)
- [x] 盈亏分析计算
- [x] 数据可视化图表
- [x] CSV 导出功能
- [x] 响应式界面设计
- [x] 深色模式支持
- [x] 中英双语支持
- [x] 智能资产填充
- [x] 扩展市场行情展示
- [ ] 用户认证系统
- [ ] 历史交易记录
- [ ] 投资组合回测
- [ ] 邮件/推送通知

---

## 贡献指南

欢迎提交 Issue 和 Pull Request。

---

## 许可证

MIT License

---

# English Version

<div align="center">

**[中文](#portfolio-manager--投资组合管理系统) | English**

A comprehensive portfolio management system supporting multi-market, multi-currency asset allocation and tracking, with real-time market data integration and professional P&L analysis.

</div>

---

## Features

### Core Features
- **Multi-Market Support**: US stocks, China A-shares, Hong Kong stocks
- **Multi-Asset Types**: Stocks, ETFs, Bonds, Funds, Cash
- **Real-Time Quotes**: Integrated with massive.com API
- **Smart Auto-Fill**: Enter ticker to auto-fetch name, sector, market info
- **P&L Analysis**: Automatic calculation of gains/losses, returns, daily changes
- **Asset Allocation**: Visualization by type and sector (Pie/Bar charts)
- **NAV Trend**: Historical NAV analysis based on actual holdings
- **Data Export**: CSV export support

### UI Features
- **Bilingual**: One-click switch between Chinese/English
- **Claude Code Style**: Warm orange theme, clean and elegant
- **Professional Layout**: Financial data display with red-up/green-down
- **Responsive Design**: Desktop and mobile support
- **Dark Mode**: Toggle between light/dark themes

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              User                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Frontend Layer                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  React 19   │  │ TypeScript  │  │   Vite      │  │  Recharts   │    │
│  │  Component  │  │  Type Safe  │  │  Build Tool │  │ Visualization│   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                         │
│  Modules: Portfolio | Analytics | Market | Add Asset | Language Switch │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Backend Layer                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Spring Boot 2.6.6                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ Controller  │  │   Service   │  │      Repository         │  │   │
│  │  │  REST API   │──│   Business  │──│    Spring Data JPA      │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  │         │                  │                    │               │   │
│  │         ▼                  ▼                    ▼               │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────────────┐  │   │
│  │  │ PriceService│  │         PortfolioService                │  │   │
│  │  │ Real-time   │  │    Asset CRUD / P&L / Price Update      │  │   │
│  │  └─────────────┘  └─────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                    │                           │
                    │                           │
        ┌───────────▼──────────┐    ┌───────────▼──────────┐
        │   External Data      │    │     Data Storage      │
        │  ┌────────────────┐  │    │  ┌────────────────┐   │
        │  │ massive.com API│  │    │  │  H2 Database   │   │
        │  │ Real-time Data │  │    │  │  In-Memory DB  │   │
        │  └────────────────┘  │    │  └────────────────┘   │
        └──────────────────────┘    └───────────────────────┘
```

### Architecture Components

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | React 19 + TypeScript + Vite | UI, visualization, bilingual support |
| **API Gateway** | Spring Boot Controller | RESTful API endpoints |
| **Business Layer** | Spring Service | Asset calculation, price updates, P&L analysis |
| **Data Layer** | Spring Data JPA + H2 | Data persistence, CRUD operations |
| **External Service** | massive.com API | Real-time market data |

---

## Tech Stack

### Backend
- **Java 8**
- **Spring Boot 2.6.6**
- **Spring Web + Spring Data JPA**
- **Spring Cache** (price caching)
- **H2 In-Memory Database** (development)
- **Massive.com API** (real-time quotes)

### Frontend
- **React 19**
- **TypeScript**
- **Vite** (build tool)
- **Recharts** (charts)
- **Lucide React** (icons)
- **React Router** (routing)

---

## Quick Start

### Prerequisites
- JDK 8+
- Node.js 18+
- Maven 3.6+

### 1. Clone the Project

```bash
git clone https://github.com/senmiao1226/PorfolioManage.git
cd PorfolioManage
```

### 2. Start Backend

```bash
# In project root
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Access the Application

Open browser and visit `http://localhost:5173`

---

## API Documentation

### REST API Endpoints

Base URL: `/api/portfolio`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get all assets |
| GET | `/api/portfolio/page` | Paginated query |
| POST | `/api/portfolio` | Add asset |
| PUT | `/api/portfolio/{id}` | Update asset |
| DELETE | `/api/portfolio/{id}` | Delete asset |
| GET | `/api/portfolio/ticker/{ticker}` | Query by ticker |
| GET | `/api/portfolio/type/{type}` | Query by type |
| GET | `/api/portfolio/market/{market}` | Query by market |
| GET | `/api/portfolio/sector/{sector}` | Query by sector |
| GET | `/api/portfolio/prices?tickers=AAPL,MSFT` | Batch price query |
| GET | `/api/portfolio/price/{ticker}` | Single price query |
| GET | `/api/portfolio/asset-info/{ticker}` | Get asset info |
| GET | `/api/portfolio/known-assets` | Get all known assets |
| GET | `/api/portfolio/export` | Export CSV |

### Example Requests

#### Add Asset
```bash
curl -X POST http://localhost:8080/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "AAPL",
    "name": "Apple Inc.",
    "sector": "Technology",
    "quantity": 100,
    "price": 150.00,
    "type": "STOCK",
    "currency": "USD",
    "market": "US"
  }'
```

#### Get Real-Time Prices
```bash
curl "http://localhost:8080/api/portfolio/prices?tickers=AAPL,MSFT,GOOGL"
```

#### Get Asset Info
```bash
curl "http://localhost:8080/api/portfolio/asset-info/AAPL"
```

### Swagger UI

Visit `http://localhost:8080/swagger-ui/index.html` for complete API documentation.

---

## Database Schema

### PortfolioItem Entity

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Primary key |
| ticker | String | Stock ticker |
| name | String | Asset name |
| sector | String | Industry sector |
| quantity | Double | Holding quantity |
| price | Double | Purchase price |
| currentPrice | Double | Current market price |
| dayChange | Double | Daily change amount |
| dayChangePercent | Double | Daily change percentage |
| type | String | Asset type (STOCK/ETF/BOND/FUND/CASH) |
| currency | String | Currency (USD/CNY/HKD) |
| exchange | String | Exchange |
| market | String | Market (US/CN/HK) |
| buyDate | LocalDateTime | Purchase date |
| lastUpdateTime | LocalDateTime | Last update time |

### H2 Console

H2 Console is enabled in development:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (empty)

---

## Configuration

### Backend (application.yaml)

```yaml
# massive.com API configuration
massive:
  api:
    key: ${MASSIVE_API_KEY:}  # Optional API Key
    url: ${MASSIVE_API_URL:https://api.massive.com/v1}

# Server configuration
server:
  port: 8080
```

### Frontend Proxy (vite.config.ts)

Development server proxy configured to forward `/api` to backend:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

---

## Project Structure

```
.
├── src/main/java/com/zyx/portfolio/    # Backend source
│   ├── controller/                     # REST API controllers
│   ├── service/                        # Business logic
│   │   ├── PortfolioService.java       # Asset service
│   │   └── PriceService.java           # Price service
│   ├── entity/                         # JPA entities
│   └── repository/                     # Data access layer
├── src/main/resources/                 # Configuration
│   └── application.yaml                # App config
├── frontend/                           # Frontend source
│   ├── src/
│   │   ├── App.tsx                     # Main component (bilingual)
│   │   ├── style.css                   # Styles
│   │   └── main.tsx                    # Entry point
│   └── package.json
└── pom.xml                             # Maven config
```

---

## Market Data Source

The system uses **massive.com API** for real-time market data.

### Configure API Key (Optional)

1. Register at [massive.com](https://massive.com) to get an API Key
2. Set environment variable:
   ```bash
   export MASSIVE_API_KEY=your_api_key_here
   ```

### No API Key Mode

When no API Key is configured, the system generates mock price data for development and testing.

---

## Roadmap

- [x] Basic CRUD functionality
- [x] Multi-market support (US/CN/HK)
- [x] Real-time quotes (massive.com)
- [x] P&L analysis
- [x] Data visualization
- [x] CSV export
- [x] Responsive design
- [x] Dark mode
- [x] Bilingual support
- [x] Smart asset auto-fill
- [x] Extended market quotes
- [ ] User authentication
- [ ] Historical transaction records
- [ ] Portfolio backtesting
- [ ] Email/push notifications

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

MIT License
