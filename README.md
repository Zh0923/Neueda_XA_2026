# Portfolio Manager / 投资组合管理系统

一个功能完善的投资组合管理系统，支持多市场、多币种资产配置与跟踪。

![Portfolio Manager](https://img.shields.io/badge/Portfolio-Manager-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.6.6-green)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 功能特性

### 核心功能
- **多市场支持**: 美股、A股、港股
- **多资产类型**: 股票、ETF、债券、基金、现金
- **实时行情**: 集成 massive.com API 获取实时价格
- **盈亏分析**: 自动计算持仓盈亏与收益率
- **资产配置**: 按类型、行业分布可视化
- **数据导出**: 支持 CSV 格式导出

### 界面特性
- **Claude Code 风格**: 暖橙色主题，简洁优雅
- **同花顺布局**: 专业金融数据展示，红涨绿跌
- **响应式设计**: 支持桌面和移动端
- **深色模式**: 一键切换浅色/深色主题

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

## 快速开始

### 环境要求
- JDK 8+
- Node.js 18+
- Maven 3.6+

### 1. 启动后端服务

```bash
# 在项目根目录执行
mvn spring-boot:run
```

后端服务默认运行在 `http://localhost:8080`

### 2. 启动前端开发服务器

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务默认运行在 `http://localhost:5173`

### 3. 访问应用

打开浏览器访问 `http://localhost:5173`

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

### Swagger UI

访问 `http://localhost:8080/swagger-ui/index.html` 查看完整 API 文档。

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

## 项目结构

```
.
├── src/main/java/com/zyx/portfolio/    # 后端源码
│   ├── controller/                     # REST API 控制器
│   ├── service/                        # 业务逻辑层
│   ├── entity/                         # JPA 实体
│   └── repository/                     # 数据访问层
├── src/main/resources/                 # 配置文件
├── frontend/                           # 前端源码
│   ├── src/
│   │   ├── App.tsx                     # 主应用组件
│   │   └── style.css                   # 样式文件
│   └── package.json
└── pom.xml                             # Maven 配置
```

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

## 开发计划

- [x] 基础 CRUD 功能
- [x] 多市场支持 (US/CN/HK)
- [x] 实时行情集成
- [x] 盈亏分析计算
- [x] 数据可视化图表
- [x] CSV 导出功能
- [x] 响应式界面设计
- [x] 深色模式支持
- [ ] 用户认证系统
- [ ] 历史交易记录
- [ ] 投资组合回测
- [ ] 邮件/推送通知

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License

---

## English Version

### Features
- Multi-market support: US, China A-shares, Hong Kong
- Multi-asset types: Stocks, ETFs, Bonds, Funds, Cash
- Real-time quotes via massive.com API
- P&L analysis with automatic calculations
- Asset allocation visualization
- CSV export functionality

### Quick Start

```bash
# Start backend
mvn spring-boot:run

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### Tech Stack
- **Backend**: Java 8, Spring Boot 2.6.6, Spring Data JPA, H2
- **Frontend**: React 19, TypeScript, Vite, Recharts
- **API**: Massive.com (financial data)
