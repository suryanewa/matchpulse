'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { TimeFilter, Notification } from '@/types'
import { notifications as initialNotifications } from '@/data/mock-data'

interface DashboardContextType {
    timeFilter: TimeFilter
    setTimeFilter: (filter: TimeFilter) => void
    savedTrendIds: Set<string>
    toggleSaveTrend: (id: string) => void
    notifications: Notification[]
    markAsRead: (id: string) => void
    markAllAsRead: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d')
    const [savedTrendIds, setSavedTrendIds] = useState<Set<string>>(new Set())
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

    const toggleSaveTrend = (id: string) => {
        setSavedTrendIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    return (
        <DashboardContext.Provider value={{
            timeFilter,
            setTimeFilter,
            savedTrendIds,
            toggleSaveTrend,
            notifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const context = useContext(DashboardContext)
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider')
    }
    return context
}
