/**
 * Content Cleaning Pipeline
 * 
 * Post-ingestion cleaning including language detection and filtering.
 */

import prisma from '@/lib/db'

// Minimum content length to keep
const MIN_CONTENT_LENGTH = 15

/**
 * Clean and filter content items
 * - Detects language and marks non-English as filtered
 * - Filters extremely short texts
 */
export async function cleanContent(): Promise<{ processed: number; kept: number; filtered: number }> {
    console.log('🧹 Starting content cleaning...')

    // Find all items with unknown language
    const uncleaned = await prisma.contentItem.findMany({
        where: { language: 'unknown' },
        select: { id: true, bodyText: true }
    })

    console.log(`  Found ${uncleaned.length} items to process`)

    let kept = 0
    let filtered = 0

    for (const item of uncleaned) {
        try {
            // Skip very short content
            if (item.bodyText.length < MIN_CONTENT_LENGTH) {
                await prisma.contentItem.delete({ where: { id: item.id } })
                filtered++
                continue
            }

            // Simple English detection heuristic
            // For MVP, we assume content from English subreddits/YouTube english search is English
            // A more robust solution would use the 'franc' library
            const isEnglish = detectEnglish(item.bodyText)

            if (isEnglish) {
                await prisma.contentItem.update({
                    where: { id: item.id },
                    data: { language: 'en' }
                })
                kept++
            } else {
                // Delete non-English content for MVP
                await prisma.contentItem.delete({ where: { id: item.id } })
                filtered++
            }
        } catch (error) {
            console.error(`  ❌ Error processing item ${item.id}:`, error)
        }
    }

    console.log(`✅ Content cleaning complete: ${kept} kept, ${filtered} filtered`)
    return { processed: uncleaned.length, kept, filtered }
}

/**
 * Simple English detection heuristic
 * Checks for common English words and patterns
 */
function detectEnglish(text: string): boolean {
    const commonEnglishWords = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'
    ]

    const lowerText = text.toLowerCase()
    const words = lowerText.split(/\s+/)

    // Count how many common English words appear
    let englishWordCount = 0
    for (const word of words) {
        if (commonEnglishWords.includes(word)) {
            englishWordCount++
        }
    }

    // If at least 10% of words are common English words, consider it English
    const ratio = englishWordCount / words.length
    return ratio >= 0.1
}

/**
 * Advanced language detection using the 'franc' library
 * (Use this for more accurate detection when needed)
 */
export async function detectLanguageAdvanced(text: string): Promise<string> {
    try {
        // Dynamic import of franc (ESM module)
        const { franc } = await import('franc')
        const langCode = franc(text, { minLength: 10 })
        return langCode === 'und' ? 'unknown' : langCode
    } catch {
        return 'unknown'
    }
}
