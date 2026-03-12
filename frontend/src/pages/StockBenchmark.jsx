// StockBenchmark.jsx
// Multi-stock prediction ML benchmarking page
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Play, RotateCcw, Check, Clock, Battery, Leaf,
    Cpu, Zap, Award, BarChart3,
    Loader2, AlertCircle, Target, Info, X
} from 'lucide-react'
import { runSingleTickerBenchmark } from '../services/stockService'

// Full stock list with company names
const STOCK_OPTIONS = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'TSLA', name: 'Tesla Inc.' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    { ticker: 'META', name: 'Meta Platforms Inc.' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation' },
    { ticker: 'NFLX', name: 'Netflix Inc.' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
    { ticker: 'V', name: 'Visa Inc.' },
    { ticker: 'WMT', name: 'Walmart Inc.' },
    { ticker: 'DIS', name: 'The Walt Disney Company' },
    { ticker: 'INTC', name: 'Intel Corporation' },
    { ticker: 'AMD', name: 'Advanced Micro Devices Inc.' },
    { ticker: 'BABA', name: 'Alibaba Group' },
    { ticker: 'PYPL', name: 'PayPal Holdings Inc.' },
    { ticker: 'UBER', name: 'Uber Technologies Inc.' },
    { ticker: 'SPOT', name: 'Spotify Technology S.A.' },
]

// Algorithm definitions grouped by category
const ALGORITHM_GROUPS = [
    {
        category: 'Traditional ML',
        algorithms: [
            { id: 'LinearRegression', name: 'Linear Regression' },
            { id: 'KNN', name: 'K-Nearest Neighbors' },
        ],
    },
    {
        category: 'Ensemble ML',
        algorithms: [
            { id: 'RandomForest', name: 'Random Forest' },
        ],
    },
    {
        category: 'Boosting',
        algorithms: [
            { id: 'XGBoost', name: 'XGBoost' },
            { id: 'LightGBM', name: 'LightGBM' },
        ],
    },
    {
        category: 'Kernel Methods',
        algorithms: [
            { id: 'SVR', name: 'SVR' },
        ],
    },
    {
        category: 'Probabilistic',
        algorithms: [
            { id: 'BayesianNetwork', name: 'Bayesian Network' },
        ],
    },
    {
        category: 'Deep Learning',
        algorithms: [
            { id: 'CNN', name: 'CNN' },
            { id: 'LSTM', name: 'LSTM' },
        ],
    },
    {
        category: 'Reinforcement Learning',
        algorithms: [
            { id: 'DQN', name: 'DQN' },
        ],
    },
]

// Color palette for charts
const CHART_COLORS = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
]

// Get display name for a ticker
function getTickerDisplay(ticker) {
    const opt = STOCK_OPTIONS.find(s => s.ticker === ticker)
    return opt ? `${opt.name} (${ticker})` : ticker
}

// --------------- Bar Chart Component ---------------
function BarChart({ data, labelKey, valueKey, title, unit }) {
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
        const padding = { top: 30, right: 20, bottom: 60, left: 60 }
        const chartW = width - padding.left - padding.right
        const chartH = height - padding.top - padding.bottom

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, width, height)

        const values = data.map(d => d[valueKey])
        const maxVal = Math.max(...values) * 1.15 || 1
        const barWidth = Math.min(chartW / data.length * 0.6, 50)
        const gap = chartW / data.length

        // Grid lines
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 1
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + chartH - (chartH * i / 4)
            ctx.beginPath()
            ctx.moveTo(padding.left, y)
            ctx.lineTo(width - padding.right, y)
            ctx.stroke()
            ctx.fillStyle = '#94a3b8'
            ctx.font = '11px Inter, sans-serif'
            ctx.textAlign = 'right'
            ctx.fillText((maxVal * i / 4).toFixed(2), padding.left - 8, y + 4)
        }

        // Bars
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
            ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0])
            ctx.fill()

            ctx.fillStyle = '#334155'
            ctx.font = 'bold 11px Inter, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(val.toFixed(4), x + barWidth / 2, y - 6)

            ctx.fillStyle = '#64748b'
            ctx.font = '10px Inter, sans-serif'
            ctx.save()
            ctx.translate(x + barWidth / 2, padding.top + chartH + 10)
            ctx.rotate(-0.5)
            ctx.textAlign = 'right'
            ctx.fillText(d[labelKey], 0, 0)
            ctx.restore()
        })

        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 13px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${title} (${unit})`, width / 2, 18)
    }, [data, labelKey, valueKey, title, unit])

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '280px' }}
            className="rounded-xl border border-slate-200"
        />
    )
}

// --------------- Per-Stock Result Block ---------------
function StockResultBlock({ ticker, stockData }) {
    const successResults = stockData?.results?.filter(r => r.status === 'success') || []

    if (stockData?.error) {
        return (
            <div className="card-base shadow-md border-red-200 bg-red-50 mb-8">
                <h3 className="text-lg font-bold text-red-800 mb-2">
                    {getTickerDisplay(ticker)} — Error
                </h3>
                <p className="text-sm text-red-600">{stockData.error}</p>
            </div>
        )
    }

    if (successResults.length === 0) return null

    return (
        <div className="mb-10 space-y-6">
            {/* Stock Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Stock</p>
                        <p className="text-lg font-bold text-slate-800">{getTickerDisplay(ticker)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Records</p>
                        <p className="text-2xl font-bold text-slate-800">{stockData.records?.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Train / Test</p>
                        <p className="text-2xl font-bold text-slate-800">{stockData.train_size} / {stockData.test_size}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Algorithms</p>
                        <p className="text-2xl font-bold text-green-600">{successResults.length}</p>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {stockData.recommendations && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stockData.recommendations.fastest && (
                        <div className="card-base shadow-md border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-semibold uppercase">Fastest</p>
                                    <p className="text-lg font-bold text-slate-800">{stockData.recommendations.fastest.algorithm}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600">
                                <Clock className="w-3.5 h-3.5 inline mr-1" />
                                {stockData.recommendations.fastest.runtime?.toFixed(4)}s
                            </p>
                        </div>
                    )}
                    {stockData.recommendations.greenest && (
                        <div className="card-base shadow-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-green-600 font-semibold uppercase">Greenest</p>
                                    <p className="text-lg font-bold text-slate-800">{stockData.recommendations.greenest.algorithm}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600">
                                <Battery className="w-3.5 h-3.5 inline mr-1" />
                                {stockData.recommendations.greenest.energy_wh?.toFixed(6)} Wh
                            </p>
                        </div>
                    )}
                    {stockData.recommendations.most_accurate && (
                        <div className="card-base shadow-md border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-purple-600 font-semibold uppercase">Most Accurate</p>
                                    <p className="text-lg font-bold text-slate-800">{stockData.recommendations.most_accurate.algorithm}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600">
                                <Target className="w-3.5 h-3.5 inline mr-1" />
                                R² = {stockData.recommendations.most_accurate.r2?.toFixed(4)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Results Table */}
            <div className="card-base shadow-lg overflow-hidden">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Results — {getTickerDisplay(ticker)}
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-semibold text-slate-600">Algorithm</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Runtime (s)</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">CPU Usage</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Memory</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">Energy (Wh)</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">CO₂ (g)</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">MAE</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">RMSE</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">R²</th>
                                <th className="text-right py-3 px-4 font-semibold text-slate-600">MAPE (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.results.map((r, i) => (
                                <tr
                                    key={r.algorithm}
                                    className={`border-b border-slate-100 hover:bg-green-50/50 transition-colors ${r.status === 'error' ? 'opacity-50' : ''}`}
                                >
                                    <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                                            style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                        {r.algorithm}
                                        {r.status === 'error' && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Error</span>
                                        )}
                                    </td>
                                    <td className="text-right py-3 px-4 text-slate-700 font-mono">{r.runtime?.toFixed(4)}</td>
                                    <td className="text-right py-3 px-4 text-slate-700">{r.cpu_usage}%</td>
                                    <td className="text-right py-3 px-4 text-slate-700">{r.memory_usage}</td>
                                    <td className="text-right py-3 px-4 text-slate-700 font-mono">{r.energy_wh?.toFixed(6)}</td>
                                    <td className="text-right py-3 px-4 text-slate-700 font-mono">{r.co2_g?.toFixed(6)}</td>
                                    <td className="text-right py-3 px-4 text-slate-700 font-mono">{r.mae?.toFixed(4)}</td>
                                    <td className="text-right py-3 px-4 text-slate-700 font-mono">{r.rmse?.toFixed(4)}</td>
                                    <td className="text-right py-3 px-4">
                                        <span className={`font-bold font-mono ${r.r2 >= 0.9 ? 'text-green-600' : r.r2 >= 0.7 ? 'text-yellow-600' : 'text-red-500'}`}>
                                            {r.r2?.toFixed(4)}
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-4 text-slate-700 font-mono">{r.mape?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-base shadow-md">
                    <BarChart data={successResults} labelKey="algorithm" valueKey="runtime" title={`Runtime — ${ticker}`} unit="seconds" />
                </div>
                <div className="card-base shadow-md">
                    <BarChart data={successResults} labelKey="algorithm" valueKey="cpu_usage" title={`CPU Usage — ${ticker}`} unit="%" />
                </div>
                <div className="card-base shadow-md">
                    <BarChart data={successResults} labelKey="algorithm" valueKey="memory_usage_mb" title={`Memory Usage — ${ticker}`} unit="MB" />
                </div>
                <div className="card-base shadow-md">
                    <BarChart data={successResults} labelKey="algorithm" valueKey="energy_wh" title={`Energy — ${ticker}`} unit="Wh" />
                </div>
                <div className="card-base shadow-md">
                    <BarChart data={successResults} labelKey="algorithm" valueKey="co2_g" title={`CO₂ — ${ticker}`} unit="grams" />
                </div>
                <div className="card-base shadow-md">
                    <BarChart data={successResults} labelKey="algorithm" valueKey="r2" title={`R² Score — ${ticker}`} unit="R²" />
                </div>
            </div>

            {/* Actual vs Predicted */}
            {successResults.length > 0 && successResults[0].predictions_sample && (
                <div className="card-base shadow-lg">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Actual vs Predicted — {successResults[0].algorithm} ({ticker})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-2 px-3 font-semibold text-slate-600">#</th>
                                    <th className="text-right py-2 px-3 font-semibold text-slate-600">Actual</th>
                                    <th className="text-right py-2 px-3 font-semibold text-slate-600">Predicted</th>
                                    <th className="text-right py-2 px-3 font-semibold text-slate-600">Diff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {successResults[0].actuals_sample?.map((actual, i) => {
                                    const pred = successResults[0].predictions_sample[i]
                                    const diff = pred - actual
                                    return (
                                        <tr key={i} className="border-b border-slate-100">
                                            <td className="py-2 px-3 text-slate-500">{i + 1}</td>
                                            <td className="text-right py-2 px-3 font-mono text-slate-800">${actual?.toFixed(2)}</td>
                                            <td className="text-right py-2 px-3 font-mono text-blue-600">${pred?.toFixed(2)}</td>
                                            <td className={`text-right py-2 px-3 font-mono ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {diff >= 0 ? '+' : ''}{diff?.toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}


// --------------- Main Component ---------------
export default function StockBenchmark() {
    const [selectedTickers, setSelectedTickers] = useState([])
    const [records, setRecords] = useState(1000)
    const [selectedAlgorithms, setSelectedAlgorithms] = useState([])
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [warning, setWarning] = useState(null)
    const [progress, setProgress] = useState('')
    const [stockDropdownOpen, setStockDropdownOpen] = useState(false)

    const toggleTicker = useCallback((ticker) => {
        setSelectedTickers(prev =>
            prev.includes(ticker)
                ? prev.filter(t => t !== ticker)
                : [...prev, ticker]
        )
    }, [])

    const toggleAlgorithm = useCallback((algoId) => {
        setSelectedAlgorithms(prev =>
            prev.includes(algoId)
                ? prev.filter(a => a !== algoId)
                : [...prev, algoId]
        )
        setWarning(null)
    }, [])

    const selectAllAlgos = useCallback(() => {
        const all = ALGORITHM_GROUPS.flatMap(g => g.algorithms.map(a => a.id))
        setSelectedAlgorithms(all)
        setWarning(null)
    }, [])

    const deselectAllAlgos = useCallback(() => {
        setSelectedAlgorithms([])
    }, [])

    const handleRunBenchmark = async () => {
        // Defensive: strip any blank/falsy entries from selectedTickers
        const validTickers = selectedTickers.filter(t => t && String(t).trim())

        if (validTickers.length === 0) {
            setWarning('Please select at least one stock ticker.')
            setError(null)
            return
        }
        if (selectedAlgorithms.length === 0) {
            setWarning('Please select at least one algorithm to run the benchmark.')
            setError(null)
            return
        }

        setLoading(true)
        setError(null)
        setWarning(null)
        setResults(null)

        // Process tickers ONE AT A TIME to avoid server overload
        const allStockResults = {}
        let failCount = 0

        for (let i = 0; i < validTickers.length; i++) {
            const ticker = validTickers[i]
            setProgress(`Processing ${ticker} (${i + 1}/${validTickers.length}) with ${selectedAlgorithms.length} algorithm(s)...`)

            try {
                const data = await runSingleTickerBenchmark(ticker, records, selectedAlgorithms)
                allStockResults[ticker] = data
            } catch (err) {
                failCount++
                allStockResults[ticker] = {
                    ticker,
                    error: err.response?.data?.detail || err.message || `Failed for ${ticker}`,
                    results: [],
                    recommendations: null,
                }
            }

            // Show partial results as they come in
            if (validTickers.length > 1) {
                setResults({
                    multi: true,
                    tickers: validTickers.slice(0, i + 1),
                    records,
                    stock_results: { ...allStockResults },
                })
            }
        }

        // Final results
        if (validTickers.length === 1) {
            const single = allStockResults[validTickers[0]]
            single.multi = false
            setResults(single)
        } else {
            setResults({
                multi: true,
                tickers: validTickers,
                records,
                stock_results: allStockResults,
            })
        }

        if (failCount > 0 && failCount < validTickers.length) {
            setWarning(`${failCount} stock(s) failed but others completed successfully.`)
        } else if (failCount === validTickers.length) {
            setError('All benchmarks failed. Please check if the backend is running.')
        }

        setProgress('')
        setLoading(false)

        // Persist for Dashboard
        try { sessionStorage.setItem('lastBenchmarkResults', JSON.stringify(allStockResults)) } catch (e) { /* ignore */ }
    }

    const handleReset = () => {
        setResults(null)
        setError(null)
        setWarning(null)
        setProgress('')
    }

    // Normalize results to a { ticker: stockData } map
    const normalizedResults = (() => {
        if (!results) return null
        if (results.multi) {
            return results.stock_results
        }
        // Single ticker result
        if (results.ticker) {
            return { [results.ticker]: results }
        }
        return null
    })()

    return (
        <div className="min-h-screen">
            {/* Hero Header */}
            <section className="bg-gradient-hero text-white section-padding">
                <div className="container-wide">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/20 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
                            <TrendingUp className="w-4 h-4" />
                            Stock Price Prediction Benchmark
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            ML Algorithm <span className="text-gradient-green">Benchmark</span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                            Compare machine learning algorithms for stock prediction — select multiple stocks, measure accuracy, performance, energy usage, and carbon footprint.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section-padding">
                <div className="container-wide space-y-8">

                    {/* Configuration Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-base shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600" />
                            Configuration
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Multi-Stock Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Stock Tickers ({selectedTickers.length} selected)
                                </label>

                                {/* Selected pills */}
                                <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    {selectedTickers.length === 0 && (
                                        <span className="text-sm text-slate-400 italic">Click below to select stocks...</span>
                                    )}
                                    {selectedTickers.map(t => {
                                        const opt = STOCK_OPTIONS.find(s => s.ticker === t)
                                        return (
                                            <span
                                                key={t}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-semibold"
                                            >
                                                {opt?.name} ({t})
                                                <button
                                                    onClick={() => toggleTicker(t)}
                                                    className="hover:text-red-600 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        )
                                    })}
                                </div>

                                {/* Stock checkbox list */}
                                <div className="relative">
                                    <button
                                        onClick={() => setStockDropdownOpen(!stockDropdownOpen)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-left text-sm font-medium text-slate-700 hover:border-green-400 transition-all flex items-center justify-between"
                                    >
                                        Select stocks to benchmark
                                        <span className={`transition-transform ${stockDropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                                    </button>

                                    <AnimatePresence>
                                        {stockDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
                                            >
                                                {STOCK_OPTIONS.map(opt => {
                                                    const checked = selectedTickers.includes(opt.ticker)
                                                    return (
                                                        <label
                                                            key={opt.ticker}
                                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors border-b border-slate-100 last:border-0 ${checked ? 'bg-green-50' : ''}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggleTicker(opt.ticker)}
                                                                className="w-4 h-4 rounded text-green-600 border-slate-300 focus:ring-green-500"
                                                            />
                                                            <span className="flex-1">
                                                                <span className="font-semibold text-slate-800">{opt.name}</span>
                                                                <span className="text-slate-400 ml-2 text-sm">({opt.ticker})</span>
                                                            </span>
                                                            {checked && <Check className="w-4 h-4 text-green-600" />}
                                                        </label>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Records Slider */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Dataset Size: <span className="text-green-600">{records.toLocaleString()} records</span>
                                </label>
                                <input
                                    type="range"
                                    id="records-slider"
                                    min="100"
                                    max="5000"
                                    step="100"
                                    value={records}
                                    onChange={(e) => setRecords(parseInt(e.target.value))}
                                    className="w-full mt-2"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>100</span>
                                    <span>2500</span>
                                    <span>5000</span>
                                </div>
                            </div>
                        </div>

                        {/* Algorithm Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-slate-700">
                                    Algorithms ({selectedAlgorithms.length} selected)
                                </label>
                                <div className="flex gap-2">
                                    <button onClick={selectAllAlgos} className="text-xs text-green-600 hover:text-green-700 font-medium">
                                        Select All
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button onClick={deselectAllAlgos} className="text-xs text-slate-500 hover:text-slate-700 font-medium">
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {ALGORITHM_GROUPS.map(group => (
                                    <div key={group.category}>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                            {group.category}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {group.algorithms.map(algo => {
                                                const isSelected = selectedAlgorithms.includes(algo.id)
                                                return (
                                                    <button
                                                        key={algo.id}
                                                        id={`algo-${algo.id}`}
                                                        onClick={() => toggleAlgorithm(algo.id)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${isSelected
                                                            ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-600'
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
                                                        {algo.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning */}
                        <AnimatePresence>
                            {warning && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    {warning}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-8">
                            <button
                                id="run-benchmark-btn"
                                onClick={handleRunBenchmark}
                                disabled={loading}
                                className="btn-primary text-base px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Running Benchmark...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Run Benchmark
                                    </>
                                )}
                            </button>
                            {results && (
                                <button onClick={handleReset} className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-2 transition-all">
                                    <RotateCcw className="w-4 h-4" />
                                    Reset
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Loading */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="card-base shadow-lg text-center py-12"
                            >
                                <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                                <p className="text-lg text-slate-700 font-semibold">{progress}</p>
                                <p className="text-sm text-slate-400 mt-2">This may take several minutes for multiple stocks and deep learning models...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-red-800">Benchmark Error</p>
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results — one block per stock */}
                    <AnimatePresence>
                        {normalizedResults && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {Object.entries(normalizedResults).map(([ticker, stockData]) => (
                                    <StockResultBlock key={ticker} ticker={ticker} stockData={stockData} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    )
}
