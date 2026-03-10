// Navbar.jsx
// Premium navigation bar with glassmorphism, animations, and responsive mobile menu
import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Leaf, BarChart3, Info, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'

// Navigation items — Home, Stock Predictor, Dashboard, About only
const navItems = [
  { to: '/', label: 'Home', icon: Leaf },
  { to: '/stocks', label: 'Stock Predictor', icon: TrendingUp },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 glass-dark"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
              GreenAlgo<span className="text-green-400">Bench</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2',
                    isActive
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex">
            <Link
              to="/stocks"
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 hover:from-green-500 hover:to-green-400 transition-all duration-200 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Run Benchmark
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-800 bg-slate-900"
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                      isActive
                        ? 'bg-green-600/20 text-green-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}

              {/* Mobile CTA */}
              <Link
                to="/stocks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl"
              >
                <TrendingUp className="w-5 h-5" />
                Run Benchmark
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
