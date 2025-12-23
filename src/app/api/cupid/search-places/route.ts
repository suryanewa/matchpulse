import { NextRequest, NextResponse } from 'next/server'

// Types
interface PlaceResult {
    id: string
    name: string
    address: string
    rating: number | null
    priceLevel: number | null
    types: string[]
    photoUrl: string | null
    location: {
        lat: number
        lng: number
    }
    openNow: boolean | null
    totalRatings: number | null
}

interface SearchPlacesRequest {
    queries: string[]
    maxResultsPerQuery?: number
}

// Map price level to our budget tiers
function priceLevelToBudget(priceLevel: number | null): string {
    switch (priceLevel) {
        case 0: return 'free'
        case 1: return 'budget'
        case 2: return 'standard'
        case 3: return 'premium'
        case 4: return 'splurge'
        default: return 'standard'
    }
}

// Search Google Places using Text Search (new) API
async function searchPlaces(query: string, maxResults: number = 5): Promise<PlaceResult[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
        throw new Error('GOOGLE_PLACES_API_KEY not configured')
    }

    // Using Places API (New) Text Search endpoint
    const url = 'https://places.googleapis.com/v1/places:searchText'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.types,places.photos,places.location,places.currentOpeningHours,places.userRatingCount'
        },
        body: JSON.stringify({
            textQuery: query,
            maxResultCount: maxResults,
            locationBias: {
                circle: {
                    center: {
                        latitude: 40.7128, // NYC center
                        longitude: -74.0060
                    },
                    radius: 15000.0 // 15km radius
                }
            }
        })
    })

    if (!response.ok) {
        const error = await response.text()
        console.error('Google Places API error:', error)
        throw new Error('Failed to search places')
    }

    const data = await response.json()
    const places = data.places || []

    return places.map((place: any) => ({
        id: place.id,
        name: place.displayName?.text || 'Unknown',
        address: place.formattedAddress || '',
        rating: place.rating || null,
        priceLevel: place.priceLevel ? parseInt(place.priceLevel.replace('PRICE_LEVEL_', '')) : null,
        types: place.types || [],
        photoUrl: place.photos?.[0]?.name
            ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`
            : null,
        location: {
            lat: place.location?.latitude || 0,
            lng: place.location?.longitude || 0
        },
        openNow: place.currentOpeningHours?.openNow ?? null,
        totalRatings: place.userRatingCount || null
    }))
}

export async function POST(request: NextRequest) {
    try {
        const body: SearchPlacesRequest = await request.json()

        if (!body.queries?.length) {
            return NextResponse.json(
                { error: 'Missing required field: queries' },
                { status: 400 }
            )
        }

        const maxResults = body.maxResultsPerQuery || 3

        // Search all queries in parallel
        const searchPromises = body.queries.map(query =>
            searchPlaces(query, maxResults).catch(err => {
                console.error(`Search failed for query "${query}":`, err)
                return [] // Return empty array on failure
            })
        )

        const results = await Promise.all(searchPromises)

        // Flatten and dedupe by place ID
        const allPlaces: PlaceResult[] = []
        const seenIds = new Set<string>()

        for (const queryResults of results) {
            for (const place of queryResults) {
                if (!seenIds.has(place.id)) {
                    seenIds.add(place.id)
                    allPlaces.push(place)
                }
            }
        }

        // Sort by rating (highest first), with fallback for no rating
        allPlaces.sort((a, b) => {
            const ratingA = a.rating ?? 0
            const ratingB = b.rating ?? 0
            return ratingB - ratingA
        })

        return NextResponse.json({
            places: allPlaces,
            totalFound: allPlaces.length
        })
    } catch (error) {
        console.error('Error searching places:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}

// Helper export for budget mapping
export { priceLevelToBudget }
