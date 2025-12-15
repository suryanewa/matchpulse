// MatchPulse - TypeScript Type Definitions

// ============================================
// Content & Source Types
// ============================================

export interface ContentSource {
    id: string;
    name: string;
    type: 'video' | 'forum' | 'social';
    icon: string;
    color: string;
}

export interface ContentItem {
    id: string;
    sourceId: string;
    text: string;
    timestamp: Date;
    engagementMetrics: {
        likes?: number;
        comments?: number;
        shares?: number;
        views?: number;
    };
    url?: string;
    language: string;
}

// ============================================
// Trend / Behavior Types
// ============================================

export interface SparklineDataPoint {
    date: string;
    value: number;
}

export interface BehaviorTrend {
    id: string;
    title: string;
    description: string;
    createdAt?: Date | string;
    updatedAt: Date | string;

    // Metrics
    mentionCount: number;
    growthRate: number; // percentage change week-over-week
    sentimentScore?: number; // -1 to 1

    // Platform breakdown (flexible format for API compatibility)
    platformBreakdown?: {
        sourceId: string;
        percentage: number;
    }[];

    // Platform breakdown (alternative format from API)
    platforms?: {
        name: string;
        percentage: number;
        count: number;
    }[];

    // Sparkline data (last 30 days)
    sparklineData?: SparklineDataPoint[];

    // Associated keywords/phrases
    topPhrases: string[];

    // Representative content
    representativePosts?: {
        text: string;
        source: string;
        engagement: number;
    }[];

    // Representative quotes (alternative key)
    representativeQuotes?: string[];

    // Linked personas - can be persona IDs with confidence or just names
    linkedPersonas: {
        personaId: string;
        confidence: number; // 0 to 1
    }[] | string[];

    // Related opportunities
    relatedOpportunities?: string[];

    // Sentiment breakdown
    sentiment?: {
        positive: number;
        neutral: number;
        negative: number;
    };

    // Status
    isSaved?: boolean;
    savedToCollections?: string[];
}

// ============================================
// Persona Types
// ============================================

export interface Persona {
    id: string;
    name: string;
    tagline: string;
    description: string;

    // Visual
    emoji: string;
    color: string;
    gradient?: string;

    // Attributes
    motivations: string[];
    fears: string[];
    datingGoals: string[];

    // Behavioral patterns
    typicalBehaviors: string[];
    communicationStyle?: string;

    // Pain points
    painPoints: string[];

    // Top behaviors from API
    topBehaviors?: string[];

    // Representative quotes
    quotes?: {
        text: string;
        source: string;
    }[];

    // Stats
    linkedTrendCount: number;
    linkedOpportunityCount: number;
}

export interface PersonaClusterLink {
    personaId: string;
    clusterId: string;
    associationScore: number;
    reasoning?: string;
}

// ============================================
// Opportunity Types
// ============================================

export type OpportunityStatus = 'new' | 'reviewed' | 'in_discovery' | 'not_relevant';
export type OpportunitySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface OpportunityCard {
    id: string;
    title: string;

    // Problem definition
    problemStatement: string;
    signalsSummary?: string;
    whyNow: string;

    // Linked entities
    personaIds: string[];
    linkedTrendIds?: string[];
    clusterIds?: string[];

    // Evidence
    signals?: {
        mentionCount: number;
        growthPercentage: number;
        topPhrases: string[];
    };
    evidenceSnippets?: {
        text: string;
        source: string;
    }[];

    // Potential solutions
    potentialDirections?: string[];

    // Metadata
    severity: OpportunitySeverity;
    confidence: number; // 0 to 1
    status: OpportunityStatus;
    notes?: string;

    // Timestamps
    createdAt: Date | string;
    createdBy?: string;
    updatedAt?: Date | string;
    reviewedAt?: Date;
    reviewedBy?: string;
}

// ============================================
// Quiz Types
// ============================================

export interface QuizQuestion {
    id: string;
    order: number;
    text: string;
    subtext?: string;
    options: QuizOption[];
}

export interface QuizOption {
    id: string;
    text: string;
    // Score contribution to each persona (personaId -> score)
    scores: Record<string, number>;
}

export interface QuizResult {
    id: string;
    timestamp: Date;
    primaryPersonaId: string;
    secondaryPersonaId?: string;
    scores: Record<string, number>;
    answers: Record<string, string>; // questionId -> optionId
    metadata?: {
        referrer?: string;
        userAgent?: string;
    };
}

// ============================================
// Filter & Search Types
// ============================================

export type TimeFilter = '7d' | '30d' | '90d' | 'all';
export type SortOption = 'fastest_rising' | 'most_mentioned' | 'most_polarizing' | 'newest';

export interface DashboardFilters {
    timeFilter: TimeFilter;
    sortBy: SortOption;
    platforms: string[];
    personas: string[];
    searchQuery: string;
}
