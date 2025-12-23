import { NextRequest, NextResponse } from 'next/server'

// Types for the request
interface GenerateQueriesRequest {
    vibes: string[]
    budgetTiers: string[]
    neighborhoods: string[]
    timeWindows: string[]
    cuisines?: string[]
}

// OpenAI API call to generate natural language search queries
async function generateSearchQueries(preferences: GenerateQueriesRequest): Promise<string[]> {
    const openaiKey = process.env.OPENAI_API_KEY

    if (!openaiKey) {
        throw new Error('OPENAI_API_KEY not configured')
    }

    const budgetDescriptions: Record<string, string> = {
        'free': 'free or no cost',
        'budget': 'cheap and affordable ($10-30)',
        'standard': 'moderately priced ($30-75)',
        'premium': 'upscale and fancy ($75-150)',
        'splurge': 'luxury and high-end ($150+)'
    }

    const vibeDescriptions: Record<string, string> = {
        'cozy': 'cozy, warm, intimate atmosphere',
        'adventurous': 'adventurous, exciting, unique experiences',
        'romantic': 'romantic, perfect for couples',
        'chill': 'relaxed, casual, laid-back',
        'foodie': 'great food, culinary experiences',
        'cultural': 'cultural, artistic, educational',
        'active': 'active, energetic, physical activities',
        'trendy': 'trendy, hip, Instagram-worthy',
        'nostalgic': 'nostalgic, classic, timeless',
        'spontaneous': 'spontaneous, surprising, unexpected'
    }

    const vibeDesc = preferences.vibes.map(v => vibeDescriptions[v] || v).join(', ')
    const budgetDesc = preferences.budgetTiers.map(b => budgetDescriptions[b] || b).join(' or ')
    const neighborhoods = preferences.neighborhoods.join(', ')

    const prompt = `You are a date planning expert for couples in NYC. Based on these preferences, generate 8 specific Google Places search queries to find great date spots.

Preferences:
- Vibes: ${vibeDesc}
- Budget: ${budgetDesc}
- Neighborhoods: ${neighborhoods}
- Preferred times: ${preferences.timeWindows.join(', ')}
${preferences.cuisines?.length ? `- Food preferences: ${preferences.cuisines.join(', ')}` : ''}

Generate 8 diverse, specific search queries that would work well with Google Places Text Search API. Each query should:
1. Be specific enough to find relevant venues
2. Include location context (NYC neighborhoods mentioned)
3. Mix different activity types (restaurants, bars, activities, experiences)
4. Match the budget and vibe preferences

Return ONLY a JSON array of 8 search query strings, no explanation. Example format:
["romantic Italian restaurant West Village NYC", "cozy speakeasy cocktail bar Lower East Side"]`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that generates search queries for finding date spots. Always respond with valid JSON arrays only.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 500
        })
    })

    if (!response.ok) {
        const error = await response.text()
        console.error('OpenAI API error:', error)
        throw new Error('Failed to generate search queries')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '[]'

    try {
        // Extract JSON array from response (handle markdown code blocks)
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        return JSON.parse(content)
    } catch {
        console.error('Failed to parse OpenAI response:', content)
        // Fallback queries if parsing fails
        return [
            `${preferences.vibes[0] || 'romantic'} restaurant ${preferences.neighborhoods[0] || 'Manhattan'} NYC`,
            `date night ${preferences.neighborhoods[0] || 'NYC'}`,
            `couples activities ${preferences.neighborhoods[0] || 'Manhattan'}`
        ]
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: GenerateQueriesRequest = await request.json()

        // Validate required fields
        if (!body.vibes?.length || !body.neighborhoods?.length) {
            return NextResponse.json(
                { error: 'Missing required fields: vibes and neighborhoods' },
                { status: 400 }
            )
        }

        const queries = await generateSearchQueries(body)

        return NextResponse.json({ queries })
    } catch (error) {
        console.error('Error generating queries:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
