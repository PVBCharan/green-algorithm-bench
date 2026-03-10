// Dashboard.jsx
// Dashboard — system metrics + multi-stock ML benchmark results
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, Leaf, Zap, Clock, Cpu, HardDrive,
  RefreshCw, Wifi, WifiOff, TrendingUp, Award, Battery,
  Target, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import api from '@/services/api'

const CHART_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
]

const TICKER_NAMES = {
  AAPL: 'Apple Inc.', GOOGL: 'Alphabet Inc.', MSFT: 'Microsoft Corporation',
  TSLA: 'Tesla Inc.', AMZN: 'Amazon.com Inc.', META: 'Meta Platforms Inc.',
  NVDA: 'NVIDIA Corporation', NFLX: 'Netflix Inc.', JPM: 'JPMorgan Chase & Co.',
  V: 'Visa Inc.', WMT: 'Walmart Inc.', DIS: 'The Walt Disney Company',
  INTC: 'Intel Corporation', AMD: 'Advanced Micro Devices Inc.', BABA: 'Alibaba Group',
  PYPL: 'PayPal Holdings Inc.', UBER: 'Uber Technologies Inc.', SPOT: 'Spotify Technology S.A.',
}

function getTickerDisplay(ticker) {
  return TICKER_NAMES[ticker] ? `${TICKER_NAMES[ticker]} (${ticker})` : ticker
}

// Mini bar chart
function MiniBarChart({ data, valueKey, title, unit }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = { top: 24, right: 10, bottom: 40, left: 50 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    const values = data.map(d => d[valueKey])
    const maxVal = Math.max(...values) * 1.15 || 1
    const barWidth = Math.min(chartW / data.length * 0.6, 40)
    const gap = chartW / data.length

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + chartH - (chartH * i / 3)
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText((maxVal * i / 3).toFixed(2), padding.left - 6, y + 3)
    }

    data.forEach((d, i) => {
      const val = d[valueKey]
      const barH = (val / maxVal) * chartH
      const x = padding.left + gap * i + (gap - barWidth) / 2
      const y = padding.top + chartH - barH

      const gradient = ctx.createLinearGradient(x, y, x, y + barH)
      gradient.addColorStop(0, CHART_COLORS[i % CHART_COLORS.length])
      gradient.addColorStop(1, CHART_COLORS[i % CHART_COLORS.length] + '88')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0])
      ctx.fill()

      ctx.fillStyle = '#64748b'
      ctx.font = '9px Inter, sans-serif'
      ctx.save()
      ctx.translate(x + barWidth / 2, padding.top + chartH + 8)
      ctx.rotate(-0.4)
      ctx.textAlign = 'right'
      ctx.fillText(d.algorithm, 0, 0)
      ctx.restore()
    })

    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${title} (${unit})`, width / 2, 14)
  }, [data, valueKey, title, unit])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '220px' }} className="rounded-xl border border-slate-200" />
}

// Per-stock dashboard section
function StockDashSection({ ticker, stockData }) {
  const successResults = stockData?.results?.filter(r => r.status === 'success') || []
  if (successResults.length === 0) return null

  return (
    <div className="mb-10 space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-600" />
        {getTickerDisplay(ticker)}
      </h3>

      {/* Recommendations row */}
      {stockData.recommendations && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stockData.recommendations.fastest && (
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-semibold uppercase">Fastest</p>
                  <p className="text-base font-bold text-slate-800">{stockData.recommendations.fastest.algorithm}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">{stockData.recommendations.fastest.runtime?.toFixed(4)}s</p>
            </Card>
          )}
          {stockData.recommendations.greenest && (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-semibold uppercase">Greenest</p>
                  <p className="text-base font-bold text-slate-800">{stockData.recommendations.greenest.algorithm}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">{stockData.recommendations.greenest.energy_wh?.toFixed(6)} Wh</p>
            </Card>
          )}
          {stockData.recommendations.most_accurate && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-semibold uppercase">Most Accurate</p>
                  <p className="text-base font-bold text-slate-800">{stockData.recommendations.most_accurate.algorithm}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">R² = {stockData.recommendations.most_accurate.r2?.toFixed(4)}</p>
            </Card>
          )}
        </div>
      )}

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 pb-3">
          <p className="font-bold text-slate-800 flex items-center gap-2 text-base">
            <BarChart3 className="w-4 h-4 text-green-600" />
            Results Table
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="text-left py-2.5 px-4 font-semibold text-slate-600">Algorithm</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">Runtime (s)</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">CPU</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">Memory</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">Energy (Wh)</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">CO₂ (g)</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">RMSE</th>
                <th className="text-right py-2.5 px-4 font-semibold text-slate-600">R²</th>
              </tr>
            </thead>
            <tbody>
              {successResults.map((r, i) => (
                <tr key={r.algorithm} className="border-b border-slate-100 hover:bg-green-50/50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {r.algorithm}
                  </td>
                  <td className="text-right py-2.5 px-4 text-slate-700 font-mono">{r.runtime?.toFixed(4)}</td>
                  <td className="text-right py-2.5 px-4 text-slate-700">{r.cpu_usage}%</td>
                  <td className="text-right py-2.5 px-4 text-slate-700">{r.memory_usage}</td>
                  <td className="text-right py-2.5 px-4 text-slate-700 font-mono">{r.energy_wh?.toFixed(6)}</td>
                  <td className="text-right py-2.5 px-4 text-slate-700 font-mono">{r.co2_g?.toFixed(6)}</td>
                  <td className="text-right py-2.5 px-4 text-slate-700 font-mono">{r.rmse?.toFixed(4)}</td>
                  <td className="text-right py-2.5 px-4">
                    <span className={`font-bold font-mono ${r.r2 >= 0.9 ? 'text-green-600' : r.r2 >= 0.7 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {r.r2?.toFixed(4)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><MiniBarChart data={successResults} valueKey="runtime" title={`Runtime — ${ticker}`} unit="s" /></Card>
        <Card><MiniBarChart data={successResults} valueKey="energy_wh" title={`Energy — ${ticker}`} unit="Wh" /></Card>
        <Card><MiniBarChart data={successResults} valueKey="co2_g" title={`CO₂ — ${ticker}`} unit="g" /></Card>
        <Card><MiniBarChart data={successResults} valueKey="r2" title={`R² — ${ticker}`} unit="R²" /></Card>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const [systemData, setSystemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendOnline, setBackendOnline] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [benchmarkData, setBenchmarkData] = useState(null)

  const fetchSystemFootprint = async () => {
    try {
      setLoading(true)
      const data = await api.get('/api/system-footprint')
      setSystemData(data)
      setBackendOnline(true)
      setLastUpdated(new Date())
    } catch {
      setBackendOnline(false)
      setSystemData({
        cpu_percent: 35 + Math.random() * 20,
        memory_used_gb: 6 + Math.random() * 2,
        memory_percent: 45 + Math.random() * 15,
        power_watts: 85 + Math.random() * 30,
        carbon_kg_per_hour: 0.04 + Math.random() * 0.02,
        energy_kwh: 0.09 + Math.random() * 0.03,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemFootprint()
    const interval = setInterval(fetchSystemFootprint, 30000)
    return () => clearInterval(interval)
  }, [])

  // Load stored benchmark results
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lastBenchmarkResults')
      if (stored) setBenchmarkData(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  // Normalize to { ticker: stockData } map
  const stockMap = (() => {
    if (!benchmarkData) return null
    if (benchmarkData.multi && benchmarkData.stock_results) {
      return benchmarkData.stock_results
    }
    if (benchmarkData.ticker) {
      return { [benchmarkData.ticker]: benchmarkData }
    }
    return null
  })()

  const summaryCards = systemData ? [
    { label: 'CPU Usage', value: `${systemData.cpu_percent?.toFixed(1)}%`, icon: Cpu, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { label: 'Memory Used', value: `${systemData.memory_used_gb?.toFixed(1)} GB`, icon: HardDrive, bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { label: 'Power Draw', value: `${systemData.power_watts?.toFixed(1)} W`, icon: Zap, bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
    { label: 'CO₂/Hour', value: `${(systemData.carbon_kg_per_hour * 1000)?.toFixed(1)}g`, icon: Leaf, bgColor: 'bg-green-100', textColor: 'text-green-600' },
  ] : []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-hero py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-green-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${backendOnline ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}
            >
              {backendOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {backendOnline ? 'Live Data' : 'Demo Mode'}
            </motion.div>
          </div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-300 text-xl max-w-2xl"
          >
            Real-time system metrics and ML benchmark monitoring
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* System Metrics */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">System Metrics</h2>
          <button onClick={fetchSystemFootprint} disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Refresh'}
          </button>
        </div>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {summaryCards.map(({ label, value, icon: Icon, bgColor, textColor }) => (
            <StaggerItem key={label}>
              <Card hover glow className="h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Energy Card */}
        {systemData && (
          <AnimatedSection delay={0.2} className="mb-12">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium mb-2">Current Energy Consumption</p>
                  <p className="text-4xl font-bold mb-2">{systemData.energy_kwh?.toFixed(4)} kWh</p>
                  <p className="text-green-100 text-base">
                    Estimated {(systemData.carbon_kg_per_hour * 1000).toFixed(1)}g CO₂ per hour
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        )}

        {/* ML Benchmark Results — per stock */}
        {stockMap && Object.keys(stockMap).length > 0 ? (
          <AnimatedSection delay={0.3}>
            <h2 className="text-xl font-bold text-slate-800 mb-6">ML Benchmark Results</h2>
            {Object.entries(stockMap).map(([ticker, stockData]) => (
              <StockDashSection key={ticker} ticker={ticker} stockData={stockData} />
            ))}
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.3}>
            <Card className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">No Benchmark Results Yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Run your first ML stock prediction benchmark to see per-stock results, charts, and recommendations here.
              </p>
              <Link to="/stocks" className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2">
                Run a Benchmark
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
