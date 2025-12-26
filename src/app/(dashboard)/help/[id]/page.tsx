'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { helpGuides } from '@/data/help-guides'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function GuideDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const guide = helpGuides.find(g => g.id === id)

    if (!guide) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Guide not found</h1>
                <button
                    onClick={() => router.push('/help')}
                    className="text-[#FE3C72] hover:opacity-80 flex items-center gap-2 font-medium"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Help Center
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header / Breadcrumb - Tinder style */}
            <nav className="flex items-center justify-between">
                <Link
                    href="/help"
                    className="group flex items-center gap-3 text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1a1a] transition-colors duration-150 ease-out group-hover:bg-[#222]">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    Back to Help Center
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-[#1a1a1a] px-4 py-2 rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.duration} read
                </div>
            </nav>

            {/* Hero Section - Tinder style */}
            <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] p-8 md:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 space-y-4"
                >
                    <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl", guide.color)}>
                        <guide.icon className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{guide.title}</h1>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        {guide.description}
                    </p>
                </motion.div>
            </div>

            {/* Content Sections - Tinder style */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
                <div className="lg:col-span-3 space-y-10">
                    {guide.content.map((item, i) => (
                        <motion.section
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FE3C72] text-xs font-bold text-white">
                                    0{i + 1}
                                </span>
                                {item.section}
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-lg pl-11">
                                {item.text}
                            </p>
                        </motion.section>
                    ))}

                    {/* Footer Navigation - Tinder style */}
                    <div className="pt-10 border-t border-[#222] flex flex-col md:flex-row gap-6 items-center justify-between text-center md:text-left">
                        <div className="space-y-1">
                            <h4 className="text-white font-bold">Found this helpful?</h4>
                            <p className="text-sm text-gray-500">Explore more guides to unlock MatchPulse&apos;s full potential.</p>
                        </div>
                        <Link
                            href="/help"
                            className="flex items-center gap-2 rounded-full bg-[#FE3C72] px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-[#FE3C72]/20"
                        >
                            Explore All Guides
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Sticky Sidebar Right - Tinder style */}
                <aside className="hidden lg:block space-y-6">
                    <div className="sticky top-6 p-5 rounded-2xl bg-[#1a1a1a]">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-[#FE3C72]" />
                            Related Guides
                        </h3>
                        <div className="space-y-4">
                            {helpGuides
                                .filter(g => g.id !== id)
                                .map(g => (
                                    <Link
                                        key={g.id}
                                        href={`/help/${g.id}`}
                                        className="block group"
                                    >
                                        <p className="text-sm font-medium text-gray-400 group-hover:text-[#FE3C72] transition-colors mb-1">{g.title}</p>
                                        <p className="text-xs text-gray-600">{g.duration} read</p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
