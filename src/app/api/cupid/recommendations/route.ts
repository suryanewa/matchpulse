import { NextRequest, NextResponse } from 'next/server'
import { DateSuggestion, VibeTag, BudgetTier, TimeWindow, DateCategory } from '@/types/cupid'

// Request types
interface RecommendationsRequest {
    vibes: VibeTag[]
    budgetTiers: BudgetTier[]
    neighborhoods: string[]
    timeWindows: TimeWindow[]
    cuisines?: string[]
}

interface PlaceResult {
    id: string
    name: string
    address: string
    rating: number | null
    priceLevel: number | null
    types: string[]
    photoUrl: string | null
    location: { lat: number; lng: number }
    openNow: boolean | null
    totalRatings: number | null
}

// Map Google place types to our DateCategory
function mapTypeToCategory(types: string[]): DateCategory {
    const typeMap: Record<string, DateCategory> = {
        restaurant: 'restaurant',
        cafe: 'coffee',
        bar: 'bar',
        night_club: 'bar',
        museum: 'museum',
        art_gallery: 'museum',
        movie_theater: 'entertainment',
        theater: 'entertainment',
        bowling_alley: 'entertainment',
        amusement_park: 'entertainment',
        park: 'outdoor',
        tourist_attraction: 'outdoor',
        bakery: 'dessert',
        spa: 'wellness',
        gym: 'wellness',
        book_store: 'shopping',
        shopping_mall: 'shopping',
    }

    for (const type of types) {
        if (typeMap[type]) return typeMap[type]
    }

    // Default category based on common patterns
    if (types.some(t => t.includes('food') || t.includes('eat'))) return 'restaurant'
    if (types.some(t => t.includes('drink'))) return 'bar'

    return 'special' // Default fallback
}

// Map price level to budget tier
function priceLevelToBudget(priceLevel: number | null): BudgetTier {
    switch (priceLevel) {
        case 0: return 'free'
        case 1: return 'budget'
        case 2: return 'standard'
        case 3: return 'premium'
        case 4: return 'splurge'
        default: return 'standard'
    }
}

// Extract neighborhood from address
function extractNeighborhood(address: string): string {
    const nycNeighborhoods = [
        'West Village', 'East Village', 'SoHo', 'NoHo', 'TriBeCa', 'Lower East Side',
        'Williamsburg', 'Bushwick', 'DUMBO', 'Greenpoint', 'Chelsea', 'Flatiron',
        'Midtown', 'Upper East Side', 'Upper West Side', 'Harlem', 'Chinatown',
        'Little Italy', 'NoLita', 'Financial District', 'Brooklyn Heights'
    ]

    for (const hood of nycNeighborhoods) {
        if (address.toLowerCase().includes(hood.toLowerCase())) {
            return hood
        }
    }

    // Try to extract from comma-separated parts
    const parts = address.split(',').map(p => p.trim())
    if (parts.length >= 2) {
        return parts[1] // Usually the neighborhood/city part
    }

    return 'NYC'
}

// Generate "why it fits" explanation using OpenAI
async function generateWhyItFits(
    place: PlaceResult,
    preferences: RecommendationsRequest
): Promise<string> {
    const openaiKey = process.env.OPENAI_API_KEY

    if (!openaiKey) {
        // Fallback without AI
        const vibeMatch = preferences.vibes[0] || 'your'
        return `Matches your ${vibeMatch} vibe in ${extractNeighborhood(place.address)}.`
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: `In 15 words or less, explain why "${place.name}" (${place.types.slice(0, 3).join(', ')}) is great for a couple who likes: ${preferences.vibes.join(', ')} vibes. Be specific and enthusiastic. Don't mention the vibe words directly.`
                }],
                temperature: 0.9,
                max_tokens: 50
            })
        })

        if (response.ok) {
            const data = await response.json()
            return data.choices[0]?.message?.content?.trim() || `Perfect for your ${preferences.vibes[0]} date night.`
        }
    } catch (e) {
        console.error('Failed to generate why it fits:', e)
    }

    return `Perfect for your ${preferences.vibes[0] || 'special'} date night in ${extractNeighborhood(place.address)}.`
}

export async function POST(request: NextRequest) {
    try {
        const preferences: RecommendationsRequest = await request.json()

        // Validate
        if (!preferences.vibes?.length || !preferences.neighborhoods?.length) {
            return NextResponse.json(
                { error: 'Missing required preferences' },
                { status: 400 }
            )
        }

        // Step 1: Generate search queries using OpenAI
        const queriesResponse = await fetch(new URL('/api/cupid/generate-queries', request.url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences)
        })

        if (!queriesResponse.ok) {
            throw new Error('Failed to generate search queries')
        }

        const { queries } = await queriesResponse.json()

        // Step 2: Search Google Places with generated queries
        const placesResponse = await fetch(new URL('/api/cupid/search-places', request.url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                queries,
                maxResultsPerQuery: 3
            })
        })

        if (!placesResponse.ok) {
            throw new Error('Failed to search places')
        }

        const { places } = await placesResponse.json() as { places: PlaceResult[] }

        // Step 3: Transform places into DateSuggestions
        const dateSuggestions: DateSuggestion[] = await Promise.all(
            places.slice(0, 15).map(async (place, index): Promise<DateSuggestion> => {
                const category = mapTypeToCategory(place.types)
                const budget = priceLevelToBudget(place.priceLevel)
                const neighborhood = extractNeighborhood(place.address)

                // Generate personalized "why it fits" (batch the first 10 for performance)
                const whyItFits = index < 10
                    ? await generateWhyItFits(place, preferences)
                    : `Great spot in ${neighborhood} for your date night.`

                return {
                    id: place.id,
                    title: place.name,
                    description: `${place.address}${place.rating ? ` • ${place.rating}⭐` : ''}${place.totalRatings ? ` (${place.totalRatings} reviews)` : ''}`,
                    category,
                    neighborhood,
                    estimatedCost: budget,
                    vibes: preferences.vibes.slice(0, 3), // Use requested vibes
                    timeWindows: preferences.timeWindows.slice(0, 2),
                    whyItFits,
                    isSaved: false,
                    isCompleted: false,
                    notOurVibe: false,
                    photoUrl: place.photoUrl,
                    googlePlaceId: place.id,
                    rating: place.rating,
                    openNow: place.openNow
                }
            })
        )

        return NextResponse.json({
            recommendations: dateSuggestions,
            queriesUsed: queries.length,
            totalPlacesFound: places.length
        })
    } catch (error) {
        console.error('Error generating recommendations:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
