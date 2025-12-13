/**
 * Persona Mapping Service
 * 
 * Associates BehaviorClusters with predefined Personas
 * based on keyword overlap and semantic similarity.
 */

import prisma from '@/lib/db'

// Configuration
const ASSOCIATION_THRESHOLD = 0.3
const MAX_PERSONAS_PER_CLUSTER = 3

export class PersonaMapperService {
    /**
     * Map all clusters to personas
     */
    async mapClustersToPersonas(): Promise<{ mappings: number }> {
        console.log('🎭 Starting persona mapping...')

        // Get all personas with keywords
        const personas = await prisma.persona.findMany({
            select: {
                id: true,
                name: true,
                keywords: true,
                painPoints: true,
                typicalBehaviors: true
            }
        })

        if (personas.length === 0) {
            console.log('  ⚠️ No personas found. Run seed first.')
            return { mappings: 0 }
        }

        // Get all clusters
        const clusters = await prisma.behaviorCluster.findMany({
            select: {
                id: true,
                label: true,
                summary: true,
                topPhrases: true
            }
        })

        console.log(`  Mapping ${clusters.length} clusters to ${personas.length} personas`)

        let totalMappings = 0

        for (const cluster of clusters) {
            try {
                // Build cluster text for matching
                const clusterText = [
                    cluster.label,
                    cluster.summary,
                    ...(cluster.topPhrases || [])
                ].join(' ').toLowerCase()

                // Score each persona
                const personaScores: { personaId: string; score: number }[] = []

                for (const persona of personas) {
                    const score = this.calculateAssociationScore(
                        clusterText,
                        persona.keywords,
                        persona.painPoints,
                        persona.typicalBehaviors
                    )

                    if (score >= ASSOCIATION_THRESHOLD) {
                        personaScores.push({ personaId: persona.id, score })
                    }
                }

                // Sort by score and take top N
                personaScores.sort((a, b) => b.score - a.score)
                const topPersonas = personaScores.slice(0, MAX_PERSONAS_PER_CLUSTER)

                // Remove existing mappings for this cluster
                await prisma.personaClusterLink.deleteMany({
                    where: { clusterId: cluster.id }
                })

                // Create new mappings
                for (const { personaId, score } of topPersonas) {
                    await prisma.personaClusterLink.create({
                        data: {
                            clusterId: cluster.id,
                            personaId,
                            associationScore: Math.round(score * 100) / 100,
                            assignmentMethod: 'auto'
                        }
                    })
                    totalMappings++
                }

            } catch (error) {
                console.error(`  ❌ Error mapping cluster ${cluster.id}:`, error)
            }
        }

        console.log(`✅ Persona mapping complete: ${totalMappings} mappings created`)
        return { mappings: totalMappings }
    }

    /**
     * Calculate association score between cluster and persona
     */
    private calculateAssociationScore(
        clusterText: string,
        keywords: string[],
        painPoints: string[],
        behaviors: string[]
    ): number {
        const allTerms = [
            ...keywords,
            ...painPoints,
            ...behaviors
        ].map(t => t.toLowerCase())

        if (allTerms.length === 0) return 0

        let matchCount = 0
        let weightedScore = 0

        for (const term of allTerms) {
            // Check for exact phrase match
            if (clusterText.includes(term)) {
                matchCount++
                weightedScore += 1.0
                continue
            }

            // Check for word-level overlap
            const termWords = term.split(/\s+/)
            const matchingWords = termWords.filter(w => clusterText.includes(w))

            if (matchingWords.length > 0) {
                const partialMatch = matchingWords.length / termWords.length
                if (partialMatch >= 0.5) {
                    matchCount++
                    weightedScore += partialMatch * 0.7
                }
            }
        }

        // Normalize by total terms
        const score = weightedScore / allTerms.length

        // Boost if multiple strong matches
        const matchRatio = matchCount / allTerms.length
        const boostedScore = score * (1 + matchRatio * 0.5)

        return Math.min(1, boostedScore)
    }
}

/**
 * Run persona mapping as a standalone job
 */
export async function runPersonaMapping() {
    const service = new PersonaMapperService()
    return service.mapClustersToPersonas()
}
