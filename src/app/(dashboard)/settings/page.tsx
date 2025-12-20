'use client'

import { useState } from 'react'
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

const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
]

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile')
    const [isSaving, setIsSaving] = useState(false)
    const [notifications, setNotifications] = useState({
        digest: true,
        alerts: true,
        mobile: false
    })

    const toggleNotification = (id: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="mt-1 text-sm text-surface-400">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar Navigation */}
                <div className="space-y-1">
                    {settingsSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors border outline-none focus:outline-none",
                                activeSection === section.id
                                    ? "bg-gradient-to-r from-pulse-500/20 to-accent-500/10 text-white border-pulse-500/20 shadow-lg shadow-pulse-500/5"
                                    : "text-surface-400 border-transparent hover:bg-surface-800/50 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className={cn(
                                    "h-5 w-5",
                                    activeSection === section.id ? "text-pulse-400" : "text-surface-500"
                                )} />
                                <span>{section.label}</span>
                            </div>
                            {activeSection === section.id && (
                                <ChevronRight className="h-4 w-4 text-pulse-500" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-surface-800 bg-surface-900/50 p-6 backdrop-blur-sm"
                    >
                        {activeSection === 'profile' && (
                            <div className="space-y-8">
                                {/* Profile Header */}
                                <div className="flex items-center gap-6">
                                    <div className="group relative">
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pulse-500 to-accent-500 p-1 shadow-xl shadow-pulse-500/20">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-950">
                                                <User className="h-10 w-10 text-white" />
                                            </div>
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-surface-700 bg-surface-800 text-surface-400 shadow-lg transition-all hover:bg-surface-700 hover:text-white group-hover:scale-110">
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Surya Newa</h2>
                                        <p className="text-surface-400">Product Manager</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-500">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Surya Newa"
                                            className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-500">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue="newa@nyu.edu"
                                            className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-500">Job Title</label>
                                        <input
                                            type="text"
                                            defaultValue="Product Manager"
                                            className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-500">Department</label>
                                        <select
                                            defaultValue="product"
                                            className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-sm text-white focus:border-pulse-500 focus:outline-none focus:ring-1 focus:ring-pulse-500 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
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
                                <div className="border-b border-surface-800 pb-4">
                                    <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                                    <p className="text-sm text-surface-500">Stay informed about new trends and insights</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'digest', label: 'Weekly Trend Digest', desc: 'Summary of the most significant behavior shifts', icon: Mail },
                                        { id: 'alerts', label: 'High-Impact Alerts', desc: 'Instant alerts for high growth spikes', icon: Laptop },
                                        { id: 'mobile', label: 'Mobile Push Notifications', desc: 'Brief updates on trending personas', icon: Smartphone }
                                    ].map((item) => {
                                        const isEnabled = notifications[item.id as keyof typeof notifications]
                                        return (
                                            <div key={item.id} className="flex items-center justify-between rounded-lg bg-surface-800/30 p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800 text-surface-400">
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{item.label}</p>
                                                        <p className="text-xs text-surface-500">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                                    className={cn(
                                                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out transition-all",
                                                        isEnabled ? "bg-pulse-500 shadow-lg shadow-pulse-500/20" : "bg-surface-700"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                                            isEnabled ? "translate-x-5" : "translate-x-0"
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
                            <div className="space-y-6">
                                <div className="border-b border-surface-800 pb-4">
                                    <h3 className="text-lg font-semibold text-white">Interface Preferences</h3>
                                    <p className="text-sm text-surface-500">Customize how MatchPulse looks and feels</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-500">Language</label>
                                        <select className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-sm text-white focus:border-pulse-500 focus:outline-none appearance-none">
                                            <option>English (US)</option>
                                            <option>English (UK)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-surface-500">Timezone</label>
                                        <select className="w-full rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-2.5 text-sm text-white focus:border-pulse-500 focus:outline-none appearance-none">
                                            <option>UTC-5 (Eastern Time)</option>
                                            <option>UTC-8 (Pacific Time)</option>
                                            <option>UTC+0 (London)</option>
                                            <option>UTC+1 (Paris)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-6">
                                <div className="border-b border-surface-800 pb-4">
                                    <h3 className="text-lg font-semibold text-white">Security & API</h3>
                                    <p className="text-sm text-surface-500">Manage your credentials and access</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border border-surface-800 p-4">
                                        <div>
                                            <p className="font-medium text-white">Change Password</p>
                                            <p className="text-xs text-surface-500">Last updated 3 months ago</p>
                                        </div>
                                        <button className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-700">
                                            <Key className="h-4 w-4 text-pulse-400" />
                                            Update
                                        </button>
                                    </div>

                                    <div className="rounded-lg border border-surface-800 p-4 space-y-3">
                                        <p className="font-medium text-white">API Keys</p>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 rounded bg-surface-950 px-3 py-2 text-xs text-surface-400 font-mono">
                                                mp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                            </code>
                                            <button className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-xs font-medium text-white hover:bg-surface-700">
                                                Reveal
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <div className="rounded-lg border border-red-900/50 bg-red-500/5 p-4">
                                            <h4 className="font-semibold text-red-500 flex items-center gap-2 mb-1">
                                                <Trash2 className="h-4 w-4" />
                                                Danger Zone
                                            </h4>
                                            <p className="text-xs text-red-400/70 mb-4">Permanently delete all your personal data and dashboard history. This action is irreversible.</p>
                                            <button className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                                                Delete Account Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-surface-800 pt-6">
                            <button className="px-4 py-2 text-sm font-medium text-surface-400 transition-colors hover:text-white">
                                Reset Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg bg-gradient-to-r from-pulse-500 to-accent-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50",
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
