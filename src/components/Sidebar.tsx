'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    TrendingUp,
    Users,
    Lightbulb,
    Sparkles,
    Settings,
    HelpCircle,
    Info,
    Heart,
    Gift
} from 'lucide-react'

const navItems = [
    {
        label: 'Behaviors',
        href: '/behaviors',
        icon: TrendingUp,
        description: 'Emerging dating trends',
    },
    {
        label: 'Personas',
        href: '/personas',
        icon: Users,
        description: 'Dating archetypes',
    },
    {
        label: 'Opportunities',
        href: '/opportunities',
        icon: Lightbulb,
        description: 'Product ideas',
    },
]

const publicNavItems = [
    {
        label: 'Cupid',
        href: '/cupid',
        icon: Heart,
        description: 'Date planner',
    },
    {
        label: 'Wrapped',
        href: '/wrapped',
        icon: Gift,
        description: 'Relationship recap',
    },
]

const bottomNavItems = [
    {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        label: 'Help',
        href: '/help',
        icon: HelpCircle,
    },
    {
        label: 'About',
        href: '/about',
        icon: Info,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-surface-800 bg-surface-950">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center gap-2.5 border-b border-surface-800 px-6">
                    <Image
                        src="/assets/MatchPulse Logo.svg"
                        alt="MatchPulse Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                    />
                    <div>
                        <span className="text-lg font-bold text-white">MatchPulse</span>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Insights
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-gradient-to-r from-[#FE3C72]/20 to-[#FF6B6B]/10 text-white'
                                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                                )}
                            >
                                <item.icon className={cn(
                                    'h-5 w-5 transition-colors',
                                    isActive ? 'text-[#FE3C72]' : 'text-gray-500'
                                )} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}

                    {/* Public Links */}
                    <div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Public
                    </div>
                    {publicNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-gradient-to-r from-[#FE3C72]/20 to-[#FF6B6B]/10 text-white'
                                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                                )}
                            >
                                <item.icon className={cn(
                                    'h-5 w-5 transition-colors',
                                    isActive ? 'text-[#FE3C72]' : 'text-gray-500'
                                )} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                    <Link
                        href="/quiz"
                        className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                            pathname.startsWith('/quiz')
                                ? 'bg-gradient-to-r from-[#FE3C72]/20 to-[#FF6B6B]/10 text-white'
                                : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                        )}
                    >
                        <Sparkles className={cn(
                            'h-5 w-5 transition-colors',
                            pathname.startsWith('/quiz') ? 'text-[#FE3C72]' : 'text-gray-500'
                        )} />
                        <span>Quiz</span>
                    </Link>
                </nav>

                {/* Bottom Navigation */}
                <div className="border-t border-[#1a1a1a] px-3 py-4">
                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-[#1a1a1a] hover:text-gray-300"
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    )
}
