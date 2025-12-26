// ============================================
// MatchPulse Cupid - Mock Data & Constants
// ============================================

import {
    CupidPreferences,
    DateSuggestion,
    CupidArchetype,
    VibeTag,
    DateLogTag,
    BudgetTier,
    TimeWindow,
    DateCategory
} from '@/types/cupid';

// ============================================
// Vibe Definitions
// ============================================

export const VIBE_DEFINITIONS: Record<VibeTag, { label: string; emoji: string; color: string }> = {
    'cozy': { label: 'Cozy', emoji: '🧸', color: 'from-amber-500 to-orange-500' },
    'adventurous': { label: 'Adventurous', emoji: '🏔️', color: 'from-emerald-500 to-teal-500' },
    'artsy': { label: 'Artsy', emoji: '🎨', color: 'from-purple-500 to-pink-500' },
    'outdoorsy': { label: 'Outdoorsy', emoji: '🌿', color: 'from-green-500 to-lime-500' },
    'nerdy': { label: 'Nerdy', emoji: '🎮', color: 'from-blue-500 to-indigo-500' },
    'romantic': { label: 'Romantic', emoji: '💕', color: 'from-pink-500 to-rose-500' },
    'active': { label: 'Active', emoji: '🏃', color: 'from-orange-500 to-red-500' },
    'chill': { label: 'Chill', emoji: '😌', color: 'from-cyan-500 to-blue-500' },
    'foodie': { label: 'Foodie', emoji: '🍜', color: 'from-yellow-500 to-orange-500' },
    'nightlife': { label: 'Nightlife', emoji: '🌙', color: 'from-violet-500 to-purple-500' },
};

export const BUDGET_DEFINITIONS: Record<BudgetTier, { label: string; emoji: string; range: string }> = {
    'free': { label: 'Free', emoji: '🆓', range: '$0' },
    'budget': { label: 'Budget', emoji: '💵', range: '$1-15' },
    'low-key': { label: 'Low-Key', emoji: '💚', range: '$15-30' },
    'standard': { label: 'Standard', emoji: '💛', range: '$30-75' },
    'premium': { label: 'Premium', emoji: '✨', range: '$75-150' },
    'treat-ourselves': { label: 'Treat Ourselves', emoji: '💎', range: '$150-250' },
    'splurge': { label: 'Splurge', emoji: '👑', range: '$250+' },
};

export const TIME_WINDOW_DEFINITIONS: Record<TimeWindow, { label: string; emoji: string }> = {
    'weeknight-evening': { label: 'Weeknight Evening', emoji: '🌆' },
    'saturday-afternoon': { label: 'Saturday Afternoon', emoji: '☀️' },
    'saturday-evening': { label: 'Saturday Evening', emoji: '🌃' },
    'sunday-brunch': { label: 'Sunday Brunch', emoji: '🥐' },
    'sunday-afternoon': { label: 'Sunday Afternoon', emoji: '🌤️' },
    'late-night': { label: 'Late Night', emoji: '🌙' },
};

export const DATE_LOG_TAG_DEFINITIONS: Record<DateLogTag, { label: string; emoji: string }> = {
    'cozy': { label: 'Cozy', emoji: '🧸' },
    'chaotic': { label: 'Chaotic', emoji: '🌪️' },
    'romantic': { label: 'Romantic', emoji: '💕' },
    'funny-fail': { label: 'Funny Fail', emoji: '😂' },
    'deep-talk': { label: 'Deep Talk', emoji: '💭' },
    'great-first-date-spot': { label: 'Great First Date Spot', emoji: '⭐' },
    'would-repeat': { label: 'Would Repeat', emoji: '🔁' },
    'spontaneous': { label: 'Spontaneous', emoji: '✨' },
    'perfect-weather': { label: 'Perfect Weather', emoji: '🌤️' },
};

// ============================================
// Archetype Definitions
// ============================================

export const ARCHETYPE_DEFINITIONS: Record<CupidArchetype, {
    label: string;
    emoji: string;
    description: string;
    gradient: string;
}> = {
    'slow-burn-storytellers': {
        label: 'Slow-Burn Storytellers',
        emoji: '📖',
        description: 'You take your time, savor the moments, and prioritize depth over frequency. Every date is a chapter worth remembering.',
        gradient: 'from-amber-500 via-orange-500 to-rose-500',
    },
    'adventure-first-duo': {
        label: 'Adventure-First Duo',
        emoji: '🧗',
        description: 'You seek thrills together and bond through experiences that get your hearts racing. Boring is never on your menu.',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    },
    'foodie-wanderers': {
        label: 'Foodie Wanderers',
        emoji: '🍜',
        description: 'Your love language is trying new restaurants. You explore the city one meal at a time and never say no to dessert.',
        gradient: 'from-yellow-500 via-orange-500 to-red-500',
    },
    'chaotic-romantics': {
        label: 'Chaotic Romantics',
        emoji: '💫',
        description: 'You embrace the unexpected and turn every "oops" into a story. Your dates may not go as planned, but they\'re never boring.',
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    },
    'cozy-homebodies': {
        label: 'Cozy Homebodies',
        emoji: '🏠',
        description: 'Your ideal dates involve blankets, good food, and quality time. You find magic in the simple moments together.',
        gradient: 'from-amber-400 via-orange-400 to-rose-400',
    },
    'culture-vultures': {
        label: 'Culture Vultures',
        emoji: '🎭',
        description: 'Museums, galleries, and shows are your playground. You bond over art, ideas, and the shared experience of learning together.',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    },
    'spontaneous-spirits': {
        label: 'Spontaneous Spirits',
        emoji: '🎲',
        description: 'Planning? What planning? You thrive on "let\'s go right now" energy and find joy in wherever the moment takes you.',
        gradient: 'from-cyan-500 via-blue-500 to-violet-500',
    },
};

// ============================================
// NYC Neighborhoods
// ============================================

export const NYC_NEIGHBORHOODS = [
    'East Village',
    'West Village',
    'Williamsburg',
    'SoHo',
    'Greenpoint',
    'Lower East Side',
    'Chelsea',
    'Bushwick',
    'Park Slope',
    'Dumbo',
    'Tribeca',
    'Nolita',
    'Astoria',
    'Upper West Side',
    'Hell\'s Kitchen',
];

// ============================================
// Curated Date Ideas (NYC)
// ============================================

export const DATE_IDEAS: Omit<DateSuggestion, 'isSaved' | 'isCompleted' | 'notOurVibe' | 'whyItFits'>[] = [
    // Coffee & Cozy
    {
        id: 'date-001',
        title: 'Cozy Corner at Devoción',
        description: 'Share pour-overs at this stunning greenhouse-style café in Williamsburg. Perfect for long conversations.',
        category: 'coffee',
        neighborhood: 'Williamsburg',
        estimatedCost: 'low-key',
        vibes: ['cozy', 'artsy', 'chill'],
        cuisines: ['coffee'],
        timeWindows: ['weeknight-evening', 'saturday-afternoon', 'sunday-brunch'],
    },
    {
        id: 'date-002',
        title: 'Literary Vibes at McNally Jackson',
        description: 'Browse books together then grab coffee at the in-store café. Bonus points for reading each other passages.',
        category: 'coffee',
        neighborhood: 'Nolita',
        estimatedCost: 'low-key',
        vibes: ['cozy', 'nerdy', 'romantic'],
        cuisines: ['coffee'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon', 'weeknight-evening'],
    },
    {
        id: 'date-003',
        title: 'Late Night at Café Reggio',
        description: 'NYC\'s oldest espresso bar. Romantic, historic, and open late. The ambiance is unmatched.',
        category: 'coffee',
        neighborhood: 'West Village',
        estimatedCost: 'low-key',
        vibes: ['romantic', 'cozy', 'chill'],
        cuisines: ['coffee'],
        timeWindows: ['late-night', 'weeknight-evening'],
    },

    // Restaurant Dates
    {
        id: 'date-004',
        title: 'Korean BBQ at Kang Ho Dong',
        description: 'Grill your own meat together—it\'s interactive, delicious, and gives you plenty to talk about.',
        category: 'restaurant',
        neighborhood: 'East Village',
        estimatedCost: 'standard',
        vibes: ['foodie', 'active', 'chill'],
        cuisines: ['korean'],
        timeWindows: ['weeknight-evening', 'saturday-evening'],
    },
    {
        id: 'date-005',
        title: 'Omakase Night at Sushi on Jones',
        description: 'Intimate counter seating, exceptional fish, and a ~45 minute experience perfect for a special night.',
        category: 'restaurant',
        neighborhood: 'West Village',
        estimatedCost: 'treat-ourselves',
        vibes: ['romantic', 'foodie'],
        cuisines: ['japanese'],
        timeWindows: ['saturday-evening', 'weeknight-evening'],
    },
    {
        id: 'date-006',
        title: 'Pasta Making at Via Carota',
        description: 'West Village Italian gem. Share truffle pasta and pretend you\'re in a rom-com.',
        category: 'restaurant',
        neighborhood: 'West Village',
        estimatedCost: 'treat-ourselves',
        vibes: ['romantic', 'foodie', 'cozy'],
        cuisines: ['italian'],
        timeWindows: ['saturday-evening', 'sunday-afternoon'],
    },
    {
        id: 'date-007',
        title: 'Tacos & Margs at Los Tacos No.1',
        description: 'Quick, cheap, and absolutely delicious. Perfect casual date or pre-activity fuel.',
        category: 'restaurant',
        neighborhood: 'Chelsea',
        estimatedCost: 'low-key',
        vibes: ['chill', 'foodie'],
        cuisines: ['mexican'],
        timeWindows: ['saturday-afternoon', 'weeknight-evening', 'sunday-afternoon'],
    },

    // Outdoors & Adventure
    {
        id: 'date-008',
        title: 'Sunset at Domino Park',
        description: 'Grab drinks, find a spot on the grass, and watch the sun set over the Manhattan skyline.',
        category: 'outdoors',
        neighborhood: 'Williamsburg',
        estimatedCost: 'low-key',
        vibes: ['romantic', 'chill', 'outdoorsy'],
        timeWindows: ['saturday-evening', 'weeknight-evening'],
    },
    {
        id: 'date-009',
        title: 'Bike the Hudson River Greenway',
        description: 'Rent Citi Bikes and ride from Tribeca to the Little Red Lighthouse. Pack snacks!',
        category: 'outdoors',
        neighborhood: 'Tribeca',
        estimatedCost: 'low-key',
        vibes: ['adventurous', 'active', 'outdoorsy'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },
    {
        id: 'date-010',
        title: 'Kayaking on the East River',
        description: 'Free weekend kayaking at Brooklyn Bridge Park. Adventure doesn\'t have to cost a thing.',
        category: 'activity',
        neighborhood: 'Dumbo',
        estimatedCost: 'low-key',
        vibes: ['adventurous', 'active', 'outdoorsy'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },
    {
        id: 'date-011',
        title: 'Prospect Park Picnic',
        description: 'Pack cheese, wine, and a blanket. Find a shady spot near the Long Meadow.',
        category: 'outdoors',
        neighborhood: 'Park Slope',
        estimatedCost: 'low-key',
        vibes: ['romantic', 'chill', 'outdoorsy', 'cozy'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },

    // Museum & Culture
    {
        id: 'date-012',
        title: 'Free Friday at MoMA',
        description: 'UNIQLO Free Fridays 4-8pm. Wander modern art and debate what it all means.',
        category: 'museum',
        neighborhood: 'Hell\'s Kitchen',
        estimatedCost: 'low-key',
        vibes: ['artsy', 'nerdy', 'chill'],
        timeWindows: ['weeknight-evening'],
    },
    {
        id: 'date-013',
        title: 'Explore the Met',
        description: 'Pick a random wing and get lost together. The rooftop bar has skyline views.',
        category: 'museum',
        neighborhood: 'Upper West Side',
        estimatedCost: 'standard',
        vibes: ['artsy', 'romantic', 'chill'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },
    {
        id: 'date-014',
        title: 'New Museum Night Adventure',
        description: 'Contemporary art that sparks conversation. Thursday nights have reduced admission.',
        category: 'museum',
        neighborhood: 'Lower East Side',
        estimatedCost: 'standard',
        vibes: ['artsy', 'nerdy', 'adventurous'],
        timeWindows: ['weeknight-evening', 'saturday-afternoon'],
    },

    // Entertainment & Activities
    {
        id: 'date-015',
        title: 'Comedy Cellar Show',
        description: 'The legendary club where legends started. Laughing together = instant bonding.',
        category: 'entertainment',
        neighborhood: 'West Village',
        estimatedCost: 'standard',
        vibes: ['nightlife', 'chill'],
        timeWindows: ['saturday-evening', 'late-night', 'weeknight-evening'],
    },
    {
        id: 'date-016',
        title: 'Vintage Arcade at Barcade',
        description: 'Retro games plus craft beer. Challenge each other to Pac-Man and see who buys the next round.',
        category: 'activity',
        neighborhood: 'Williamsburg',
        estimatedCost: 'standard',
        vibes: ['nerdy', 'chill', 'nightlife'],
        timeWindows: ['saturday-evening', 'late-night'],
    },
    {
        id: 'date-017',
        title: 'Bowling at Brooklyn Bowl',
        description: 'Live music + bowling + amazing food. The triple threat date spot.',
        category: 'activity',
        neighborhood: 'Williamsburg',
        estimatedCost: 'standard',
        vibes: ['active', 'chill', 'nightlife'],
        timeWindows: ['saturday-evening', 'late-night'],
    },
    {
        id: 'date-018',
        title: 'Jazz at Smalls',
        description: 'Intimate basement jazz club. Order drinks, sit close, and let the music do its thing.',
        category: 'entertainment',
        neighborhood: 'West Village',
        estimatedCost: 'standard',
        vibes: ['romantic', 'artsy', 'nightlife'],
        timeWindows: ['saturday-evening', 'late-night'],
    },

    // Dessert & Sweet Treats
    {
        id: 'date-019',
        title: 'Late Night Pie at Petee\'s',
        description: 'Some of NYC\'s best pie. Perfect for a sweet ending or a standalone dessert date.',
        category: 'dessert',
        neighborhood: 'Lower East Side',
        estimatedCost: 'low-key',
        vibes: ['cozy', 'romantic', 'foodie'],
        cuisines: ['dessert'],
        timeWindows: ['late-night', 'saturday-evening'],
    },
    {
        id: 'date-020',
        title: 'Ice Cream Flight at Oddfellows',
        description: 'Try weird and wonderful flavors together. Miso cherry? Olive oil? Yes please.',
        category: 'dessert',
        neighborhood: 'Williamsburg',
        estimatedCost: 'low-key',
        vibes: ['foodie', 'adventurous', 'chill'],
        cuisines: ['dessert'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon', 'saturday-evening'],
    },

    // Shopping & Markets
    {
        id: 'date-021',
        title: 'Smorgasburg Food Market',
        description: 'Williamsburg\'s famous outdoor food market. Share bites from 10 different vendors.',
        category: 'shopping',
        neighborhood: 'Williamsburg',
        estimatedCost: 'standard',
        vibes: ['foodie', 'outdoorsy', 'chill'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },
    {
        id: 'date-022',
        title: 'Brooklyn Flea Thrift Hunt',
        description: 'Vintage treasures await. Find matching items or pick gifts for each other.',
        category: 'shopping',
        neighborhood: 'Dumbo',
        estimatedCost: 'standard',
        vibes: ['artsy', 'adventurous', 'chill'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },

    // Nightlife
    {
        id: 'date-023',
        title: 'Speakeasy at Please Don\'t Tell',
        description: 'Enter through a phone booth in a hot dog shop. The cocktails are as legendary as the entrance.',
        category: 'nightlife',
        neighborhood: 'East Village',
        estimatedCost: 'treat-ourselves',
        vibes: ['romantic', 'nightlife', 'adventurous'],
        timeWindows: ['saturday-evening', 'late-night'],
    },
    {
        id: 'date-024',
        title: 'Rooftop Drinks at Westlight',
        description: '22nd floor views of Manhattan. Best at sunset for golden hour magic.',
        category: 'nightlife',
        neighborhood: 'Williamsburg',
        estimatedCost: 'treat-ourselves',
        vibes: ['romantic', 'nightlife'],
        timeWindows: ['saturday-evening', 'weeknight-evening'],
    },

    // Wellness
    {
        id: 'date-025',
        title: 'Korean Spa Day at Sojo',
        description: 'Jimjilbang vibes in NJ (worth the trip). Saunas, pools, and relaxation together.',
        category: 'wellness',
        neighborhood: 'Chelsea',
        estimatedCost: 'treat-ourselves',
        vibes: ['chill', 'romantic', 'cozy'],
        timeWindows: ['saturday-afternoon', 'sunday-afternoon'],
    },
];

// ============================================
// Simulated Partner Preferences (Legacy)
// ============================================

export const SIMULATED_PARTNER_PREFERENCES: CupidPreferences = {
    city: 'NYC',
    neighborhoods: ['Williamsburg', 'West Village', 'East Village', 'Dumbo'],
    budgetTiers: ['low-key', 'standard'],
    vibes: ['cozy', 'foodie', 'artsy', 'romantic'],
    cuisines: ['korean', 'italian', 'japanese', 'coffee', 'dessert'],
    timeWindows: ['saturday-afternoon', 'saturday-evening', 'sunday-brunch'],
};

// ============================================
// Matched Women Profiles
// ============================================

export interface MatchedWoman {
    id: string;
    name: string;
    age: number;
    photo: string;
    bio: string;
    preferences: CupidPreferences;
}

export const MATCHED_WOMEN: MatchedWoman[] = [
    {
        id: 'match-emma',
        name: 'Emma',
        age: 26,
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        bio: 'Coffee addict & museum wanderer. Always down for a cozy brunch spot.',
        preferences: {
            city: 'NYC',
            neighborhoods: ['West Village', 'SoHo', 'Tribeca', 'Nolita'],
            budgetTiers: ['standard', 'treat-ourselves'],
            vibes: ['cozy', 'artsy', 'romantic', 'foodie'],
            cuisines: ['italian', 'french', 'coffee', 'dessert'],
            timeWindows: ['sunday-brunch', 'saturday-afternoon', 'weeknight-evening'],
        },
    },
    {
        id: 'match-sophia',
        name: 'Sophia',
        age: 28,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        bio: 'Adventure seeker & rooftop enthusiast. Let\'s explore the city together!',
        preferences: {
            city: 'NYC',
            neighborhoods: ['Williamsburg', 'Dumbo', 'East Village', 'Greenpoint'],
            budgetTiers: ['low-key', 'standard', 'treat-ourselves'],
            vibes: ['adventurous', 'nightlife', 'outdoorsy', 'active'],
            cuisines: ['korean', 'japanese', 'thai', 'mexican'],
            timeWindows: ['saturday-evening', 'late-night', 'saturday-afternoon'],
        },
    },
    {
        id: 'match-olivia',
        name: 'Olivia',
        age: 25,
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        bio: 'Bookworm by day, jazz bar regular by night. Love a good speakeasy.',
        preferences: {
            city: 'NYC',
            neighborhoods: ['East Village', 'West Village', 'Lower East Side', 'Chelsea'],
            budgetTiers: ['budget', 'low-key', 'standard'],
            vibes: ['chill', 'nerdy', 'romantic', 'nightlife'],
            cuisines: ['coffee', 'japanese', 'american', 'dessert'],
            timeWindows: ['weeknight-evening', 'saturday-evening', 'late-night'],
        },
    },
    {
        id: 'match-ava',
        name: 'Ava',
        age: 27,
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
        bio: 'Yoga mornings & foodie nights. Find me at the farmer\'s market on Sundays.',
        preferences: {
            city: 'NYC',
            neighborhoods: ['Park Slope', 'Cobble Hill', 'Upper West Side', 'Astoria'],
            budgetTiers: ['low-key', 'standard'],
            vibes: ['outdoorsy', 'foodie', 'chill', 'cozy'],
            cuisines: ['mediterranean', 'indian', 'thai', 'coffee'],
            timeWindows: ['sunday-brunch', 'sunday-afternoon', 'saturday-afternoon'],
        },
    },
    {
        id: 'match-mia',
        name: 'Mia',
        age: 24,
        photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
        bio: 'Art gallery hopper & cocktail connoisseur. Always planning the next adventure.',
        preferences: {
            city: 'NYC',
            neighborhoods: ['Chelsea', 'Hell\'s Kitchen', 'Tribeca', 'SoHo'],
            budgetTiers: ['standard', 'treat-ourselves', 'splurge'],
            vibes: ['artsy', 'adventurous', 'nightlife', 'romantic'],
            cuisines: ['french', 'italian', 'japanese', 'chinese'],
            timeWindows: ['saturday-evening', 'weeknight-evening', 'late-night'],
        },
    },
    {
        id: 'match-luna',
        name: 'Luna',
        age: 26,
        photo: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop',
        bio: 'Tech nerd by day, karaoke queen by night. Big fan of ramen and retro arcades.',
        preferences: {
            city: 'NYC',
            neighborhoods: ['East Village', 'Lower East Side', 'Williamsburg', 'Bushwick'],
            budgetTiers: ['budget', 'low-key', 'standard'],
            vibes: ['nerdy', 'nightlife', 'adventurous', 'chill'],
            cuisines: ['japanese', 'korean', 'thai', 'american'],
            timeWindows: ['late-night', 'saturday-evening', 'weeknight-evening'],
        },
    },
];

// ============================================
// Helper Functions
// ============================================

export function calculateOverlap<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter(item => arr2.includes(item));
}

export function calculateOverlapScore(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    const overlap = calculateOverlap(arr1, arr2);
    const union = Array.from(new Set([...arr1, ...arr2]));
    return union.length > 0 ? overlap.length / union.length : 0;
}

export function getVibeEmoji(vibe: VibeTag): string {
    return VIBE_DEFINITIONS[vibe]?.emoji || '✨';
}

export function getBudgetLabel(budget: BudgetTier): string {
    return BUDGET_DEFINITIONS[budget]?.label || budget;
}

export function getTimeWindowLabel(tw: TimeWindow): string {
    return TIME_WINDOW_DEFINITIONS[tw]?.label || tw;
}
