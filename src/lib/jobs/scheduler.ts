/**
 * Pipeline Scheduler
 * 
 * Schedules and runs the data pipeline using node-cron.
 * 
 * Daily Schedule (UTC):
 * - 03:00 - YouTube Ingestion
 * - 03:30 - Reddit Ingestion
 * - 04:00 - Content Cleaning
 * - 04:15 - Embedding Generation
 * - 05:00 - Clustering
 * - 05:30 - Cluster Labeling
 * - 06:00 - Persona Mapping
 * - 06:15 - Opportunity Generation
 * 
 * Run with: node -r tsx/register src/lib/jobs/scheduler.ts
 */

import cron from 'node-cron'
import { runYouTubeIngestion } from '../ingestion/youtube'
import { runRedditIngestion } from '../ingestion/reddit'
import { cleanContent } from '../ingestion/content-cleaner'
import { runEmbeddingGeneration } from '../processing/embeddings'
import { runClustering } from '../processing/clustering'
import { runLabeling } from '../processing/labeling'
import { runPersonaMapping } from '../analysis/persona-mapper'
import { runOpportunityGeneration } from '../analysis/opportunity-generator'

// Track running jobs to prevent overlap
const runningJobs = new Set<string>()

async function safeRun(name: string, fn: () => Promise<unknown>) {
    if (runningJobs.has(name)) {
        console.log(`⚠️ ${name} is already running, skipping...`)
        return
    }

    runningJobs.add(name)
    console.log(`\n🚀 Starting scheduled job: ${name}`)
    console.log(`   Time: ${new Date().toISOString()}`)

    try {
        await fn()
        console.log(`✅ ${name} completed successfully`)
    } catch (error) {
        console.error(`❌ ${name} failed:`, error)
    } finally {
        runningJobs.delete(name)
    }
}

// Schedule jobs
function scheduleJobs() {
    console.log('🗓️ MatchPulse Pipeline Scheduler')
    console.log('='.repeat(50))
    console.log('Configured schedule (UTC):')
    console.log('  03:00 - YouTube Ingestion')
    console.log('  03:30 - Reddit Ingestion')
    console.log('  04:00 - Content Cleaning')
    console.log('  04:15 - Embedding Generation')
    console.log('  05:00 - Clustering')
    console.log('  05:30 - Cluster Labeling')
    console.log('  06:00 - Persona Mapping')
    console.log('  06:15 - Opportunity Generation')
    console.log('='.repeat(50))
    console.log('')

    // YouTube Ingestion - 3:00 AM UTC
    cron.schedule('0 3 * * *', () => {
        safeRun('YouTube Ingestion', runYouTubeIngestion)
    }, { timezone: 'UTC' })

    // Reddit Ingestion - 3:30 AM UTC
    cron.schedule('30 3 * * *', () => {
        safeRun('Reddit Ingestion', runRedditIngestion)
    }, { timezone: 'UTC' })

    // Content Cleaning - 4:00 AM UTC
    cron.schedule('0 4 * * *', () => {
        safeRun('Content Cleaning', cleanContent)
    }, { timezone: 'UTC' })

    // Embedding Generation - 4:15 AM UTC
    cron.schedule('15 4 * * *', () => {
        safeRun('Embedding Generation', runEmbeddingGeneration)
    }, { timezone: 'UTC' })

    // Clustering - 5:00 AM UTC
    cron.schedule('0 5 * * *', () => {
        safeRun('Clustering', runClustering)
    }, { timezone: 'UTC' })

    // Cluster Labeling - 5:30 AM UTC
    cron.schedule('30 5 * * *', () => {
        safeRun('Cluster Labeling', runLabeling)
    }, { timezone: 'UTC' })

    // Persona Mapping - 6:00 AM UTC
    cron.schedule('0 6 * * *', () => {
        safeRun('Persona Mapping', runPersonaMapping)
    }, { timezone: 'UTC' })

    // Opportunity Generation - 6:15 AM UTC
    cron.schedule('15 6 * * *', () => {
        safeRun('Opportunity Generation', runOpportunityGeneration)
    }, { timezone: 'UTC' })

    console.log('Scheduler started. Waiting for scheduled jobs...')
    console.log('Press Ctrl+C to stop.')
}

// Start the scheduler
scheduleJobs()
