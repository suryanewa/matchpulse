/**
 * YouTube Ingestion Job Runner
 * 
 * Run with: npm run ingest:youtube
 */

import { runYouTubeIngestion } from '../ingestion/youtube'

async function main() {
    console.log('='.repeat(50))
    console.log('🎬 YouTube Ingestion Job')
    console.log('='.repeat(50))
    console.log(`Started at: ${new Date().toISOString()}`)
    console.log('')

    try {
        const result = await runYouTubeIngestion()

        console.log('')
        console.log('='.repeat(50))
        console.log(`✅ Completed at: ${new Date().toISOString()}`)
        console.log(`   Processed: ${result.processed}`)
        console.log(`   Ingested: ${result.ingested}`)
        console.log('='.repeat(50))

        process.exit(0)
    } catch (error) {
        console.error('')
        console.error('='.repeat(50))
        console.error('❌ Job failed:', error)
        console.error('='.repeat(50))
        process.exit(1)
    }
}

main()
