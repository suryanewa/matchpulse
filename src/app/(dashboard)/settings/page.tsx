'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Bell,
    Shield,
    Globe,
    Mail,
    Laptop,
    Smartphone,
    Key,
    Trash2,
    Save,
    ChevronRight,
    Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCupid } from '@/context/CupidContext'
import {
    NYC_NEIGHBORHOODS,
    VIBE_DEFINITIONS,
    BUDGET_DEFINITIONS,
    TIME_WINDOW_DEFINITIONS
} from '@/data/cupid-data'
import { VibeTag, BudgetTier, TimeWindow, CupidPreferences } from '@/types/cupid'

const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
]

export default function SettingsPage() {
    const { state, setUserPreferences } = useCupid()
    const [activeSection, setActiveSection] = useState('profile')
    const [isSaving, setIsSaving] = useState(false)
    const [notifications, setNotifications] = useState({
        digest: true,
        alerts: true,
        mobile: false
    })

    // Cupid preferences state
    const [cupidPrefs, setCupidPrefs] = useState<{
        neighborhoods: string[]
        vibes: VibeTag[]
        budgetTiers: BudgetTier[]
        timeWindows: TimeWindow[]
    }>({
        neighborhoods: [],
        vibes: [],
        budgetTiers: [],
        timeWindows: []
    })

    // Sync with CupidContext on mount
    useEffect(() => {
        if (state.userPreferences) {
            setCupidPrefs({
                neighborhoods: state.userPreferences.neighborhoods,
                vibes: state.userPreferences.vibes,
                budgetTiers: state.userPreferences.budgetTiers,
                timeWindows: state.userPreferences.timeWindows
            })
        }
    }, [state.userPreferences])

    // Toggle functions
    const toggleNeighborhood = (n: string) => {
        setCupidPrefs(prev => ({
            ...prev,
            neighborhoods: prev.neighborhoods.includes(n)
                ? prev.neighborhoods.filter(x => x !== n)
                : [...prev.neighborhoods, n]
        }))
    }

    const toggleVibe = (v: VibeTag) => {
        setCupidPrefs(prev => ({
            ...prev,
            vibes: prev.vibes.includes(v)
                ? prev.vibes.filter(x => x !== v)
                : [...prev.vibes, v]
        }))
    }

    const toggleBudget = (b: BudgetTier) => {
        setCupidPrefs(prev => ({
            ...prev,
            budgetTiers: prev.budgetTiers.includes(b)
                ? prev.budgetTiers.filter(x => x !== b)
                : [...prev.budgetTiers, b]
        }))
    }

    const toggleTimeWindow = (t: TimeWindow) => {
        setCupidPrefs(prev => ({
            ...prev,
            timeWindows: prev.timeWindows.includes(t)
                ? prev.timeWindows.filter(x => x !== t)
                : [...prev.timeWindows, t]
        }))
    }

    const toggleNotification = (id: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleSave = () => {
        setIsSaving(true)
        // Save Cupid preferences
        setUserPreferences({
            city: 'NYC',
            neighborhoods: cupidPrefs.neighborhoods,
            vibes: cupidPrefs.vibes,
            budgetTiers: cupidPrefs.budgetTiers,
            cuisines: state.userPreferences?.cuisines || [],
            timeWindows: cupidPrefs.timeWindows
        })
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar Navigation - Tinder style */}
                <div className="space-y-2">
                    {settingsSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-2xl px-4 py-4 text-sm font-medium transition-all",
                                activeSection === section.id
                                    ? "bg-[#FE3C72] text-white shadow-lg shadow-[#FE3C72]/20"
                                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className="h-5 w-5" />
                                <span>{section.label}</span>
                            </div>
                            {activeSection === section.id && (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area - Tinder style */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-[#1a1a1a] p-6"
                    >
                        {activeSection === 'profile' && (
                            <div className="space-y-8">
                                {/* Profile Header - Tinder style */}
                                <div className="flex items-center gap-6">
                                    <div className="group relative">
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#FE3C72] to-[#FF6B6B] p-1 shadow-xl shadow-[#FE3C72]/20">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#111]">
                                                <User className="h-10 w-10 text-gray-400" />
                                            </div>
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FE3C72] text-white shadow-lg transition-all hover:scale-110">
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Surya Newa</h2>
                                        <p className="text-gray-500">Product Manager</p>
                                    </div>
                                </div>

                                {/* Form Fields - Tinder style */}
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Surya Newa"
                                            className="w-full rounded-xl border-0 bg-[#222] px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue="newa@nyu.edu"
                                            className="w-full rounded-xl border-0 bg-[#222] px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Job Title</label>
                                        <input
                                            type="text"
                                            defaultValue="Product Manager"
                                            className="w-full rounded-xl border-0 bg-[#222] px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Department</label>
                                        <select
                                            defaultValue="product"
                                            className="w-full rounded-xl border-0 bg-[#222] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50 appearance-none cursor-pointer"
                                        >
                                            <option value="product">Product</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="engineering">Engineering</option>
                                            <option value="data">Data Science</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="space-y-6">
                                <div className="pb-4">
                                    <h3 className="text-lg font-bold text-white">Notification Settings</h3>
                                    <p className="text-sm text-gray-500">Stay informed about new trends and insights</p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { id: 'digest', label: 'Weekly Trend Digest', desc: 'Summary of the most significant behavior shifts', icon: Mail },
                                        { id: 'alerts', label: 'High-Impact Alerts', desc: 'Instant alerts for high growth spikes', icon: Laptop },
                                        { id: 'mobile', label: 'Mobile Push Notifications', desc: 'Brief updates on trending personas', icon: Smartphone }
                                    ].map((item) => {
                                        const isEnabled = notifications[item.id as keyof typeof notifications]
                                        return (
                                            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#222] p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2a2a2a] text-gray-400">
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{item.label}</p>
                                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                                    className={cn(
                                                        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
                                                        isEnabled ? "bg-[#FE3C72]" : "bg-[#333]"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5",
                                                            isEnabled ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {activeSection === 'preferences' && (
                            <div className="space-y-8">
                                {/* Interface Preferences */}
                                <div>
                                    <div className="pb-4">
                                        <h3 className="text-lg font-bold text-white">Interface Preferences</h3>
                                        <p className="text-sm text-gray-500">Customize how MatchPulse looks and feels</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Language</label>
                                            <select className="w-full rounded-xl border-0 bg-[#222] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50 appearance-none cursor-pointer">
                                                <option>English (US)</option>
                                                <option>English (UK)</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Timezone</label>
                                            <select className="w-full rounded-xl border-0 bg-[#222] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FE3C72]/50 appearance-none cursor-pointer">
                                                <option>UTC-5 (Eastern Time)</option>
                                                <option>UTC-8 (Pacific Time)</option>
                                                <option>UTC+0 (London)</option>
                                                <option>UTC+1 (Paris)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Cupid Date Preferences */}
                                <div className="border-t border-[#222] pt-8">
                                    <div className="pb-4">
                                        <h3 className="text-lg font-bold text-white">Cupid Date Preferences</h3>
                                        <p className="text-sm text-gray-500">Customize your date recommendations</p>
                                    </div>

                                    {/* Neighborhoods */}
                                    <div className="mb-6">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 block">Favorite Neighborhoods</label>
                                        <div className="flex flex-wrap gap-2">
                                            {NYC_NEIGHBORHOODS.map((n) => (
                                                <button
                                                    key={n}
                                                    onClick={() => toggleNeighborhood(n)}
                                                    className={cn(
                                                        'rounded-full px-4 py-2 text-sm font-medium transition-all',
                                                        cupidPrefs.neighborhoods.includes(n)
                                                            ? 'bg-[#FE3C72] text-white shadow-lg shadow-[#FE3C72]/25'
                                                            : 'bg-[#222] text-gray-300 hover:bg-[#2a2a2a]'
                                                    )}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Vibes */}
                                    <div className="mb-6">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 block">Date Vibes</label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                            {(Object.entries(VIBE_DEFINITIONS) as [VibeTag, typeof VIBE_DEFINITIONS[VibeTag]][]).map(([key, vibe]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleVibe(key)}
                                                    className={cn(
                                                        'flex flex-col items-center gap-2 rounded-xl p-3 transition-all',
                                                        cupidPrefs.vibes.includes(key)
                                                            ? 'bg-[#FE3C72] text-white shadow-lg shadow-[#FE3C72]/25'
                                                            : 'bg-[#222] text-gray-300 hover:bg-[#2a2a2a]'
                                                    )}
                                                >
                                                    <span className="text-xl">{vibe.emoji}</span>
                                                    <span className="text-xs font-medium">{vibe.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Budget Tiers */}
                                    <div className="mb-6">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 block">Budget Range</label>
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            {(Object.entries(BUDGET_DEFINITIONS) as [BudgetTier, typeof BUDGET_DEFINITIONS[BudgetTier]][]).map(([key, budget]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleBudget(key)}
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-xl p-3 transition-all sm:flex-col sm:flex-1',
                                                        cupidPrefs.budgetTiers.includes(key)
                                                            ? 'bg-[#FE3C72] text-white shadow-lg shadow-[#FE3C72]/25'
                                                            : 'bg-[#222] text-gray-300 hover:bg-[#2a2a2a]'
                                                    )}
                                                >
                                                    <span className="text-xl">{budget.emoji}</span>
                                                    <div className="text-left sm:text-center">
                                                        <div className="text-sm font-semibold">{budget.label}</div>
                                                        <div className="text-xs opacity-75">{budget.range}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Windows */}
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 block">Preferred Times</label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {(Object.entries(TIME_WINDOW_DEFINITIONS) as [TimeWindow, typeof TIME_WINDOW_DEFINITIONS[TimeWindow]][]).map(([key, tw]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleTimeWindow(key)}
                                                    className={cn(
                                                        'flex items-center gap-2 rounded-xl p-3 transition-all',
                                                        cupidPrefs.timeWindows.includes(key)
                                                            ? 'bg-[#FE3C72] text-white shadow-lg shadow-[#FE3C72]/25'
                                                            : 'bg-[#222] text-gray-300 hover:bg-[#2a2a2a]'
                                                    )}
                                                >
                                                    <span className="text-lg">{tw.emoji}</span>
                                                    <span className="text-xs font-medium">{tw.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-6">
                                <div className="pb-4">
                                    <h3 className="text-lg font-bold text-white">Security & API</h3>
                                    <p className="text-sm text-gray-500">Manage your credentials and access</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-2xl bg-[#222] p-4">
                                        <div>
                                            <p className="font-medium text-white">Change Password</p>
                                            <p className="text-xs text-gray-500">Last updated 3 months ago</p>
                                        </div>
                                        <button className="flex items-center gap-2 rounded-xl bg-[#2a2a2a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#333]">
                                            <Key className="h-4 w-4 text-[#FE3C72]" />
                                            Update
                                        </button>
                                    </div>

                                    <div className="rounded-2xl bg-[#222] p-4 space-y-3">
                                        <p className="font-medium text-white">API Keys</p>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 rounded-xl bg-[#111] px-4 py-3 text-xs text-gray-500 font-mono">
                                                mp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                            </code>
                                            <button className="rounded-xl bg-[#2a2a2a] px-4 py-3 text-xs font-medium text-white hover:bg-[#333]">
                                                Reveal
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                                            <h4 className="font-bold text-red-500 flex items-center gap-2 mb-2">
                                                <Trash2 className="h-4 w-4" />
                                                Danger Zone
                                            </h4>
                                            <p className="text-sm text-red-400/70 mb-4">Permanently delete all your personal data and dashboard history. This action is irreversible.</p>
                                            <button className="rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                                                Delete Account Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions - Tinder style */}
                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#222] pt-6">
                            <button className="px-5 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-white rounded-xl hover:bg-[#222]">
                                Reset Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    "flex items-center gap-2 rounded-full bg-[#FE3C72] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#FE3C72]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50",
                                    isSaving && "animate-pulse"
                                )}
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
