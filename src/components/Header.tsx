'use client'

import { Search, Bell, User, X, Zap, Users, Lightbulb, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { behaviorTrends, personas, opportunityCards } from '@/data/mock-data'

export function Header() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const { timeFilter, setTimeFilter, notifications, markAsRead, markAllAsRead } = useDashboard()
    const notificationRef = useRef<HTMLDivElement>(null)
    const userRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const unreadCount = notifications.filter(n => !n.isRead).length

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setShowUserMenu(false)
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return { trends: [], personas: [], opportunities: [] }
        const query = searchQuery.toLowerCase()
        return {
            trends: behaviorTrends.filter(t => t.title.toLowerCase().includes(query)).slice(0, 3),
            personas: personas.filter(p => p.name.toLowerCase().includes(query)).slice(0, 3),
            opportunities: opportunityCards.filter(o => o.title.toLowerCase().includes(query)).slice(0, 3)
        }
    }, [searchQuery])

    const hasResults = searchResults.trends.length > 0 || searchResults.personas.length > 0 || searchResults.opportunities.length > 0

    const handleSearchClick = (path: string) => {
        setSearchQuery('')
        setShowSearch(false)
        router.push(path)
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-800 bg-surface-950/80 px-6 backdrop-blur-md">
            {/* Search */}
            <div className="relative w-96" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    placeholder="Search trends, personas, opportunities..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSearch(true)
                    }}
                    onFocus={() => setShowSearch(true)}
                    className="h-10 w-full rounded-lg border border-surface-700 bg-surface-900 pl-10 pr-4 text-sm text-white placeholder-surface-500 transition-colors focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                />

                <AnimatePresence>
                    {showSearch && searchQuery.trim() && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-full overflow-hidden rounded-xl border border-surface-800 bg-surface-900/95 shadow-2xl backdrop-blur-xl"
                        >
                            {!hasResults ? (
                                <div className="p-4 text-center text-sm text-surface-500">
                                    No results found for "{searchQuery}"
                                </div>
                            ) : (
                                <div className="max-h-[calc(100vh-200px)] overflow-y-auto py-2">
                                    {/* Trends */}
                                    {searchResults.trends.length > 0 && (
                                        <div className="mb-2">
                                            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500">
                                                <Zap className="h-3 w-3" />
                                                Trends
                                            </div>
                                            {searchResults.trends.map(trend => (
                                                <button
                                                    key={trend.id}
                                                    onClick={() => handleSearchClick(`/behaviors?trendId=${trend.id}`)}
                                                    className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-surface-800"
                                                >
                                                    <span className="text-sm text-surface-200">{trend.title}</span>
                                                    <ArrowRight className="h-3 w-3 text-surface-500" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Personas */}
                                    {searchResults.personas.length > 0 && (
                                        <div className="mb-2 border-t border-surface-800 pt-2">
                                            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500">
                                                <Users className="h-3 w-3" />
                                                Personas
                                            </div>
                                            {searchResults.personas.map(persona => (
                                                <button
                                                    key={persona.id}
                                                    onClick={() => handleSearchClick(`/personas/${persona.id}`)}
                                                    className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-surface-800"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{persona.emoji}</span>
                                                        <span className="text-sm text-surface-200">{persona.name}</span>
                                                    </div>
                                                    <ArrowRight className="h-3 w-3 text-surface-500" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Opportunities */}
                                    {searchResults.opportunities.length > 0 && (
                                        <div className="border-t border-surface-800 pt-2">
                                            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500">
                                                <Lightbulb className="h-3 w-3" />
                                                Opportunities
                                            </div>
                                            {searchResults.opportunities.map(opp => (
                                                <button
                                                    key={opp.id}
                                                    onClick={() => handleSearchClick('/opportunities')}
                                                    className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-surface-800"
                                                >
                                                    <span className="truncate pr-4 text-left text-sm text-surface-200">{opp.title}</span>
                                                    <ArrowRight className="h-3 w-3 shrink-0 text-surface-500" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Time filter selector */}
                <div className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-900 px-3 py-1.5 transition-colors focus-within:border-pulse-500">
                    <span className="text-xs text-surface-400">Viewing:</span>
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value as any)}
                        className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="12m">Last Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                            "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150",
                            showNotifications
                                ? "bg-[#FE3C72]/10 text-[#FE3C72]"
                                : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white"
                        )}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FE3C72] text-[10px] font-bold text-white shadow-lg shadow-[#FE3C72]/30">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <NotificationDropdown
                                notifications={notifications}
                                onMarkAsRead={markAsRead}
                                onMarkAllAsRead={markAllAsRead}
                                onClose={() => setShowNotifications(false)}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* User */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
                            showUserMenu
                                ? "ring-2 ring-[#FE3C72] ring-offset-2 ring-offset-[#111]"
                                : "bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] text-white shadow-lg shadow-[#FE3C72]/20 hover:shadow-[#FE3C72]/40"
                        )}
                    >
                        <User className="h-5 w-5" />
                    </button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl shadow-black/50"
                            >
                                {/* Profile Header */}
                                <div className="bg-[#222] p-5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] p-0.5">
                                                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1a1a1a]">
                                                    <User className="h-6 w-6 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-white">Surya Newa</p>
                                            <p className="text-sm text-gray-500">newa@nyu.edu</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl bg-[#FE3C72]/10 px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#FE3C72] animate-pulse" />
                                            <span className="text-xs font-bold text-[#FE3C72]">DEMO ACCOUNT</span>
                                        </div>
                                        <span className="rounded-full bg-[#2a2a2a] px-2.5 py-1 text-[10px] font-medium text-gray-400">ACTIVE</span>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="p-2">
                                    <Link
                                        href="/settings"
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-colors duration-150 hover:bg-[#222] hover:text-white"
                                    >
                                        <span className="text-sm font-medium">View Profile</span>
                                    </Link>
                                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors duration-150 hover:bg-red-500/10">
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    )
}
