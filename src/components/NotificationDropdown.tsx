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
            case 'persona': return <User className="h-4 w-4 text-pulse-400" />
            case 'opportunity': return <Lightbulb className="h-4 w-4 text-amber-400" />
            case 'system': return <Info className="h-4 w-4 text-blue-400" />
            default: return <Bell className="h-4 w-4 text-surface-400" />
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-surface-800 bg-surface-950 shadow-2xl z-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-800 bg-surface-900/50 p-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="rounded-full bg-pulse-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-pulse-400 hover:text-pulse-300 transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                    <button onClick={onClose} className="text-surface-500 hover:text-white transition-colors">
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
                                    "relative flex items-start gap-3 border-b border-surface-800/50 p-4 transition-colors hover:bg-surface-900",
                                    !n.isRead && "bg-pulse-500/[0.03]"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                                    !n.isRead ? "border-pulse-500/30 bg-pulse-500/10" : "border-surface-800 bg-surface-900"
                                )}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            {!n.isRead && (
                                                <div className="h-2 w-2 shrink-0 rounded-full bg-pulse-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                                            )}
                                            <h4 className={cn("text-sm font-medium leading-none", !n.isRead ? "text-white" : "text-surface-400")}>
                                                {n.title}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] text-surface-500 whitespace-nowrap mt-0.5">
                                            {formatRelativeTime(n.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-surface-400 line-clamp-2 mb-2">
                                        {n.description}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={onClose}
                                                className="text-[10px] font-semibold text-pulse-400 hover:underline"
                                            >
                                                View details
                                            </Link>
                                        )}
                                        {!n.isRead && (
                                            <button
                                                onClick={() => onMarkAsRead(n.id)}
                                                className="flex items-center gap-1 text-[10px] font-semibold text-surface-500 hover:text-white"
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
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-900 text-surface-500">
                                <Bell className="h-6 w-6" />
                            </div>
                            <h4 className="mb-1 text-sm font-medium text-white">No notifications</h4>
                            <p className="text-xs text-surface-500">
                                We'll notify you when new trends or insights are detected.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
