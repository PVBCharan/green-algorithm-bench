/**
 * Stock Service
 * 
 * API calls for stock data fetching and ML benchmark execution.
 * Supports multi-stock benchmarking.
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
        timeout: 30000,
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
 * Run stock prediction benchmark for one or more tickers
 * @param {string[]} tickers - Array of stock ticker symbols
 * @param {number} records - Number of records
 * @param {string[]} algorithms - List of algorithm names
 * @returns {Promise} Benchmark results
 */
export const runStockBenchmark = async (tickers, records, algorithms) => {
    return api.post('/api/benchmark/run', {
        tickers,
        records,
        algorithms,
    }, {
        timeout: 600000, // 10 minute timeout for multi-stock ML benchmarks
    })
}
