'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
    CupidPreferences,
    CoupleProfile,
    DateSuggestion,
    DateLog,
    WrappedData,
    CupidState,
    WRAPPED_THRESHOLD,
    VibeTag,
    BudgetTier,
    TimeWindow,
    CupidArchetype,
    DateCategory,
} from '@/types/cupid'
import {
    DATE_IDEAS,
    SIMULATED_PARTNER_PREFERENCES,
    calculateOverlap,
    calculateOverlapScore,
    ARCHETYPE_DEFINITIONS,
} from '@/data/cupid-data'

// ============================================
// Context Types
// ============================================

interface CupidContextType {
    // State
    state: CupidState
    isLoading: boolean
    recommendations: DateSuggestion[]
    isLoadingRecommendations: boolean
    recommendationsError: string | null

    // Actions - Onboarding
    setUserPreferences: (prefs: CupidPreferences) => void
    completeOnboarding: () => void

    // Actions - Dates
    getRecommendations: () => DateSuggestion[]
    fetchRecommendations: (append?: boolean) => Promise<void>
    saveDate: (dateId: string) => void
    unsaveDate: (dateId: string) => void
    markCompleted: (dateId: string) => void
    markNotOurVibe: (dateId: string) => void
    dismissDate: (dateId: string) => void

    // Actions - Logging
    logDate: (log: Omit<DateLog, 'id'>) => void

    // Actions - Wrapped
    generateWrapped: () => WrappedData | null

    // Helpers
    getSavedDates: () => DateSuggestion[]
    getCompletedDates: () => DateLog[]
}

const defaultPreferences: CupidPreferences = {
    city: 'NYC',
    neighborhoods: [],
    budgetTiers: [],
    vibes: [],
    cuisines: [],
    timeWindows: [],
}

const defaultState: CupidState = {
    isOnboarded: false,
    userPreferences: null,
    partnerPreferences: SIMULATED_PARTNER_PREFERENCES,
    coupleProfile: null,
    savedDates: [],
    completedDates: [],
    notOurVibeDates: [],
    dismissedDates: [],
    wrappedData: null,
    wrappedUnlocked: false,
}

// ============================================
// Context Creation
// ============================================

const CupidContext = createContext<CupidContextType | undefined>(undefined)

// ============================================
// Provider Component
// ============================================

export function CupidProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CupidState>(defaultState)
    const [isLoading, setIsLoading] = useState(true)
    const [recommendations, setRecommendations] = useState<DateSuggestion[]>([])
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
    const [recommendationsError, setRecommendationsError] = useState<string | null>(null)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cupid-state')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.completedDates) {
                    parsed.completedDates = parsed.completedDates.map((d: DateLog) => ({
                        ...d,
                        completedAt: new Date(d.completedAt)
                    }))
                }
                setState(parsed)
            } catch (e) {
                console.error('Failed to load cupid state:', e)
            }
        }
        // Also load cached recommendations
        const cachedRecs = localStorage.getItem('cupid-recommendations')
        if (cachedRecs) {
            try {
                setRecommendations(JSON.parse(cachedRecs))
            } catch (e) {
                console.error('Failed to load cached recommendations:', e)
            }
        }
        setIsLoading(false)
    }, [])

    // Save to localStorage on state change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('cupid-state', JSON.stringify(state))
        }
    }, [state, isLoading])

    // ============================================
    // Couple Profile Calculation
    // ============================================

    const calculateCoupleProfile = useCallback((
        userPrefs: CupidPreferences,
        partnerPrefs: CupidPreferences
    ): CoupleProfile => {
        return {
            user1Preferences: userPrefs,
            user2Preferences: partnerPrefs,
            overlaps: {
                neighborhoods: calculateOverlap(userPrefs.neighborhoods, partnerPrefs.neighborhoods),
                budgetTiers: calculateOverlap(userPrefs.budgetTiers, partnerPrefs.budgetTiers) as BudgetTier[],
                vibes: calculateOverlap(userPrefs.vibes, partnerPrefs.vibes) as VibeTag[],
                cuisines: calculateOverlap(userPrefs.cuisines, partnerPrefs.cuisines),
                timeWindows: calculateOverlap(userPrefs.timeWindows, partnerPrefs.timeWindows) as TimeWindow[],
            },
            stretchPicks: {
                fromUser1: userPrefs.vibes.filter(v => !partnerPrefs.vibes.includes(v)) as VibeTag[],
                fromUser2: partnerPrefs.vibes.filter(v => !userPrefs.vibes.includes(v)) as VibeTag[],
            }
        }
    }, [])

    // ============================================
    // API-Based Recommendations
    // ============================================

    const fetchRecommendations = useCallback(async (append: boolean = false) => {
        if (!state.userPreferences) {
            console.log('No user preferences, skipping fetch')
            return
        }

        setIsLoadingRecommendations(true)
        setRecommendationsError(null)

        try {
            // Get existing IDs to exclude from new fetch
            const existingIds = append ? recommendations.map(r => r.id) : []

            const response = await fetch('/api/cupid/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vibes: state.userPreferences.vibes,
                    budgetTiers: state.userPreferences.budgetTiers,
                    neighborhoods: state.userPreferences.neighborhoods,
                    timeWindows: state.userPreferences.timeWindows,
                    cuisines: state.userPreferences.cuisines,
                    excludeIds: existingIds
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || `API error: ${response.status}`)
            }

            const data = await response.json()

            // Merge with user state (saved, completed, etc.)
            const enrichedRecs = data.recommendations.map((rec: DateSuggestion) => ({
                ...rec,
                isSaved: state.savedDates.includes(rec.id),
                isCompleted: state.completedDates.some(d => d.dateIdeaId === rec.id),
                notOurVibe: state.notOurVibeDates.includes(rec.id)
            })).filter((rec: DateSuggestion) => !rec.notOurVibe && !existingIds.includes(rec.id))

            // Append or replace
            const newRecs = append ? [...recommendations, ...enrichedRecs] : enrichedRecs
            setRecommendations(newRecs)
            localStorage.setItem('cupid-recommendations', JSON.stringify(newRecs))

            console.log(`Fetched ${enrichedRecs.length} recommendations from API${append ? ' (appended)' : ''}`)
        } catch (error) {
            console.error('Failed to fetch recommendations:', error)
            setRecommendationsError(error instanceof Error ? error.message : 'Failed to load recommendations')

            // Fallback to mock data only if not appending
            if (!append) {
                console.log('Using mock data as fallback')
                const mockRecs = getMockRecommendations()
                setRecommendations(mockRecs)
            }
        } finally {
            setIsLoadingRecommendations(false)
        }
    }, [state.userPreferences, state.savedDates, state.completedDates, state.notOurVibeDates, recommendations])

    // Fallback mock recommendations
    const getMockRecommendations = useCallback((): DateSuggestion[] => {
        if (!state.coupleProfile) return []

        const { overlaps } = state.coupleProfile

        return DATE_IDEAS
            .filter(date => !state.notOurVibeDates.includes(date.id))
            .map(date => {
                const vibeScore = calculateOverlapScore(date.vibes, overlaps.vibes)
                const budgetScore = overlaps.budgetTiers.includes(date.estimatedCost) ? 1 : 0.3
                const timeScore = calculateOverlapScore(date.timeWindows, overlaps.timeWindows)
                const neighborhoodScore = overlaps.neighborhoods.includes(date.neighborhood) ? 1 : 0.5

                const totalScore = vibeScore * 0.4 + budgetScore * 0.2 + timeScore * 0.2 + neighborhoodScore * 0.2

                const whyReasons: string[] = []
                if (vibeScore > 0.5) whyReasons.push(`Matches your ${overlaps.vibes.slice(0, 2).join(' & ')} vibes`)
                if (budgetScore === 1) whyReasons.push(`Fits your budget`)
                if (neighborhoodScore === 1) whyReasons.push(`In ${date.neighborhood}`)

                return {
                    ...date,
                    whyItFits: whyReasons.length > 0 ? whyReasons.join('. ') + '.' : 'A unique experience to try!',
                    isSaved: state.savedDates.includes(date.id),
                    isCompleted: state.completedDates.some(d => d.dateIdeaId === date.id),
                    notOurVibe: false,
                    _score: totalScore,
                }
            })
            .sort((a, b) => (b._score || 0) - (a._score || 0))
            .map(({ _score, ...date }) => date as DateSuggestion)
            .slice(0, 15)
    }, [state])

    // ============================================
    // Onboarding Actions
    // ============================================

    const setUserPreferences = useCallback((prefs: CupidPreferences) => {
        const coupleProfile = calculateCoupleProfile(prefs, SIMULATED_PARTNER_PREFERENCES)
        setState(prev => ({
            ...prev,
            userPreferences: prefs,
            coupleProfile,
        }))
    }, [calculateCoupleProfile])

    const completeOnboarding = useCallback(() => {
        setState(prev => ({ ...prev, isOnboarded: true }))
    }, [])

    // ============================================
    // Sync getRecommendations to return cached data
    // ============================================

    const getRecommendations = useCallback((): DateSuggestion[] => {
        // Return cached recommendations with updated user state
        const dismissedDates = state.dismissedDates || []
        return recommendations.map(rec => ({
            ...rec,
            isSaved: state.savedDates.includes(rec.id),
            isCompleted: state.completedDates.some(d => d.dateIdeaId === rec.id),
        })).filter(rec => !state.notOurVibeDates.includes(rec.id) && !dismissedDates.includes(rec.id))
    }, [recommendations, state.savedDates, state.completedDates, state.notOurVibeDates, state.dismissedDates])

    // ============================================
    // Date Actions
    // ============================================

    const saveDate = useCallback((dateId: string) => {
        setState(prev => ({
            ...prev,
            savedDates: Array.from(new Set([...prev.savedDates, dateId]))
        }))
    }, [])

    const unsaveDate = useCallback((dateId: string) => {
        setState(prev => ({
            ...prev,
            savedDates: prev.savedDates.filter(id => id !== dateId)
        }))
    }, [])

    const markCompleted = useCallback((dateId: string) => {
        setState(prev => ({
            ...prev,
            savedDates: prev.savedDates.filter(id => id !== dateId)
        }))
    }, [])

    const markNotOurVibe = useCallback((dateId: string) => {
        setState(prev => ({
            ...prev,
            notOurVibeDates: Array.from(new Set([...prev.notOurVibeDates, dateId])),
            savedDates: prev.savedDates.filter(id => id !== dateId)
        }))
    }, [])

    const dismissDate = useCallback((dateId: string) => {
        setState(prev => ({
            ...prev,
            dismissedDates: Array.from(new Set([...prev.dismissedDates, dateId])),
            savedDates: prev.savedDates.filter(id => id !== dateId)
        }))
    }, [])

    // ============================================
    // Logging
    // ============================================

    const logDate = useCallback((log: Omit<DateLog, 'id'>) => {
        const newLog: DateLog = {
            ...log,
            id: `log-${Date.now()}`,
        }
        setState(prev => {
            const completedDates = [...prev.completedDates, newLog]
            const wrappedUnlocked = completedDates.length >= WRAPPED_THRESHOLD
            return {
                ...prev,
                completedDates,
                wrappedUnlocked,
                savedDates: prev.savedDates.filter(id => id !== log.dateIdeaId)
            }
        })
    }, [])

    // ============================================
    // Wrapped Generation
    // ============================================

    const generateWrapped = useCallback((): WrappedData | null => {
        const logs = state.completedDates
        if (logs.length === 0) return null

        const totalDatesCompleted = logs.length
        const averageRating = logs.reduce((sum, l) => sum + l.rating, 0) / logs.length
        const bestDate = logs.reduce((best, l) => l.rating > (best?.rating || 0) ? l : best, logs[0])

        const tagCounts: Record<string, number> = {}
        logs.forEach(l => l.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
        const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)

        const tagToVibe: Record<string, VibeTag> = {
            'cozy': 'cozy',
            'romantic': 'romantic',
            'chaotic': 'adventurous',
            'deep-talk': 'cozy',
            'spontaneous': 'adventurous',
        }
        const topVibes = topTags.map(([tag]) => tagToVibe[tag] || 'chill').filter(Boolean) as VibeTag[]

        const neighborhoodCounts: Record<string, number> = {}
        logs.forEach(l => { neighborhoodCounts[l.neighborhood] = (neighborhoodCounts[l.neighborhood] || 0) + 1 })
        const mostVisitedNeighborhood = Object.entries(neighborhoodCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'

        const categoryCounts: Record<string, number> = {}
        logs.forEach(l => { categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1 })
        const signatureActivity = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] as DateCategory || 'restaurant'

        let archetype: CupidArchetype = 'slow-burn-storytellers'
        if (topTags.some(([t]) => t === 'chaotic' || t === 'spontaneous')) {
            archetype = 'chaotic-romantics'
        } else if (signatureActivity === 'restaurant' || signatureActivity === 'dessert') {
            archetype = 'foodie-wanderers'
        } else if (signatureActivity === 'museum') {
            archetype = 'culture-vultures'
        } else if (topTags.some(([t]) => t === 'cozy')) {
            archetype = 'cozy-homebodies'
        }

        const wrappedData: WrappedData = {
            totalDatesCompleted,
            averageRating: Math.round(averageRating * 10) / 10,
            bestDate,
            topVibes: Array.from(new Set(topVibes)).slice(0, 3),
            mostVisitedNeighborhood,
            signatureActivity,
            archetype,
            archetypeDescription: ARCHETYPE_DEFINITIONS[archetype].description,
            stats: {
                totalHoursSpent: totalDatesCompleted * 2.5,
                mostCommonTimeWindow: 'saturday-evening',
                cuisineVariety: new Set(logs.map(l => l.category)).size,
                neighborhoodCount: Object.keys(neighborhoodCounts).length,
            }
        }

        setState(prev => ({ ...prev, wrappedData }))
        return wrappedData
    }, [state.completedDates])

    // ============================================
    // Helpers
    // ============================================

    const getSavedDates = useCallback((): DateSuggestion[] => {
        return getRecommendations().filter(d => d.isSaved)
    }, [getRecommendations])

    const getCompletedDates = useCallback((): DateLog[] => {
        return state.completedDates
    }, [state.completedDates])

    // ============================================
    // Context Value
    // ============================================

    const value: CupidContextType = {
        state,
        isLoading,
        recommendations,
        isLoadingRecommendations,
        recommendationsError,
        setUserPreferences,
        completeOnboarding,
        getRecommendations,
        fetchRecommendations,
        saveDate,
        unsaveDate,
        markCompleted,
        markNotOurVibe,
        dismissDate,
        logDate,
        generateWrapped,
        getSavedDates,
        getCompletedDates,
    }

    return (
        <CupidContext.Provider value={value}>
            {children}
        </CupidContext.Provider>
    )
}

// ============================================
// Hook
// ============================================

export function useCupid() {
    const context = useContext(CupidContext)
    if (context === undefined) {
        throw new Error('useCupid must be used within a CupidProvider')
    }
    return context
}

