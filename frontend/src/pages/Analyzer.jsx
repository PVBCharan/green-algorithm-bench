// Analyzer.jsx
// Redirects to Stock Predictor — sorting algorithm analyzer has been replaced
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Analyzer() {
    const navigate = useNavigate()

    // Auto-redirect after a brief moment
    useEffect(() => {
        const timer = setTimeout(() => navigate('/stocks'), 3000)
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
            >
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    Algorithm Analyzer has moved!
                </h1>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    We've upgraded to <strong>ML Stock Prediction Benchmarking</strong>.
                    You'll be redirected automatically in a moment.
                </p>
                <Link
                    to="/stocks"
                    className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2"
                >
                    Go to Stock Predictor
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>
        </div>
    )
}
