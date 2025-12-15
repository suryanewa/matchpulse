/**
 * Clustering Service
 * 
 * Groups related content items into BehaviorClusters using
 * a simplified HDBSCAN-like approach.
 */

import prisma from '@/lib/db'

// Configuration
const MIN_CLUSTER_SIZE = parseInt(process.env.MIN_CLUSTER_SIZE || '20')
const SIMILARITY_THRESHOLD = 0.65

interface ContentWithEmbedding {
    id: string
    embeddingVector: number[]
    sourcePlatform: string
    publishedAt: Date
}

interface ClusterCandidate {
    members: ContentWithEmbedding[]
    centroid: number[]
}

export class ClusteringService {
    /**
     * Run clustering on recent content items
     */
    async runClustering(): Promise<{ clustersCreated: number; itemsAssigned: number }> {
        console.log('🔮 Starting clustering...')

        // Get embeddings for recent content
        const lookbackDays = parseInt(process.env.CONTENT_LOOKBACK_DAYS || '30')
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - lookbackDays)

        // Fetch all items and filter for those with embeddings in application code
        const allItems = await prisma.contentItem.findMany({
            where: {
                language: 'en',
                publishedAt: { gte: cutoffDate }
            },
            select: {
                id: true,
                embeddingVector: true,
                sourcePlatform: true,
                publishedAt: true
            }
        })

        // Filter for items that have embeddings
        const items = allItems.filter((item: typeof allItems[0]) =>
            item.embeddingVector !== null &&
            Array.isArray(item.embeddingVector) &&
            (item.embeddingVector as number[]).length > 0
        )

        console.log(`  Found ${items.length} items with embeddings`)

        if (items.length < MIN_CLUSTER_SIZE) {
            console.log('  ⚠️ Not enough items for clustering')
            return { clustersCreated: 0, itemsAssigned: 0 }
        }

        // Convert embeddings from JSON
        const itemsWithVectors: ContentWithEmbedding[] = items.map((item) => ({
            id: item.id,
            embeddingVector: item.embeddingVector as number[],
            sourcePlatform: item.sourcePlatform,
            publishedAt: item.publishedAt
        }))

        // Run simplified clustering algorithm
        const clusters = this.performClustering(itemsWithVectors)

        console.log(`  Found ${clusters.length} valid clusters`)

        // Save clusters to database
        let clustersCreated = 0
        let itemsAssigned = 0

        for (const cluster of clusters) {
            try {
                const result = await this.saveCluster(cluster)
                if (result.created) clustersCreated++
                itemsAssigned += result.membersAdded
            } catch (error) {
                console.error('  ❌ Error saving cluster:', error)
            }
        }

        console.log(`✅ Clustering complete: ${clustersCreated} clusters, ${itemsAssigned} items assigned`)
        return { clustersCreated, itemsAssigned }
    }

    /**
     * Simplified clustering using k-means-like approach
     * (For MVP - can be replaced with actual HDBSCAN later)
     */
    private performClustering(items: ContentWithEmbedding[]): ClusterCandidate[] {
        const clusters: ClusterCandidate[] = []
        const assigned = new Set<string>()

        // Shuffle items for randomness
        const shuffled = [...items].sort(() => Math.random() - 0.5)

        for (const item of shuffled) {
            if (assigned.has(item.id)) continue

            // Check if item fits in existing cluster
            let foundCluster = false
            for (const cluster of clusters) {
                const similarity = this.cosineSimilarity(item.embeddingVector, cluster.centroid)
                if (similarity >= SIMILARITY_THRESHOLD) {
                    cluster.members.push(item)
                    cluster.centroid = this.updateCentroid(cluster.members)
                    assigned.add(item.id)
                    foundCluster = true
                    break
                }
            }

            // Create new cluster if no match
            if (!foundCluster) {
                clusters.push({
                    members: [item],
                    centroid: item.embeddingVector
                })
                assigned.add(item.id)
            }
        }

        // Filter clusters by minimum size
        return clusters.filter(c => c.members.length >= MIN_CLUSTER_SIZE)
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0

        let dotProduct = 0
        let normA = 0
        let normB = 0

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i]
            normA += a[i] * a[i]
            normB += b[i] * b[i]
        }

        normA = Math.sqrt(normA)
        normB = Math.sqrt(normB)

        if (normA === 0 || normB === 0) return 0
        return dotProduct / (normA * normB)
    }

    /**
     * Calculate centroid of cluster members
     */
    private updateCentroid(members: ContentWithEmbedding[]): number[] {
        if (members.length === 0) return []

        const dim = members[0].embeddingVector.length
        const centroid = new Array(dim).fill(0)

        for (const member of members) {
            for (let i = 0; i < dim; i++) {
                centroid[i] += member.embeddingVector[i]
            }
        }

        for (let i = 0; i < dim; i++) {
            centroid[i] /= members.length
        }

        return centroid
    }

    /**
     * Save or update a cluster in the database
     */
    private async saveCluster(
        candidate: ClusterCandidate
    ): Promise<{ created: boolean; membersAdded: number }> {
        // Check if similar cluster already exists - fetch all and filter in app
        const allClusters = await prisma.behaviorCluster.findMany({
            select: { id: true, centroidVector: true }
        })
        const existingClusters = allClusters.filter((c: typeof allClusters[0]) =>
            c.centroidVector !== null && Array.isArray(c.centroidVector)
        )

        let clusterId: string | null = null

        for (const existing of existingClusters) {
            const similarity = this.cosineSimilarity(
                candidate.centroid,
                existing.centroidVector as number[]
            )
            if (similarity >= 0.85) {
                // Update existing cluster
                clusterId = existing.id
                break
            }
        }

        // Calculate metrics
        const now = new Date()
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const last7dCount = candidate.members.filter(
            m => m.publishedAt >= sevenDaysAgo
        ).length

        const sourceBreakdown = this.calculateSourceBreakdown(candidate.members)

        if (clusterId) {
            // Update existing cluster
            await prisma.behaviorCluster.update({
                where: { id: clusterId },
                data: {
                    contentCountTotal: candidate.members.length,
                    contentCountLast7d: last7dCount,
                    sourceBreakdown,
                    centroidVector: candidate.centroid,
                    updatedAt: now
                }
            })
        } else {
            // Create new cluster with placeholder label
            const cluster = await prisma.behaviorCluster.create({
                data: {
                    label: 'Unlabeled Cluster',
                    summary: 'Pending analysis...',
                    topPhrases: [],
                    contentCountTotal: candidate.members.length,
                    contentCountLast7d: last7dCount,
                    sourceBreakdown,
                    centroidVector: candidate.centroid
                }
            })
            clusterId = cluster.id
        }

        // Add cluster memberships
        let membersAdded = 0
        for (const member of candidate.members) {
            const similarity = this.cosineSimilarity(member.embeddingVector, candidate.centroid)

            try {
                await prisma.clusterMembership.upsert({
                    where: {
                        clusterId_contentId: {
                            clusterId,
                            contentId: member.id
                        }
                    },
                    update: { similarityScore: similarity },
                    create: {
                        clusterId,
                        contentId: member.id,
                        similarityScore: similarity
                    }
                })
                membersAdded++
            } catch {
                // Skip duplicates
            }
        }

        return { created: !existingClusters.find((e: typeof existingClusters[0]) => e.id === clusterId), membersAdded }
    }

    /**
     * Calculate source platform breakdown
     */
    private calculateSourceBreakdown(
        members: ContentWithEmbedding[]
    ): Record<string, number> {
        const counts: Record<string, number> = {}

        for (const member of members) {
            counts[member.sourcePlatform] = (counts[member.sourcePlatform] || 0) + 1
        }

        const total = members.length
        const breakdown: Record<string, number> = {}

        for (const [platform, count] of Object.entries(counts)) {
            breakdown[platform] = Math.round((count / total) * 100) / 100
        }

        return breakdown
    }
}

/**
 * Run clustering as a standalone job
 */
export async function runClustering() {
    const service = new ClusteringService()
    return service.runClustering()
}
