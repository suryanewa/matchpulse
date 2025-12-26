'use client'

import { Notification } from '@/types'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Bell, Check, TrendingUp, User, Lightbulb, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface NotificationDropdownProps {
    notifications: Notification[]
    onMarkAsRead: (id: string) => void
    onMarkAllAsRead: () => void
    onClose: () => void
}

export function NotificationDropdown({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClose
}: NotificationDropdownProps) {
    const unreadCount = notifications.filter(n => !n.isRead).length

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'trend': return <TrendingUp className="h-4 w-4 text-emerald-400" />
            case 'persona': return <User className="h-4 w-4 text-[#FE3C72]" />
            case 'opportunity': return <Lightbulb className="h-4 w-4 text-amber-400" />
            case 'system': return <Info className="h-4 w-4 text-cyan-400" />
            default: return <Bell className="h-4 w-4 text-gray-400" />
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl shadow-black/50 z-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#222] px-5 py-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FE3C72] text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs font-medium text-[#FE3C72] transition-colors duration-150 hover:text-[#FF6B6B]"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 transition-colors duration-150 hover:bg-[#333] hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
                <AnimatePresence initial={false}>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "relative flex items-start gap-3 border-b border-[#2a2a2a] p-4 transition-colors duration-150 hover:bg-[#222]",
                                    !n.isRead && "bg-[#FE3C72]/5"
                                )}
                            >
                                <div className={cn(
                                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-150",
                                    !n.isRead ? "bg-[#FE3C72]/10" : "bg-[#2a2a2a]"
                                )}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            {!n.isRead && (
                                                <div className="h-2 w-2 shrink-0 rounded-full bg-[#FE3C72]" />
                                            )}
                                            <h4 className={cn("text-sm font-semibold leading-tight", !n.isRead ? "text-white" : "text-gray-400")}>
                                                {n.title}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                            {formatRelativeTime(n.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                        {n.description}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={onClose}
                                                className="text-xs font-semibold text-[#FE3C72] transition-colors duration-150 hover:text-[#FF6B6B]"
                                            >
                                                View details
                                            </Link>
                                        )}
                                        {!n.isRead && (
                                            <button
                                                onClick={() => onMarkAsRead(n.id)}
                                                className="flex items-center gap-1 text-xs text-gray-500 transition-colors duration-150 hover:text-white"
                                            >
                                                <Check className="h-3 w-3" />
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2a2a2a]">
                                <Bell className="h-7 w-7 text-gray-500" />
                            </div>
                            <h4 className="mb-1 text-sm font-bold text-white">No notifications</h4>
                            <p className="text-xs text-gray-500">
                                We&apos;ll notify you when new trends or insights are detected.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
