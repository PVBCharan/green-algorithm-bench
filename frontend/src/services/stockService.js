/**
 * Stock Service
 * 
 * API calls for stock data fetching and ML benchmark execution.
 * Supports multi-stock benchmarking with per-ticker batching.
 */

import api from './api'

/**
 * Fetch live stock data
 * @param {string} ticker - Stock ticker symbol
 * @param {number} records - Number of records to fetch
 * @returns {Promise} Stock data
 */
export const fetchStockData = async (ticker, records = 5000) => {
    return api.get('/api/stocks/data', {
        params: { ticker, records },
        timeout: 60000,
    })
}

/**
 * Get available ML algorithms for stock benchmarking
 * @returns {Promise} List of available algorithms
 */
export const getAvailableAlgorithms = async () => {
    return api.get('/api/benchmark/algorithms')
}

/**
 * Run stock prediction benchmark for a SINGLE ticker.
 * For multiple tickers, call this in a loop from the UI
 * to avoid server overload and show per-ticker progress.
 * 
 * @param {string} ticker - Single stock ticker symbol
 * @param {number} records - Number of records
 * @param {string[]} algorithms - List of algorithm names
 * @returns {Promise} Benchmark results for this ticker
 */
export const runSingleTickerBenchmark = async (ticker, records, algorithms) => {
    return api.post('/api/benchmark/run', {
        tickers: [ticker],
        records,
        algorithms,
    }, {
        timeout: 600000, // 10 min per single ticker (10 algos)
    })
}

/**
 * Legacy: Run benchmark for multiple tickers in one request.
 * Kept for backward compatibility but prefer runSingleTickerBenchmark.
 */
export const runStockBenchmark = async (tickers, records, algorithms) => {
    return api.post('/api/benchmark/run', {
        tickers,
        records,
        algorithms,
    }, {
        timeout: 1800000,
    })
}
