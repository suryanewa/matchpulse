/**
 * Full Pipeline Runner
 * 
 * Runs the complete data pipeline end-to-end:
 * 1. YouTube Ingestion
 * 2. Reddit Ingestion
 * 3. Content Cleaning
 * 4. Embedding Generation
 * 5. Clustering
 * 6. Cluster Labeling
 * 7. Persona Mapping
 * 8. Opportunity Generation
 * 
 * Run with: npm run pipeline:run
 */

import { runYouTubeIngestion } from '../ingestion/youtube'
import { runRedditIngestion } from '../ingestion/reddit'
import { cleanContent } from '../ingestion/content-cleaner'
import { runEmbeddingGeneration } from '../processing/embeddings'
import { runClustering } from '../processing/clustering'
import { runLabeling } from '../processing/labeling'
import { runPersonaMapping } from '../analysis/persona-mapper'
import { runOpportunityGeneration } from '../analysis/opportunity-generator'

interface StepResult {
    name: string
    success: boolean
    duration: number
    details?: Record<string, unknown>
    error?: string
}

async function runStep(
    name: string,
    fn: () => Promise<unknown>
): Promise<StepResult> {
    const start = Date.now()

    try {
        const result = await fn()
        return {
            name,
            success: true,
            duration: Date.now() - start,
            details: result as Record<string, unknown>
        }
    } catch (error) {
        return {
            name,
            success: false,
            duration: Date.now() - start,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

async function main() {
    console.log('╔' + '═'.repeat(58) + '╗')
    console.log('║  🚀 MatchPulse Data Pipeline - Full Run                   ║')
    console.log('╠' + '═'.repeat(58) + '╣')
    console.log(`║  Started: ${new Date().toISOString()}             ║`)
    console.log('╚' + '═'.repeat(58) + '╝')
    console.log('')

    const results: StepResult[] = []

    // Step 1: YouTube Ingestion
    console.log('📍 Step 1/8: YouTube Ingestion')
    results.push(await runStep('YouTube Ingestion', runYouTubeIngestion))
    console.log('')

    // Step 2: Reddit Ingestion
    console.log('📍 Step 2/8: Reddit Ingestion')
    results.push(await runStep('Reddit Ingestion', runRedditIngestion))
    console.log('')

    // Step 3: Content Cleaning
    console.log('📍 Step 3/8: Content Cleaning')
    results.push(await runStep('Content Cleaning', cleanContent))
    console.log('')

    // Step 4: Embedding Generation
    console.log('📍 Step 4/8: Embedding Generation')
    results.push(await runStep('Embedding Generation', runEmbeddingGeneration))
    console.log('')

    // Step 5: Clustering
    console.log('📍 Step 5/8: Clustering')
    results.push(await runStep('Clustering', runClustering))
    console.log('')

    // Step 6: Cluster Labeling
    console.log('📍 Step 6/8: Cluster Labeling')
    results.push(await runStep('Cluster Labeling', runLabeling))
    console.log('')

    // Step 7: Persona Mapping
    console.log('📍 Step 7/8: Persona Mapping')
    results.push(await runStep('Persona Mapping', runPersonaMapping))
    console.log('')

    // Step 8: Opportunity Generation
    console.log('📍 Step 8/8: Opportunity Generation')
    results.push(await runStep('Opportunity Generation', runOpportunityGeneration))
    console.log('')

    // Summary
    console.log('╔' + '═'.repeat(58) + '╗')
    console.log('║  📊 Pipeline Summary                                       ║')
    console.log('╠' + '═'.repeat(58) + '╣')

    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
    const successCount = results.filter(r => r.success).length

    for (const result of results) {
        const status = result.success ? '✅' : '❌'
        const duration = `${(result.duration / 1000).toFixed(1)}s`
        const name = result.name.padEnd(25)
        console.log(`║  ${status} ${name} ${duration.padStart(8)} ║`)
    }

    console.log('╠' + '═'.repeat(58) + '╣')
    console.log(`║  Total: ${successCount}/${results.length} steps succeeded in ${(totalDuration / 1000).toFixed(1)}s            ║`)
    console.log('╚' + '═'.repeat(58) + '╝')

    // Exit with error if any step failed
    const hasErrors = results.some(r => !r.success)
    if (hasErrors) {
        console.log('')
        console.log('Errors:')
        for (const result of results.filter(r => !r.success)) {
            console.log(`  - ${result.name}: ${result.error}`)
        }
        process.exit(1)
    }

    process.exit(0)
}

main()
