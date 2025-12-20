'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
    Sparkles,
    Zap,
    Users,
    Lightbulb,
    Database,
    TrendingUp,
    BarChart3,
    Mail,
    ExternalLink,
    Github,
    Linkedin
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900/50 p-12 backdrop-blur-md"
            >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pulse-500/10 to-accent-500/10" />
                <div className="flex items-center gap-4 mb-6">
                    <Image
                        src="/assets/MatchPulse Logo.svg"
                        alt="MatchPulse Logo"
                        width={64}
                        height={64}
                        className="h-16 w-16"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-white">MatchPulse</h1>
                        <p className="text-lg text-surface-400">Cultural Insights Dashboard for Dating Apps</p>
                    </div>
                </div>
                <p className="max-w-3xl text-lg text-surface-300 leading-relaxed">
                    MatchPulse is a real-time behavioral intelligence platform that monitors, analyzes, and surfaces emerging dating trends from across social media. Built for product teams at dating apps who need to stay ahead of cultural shifts and build features users actually want.
                </p>
            </motion.div>

            {/* How It Works */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-pulse-400" />
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-surface-800 bg-surface-900/30 p-6 space-y-4"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">1. Data Collection</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            We continuously scrape Reddit, TikTok, and X (Twitter) for dating-related content, discussions, and trends. Our ingestion pipeline processes thousands of posts daily.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-surface-800 bg-surface-900/30 p-6 space-y-4"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">2. NLP Analysis</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Advanced natural language processing clusters similar discussions, identifies sentiment, and detects emerging behavioral patterns before they hit mainstream.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl border border-surface-800 bg-surface-900/30 p-6 space-y-4"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Lightbulb className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">3. Insight Generation</h3>
                        <p className="text-surface-400 text-sm leading-relaxed">
                            Trends are mapped to user personas and translated into actionable product opportunities with evidence-backed recommendations for your roadmap.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Dashboard Features */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Zap className="h-6 w-6 text-amber-400" />
                    Dashboard Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 rounded-xl border border-surface-800 bg-surface-900/30 p-5">
                        <TrendingUp className="h-5 w-5 text-pulse-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Rising Behaviors</h4>
                            <p className="text-sm text-surface-400">Track emerging dating trends with real-time mention counts, growth rates, and cross-platform sentiment analysis.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-xl border border-surface-800 bg-surface-900/30 p-5">
                        <Users className="h-5 w-5 text-accent-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Persona Intelligence</h4>
                            <p className="text-sm text-surface-400">Explore dynamic dating archetypes built from behavioral clustering, complete with motivations, fears, and communication styles.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-xl border border-surface-800 bg-surface-900/30 p-5">
                        <Lightbulb className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Product Opportunities</h4>
                            <p className="text-sm text-surface-400">AI-generated feature ideas backed by behavioral evidence, with severity ratings and direct quotes from users.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-xl border border-surface-800 bg-surface-900/30 p-5">
                        <Sparkles className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Persona Quiz</h4>
                            <p className="text-sm text-surface-400">Interactive quiz that matches users to their dating persona—embeddable for user research and engagement.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6"
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                        <Database className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Demo Mode</h3>
                        <p className="text-surface-300 leading-relaxed">
                            This dashboard is currently running with <strong className="text-amber-400">representative sample data</strong> to demonstrate the platform's capabilities.
                            The trends, personas, and opportunities shown are based on real cultural patterns but are not live-updated.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl bg-gradient-to-br from-pulse-500/10 to-accent-500/10 border border-pulse-500/20 p-8"
            >
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-white mb-3">Want Live Data?</h2>
                    <p className="text-surface-300 leading-relaxed mb-6">
                        Interested in having MatchPulse continuously scrape, monitor, and analyze up-to-date dating trends for your organization?
                        I can build a custom data pipeline tailored to your specific needs, including:
                    </p>
                    <ul className="space-y-2 mb-8 text-surface-400">
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pulse-500" />
                            Real-time social media ingestion from Reddit, TikTok, X, and more
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pulse-500" />
                            Custom NLP models tuned to your product domain
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pulse-500" />
                            API access for integration with your existing tools
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-pulse-500" />
                            Weekly trend reports and product recommendations
                        </li>
                    </ul>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="mailto:newa@nyu.edu"
                            className="inline-flex items-center gap-2 rounded-xl bg-pulse-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-pulse-600 active:scale-95 shadow-lg shadow-pulse-500/20"
                        >
                            <Mail className="h-4 w-4" />
                            Contact Developer
                        </a>
                        <a
                            href="https://linkedin.com/in/suryanewa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-surface-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-surface-700 border border-surface-700"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/suryanewa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-surface-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-surface-700 border border-surface-700"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="text-center text-surface-500 text-sm pt-4 border-t border-surface-800">
                <p>
                    Built by <span className="text-surface-300 font-medium">Surya Newa</span>
                </p>
            </div>
        </div>
    )
}
