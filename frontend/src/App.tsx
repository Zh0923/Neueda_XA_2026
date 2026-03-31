import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Briefcase,
  TrendingUp,
  DollarSign,
  Search,
  RefreshCw,
  Moon,
  Sun,
  Plus,
  Pencil,
  Trash2,
  X,
  Globe,
  PieChart as PieChartIcon,
  Activity,
  Languages,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useLocation, useNavigate } from 'react-router-dom'
import './style.css'

// ─── i18n 文本字典 ────────────────────────────────────────────────────────────
type Lang = 'zh' | 'en'

const T = {
  zh: {
    appName: '投资组合管理系统',
    appSubtitle: '专业的资产管理平台，支持多市场、多币种投资组合跟踪与分析',
    enterDashboard: '进入系统',
    lightMode: '浅色',
    darkMode: '深色',
    refresh: '刷新',
    tabPortfolio: '投资组合',
    tabPerformance: '业绩分析',
    tabMarket: '市场行情',
    navAssetValue: '总资产净值',
    navTotalCost: '总成本',
    navUnrealizedPnl: '未实现盈亏',
    navPositions: '持仓数量',
    searchPlaceholder: '搜索代码或名称...',
    allTypes: '全部类型',
    typeStock: '股票',
    typeEtf: 'ETF',
    typeBond: '债券',
    typeFund: '基金',
    typeCash: '现金',
    allMarkets: '全部市场',
    marketUS: '美股',
    marketCN: 'A股',
    marketHK: '港股',
    addAsset: '添加资产',
    exportCsv: '导出 CSV',
    colTicker: '代码',
    colName: '名称',
    colSector: '行业',
    colQty: '持仓',
    colCost: '成本价',
    colCurrent: '现价',
    colValue: '市值',
    colPnl: '盈亏',
    colDayChange: '日涨跌',
    colType: '类型',
    colMarket: '市场',
    colAction: '操作',
    loading: '加载中...',
    noData: '暂无数据',
    chartAllocation: '资产配置',
    chartPie: '饼图',
    chartBar: '柱状',
    chartSector: '行业分布',
    chartNAV: '资产净值走势 (模拟)',
    chartNavLabel: '资产净值',
    chartBenchmark: '基准',
    chartAssetValue: '资产价值',
    marketQuotes: '实时行情',
    colPrice: '最新价',
    colChange: '涨跌额',
    colChangePct: '涨跌幅',
    modalAddTitle: '添加资产',
    modalEditTitle: '编辑资产',
    fieldTicker: '股票代码 *',
    fieldTickerPlaceholder: '如: AAPL',
    fieldName: '资产名称',
    fieldNamePlaceholder: '如: Apple Inc.',
    fieldQty: '持仓数量 *',
    fieldPrice: '买入价格 *',
    fieldType: '资产类型',
    fieldMarket: '市场',
    fieldSector: '行业板块',
    fieldSectorPlaceholder: '如: Technology',
    btnCancel: '取消',
    btnAdd: '添加',
    btnSave: '保存',
    errTickerRequired: '请输入股票代码',
    errQtyPrice: '数量和价格必须大于0',
    confirmDelete: '确定要删除这个资产吗？',
    footer: 'Portfolio Manager · 投资组合管理系统',
  },
  en: {
    appName: 'Portfolio Manager',
    appSubtitle: 'Professional asset management platform supporting multi-market, multi-currency portfolio tracking and analysis.',
    enterDashboard: 'Enter Dashboard',
    lightMode: 'Light',
    darkMode: 'Dark',
    refresh: 'Refresh',
    tabPortfolio: 'Portfolio',
    tabPerformance: 'Performance',
    tabMarket: 'Market',
    navAssetValue: 'Net Asset Value',
    navTotalCost: 'Total Cost',
    navUnrealizedPnl: 'Unrealized P&L',
    navPositions: 'Positions',
    searchPlaceholder: 'Search ticker or name...',
    allTypes: 'All Types',
    typeStock: 'Stock',
    typeEtf: 'ETF',
    typeBond: 'Bond',
    typeFund: 'Fund',
    typeCash: 'Cash',
    allMarkets: 'All Markets',
    marketUS: 'US',
    marketCN: 'China A',
    marketHK: 'Hong Kong',
    addAsset: 'Add Asset',
    exportCsv: 'Export CSV',
    colTicker: 'Ticker',
    colName: 'Name',
    colSector: 'Sector',
    colQty: 'Qty',
    colCost: 'Cost',
    colCurrent: 'Price',
    colValue: 'Mkt Value',
    colPnl: 'P&L',
    colDayChange: 'Day Chg',
    colType: 'Type',
    colMarket: 'Market',
    colAction: 'Action',
    loading: 'Loading...',
    noData: 'No data',
    chartAllocation: 'Asset Allocation',
    chartPie: 'Pie',
    chartBar: 'Bar',
    chartSector: 'Sector Distribution',
    chartNAV: 'NAV Trend (Simulated)',
    chartNavLabel: 'NAV',
    chartBenchmark: 'Benchmark',
    chartAssetValue: 'Asset Value',
    marketQuotes: 'Live Quotes',
    colPrice: 'Price',
    colChange: 'Change',
    colChangePct: 'Chg %',
    modalAddTitle: 'Add Asset',
    modalEditTitle: 'Edit Asset',
    fieldTicker: 'Ticker *',
    fieldTickerPlaceholder: 'e.g. AAPL',
    fieldName: 'Name',
    fieldNamePlaceholder: 'e.g. Apple Inc.',
    fieldQty: 'Quantity *',
    fieldPrice: 'Buy Price *',
    fieldType: 'Type',
    fieldMarket: 'Market',
    fieldSector: 'Sector',
    fieldSectorPlaceholder: 'e.g. Technology',
    btnCancel: 'Cancel',
    btnAdd: 'Add',
    btnSave: 'Save',
    errTickerRequired: 'Ticker is required',
    errQtyPrice: 'Quantity and price must be greater than 0',
    confirmDelete: 'Are you sure you want to delete this asset?',
    footer: 'Portfolio Manager · Investment Management System',
  },
} as const

// ─── 类型定义 ──────────────────────────────────────────────────────────────────
type PortfolioItem = {
  id?: number
  ticker: string
  name?: string
  sector?: string
  quantity: number
  price: number
  currentPrice?: number
  dayChange?: number
  dayChangePercent?: number
  type: string
  currency?: string
  exchange?: string
  market?: string
  buyDate?: string
}

type MarketIndex = {
  nameZh: string
  nameEn: string
  value: number
  change: number
  changePercent: number
}

const defaultForm: PortfolioItem = {
  ticker: '',
  name: '',
  sector: '',
  quantity: 0,
  price: 0,
  type: 'STOCK',
  currency: 'USD',
  market: 'US',
}

type View = 'portfolio' | 'performance' | 'market'
type ChartView = 'pie' | 'bar'
type PriceMap = Record<string, number>

// 已知资产条目（从后端拉取）
type KnownAsset = {
  ticker: string
  name: string
  sector: string
  exchange: string
  market: string
  price?: number
  change?: number
  changePercent?: number
}

// 市场指数（双语名称）
const marketIndices: MarketIndex[] = [
  { nameZh: '上证指数', nameEn: 'SSE Composite', value: 3052.37, change: -12.45, changePercent: -0.41 },
  { nameZh: '深证成指', nameEn: 'SZSE Component', value: 9852.64, change: -45.23, changePercent: -0.46 },
  { nameZh: '创业板指', nameEn: 'ChiNext Index', value: 1932.18, change: -18.92, changePercent: -0.97 },
  { nameZh: '恒生指数', nameEn: 'Hang Seng', value: 16589.44, change: 89.32, changePercent: 0.54 },
  { nameZh: '道琼斯', nameEn: 'Dow Jones', value: 38972.41, change: 125.38, changePercent: 0.32 },
  { nameZh: '纳斯达克', nameEn: 'NASDAQ', value: 16340.87, change: 234.56, changePercent: 1.46 },
]

const pieColors = ['#E57035', '#F4A261', '#2A9D8F', '#264653', '#E9C46A', '#F4A261', '#E76F51']

// 生成基于持仓的资产净值走势（确定性，不随机）
function buildPortfolioTrendSeries(items: PortfolioItem[], lang: Lang) {
  if (items.length === 0) return []
  const totalCost = items.reduce((s, i) => s + i.quantity * i.price, 0)
  const totalMarket = items.reduce((s, i) => s + i.quantity * (i.currentPrice || i.price), 0)
  // 用 seed 生成稳定的历史走势（基于 totalCost 做种子）
  const seed = Math.round(totalCost * 100) % 9999 + 1
  return Array.from({ length: 30 }).map((_, idx) => {
    const progress = idx / 29
    // 从成本线平滑趋向当前市值
    const interpolated = totalCost + (totalMarket - totalCost) * progress
    // 加入确定性波动（用 sin/cos 组合，不用 Math.random）
    const wave = Math.sin((idx + seed) * 0.4) * 0.012 + Math.cos((idx + seed) * 0.7) * 0.008
    const value = Math.max(0, interpolated * (1 + wave))
    return {
      day: lang === 'zh' ? `${30 - idx}天前` : `D-${30 - idx}`,
      value: Number(value.toFixed(2)),
      cost: Number(totalCost.toFixed(2)),
    }
  }).reverse()
}

// ─── 主组件 ────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>('zh')
  const [isDark, setIsDark] = useState(false)
  const [chartView, setChartView] = useState<ChartView>('pie')
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<PortfolioItem>(defaultForm)
  const [filterTicker, setFilterTicker] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterMarket, setFilterMarket] = useState('ALL')
  const [marketLoading, setMarketLoading] = useState(false)
  const [marketError, setMarketError] = useState('')
  const [marketPrices, setMarketPrices] = useState<PriceMap>({})
  const [knownAssets, setKnownAssets] = useState<KnownAsset[]>([])
  const [marketFilterMarket, setMarketFilterMarket] = useState('ALL')
  const [marketFilterSector, setMarketFilterSector] = useState('ALL')
  const [marketSearch, setMarketSearch] = useState('')
  const [formError, setFormError] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<PortfolioItem>(defaultForm)
  const [showAddModal, setShowAddModal] = useState(false)
  const [tickerLookupLoading, setTickerLookupLoading] = useState(false)
  const [tickerLookupDone, setTickerLookupDone] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const t = T[lang]

  const view: View = useMemo(() => {
    if (location.pathname === '/performance') return 'performance'
    if (location.pathname === '/market') return 'market'
    return 'portfolio'
  }, [location.pathname])

  const loadItems = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/portfolio')
      if (!res.ok) throw new Error(`${lang === 'zh' ? '加载失败' : 'Load failed'}: ${res.status}`)
      setItems((await res.json()) as PortfolioItem[])
    } catch (e) { setError(e instanceof Error ? e.message : (lang === 'zh' ? '未知错误' : 'Unknown error')) }
    finally { setLoading(false) }
  }

  const loadMarketPrices = async () => {
    setMarketLoading(true); setMarketError('')
    try {
      // 1. 加载所有已知资产列表
      const assetsRes = await fetch('/api/portfolio/known-assets')
      if (!assetsRes.ok) throw new Error(`${lang === 'zh' ? '资产列表获取失败' : 'Asset list fetch failed'}: ${assetsRes.status}`)
      const assetList = (await assetsRes.json()) as KnownAsset[]

      // 2. 批量获取价格（分批，避免URL过长）
      const tickers = assetList.map((a) => a.ticker)
      const BATCH = 20
      const priceMap: PriceMap = {}
      for (let i = 0; i < tickers.length; i += BATCH) {
        const batch = tickers.slice(i, i + BATCH)
        try {
          const res = await fetch(`/api/portfolio/prices?tickers=${batch.join(',')}`)
          if (res.ok) {
            const batchPrices = (await res.json()) as PriceMap
            Object.assign(priceMap, batchPrices)
          }
        } catch {
          // 忽略单批失败
        }
      }
      setMarketPrices(priceMap)

      // 3. 将价格合并到资产列表，生成涨跌（基于价格哈希模拟）
      const enriched: KnownAsset[] = assetList.map((a) => {
        const price = priceMap[a.ticker] || 0
        // 用 ticker hash 生成稳定的涨跌幅（模拟）
        let hashVal = 0
        for (let j = 0; j < a.ticker.length; j++) hashVal = (hashVal * 31 + a.ticker.charCodeAt(j)) & 0xffffffff
        const changePct = ((hashVal % 500) - 250) / 100  // -2.5% ~ +2.5%
        const change = price * changePct / 100
        return { ...a, price, change, changePercent: changePct }
      })
      setKnownAssets(enriched)
    } catch (e) { setMarketError(e instanceof Error ? e.message : (lang === 'zh' ? '未知错误' : 'Unknown error')) }
    finally { setMarketLoading(false) }
  }

  // 根据股票代码自动填充资产信息
  const lookupTicker = async (ticker: string) => {
    if (!ticker.trim()) return
    setTickerLookupLoading(true)
    setTickerLookupDone(false)
    try {
      const res = await fetch(`/api/portfolio/asset-info/${ticker.trim().toUpperCase()}`)
      if (res.ok) {
        const info = (await res.json()) as { ticker: string; name: string; sector: string; exchange: string; market: string; currentPrice: number; found: boolean }
        setForm((prev) => ({
          ...prev,
          ticker: info.ticker,
          name: info.name || prev.name,
          sector: info.sector || prev.sector,
          market: info.market || prev.market,
          price: info.currentPrice > 0 ? info.currentPrice : prev.price,
        }))
        setTickerLookupDone(true)
      }
    } catch {
      // 忽略查询失败
    } finally {
      setTickerLookupLoading(false)
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setFormError('')
    if (!form.ticker.trim()) { setFormError(t.errTickerRequired); return }
    if (Number(form.quantity) <= 0 || Number(form.price) <= 0) { setFormError(t.errQtyPrice); return }
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ticker: form.ticker.trim().toUpperCase(), quantity: Number(form.quantity), price: Number(form.price) }),
      })
      if (!res.ok) {
        const p = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(p?.message ?? `${lang === 'zh' ? '创建失败' : 'Create failed'}: ${res.status}`)
      }
      setForm(defaultForm); setShowAddModal(false); await loadItems()
    } catch (e) { setError(e instanceof Error ? e.message : (lang === 'zh' ? '未知错误' : 'Unknown error')) }
  }

  const openEdit = (item: PortfolioItem) => {
    setFormError(''); setEditId(item.id ?? null)
    setEditForm({ ticker: item.ticker, name: item.name || '', sector: item.sector || '', quantity: item.quantity, price: item.price, type: item.type, currency: item.currency || 'USD', market: item.market || 'US', id: item.id })
  }
  const closeEdit = () => { setEditId(null); setEditForm(defaultForm) }

  const onUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!editId) return; setError(''); setFormError('')
    if (!editForm.ticker.trim()) { setFormError(t.errTickerRequired); return }
    if (Number(editForm.quantity) <= 0 || Number(editForm.price) <= 0) { setFormError(t.errQtyPrice); return }
    try {
      const res = await fetch(`/api/portfolio/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, ticker: editForm.ticker.trim().toUpperCase(), quantity: Number(editForm.quantity), price: Number(editForm.price) }),
      })
      if (!res.ok) {
        const p = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(p?.message ?? `${lang === 'zh' ? '更新失败' : 'Update failed'}: ${res.status}`)
      }
      closeEdit(); await loadItems()
    } catch (e) { setError(e instanceof Error ? e.message : (lang === 'zh' ? '未知错误' : 'Unknown error')) }
  }

  const onDelete = async (id?: number) => {
    if (!id) return
    if (!confirm(t.confirmDelete)) return
    setError('')
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`${lang === 'zh' ? '删除失败' : 'Delete failed'}: ${res.status}`)
      await loadItems()
    } catch (e) { setError(e instanceof Error ? e.message : (lang === 'zh' ? '未知错误' : 'Unknown error')) }
  }

  const bootstrap = async () => { await Promise.all([loadItems(), loadMarketPrices()]) }
  useEffect(() => { void bootstrap() }, [])

  const filteredItems = useMemo(() => items.filter((item) => {
    const tickerOk = filterTicker.trim()
      ? item.ticker.toUpperCase().includes(filterTicker.trim().toUpperCase()) || (item.name?.toUpperCase().includes(filterTicker.trim().toUpperCase()) ?? false)
      : true
    return tickerOk && (filterType === 'ALL' || item.type === filterType) && (filterMarket === 'ALL' || item.market === filterMarket)
  }), [items, filterTicker, filterType, filterMarket])

  const portfolioTotalCost = useMemo(() => filteredItems.reduce((s, i) => s + i.quantity * i.price, 0), [filteredItems])
  const portfolioByType = useMemo(() => {
    const m = new Map<string, number>()
    filteredItems.forEach((i) => m.set(i.type, (m.get(i.type) ?? 0) + i.quantity * (i.currentPrice || i.price)))
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredItems])

  const portfolioBySector = useMemo(() => {
    const m = new Map<string, number>()
    filteredItems.forEach((i) => {
      const s = i.sector || (lang === 'zh' ? '其他' : 'Other')
      m.set(s, (m.get(s) ?? 0) + i.quantity * (i.currentPrice || i.price))
    })
    return Array.from(m.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6)
  }, [filteredItems, lang])

  const totalMarketValue = useMemo(() => filteredItems.reduce((s, i) => s + i.quantity * (i.currentPrice || i.price), 0), [filteredItems])
  const totalPnl = useMemo(() => totalMarketValue - portfolioTotalCost, [totalMarketValue, portfolioTotalCost])
  const pnlPct = useMemo(() => (portfolioTotalCost === 0 ? 0 : (totalPnl / portfolioTotalCost) * 100), [portfolioTotalCost, totalPnl])
  const trendSeries = useMemo(() => buildPortfolioTrendSeries(items, lang), [items, lang])

  const gc = (v: number) => v >= 0 ? 'up' : 'down'
  const gi = (v: number) => v >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />
  const fmtNum = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // ── 语言切换按钮 ──────────────────────────────────────────────────────────────
  const LangBtn = () => (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => setLang((l) => l === 'zh' ? 'en' : 'zh')}
      title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
      style={{ fontWeight: 600, minWidth: 52, display: 'flex', alignItems: 'center', gap: 4 }}
    >
      <Languages size={15} />
      {lang === 'zh' ? 'EN' : '中文'}
    </button>
  )

  // ── 双语标签辅助 ──────────────────────────────────────────────────────────────
  const Bi = ({ zh, en: en_ }: { zh: string; en: string }) => (
    <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
      <span style={{ fontSize: lang === 'zh' ? 14 : 12, fontWeight: 600 }}>{lang === 'zh' ? zh : en_}</span>
      <span style={{ fontSize: lang === 'zh' ? 10 : 11, color: 'var(--text-muted)', fontWeight: 400 }}>{lang === 'zh' ? en_ : zh}</span>
    </span>
  )

  // ─── 首页 ─────────────────────────────────────────────────────────────────────
  if (location.pathname === '/') {
    return (
      <main className={`page ${isDark ? 'dark' : ''}`}>
        <div className="navbar">
          <div className="navbar-brand">
            <div className="logo">P</div>
            <span>Portfolio Manager</span>
          </div>
          <div className="navbar-actions">
            <LangBtn />
            <button className="btn btn-ghost btn-icon" onClick={() => setIsDark((v) => !v)}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <div className="card fade-in" style={{ maxWidth: 500, textAlign: 'center', padding: 48 }}>
            <div className="logo" style={{ width: 72, height: 72, margin: '0 auto 28px', fontSize: 32 }}>P</div>
            <h1 style={{ fontSize: 26, marginBottom: 6 }}>{t.appName}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>{t.appSubtitle}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/portfolio')}>
                <Briefcase size={18} /> {t.enterDashboard}
              </button>
              <button className="btn btn-secondary" onClick={() => setIsDark((v) => !v)}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? t.lightMode : t.darkMode}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ─── 主应用 ───────────────────────────────────────────────────────────────────
  return (
    <main className={`page ${isDark ? 'dark' : ''}`}>
      {/* 导航栏 */}
      <div className="navbar">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo">P</div>
          <Bi zh="投资组合管理" en="Portfolio Manager" />
        </div>
        <div className="navbar-actions">
          <LangBtn />
          <button className="btn btn-ghost btn-icon" onClick={() => void bootstrap()} title={lang === 'zh' ? '刷新数据' : 'Refresh data'}>
            <RefreshCw size={18} className={loading || marketLoading ? 'spin' : ''} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => setIsDark((v) => !v)}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* 市场概览条 */}
      <div className="market-bar">
        {marketIndices.map((idx) => (
          <div key={idx.nameZh} className="market-item">
            <span className="name">{lang === 'zh' ? idx.nameZh : idx.nameEn}</span>
            <span className="value">{idx.value.toFixed(2)}</span>
            <span className={`change ${gc(idx.changePercent)}`}>
              {gi(idx.changePercent)}{Math.abs(idx.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="container">
        {/* 标签页 */}
        <div className="tabs">
          <button className={view === 'portfolio' ? 'active' : ''} onClick={() => navigate('/portfolio')}>
            <Briefcase size={16} /> {t.tabPortfolio}
          </button>
          <button className={view === 'performance' ? 'active' : ''} onClick={() => navigate('/performance')}>
            <TrendingUp size={16} /> {t.tabPerformance}
          </button>
          <button className={view === 'market' ? 'active' : ''} onClick={() => navigate('/market')}>
            <Globe size={16} /> {t.tabMarket}
          </button>
        </div>

        {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}

        {/* ─── 投资组合页面 ────────────────────────────────────────────────────── */}
        {view === 'portfolio' && (
          <>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="label"><DollarSign size={14} /> <Bi zh="总资产净值" en="Net Asset Value" /></div>
                <div className="value">${fmtNum(totalMarketValue)}</div>
              </div>
              <div className="metric-card">
                <div className="label"><Activity size={14} /> <Bi zh="总成本" en="Total Cost" /></div>
                <div className="value">${fmtNum(portfolioTotalCost)}</div>
              </div>
              <div className="metric-card">
                <div className="label"><BarChart3 size={14} /> <Bi zh="未实现盈亏" en="Unrealized P&L" /></div>
                <div className={`value ${gc(totalPnl)}`}>{totalPnl >= 0 ? '+' : ''}${fmtNum(totalPnl)}</div>
                <div className={`change ${gc(pnlPct)}`}>{gi(pnlPct)} {Math.abs(pnlPct).toFixed(2)}%</div>
              </div>
              <div className="metric-card">
                <div className="label"><Briefcase size={14} /> <Bi zh="持仓数量" en="Positions" /></div>
                <div className="value">{filteredItems.length}</div>
              </div>
            </div>

            <div className="filters">
              <div className="search-box">
                <Search size={16} className="icon" />
                <input placeholder={t.searchPlaceholder} value={filterTicker} onChange={(e) => setFilterTicker(e.target.value)} />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="ALL">{t.allTypes}</option>
                <option value="STOCK">{t.typeStock}</option>
                <option value="ETF">{t.typeEtf}</option>
                <option value="BOND">{t.typeBond}</option>
                <option value="FUND">{t.typeFund}</option>
                <option value="CASH">{t.typeCash}</option>
              </select>
              <select value={filterMarket} onChange={(e) => setFilterMarket(e.target.value)}>
                <option value="ALL">{t.allMarkets}</option>
                <option value="US">{t.marketUS}</option>
                <option value="CN">{t.marketCN}</option>
                <option value="HK">{t.marketHK}</option>
              </select>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <Plus size={16} /> {t.addAsset}
              </button>
              <button className="btn btn-secondary" onClick={() => window.open('/api/portfolio/export', '_blank')}>
                {t.exportCsv}
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{t.colTicker}</th>
                    <th>{t.colName}</th>
                    <th>{t.colSector}</th>
                    <th>{t.colQty}</th>
                    <th>{t.colCost}</th>
                    <th>{t.colCurrent}</th>
                    <th>{t.colValue}</th>
                    <th>{t.colPnl}</th>
                    <th>{t.colDayChange}</th>
                    <th>{t.colType}</th>
                    <th>{t.colMarket}</th>
                    <th>{t.colAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={12}><div className="loading"><RefreshCw size={20} className="spin" /> {t.loading}</div></td></tr>
                  ) : filteredItems.length === 0 ? (
                    <tr><td colSpan={12}><div className="empty-state"><Briefcase size={48} /><p>{t.noData}</p></div></td></tr>
                  ) : (
                    filteredItems.map((item) => {
                      const cp = item.currentPrice || item.price
                      const mv = item.quantity * cp
                      const cost = item.quantity * item.price
                      const pnl = mv - cost
                      const pct = item.price > 0 ? (pnl / cost) * 100 : 0
                      return (
                        <tr key={item.id}>
                          <td><strong>{item.ticker}</strong></td>
                          <td>{item.name || '-'}</td>
                          <td>{item.sector || '-'}</td>
                          <td className="td-number">{item.quantity.toLocaleString()}</td>
                          <td className="td-number">${item.price.toFixed(2)}</td>
                          <td className="td-number">${cp.toFixed(2)}</td>
                          <td className="td-number">${mv.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className={`td-number ${gc(pnl)}`}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}<br />
                            <small>({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)</small>
                          </td>
                          <td className={`td-number ${gc(item.dayChangePercent || 0)}`}>
                            {(item.dayChangePercent ?? 0) >= 0 ? '+' : ''}{(item.dayChangePercent ?? 0).toFixed(2)}%
                          </td>
                          <td><span className="tag tag-primary">{item.type}</span></td>
                          <td>{item.market || 'US'}</td>
                          <td>
                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)} title={lang === 'zh' ? '编辑' : 'Edit'}><Pencil size={14} /></button>
                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => void onDelete(item.id)} title={lang === 'zh' ? '删除' : 'Delete'}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── 业绩分析页面 ────────────────────────────────────────────────────── */}
        {view === 'performance' && (
          <>
            <div className="content-grid">
              <div className="chart-container">
                <div className="card-header">
                  <div className="card-title">
                    <PieChartIcon size={18} />
                    <Bi zh="资产配置" en="Asset Allocation" />
                  </div>
                  <div className="tabs" style={{ margin: 0 }}>
                    <button className={chartView === 'pie' ? 'active' : ''} onClick={() => setChartView('pie')}>{t.chartPie}</button>
                    <button className={chartView === 'bar' ? 'active' : ''} onClick={() => setChartView('bar')}>{t.chartBar}</button>
                  </div>
                </div>
                {portfolioByType.length === 0 ? (
                  <div className="empty-state"><PieChartIcon size={48} /><p>{t.noData}</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    {chartView === 'pie' ? (
                      <PieChart>
                        <Pie data={portfolioByType} dataKey="value" nameKey="name" outerRadius={120}
                          label={(props) => `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`}>
                          {portfolioByType.map((e, i) => <Cell key={e.name} fill={pieColors[i % pieColors.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                        <Legend />
                      </PieChart>
                    ) : (
                      <BarChart data={portfolioByType}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                        <Bar dataKey="value" name={t.chartAssetValue}>
                          {portfolioByType.map((e, i) => <Cell key={e.name} fill={pieColors[i % pieColors.length]} />)}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>

              <div className="chart-container">
                <div className="card-header">
                  <div className="card-title">
                    <BarChart3 size={18} />
                    <Bi zh="行业分布" en="Sector Distribution" />
                  </div>
                </div>
                {portfolioBySector.length === 0 ? (
                  <div className="empty-state"><BarChart3 size={48} /><p>{t.noData}</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={portfolioBySector} layout="vertical">
                      <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                      <YAxis type="category" dataKey="name" width={110} />
                      <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                      <Bar dataKey="value" name={t.chartAssetValue} fill="#E57035" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="chart-container">
              <div className="card-header">
                <div className="card-title">
                  <TrendingUp size={18} />
                  <Bi zh="资产净值走势（个人持仓）" en="Portfolio NAV Trend (Holdings)" />
                </div>
              </div>
              {trendSeries.length === 0 ? (
                <div className="empty-state"><TrendingUp size={48} /><p>{t.noData}</p></div>
              ) : (
                <>
                  {/* 持仓明细摘要 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, padding: '0 4px' }}>
                    {items.map((item) => {
                      const mv = item.quantity * (item.currentPrice || item.price)
                      const cost = item.quantity * item.price
                      const pnl = mv - cost
                      const pct = cost > 0 ? (pnl / cost) * 100 : 0
                      return (
                        <div key={item.id} style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '8px 12px',
                          minWidth: 140,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{item.ticker}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.name || '-'}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                            {lang === 'zh' ? '市值' : 'MV'}: <strong>${mv.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
                          </div>
                          <div className={`change ${gc(pnl)}`} style={{ fontSize: 12 }}>
                            {pnl >= 0 ? '+' : ''}{pct.toFixed(2)}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendSeries}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E57035" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#E57035" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={60} />
                      <Tooltip formatter={(v, name) => [
                        `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                        name === 'value' ? (lang === 'zh' ? '资产净值' : 'NAV') : (lang === 'zh' ? '持仓成本' : 'Cost Basis')
                      ]} />
                      <Area type="monotone" dataKey="value" stroke="#E57035" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name={lang === 'zh' ? '资产净值' : 'NAV'} />
                      <Area type="monotone" dataKey="cost" stroke="#6B7280" strokeDasharray="5 5" fill="none" strokeWidth={1.5} name={lang === 'zh' ? '持仓成本' : 'Cost Basis'} />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </>
        )}

        {/* ─── 市场行情页面 ────────────────────────────────────────────────────── */}
        {view === 'market' && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Globe size={18} />
                <Bi zh="实时行情" en="Live Quotes" />
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => void loadMarketPrices()}>
                <RefreshCw size={14} className={marketLoading ? 'spin' : ''} />
                {lang === 'zh' ? ' 刷新' : ' Refresh'}
              </button>
            </div>

            {/* 筛选栏 */}
            <div className="filters" style={{ marginBottom: 16 }}>
              <div className="search-box">
                <Search size={16} className="icon" />
                <input
                  placeholder={lang === 'zh' ? '搜索代码或名称...' : 'Search ticker or name...'}
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                />
              </div>
              <select value={marketFilterMarket} onChange={(e) => setMarketFilterMarket(e.target.value)}>
                <option value="ALL">{t.allMarkets}</option>
                <option value="US">{t.marketUS}</option>
                <option value="CN">{t.marketCN}</option>
                <option value="HK">{t.marketHK}</option>
              </select>
              <select value={marketFilterSector} onChange={(e) => setMarketFilterSector(e.target.value)}>
                <option value="ALL">{lang === 'zh' ? '全部行业' : 'All Sectors'}</option>
                {Array.from(new Set(knownAssets.map((a) => a.sector))).sort().map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {marketError && <div className="error" style={{ marginBottom: 16 }}>{marketError}</div>}

            {marketLoading ? (
              <div className="loading"><RefreshCw size={20} className="spin" /> {t.loading}</div>
            ) : (() => {
              // 筛选
              const filtered = knownAssets.filter((a) => {
                const searchOk = marketSearch.trim()
                  ? a.ticker.toUpperCase().includes(marketSearch.trim().toUpperCase()) || a.name.toUpperCase().includes(marketSearch.trim().toUpperCase())
                  : true
                const mktOk = marketFilterMarket === 'ALL' || a.market === marketFilterMarket
                const secOk = marketFilterSector === 'ALL' || a.sector === marketFilterSector
                return searchOk && mktOk && secOk
              })

              if (filtered.length === 0) {
                return <div className="empty-state"><Globe size={48} /><p>{t.noData}</p></div>
              }

              // 按市场分组
              const groupOrder = ['US', 'CN', 'HK']
              const marketLabel: Record<string, string> = {
                US: lang === 'zh' ? '🇺🇸 美股' : '🇺🇸 US Stocks',
                CN: lang === 'zh' ? '🇨🇳 A股' : '🇨🇳 China A-Share',
                HK: lang === 'zh' ? '🇭🇰 港股' : '🇭🇰 Hong Kong',
              }
              const grouped = new Map<string, KnownAsset[]>()
              groupOrder.forEach((m) => grouped.set(m, []))
              filtered.forEach((a) => {
                grouped.set(a.market, [...(grouped.get(a.market) ?? []), a])
              })

              return (
                <>
                  {groupOrder.map((mkt) => {
                    const list = grouped.get(mkt) ?? []
                    if (list.length === 0) return null
                    return (
                      <div key={mkt} style={{ marginBottom: 24 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, paddingLeft: 4 }}>
                          {marketLabel[mkt] ?? mkt} &nbsp;<span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}>({list.length})</span>
                        </div>
                        <div className="table-container">
                          <table>
                            <thead>
                              <tr>
                                <th>{t.colTicker}</th>
                                <th>{t.colName}</th>
                                <th>{t.colSector}</th>
                                <th>{t.colPrice}</th>
                                <th>{t.colChange}</th>
                                <th>{t.colChangePct}</th>
                                <th>Exchange</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((a) => (
                                <tr key={a.ticker}>
                                  <td><strong>{a.ticker}</strong></td>
                                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name || '-'}</td>
                                  <td><span className="tag tag-neutral" style={{ fontSize: 11 }}>{a.sector || '-'}</span></td>
                                  <td className="td-number">{a.price ? `$${a.price.toFixed(2)}` : '-'}</td>
                                  <td className={`td-number ${gc(a.change ?? 0)}`}>
                                    {a.change !== undefined ? `${a.change >= 0 ? '+' : ''}${a.change.toFixed(2)}` : '-'}
                                  </td>
                                  <td className={`td-number ${gc(a.changePercent ?? 0)}`}>
                                    {a.changePercent !== undefined ? (
                                      <>{gi(a.changePercent)} {Math.abs(a.changePercent).toFixed(2)}%</>
                                    ) : '-'}
                                  </td>
                                  <td><span className="tag tag-primary" style={{ fontSize: 11 }}>{a.exchange}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  })}
                </>
              )
            })()}
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="footer">
        <p>Portfolio Manager &nbsp;·&nbsp; 投资组合管理系统 &nbsp;·&nbsp; {lang === 'zh' ? '数据由 Massive.com 提供' : 'Data powered by Massive.com'}</p>
      </footer>

      {/* ─── 添加资产模态框 ───────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>
                <Bi zh={t.modalAddTitle} en={T.en.modalAddTitle} />
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={() => { setShowAddModal(false); setForm(defaultForm); setTickerLookupDone(false) }}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={onSubmit}>
                {/* 股票代码 - 输入完成后自动查询 */}
                <div className="form-group">
                  <label>{t.fieldTicker}</label>
                  <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                    <input
                      required
                      placeholder={t.fieldTickerPlaceholder}
                      value={form.ticker}
                      onChange={(e) => { setForm({ ...form, ticker: e.target.value }); setTickerLookupDone(false) }}
                      onBlur={(e) => { if (e.target.value.trim()) void lookupTicker(e.target.value) }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => void lookupTicker(form.ticker)}
                      disabled={!form.ticker.trim() || tickerLookupLoading}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {tickerLookupLoading
                        ? <RefreshCw size={14} className="spin" />
                        : <Search size={14} />}
                      {lang === 'zh' ? ' 查询' : ' Lookup'}
                    </button>
                  </div>
                  {tickerLookupDone && (
                    <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>
                      ✓ {lang === 'zh' ? '已自动填充股票信息' : 'Stock info auto-filled'}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.fieldName}</label>
                    <input placeholder={t.fieldNamePlaceholder} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>{t.fieldSector}</label>
                    <input placeholder={t.fieldSectorPlaceholder} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.fieldQty}</label>
                    <input required type="number" min="0" step="0.01" placeholder="0.00" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>{t.fieldPrice}</label>
                    <input required type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.fieldType}</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="STOCK">{t.typeStock}</option>
                      <option value="ETF">{t.typeEtf}</option>
                      <option value="BOND">{t.typeBond}</option>
                      <option value="FUND">{t.typeFund}</option>
                      <option value="CASH">{t.typeCash}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.fieldMarket}</label>
                    <select value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })}>
                      <option value="US">{t.marketUS}</option>
                      <option value="CN">{t.marketCN}</option>
                      <option value="HK">{t.marketHK}</option>
                    </select>
                  </div>
                </div>
                {formError && <div className="error">{formError}</div>}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowAddModal(false); setForm(defaultForm); setTickerLookupDone(false) }}>{t.btnCancel}</button>
                  <button type="submit" className="btn btn-primary">{t.btnAdd}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── 编辑资产模态框 ───────────────────────────────────────────────────── */}
      {editId && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>
                <Bi zh={`${T.zh.modalEditTitle} #${editId}`} en={`${T.en.modalEditTitle} #${editId}`} />
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={closeEdit}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={onUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.fieldTicker}</label>
                    <input required value={editForm.ticker} onChange={(e) => setEditForm({ ...editForm, ticker: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>{t.fieldName}</label>
                    <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.fieldQty}</label>
                    <input required type="number" min="0" step="0.01" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>{t.fieldPrice}</label>
                    <input required type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.fieldType}</label>
                    <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                      <option value="STOCK">{t.typeStock}</option>
                      <option value="ETF">{t.typeEtf}</option>
                      <option value="BOND">{t.typeBond}</option>
                      <option value="FUND">{t.typeFund}</option>
                      <option value="CASH">{t.typeCash}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.fieldMarket}</label>
                    <select value={editForm.market} onChange={(e) => setEditForm({ ...editForm, market: e.target.value })}>
                      <option value="US">{t.marketUS}</option>
                      <option value="CN">{t.marketCN}</option>
                      <option value="HK">{t.marketHK}</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>{t.fieldSector}</label>
                  <input value={editForm.sector} onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })} />
                </div>
                {formError && <div className="error">{formError}</div>}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={closeEdit}>{t.btnCancel}</button>
                  <button type="submit" className="btn btn-primary">{t.btnSave}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
