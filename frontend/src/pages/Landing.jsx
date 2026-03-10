// Landing.jsx - Clean, polished home page with proper spacing
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Leaf, BarChart3, Cpu, TrendingDown, ArrowRight, Check, Globe } from 'lucide-react'
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Feature data with fixed color classes
const features = [
  {
    icon: Cpu,
    title: 'Real-Time Metrics',
    description: 'Monitor CPU, memory, and energy consumption as your algorithms execute.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: TrendingDown,
    title: 'Carbon Estimation',
    description: 'Calculate CO₂ emissions based on energy usage and grid intensity.',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: BarChart3,
    title: 'Compare Algorithms',
    description: 'Side-by-side comparison to find the most efficient solution.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Leaf,
    title: 'Optimization Tips',
    description: 'Get actionable recommendations to reduce your code\'s footprint.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
]

// How it works steps
const steps = [
  { step: '01', title: 'Select Stock & Algorithms', description: 'Choose a stock ticker and pick from ML algorithms including Random Forest, XGBoost, LSTM, and more.' },
  { step: '02', title: 'Run Benchmark', description: 'Execute predictions and measure runtime, energy, and carbon emissions.' },
  { step: '03', title: 'Compare Results', description: 'View detailed comparisons and identify the fastest, greenest, and most accurate algorithm.' },
]

// Stats
const stats = [
  { value: '40%', label: 'Avg. Energy Savings' },
  { value: '100+', label: 'Algorithms Analyzed' },
  { value: '50g', label: 'CO₂ Saved Per Run' },
]

export default function Landing() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-8"
          >
            <Leaf className="w-4 h-4" />
            Carbon-Aware Computing
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
          >
            Your Code Has a{' '}
            <span className="text-green-400">Carbon Footprint</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Measure, compare, and optimize the environmental impact of your algorithms.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/stocks">
              <Button size="lg" icon={<Zap className="w-5 h-5" />}>
                Start Benchmarking
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-white mb-1">{value}</div>
                <div className="text-xs md:text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why Green Algorithms Matter
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every line of code consumes energy. Optimize to reduce emissions and build sustainable software.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, iconBg, iconColor }) => (
              <StaggerItem key={title}>
                <Card hover className="h-full">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}>
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">Three simple steps to optimize your code</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }, idx) => (
              <AnimatedSection key={step} delay={idx * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full">
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-6">
                    {step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Traditional vs. Green
            </h2>
            <p className="text-lg text-slate-400">See the difference in approach</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <AnimatedSection>
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-full">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-red-400 text-xl">⚡</span>
                  </span>
                  Traditional Code
                </h3>
                <ul className="space-y-4 text-slate-300">
                  {['Speed-only optimization', 'No energy awareness', 'Ignores carbon impact'].map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="text-red-400 text-lg">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Green */}
            <AnimatedSection delay={0.15}>
              <div className="bg-green-900/30 rounded-2xl p-8 border border-green-700/50 h-full">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-400" />
                  </span>
                  Green Algorithms
                </h3>
                <ul className="space-y-4 text-slate-300">
                  {['Balanced speed & efficiency', 'Monitors power usage', 'Carbon-aware decisions'].map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-green-600">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <Globe className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Reduce Your Carbon Footprint?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto leading-relaxed">
              Start measuring and optimizing today. Make your code sustainable.
            </p>
            <Link to="/stocks">
              <Button
                className="bg-white text-green-700 hover:bg-green-50 shadow-lg"
                size="lg"
                icon={<Zap className="w-5 h-5" />}
              >
                Run Your First Benchmark
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
