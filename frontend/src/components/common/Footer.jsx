// Footer.jsx
// Enhanced footer with gradient accents and social links
import { Link } from 'react-router-dom'
import { Leaf, Github, Twitter, Linkedin, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const footerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Stock Predictor', to: '/stocks' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'About', to: '/about' },
]

const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                GreenAlgo<span className="text-green-400">Bench</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm max-w-xs">
                            Measure, compare, and optimize the carbon footprint of your algorithms.
                            Build sustainable software.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {footerLinks.map(({ label, to }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-slate-400 hover:text-green-400 transition-colors text-sm"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-slate-700 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2026 GreenAlgoBench. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500" /> for a greener future
                    </p>
                </div>
            </div>
        </footer>
    )
}
