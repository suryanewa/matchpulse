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
    Github,
    Linkedin
} from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="space-y-10 pb-12">
            {/* Hero Section - Tinder style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-10"
            >
                <div className="flex items-center gap-5 mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] p-0.5 shadow-lg shadow-[#FE3C72]/20">
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#111]">
                            <Image
                                src="/assets/MatchPulse Logo.svg"
                                alt="MatchPulse Logo"
                                width={40}
                                height={40}
                                className="h-10 w-10"
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">MatchPulse</h1>
                        <p className="text-gray-500">Cultural Insights Dashboard for Dating Apps</p>
                    </div>
                </div>
                <p className="max-w-3xl text-lg text-gray-400 leading-relaxed">
                    MatchPulse is a real-time behavioral intelligence platform that monitors, analyzes, and surfaces emerging dating trends from across social media. Built for product teams at dating apps who need to stay ahead of cultural shifts and build features users actually want.
                </p>
            </motion.div>

            {/* How It Works - Tinder style */}
            <div className="space-y-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FE3C72] text-white">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl bg-[#1a1a1a] p-6 space-y-4"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">1. Data Collection</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We continuously scrape Reddit, TikTok, and X (Twitter) for dating-related content, discussions, and trends. Our ingestion pipeline processes thousands of posts daily.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl bg-[#1a1a1a] p-6 space-y-4"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">2. NLP Analysis</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Advanced natural language processing clusters similar discussions, identifies sentiment, and detects emerging behavioral patterns before they hit mainstream.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl bg-[#1a1a1a] p-6 space-y-4"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <Lightbulb className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">3. Insight Generation</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Trends are mapped to user personas and translated into actionable product opportunities with evidence-backed recommendations for your roadmap.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Dashboard Features - Tinder style */}
            <div className="space-y-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                        <Zap className="h-5 w-5" />
                    </div>
                    Dashboard Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FE3C72]/10 text-[#FE3C72] shrink-0">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Rising Behaviors</h4>
                            <p className="text-sm text-gray-500">Track emerging dating trends with real-time mention counts, growth rates, and cross-platform sentiment analysis.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Persona Intelligence</h4>
                            <p className="text-sm text-gray-500">Explore dynamic dating archetypes built from behavioral clustering, complete with motivations, fears, and communication styles.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                            <Lightbulb className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Product Opportunities</h4>
                            <p className="text-sm text-gray-500">AI-generated feature ideas backed by behavioral evidence, with severity ratings and direct quotes from users.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 rounded-2xl bg-[#1a1a1a] p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Persona Quiz</h4>
                            <p className="text-sm text-gray-500">Interactive quiz that matches users to their dating persona—embeddable for user research and engagement.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Notice - Tinder style */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl bg-amber-500/5 p-6"
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                        <Database className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Demo Mode</h3>
                        <p className="text-gray-400 leading-relaxed">
                            This dashboard is currently running with <strong className="text-amber-400">representative sample data</strong> to demonstrate the platform&apos;s capabilities.
                            The trends, personas, and opportunities shown are based on real cultural patterns but are not live-updated.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Contact CTA - Tinder style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-3xl bg-[#1a1a1a] p-8"
            >
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-white mb-3">Want Live Data?</h2>
                    <p className="text-gray-400 leading-relaxed mb-6">
                        Interested in having MatchPulse continuously scrape, monitor, and analyze up-to-date dating trends for your organization?
                        I can build a custom data pipeline tailored to your specific needs, including:
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-[#FE3C72]" />
                            Real-time social media ingestion from Reddit, TikTok, X, and more
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-[#FE3C72]" />
                            Custom NLP models tuned to your product domain
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-[#FE3C72]" />
                            API access for integration with your existing tools
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-[#FE3C72]" />
                            Weekly trend reports and product recommendations
                        </li>
                    </ul>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="mailto:newa@nyu.edu"
                            className="inline-flex items-center gap-2 rounded-full bg-[#FE3C72] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[#FE3C72]/20"
                        >
                            <Mail className="h-4 w-4" />
                            Contact Developer
                        </a>
                        <a
                            href="https://linkedin.com/in/suryanewa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#222] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#2a2a2a]"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/suryanewa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#222] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#2a2a2a]"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Footer - Tinder style */}
            <div className="text-center text-gray-600 text-sm pt-6">
                <p>
                    Built by <span className="text-white font-medium">Surya Newa</span>
                </p>
            </div>
        </div>
    )
}
