# Frontend (Vite + React + TypeScript)

## 中文

### 启动步骤
1. 先启动后端（默认 `http://localhost:8080`）
2. 在 `frontend` 目录安装依赖并启动：

```bash
npm install
npm run dev
```

### 说明
- 前端开发服务默认运行在 `http://localhost:5173`
- 已配置代理：`/api/*` -> `http://localhost:8080`
- 当前页面功能：
  - Portfolio 页面：浏览/新增/删除资产
  - Performance 页面：组合指标与图表（Allocation、P/L）
  - Market 页面：Yahoo 样例数据行情快照
- 已对接接口：
  - `GET /api/portfolio`
  - `POST /api/portfolio`
  - `DELETE /api/portfolio/{id}`

## English

### Run
1. Start backend first (`http://localhost:8080` by default)
2. In `frontend` folder:

```bash
npm install
npm run dev
```

### Notes
- Frontend dev server runs on `http://localhost:5173`
- Proxy is configured: `/api/*` -> `http://localhost:8080`
- Current UI features:
  - Portfolio page: browse/add/remove items
  - Performance page: portfolio metrics and chart
  - Market page: Yahoo sample quote snapshot
- Integrated APIs:
  - `GET /api/portfolio`
  - `POST /api/portfolio`
  - `DELETE /api/portfolio/{id}`

