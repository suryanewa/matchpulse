'use client'

import { Search, Bell, User } from 'lucide-react'
import { useState } from 'react'

export function Header() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-800 bg-surface-950/80 px-6 backdrop-blur-md">
            {/* Search */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    placeholder="Search trends, personas, opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-lg border border-surface-700 bg-surface-900 pl-10 pr-4 text-sm text-white placeholder-surface-500 transition-colors focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Time filter indicator */}
                <div className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-900 px-3 py-1.5">
                    <span className="text-xs text-surface-400">Viewing:</span>
                    <span className="text-sm font-medium text-white">Last 30 days</span>
                </div>

                {/* Notifications */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-surface-700 bg-surface-900 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pulse-500 text-[10px] font-bold text-white">
                        3
                    </span>
                </button>

                {/* User */}
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pulse-500 to-accent-500 text-white transition-transform hover:scale-105">
                    <User className="h-5 w-5" />
                </button>
            </div>
        </header>
    )
}
