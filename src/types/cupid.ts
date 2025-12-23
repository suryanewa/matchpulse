// ============================================
// MatchPulse Cupid - Type Definitions
// ============================================

// ============================================
// Preference Types
// ============================================

export type BudgetTier = 'free' | 'budget' | 'low-key' | 'standard' | 'premium' | 'treat-ourselves' | 'splurge';

export type VibeTag =
    | 'cozy'
    | 'adventurous'
    | 'artsy'
    | 'outdoorsy'
    | 'nerdy'
    | 'romantic'
    | 'active'
    | 'chill'
    | 'foodie'
    | 'nightlife';

export type CuisineType =
    | 'korean'
    | 'italian'
    | 'french'
    | 'japanese'
    | 'mexican'
    | 'indian'
    | 'thai'
    | 'american'
    | 'mediterranean'
    | 'chinese'
    | 'dessert'
    | 'coffee';

export type TimeWindow =
    | 'weeknight-evening'
    | 'saturday-afternoon'
    | 'saturday-evening'
    | 'sunday-brunch'
    | 'sunday-afternoon'
    | 'late-night';

export type DateCategory =
    | 'restaurant'
    | 'coffee'
    | 'dessert'
    | 'museum'
    | 'outdoors'
    | 'outdoor'
    | 'entertainment'
    | 'activity'
    | 'nightlife'
    | 'bar'
    | 'shopping'
    | 'wellness'
    | 'special';

export interface CupidPreferences {
    city: string;
    neighborhoods: string[];
    budgetTiers: BudgetTier[];
    vibes: VibeTag[];
    cuisines: CuisineType[];
    timeWindows: TimeWindow[];
}

// ============================================
// Couple Profile Types
// ============================================

export interface CoupleProfile {
    user1Preferences: CupidPreferences;
    user2Preferences: CupidPreferences;
    overlaps: {
        neighborhoods: string[];
        budgetTiers: BudgetTier[];
        vibes: VibeTag[];
        cuisines: CuisineType[];
        timeWindows: TimeWindow[];
    };
    stretchPicks: {
        fromUser1: VibeTag[];
        fromUser2: VibeTag[];
    };
}

// ============================================
// Date Suggestion Types
// ============================================

export interface DateSuggestion {
    id: string;
    title: string;
    description: string;
    category: DateCategory;
    neighborhood: string;
    estimatedCost: BudgetTier;
    vibes: VibeTag[];
    cuisines?: CuisineType[];
    timeWindows: TimeWindow[];
    whyItFits: string;
    imageUrl?: string;

    // Google Places fields
    photoUrl?: string | null;
    googlePlaceId?: string;
    rating?: number | null;
    openNow?: boolean | null;

    // User actions
    isSaved: boolean;
    isCompleted: boolean;
    notOurVibe: boolean;
}

// ============================================
// Date Logging Types
// ============================================

export type DateLogTag =
    | 'cozy'
    | 'chaotic'
    | 'romantic'
    | 'funny-fail'
    | 'deep-talk'
    | 'great-first-date-spot'
    | 'would-repeat'
    | 'spontaneous'
    | 'perfect-weather';

export interface DateLog {
    id: string;
    dateIdeaId: string;
    dateIdeaTitle: string;
    category: DateCategory;
    neighborhood: string;
    completedAt: Date;
    didGo: boolean;
    rating: 1 | 2 | 3 | 4 | 5;
    tags: DateLogTag[];
    note?: string;
    emoji?: string;
}

// ============================================
// Wrapped Types
// ============================================

export type CupidArchetype =
    | 'slow-burn-storytellers'
    | 'adventure-first-duo'
    | 'foodie-wanderers'
    | 'chaotic-romantics'
    | 'cozy-homebodies'
    | 'culture-vultures'
    | 'spontaneous-spirits';

export interface WrappedData {
    totalDatesCompleted: number;
    averageRating: number;
    bestDate: DateLog | null;
    topVibes: VibeTag[];
    mostVisitedNeighborhood: string;
    signatureActivity: DateCategory;
    archetype: CupidArchetype;
    archetypeDescription: string;

    // Stats for display
    stats: {
        totalHoursSpent: number;
        mostCommonTimeWindow: TimeWindow;
        cuisineVariety: number;
        neighborhoodCount: number;
    };
}

// ============================================
// Cupid State Types
// ============================================

export interface CupidState {
    isOnboarded: boolean;
    userPreferences: CupidPreferences | null;
    partnerPreferences: CupidPreferences | null;
    coupleProfile: CoupleProfile | null;
    savedDates: string[];
    completedDates: DateLog[];
    notOurVibeDates: string[];
    wrappedData: WrappedData | null;
    wrappedUnlocked: boolean;
}

export const WRAPPED_THRESHOLD = 10; // dates needed to unlock Wrapped
