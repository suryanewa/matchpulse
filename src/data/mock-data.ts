import {
    ContentSource,
    Persona,
    BehaviorTrend,
    OpportunityCard,
    QuizQuestion
} from '@/types'

// ============================================
// Content Sources
// ============================================

export const contentSources: ContentSource[] = [
    {
        id: 'tiktok',
        name: 'TikTok',
        type: 'video',
        icon: '🎵',
        color: '#00f2ea',
    },
    {
        id: 'reddit',
        name: 'Reddit',
        type: 'forum',
        icon: '🤖',
        color: '#ff4500',
    },
    {
        id: 'twitter',
        name: 'X/Twitter',
        type: 'social',
        icon: '𝕏',
        color: '#1da1f2',
    },
]

// ============================================
// Personas
// ============================================

export const personas: Persona[] = [
    {
        id: 'overthinker',
        name: 'The Overthinker',
        tagline: 'Analyzes every text, double-checks every move',
        description: 'The Overthinker approaches dating like a chess match. Every message is carefully crafted, every response is analyzed for hidden meaning. They spend more time thinking about what to say than actually saying it.',
        emoji: '🧠',
        color: '#8b5cf6',
        gradient: 'from-violet-500 to-purple-600',
        motivations: [
            'Finding genuine connection',
            'Avoiding rejection and embarrassment',
            'Understanding their match deeply',
        ],
        fears: [
            'Saying the wrong thing',
            'Being ghosted without explanation',
            'Moving too fast or too slow',
        ],
        datingGoals: [
            'Build emotional intimacy before physical',
            'Find someone patient and understanding',
            'Take things at a comfortable pace',
        ],
        typicalBehaviors: [
            'Drafts messages in notes app first',
            'Screenshots conversations for friend analysis',
            'Researches matches extensively',
            'Delays responses to seem less eager',
        ],
        communicationStyle: 'Thoughtful, sometimes delayed, wants meaningful conversations over small talk',
        painPoints: [
            'Texting anxiety',
            'Fear of coming on too strong',
            'Analysis paralysis on when to meet',
            'Ghosting triggers spiraling thoughts',
        ],
        quotes: [
            { text: 'I literally rewrite my texts 5 times before sending and still cringe', source: 'TikTok' },
            { text: 'Does "haha" mean they\'re bored? Should I have said something funnier?', source: 'Reddit' },
        ],
        linkedTrendCount: 8,
        linkedOpportunityCount: 5,
    },
    {
        id: 'slow-burner',
        name: 'The Slow Burner',
        tagline: 'Patience is a virtue, especially in love',
        description: 'The Slow Burner believes real connections take time. They prefer phone calls over texting, long dates over quick coffee meetups, and genuine getting-to-know-you phases over instant chemistry.',
        emoji: '🕯️',
        color: '#f59e0b',
        gradient: 'from-amber-500 to-orange-600',
        motivations: [
            'Building lasting relationships',
            'Finding depth over excitement',
            'Creating genuine emotional bonds',
        ],
        fears: [
            'Rushing into something wrong',
            'Superficial connections',
            'Being pressured to commit too fast',
        ],
        datingGoals: [
            'Develop friendship first',
            'Multiple dates before labels',
            'Natural progression of intimacy',
        ],
        typicalBehaviors: [
            'Prefers phone/video calls',
            'Suggests activity dates over drinks',
            'Takes weeks to define the relationship',
            'Values consistency over grand gestures',
        ],
        communicationStyle: 'Steady, prefers voice over text, values quality over quantity of interaction',
        painPoints: [
            'Pressure to DTR too quickly',
            'Matching with impatient people',
            'App fatigue from swiping culture',
            'Feeling "too slow" for modern dating',
        ],
        quotes: [
            { text: 'I need at least 3 dates before I know if I even like someone', source: 'Reddit' },
            { text: 'Everyone wants to be exclusive after one week, like slow down??', source: 'TikTok' },
        ],
        linkedTrendCount: 6,
        linkedOpportunityCount: 4,
    },
    {
        id: 'chaos-creative',
        name: 'The Chaos Creative',
        tagline: 'Life\'s too short for boring dates',
        description: 'The Chaos Creative thrives on spontaneity and novelty. They suggest unconventional dates, send voice notes at 2am, and believe that the best connections happen when you break the rules.',
        emoji: '🌪️',
        color: '#ec4899',
        gradient: 'from-pink-500 to-rose-600',
        motivations: [
            'Excitement and novelty',
            'Authentic, unfiltered connections',
            'Breaking out of dating app monotony',
        ],
        fears: [
            'Boring, predictable relationships',
            'Being seen as "too much"',
            'Settling for less than fireworks',
        ],
        datingGoals: [
            'Find someone who matches their energy',
            'Have adventures together',
            'Keep the spark alive long-term',
        ],
        typicalBehaviors: [
            'Proposes unusual first date ideas',
            'Heavy use of voice notes and videos',
            'Impulsive "are you free right now?" messages',
            'Bold, flirty openers',
        ],
        communicationStyle: 'High energy, multimedia-heavy, loves banter and doesn\'t wait for "the right time"',
        painPoints: [
            'Matching with people who are "too serious"',
            'Being misread as not relationship material',
            'Finding others who can keep up',
            'Burnout from always initiating fun',
        ],
        quotes: [
            { text: 'My ideal first date is breaking into an abandoned building at midnight', source: 'TikTok' },
            { text: 'If your opener is "hey" I\'m already asleep', source: 'Twitter' },
        ],
        linkedTrendCount: 7,
        linkedOpportunityCount: 3,
    },
    {
        id: 'energy-extrovert',
        name: 'The Energy Extrovert',
        tagline: 'Dating is a social sport',
        description: 'The Energy Extrovert brings friends into everything. Double dates, group hangs, meeting the squad early – they believe your partner should mesh with your world, not exist separately from it.',
        emoji: '⚡',
        color: '#06b6d4',
        gradient: 'from-cyan-500 to-teal-600',
        motivations: [
            'Finding someone who fits their social life',
            'Getting friend validation',
            'Building a shared friend group',
        ],
        fears: [
            'Partner who isolates them',
            'Awkward friend introductions',
            'Having to choose between partner and friends',
        ],
        datingGoals: [
            'Integrate partner into friend group',
            'Active social life as a couple',
            'Adventures with a team',
        ],
        typicalBehaviors: [
            'Suggests group dates early',
            'Talks about their friends constantly',
            'Active on social/dating simultaneously',
            'Soft-launches relationships quickly',
        ],
        communicationStyle: 'Gregarious, references friend opinions, prefers public social spaces',
        painPoints: [
            'Matches who don\'t want to meet friends',
            'Finding group-friendly date ideas',
            'Balancing 1:1 time with social time',
            'Friends not approving of matches',
        ],
        quotes: [
            { text: 'If my friends don\'t like you, it\'s not gonna work. Sorry not sorry.', source: 'TikTok' },
            { text: 'Group dates take the pressure off AND I get real vibes', source: 'Reddit' },
        ],
        linkedTrendCount: 5,
        linkedOpportunityCount: 4,
    },
    {
        id: 'hopeful-romantic',
        name: 'The Hopeful Romantic',
        tagline: 'Still believes in love stories',
        description: 'The Hopeful Romantic is keeping the dream alive despite dating app fatigue. They love grand gestures, believe in "when you know, you know," and are looking for their person amidst the chaos.',
        emoji: '💕',
        color: '#f43f5e',
        gradient: 'from-rose-500 to-pink-600',
        motivations: [
            'Finding "the one"',
            'Experiencing movie-worthy moments',
            'Deep emotional connection',
        ],
        fears: [
            'Becoming cynical',
            'Never finding real love',
            'Casual culture ruining romance',
        ],
        datingGoals: [
            'Committed, loving relationship',
            'Traditional milestones (eventually)',
            'Someone who believes in love too',
        ],
        typicalBehaviors: [
            'Creates date playlists',
            'Remembers small details',
            'Plans thoughtful gestures',
            'Gets invested quickly',
        ],
        communicationStyle: 'Warm, expressive, asks deep questions early, uses lots of emojis',
        painPoints: [
            'Situationships and ambiguity',
            'Casual dating culture',
            'Feeling naive for wanting romance',
            'Getting hurt by people "not looking for anything serious"',
        ],
        quotes: [
            { text: 'I know situationships are trendy but I need LABELS and COMMITMENT', source: 'TikTok' },
            { text: 'Am I delusional for still believing in soulmates? Asking for myself.', source: 'Reddit' },
        ],
        linkedTrendCount: 9,
        linkedOpportunityCount: 6,
    },
    {
        id: 'practical-matcher',
        name: 'The Practical Matcher',
        tagline: 'Efficient dating for busy lives',
        description: 'The Practical Matcher treats dating like a well-optimized process. They have clear criteria, don\'t waste time on dead-ends, and believe compatibility can be assessed relatively quickly.',
        emoji: '📊',
        color: '#10b981',
        gradient: 'from-emerald-500 to-green-600',
        motivations: [
            'Finding a compatible partner efficiently',
            'Not wasting time on wrong matches',
            'Clear communication and expectations',
        ],
        fears: [
            'Wasting months on incompatible people',
            'Unclear intentions from matches',
            'Emotional manipulation',
        ],
        datingGoals: [
            'Find someone with aligned life goals',
            'Skip the games, get to real compatibility',
            'Build a partnership that works',
        ],
        typicalBehaviors: [
            'Asks important questions early',
            'Has clear dealbreakers',
            'Efficient at filtering matches',
            'Prefers quick first meets to assess chemistry',
        ],
        communicationStyle: 'Direct, efficient, values clarity, asks about intentions early',
        painPoints: [
            'People who play games',
            'Unclear profile bios',
            'Wasting time on small talk',
            'Being seen as "too intense" for being direct',
        ],
        quotes: [
            { text: 'I ask about dealbreakers on date 1. Life is too short for surprises at month 6.', source: 'Reddit' },
            { text: 'My dating app bio is basically a job listing and I\'m not sorry', source: 'TikTok' },
        ],
        linkedTrendCount: 4,
        linkedOpportunityCount: 3,
    },
]

// ============================================
// Helper: Generate sparkline data
// ============================================

function generateSparkline(baseValue: number, trend: 'up' | 'down' | 'stable', days: number = 30) {
    const data = []
    let value = baseValue

    for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        const randomFactor = Math.random() * 0.3 - 0.15
        const trendFactor = trend === 'up' ? 0.03 : trend === 'down' ? -0.02 : 0
        value = Math.max(0, value * (1 + trendFactor + randomFactor))

        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(value),
        })
    }

    return data
}

// ============================================
// Behavior Trends
// ============================================

export const behaviorTrends: BehaviorTrend[] = [
    {
        id: 'soft-launching',
        title: 'Soft-Launching Relationships',
        description: 'The art of hinting at a new relationship on social media without full confirmation. Cropped photos, hand-holding shots, mysterious captions.',
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-12-10'),
        mentionCount: 48200,
        growthRate: 127,
        sentimentScore: 0.3,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 62 },
            { sourceId: 'reddit', percentage: 25 },
            { sourceId: 'twitter', percentage: 13 },
        ],
        sparklineData: generateSparkline(800, 'up'),
        topPhrases: ['soft launch', 'hard launch', 'instagram official', 'cropped photo', 'mystery hand'],
        representativePosts: [
            { text: 'POV: you\'re deciding which body part to include in your soft launch', source: 'TikTok', engagement: 2400000 },
            { text: 'the anxiety of deciding when to go from soft to hard launch is unreal', source: 'Reddit', engagement: 3200 },
            { text: 'my soft launch was so subtle no one noticed 😭', source: 'Twitter', engagement: 45000 },
        ],
        linkedPersonas: [
            { personaId: 'energy-extrovert', confidence: 0.89 },
            { personaId: 'overthinker', confidence: 0.72 },
            { personaId: 'hopeful-romantic', confidence: 0.58 },
        ],
        isSaved: false,
    },
    {
        id: 'texting-anxiety',
        title: 'Texting Anxiety & Response Time Panic',
        description: 'The overwhelming stress around when to reply, what to say, and analyzing every aspect of digital communication in dating.',
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-12-11'),
        mentionCount: 156800,
        growthRate: 89,
        sentimentScore: -0.4,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 51 },
            { sourceId: 'reddit', percentage: 38 },
            { sourceId: 'twitter', percentage: 11 },
        ],
        sparklineData: generateSparkline(2500, 'up'),
        topPhrases: ['double text', 'left on read', 'typing indicator', 'response time', 'seen no reply'],
        representativePosts: [
            { text: 'the typing bubble appearing and disappearing is my villain origin story', source: 'TikTok', engagement: 5800000 },
            { text: 'I set timers to not reply too fast. We\'re all insane.', source: 'Reddit', engagement: 8900 },
            { text: 'being left on read for 4 hours should be a felony', source: 'Twitter', engagement: 127000 },
        ],
        linkedPersonas: [
            { personaId: 'overthinker', confidence: 0.96 },
            { personaId: 'hopeful-romantic', confidence: 0.71 },
            { personaId: 'chaos-creative', confidence: 0.32 },
        ],
        isSaved: true,
    },
    {
        id: 'situationship-culture',
        title: 'Situationship Fatigue',
        description: 'Growing exhaustion with undefined, label-less relationships. Users expressing frustration with ambiguity and seeking clearer intentions.',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-12-09'),
        mentionCount: 234500,
        growthRate: 156,
        sentimentScore: -0.6,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 58 },
            { sourceId: 'reddit', percentage: 32 },
            { sourceId: 'twitter', percentage: 10 },
        ],
        sparklineData: generateSparkline(4000, 'up'),
        topPhrases: ['situationship', 'define the relationship', 'what are we', 'no labels', 'almost relationship'],
        representativePosts: [
            { text: 'I\'m retiring from situationships effective immediately', source: 'TikTok', engagement: 12400000 },
            { text: 'How do I escape a situationship when they won\'t have "the talk"', source: 'Reddit', engagement: 4200 },
            { text: 'gen z invented situationships and now we\'re all in therapy for it', source: 'Twitter', engagement: 89000 },
        ],
        linkedPersonas: [
            { personaId: 'hopeful-romantic', confidence: 0.92 },
            { personaId: 'practical-matcher', confidence: 0.78 },
            { personaId: 'slow-burner', confidence: 0.65 },
        ],
        isSaved: true,
    },
    {
        id: 'delulu-mindset',
        title: 'The "Delulu" Dating Mindset',
        description: 'Embracing delusional optimism in dating. Users manifesting relationships, seeing signs everywhere, and leaning into hopeful thinking.',
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date('2024-12-08'),
        mentionCount: 89400,
        growthRate: 203,
        sentimentScore: 0.5,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 78 },
            { sourceId: 'reddit', percentage: 12 },
            { sourceId: 'twitter', percentage: 10 },
        ],
        sparklineData: generateSparkline(1200, 'up'),
        topPhrases: ['delulu', 'manifest', 'he\'s my boyfriend he just doesn\'t know yet', 'signs from the universe', 'speaking it into existence'],
        representativePosts: [
            { text: 'delulu is the solulu (delusional is the solution)', source: 'TikTok', engagement: 8900000 },
            { text: 'Is being delulu actually... working? I\'m confused and in love', source: 'Reddit', engagement: 2100 },
            { text: 'manifested my crush texting me and it WORKED stay delulu besties', source: 'Twitter', engagement: 67000 },
        ],
        linkedPersonas: [
            { personaId: 'hopeful-romantic', confidence: 0.88 },
            { personaId: 'chaos-creative', confidence: 0.75 },
            { personaId: 'energy-extrovert', confidence: 0.42 },
        ],
        isSaved: false,
    },
    {
        id: 'ick-culture',
        title: 'The Rise of the "Ick"',
        description: 'Sudden, irrational turn-offs that kill attraction instantly. Users sharing increasingly absurd icks and debating their validity.',
        createdAt: new Date('2024-07-20'),
        updatedAt: new Date('2024-12-10'),
        mentionCount: 178300,
        growthRate: 67,
        sentimentScore: -0.1,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 72 },
            { sourceId: 'reddit', percentage: 18 },
            { sourceId: 'twitter', percentage: 10 },
        ],
        sparklineData: generateSparkline(3200, 'up'),
        topPhrases: ['got the ick', 'ick list', 'instant ick', 'can\'t unsee', 'deal breaker'],
        representativePosts: [
            { text: 'my ick is when they run to catch the train. Idk why.', source: 'TikTok', engagement: 4200000 },
            { text: 'Are icks just avoidant attachment in disguise? Discuss.', source: 'Reddit', engagement: 5600 },
            { text: 'got the ick because he said "yummy" while eating', source: 'Twitter', engagement: 234000 },
        ],
        linkedPersonas: [
            { personaId: 'overthinker', confidence: 0.69 },
            { personaId: 'chaos-creative', confidence: 0.61 },
            { personaId: 'practical-matcher', confidence: 0.45 },
        ],
        isSaved: false,
    },
    {
        id: 'date-draining',
        title: 'Dating App Burnout',
        description: 'Exhaustion from endless swiping, conversations that go nowhere, and the emotional toll of modern app-based dating.',
        createdAt: new Date('2024-05-15'),
        updatedAt: new Date('2024-12-11'),
        mentionCount: 312000,
        growthRate: 45,
        sentimentScore: -0.7,
        platformBreakdown: [
            { sourceId: 'reddit', percentage: 52 },
            { sourceId: 'tiktok', percentage: 35 },
            { sourceId: 'twitter', percentage: 13 },
        ],
        sparklineData: generateSparkline(5500, 'stable'),
        topPhrases: ['app fatigue', 'deleting the apps', 'taking a break', 'swipe fatigue', 'talking stage exhaustion'],
        representativePosts: [
            { text: 'I\'ve been on 47 first dates this year and have nothing to show for it', source: 'Reddit', engagement: 12400 },
            { text: 'deleting hinge for my mental health (again)', source: 'TikTok', engagement: 890000 },
            { text: 'the apps have broken my brain and my will to live', source: 'Twitter', engagement: 156000 },
        ],
        linkedPersonas: [
            { personaId: 'slow-burner', confidence: 0.84 },
            { personaId: 'hopeful-romantic', confidence: 0.79 },
            { personaId: 'practical-matcher', confidence: 0.72 },
        ],
        isSaved: true,
    },
    {
        id: 'roster-dating',
        title: 'Roster Culture & Multi-Dating',
        description: 'Dating multiple people simultaneously until exclusivity is defined. Debate around ethics, jealousy, and modern dating norms.',
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-12-07'),
        mentionCount: 67800,
        growthRate: 112,
        sentimentScore: 0.1,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 65 },
            { sourceId: 'reddit', percentage: 28 },
            { sourceId: 'twitter', percentage: 7 },
        ],
        sparklineData: generateSparkline(1100, 'up'),
        topPhrases: ['roster', 'rotation', 'multi-dating', 'not exclusive yet', 'keeping options open'],
        representativePosts: [
            { text: 'normalize having a roster until someone earns exclusivity', source: 'TikTok', engagement: 3400000 },
            { text: 'Am I wrong for feeling hurt that he\'s seeing others? We never had "the talk"', source: 'Reddit', engagement: 890 },
            { text: 'my roster is 4 deep and I still feel single', source: 'Twitter', engagement: 45000 },
        ],
        linkedPersonas: [
            { personaId: 'practical-matcher', confidence: 0.76 },
            { personaId: 'chaos-creative', confidence: 0.68 },
            { personaId: 'energy-extrovert', confidence: 0.52 },
        ],
        isSaved: false,
    },
    {
        id: 'sneaky-link',
        title: 'Sneaky Link Culture',
        description: 'Casual, secretive hookups kept hidden from social circles. Discussion around validation, shame, and modern intimacy norms.',
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2024-12-05'),
        mentionCount: 145200,
        growthRate: 23,
        sentimentScore: -0.2,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 71 },
            { sourceId: 'twitter', percentage: 19 },
            { sourceId: 'reddit', percentage: 10 },
        ],
        sparklineData: generateSparkline(2800, 'stable'),
        topPhrases: ['sneaky link', 'late night text', 'no strings', 'keep it quiet', 'situationship vibes'],
        representativePosts: [
            { text: 'sneaky link upgraded to potential boyfriend?? growth', source: 'TikTok', engagement: 2100000 },
            { text: 'I want to be someone\'s priority, not their sneaky link at 2am', source: 'Reddit', engagement: 3400 },
            { text: 'the sneaky link to serious pipeline is REAL', source: 'Twitter', engagement: 78000 },
        ],
        linkedPersonas: [
            { personaId: 'chaos-creative', confidence: 0.82 },
            { personaId: 'energy-extrovert', confidence: 0.45 },
            { personaId: 'hopeful-romantic', confidence: 0.28 },
        ],
        isSaved: false,
    },
    {
        id: 'green-flags',
        title: 'Green Flag Obsession',
        description: 'Focusing on positive relationship indicators rather than just avoiding red flags. Sharing examples of healthy relationship signs.',
        createdAt: new Date('2024-09-25'),
        updatedAt: new Date('2024-12-09'),
        mentionCount: 93600,
        growthRate: 178,
        sentimentScore: 0.8,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 55 },
            { sourceId: 'reddit', percentage: 32 },
            { sourceId: 'twitter', percentage: 13 },
        ],
        sparklineData: generateSparkline(1500, 'up'),
        topPhrases: ['green flag', 'healthy communication', 'bare minimum or green flag?', 'actually a good sign', 'relationship goals'],
        representativePosts: [
            { text: 'him apologizing AND changing behavior is the biggest green flag', source: 'TikTok', engagement: 5600000 },
            { text: 'We need to stop calling the bare minimum a green flag', source: 'Reddit', engagement: 7800 },
            { text: 'green flag: he makes plans and actually follows through', source: 'Twitter', engagement: 112000 },
        ],
        linkedPersonas: [
            { personaId: 'hopeful-romantic', confidence: 0.91 },
            { personaId: 'practical-matcher', confidence: 0.85 },
            { personaId: 'slow-burner', confidence: 0.78 },
        ],
        isSaved: false,
    },
    {
        id: 'talking-stage',
        title: 'Endless Talking Stage',
        description: 'The frustration of being stuck in perpetual "getting to know you" phase without progression. Desire for clearer escalation paths.',
        createdAt: new Date('2024-07-10'),
        updatedAt: new Date('2024-12-08'),
        mentionCount: 189400,
        growthRate: 34,
        sentimentScore: -0.5,
        platformBreakdown: [
            { sourceId: 'tiktok', percentage: 48 },
            { sourceId: 'reddit', percentage: 42 },
            { sourceId: 'twitter', percentage: 10 },
        ],
        sparklineData: generateSparkline(3200, 'stable'),
        topPhrases: ['talking stage', 'just talking', 'more than friends less than dating', 'going nowhere', 'stale conversation'],
        representativePosts: [
            { text: 'we\'ve been in the talking stage for 3 months. Are we just penpals?', source: 'TikTok', engagement: 1800000 },
            { text: 'How do you escape the talking stage without scaring them off?', source: 'Reddit', engagement: 4500 },
            { text: 'the talking stage should have a 2 week expiration date', source: 'Twitter', engagement: 89000 },
        ],
        linkedPersonas: [
            { personaId: 'practical-matcher', confidence: 0.88 },
            { personaId: 'slow-burner', confidence: 0.71 },
            { personaId: 'hopeful-romantic', confidence: 0.65 },
        ],
        isSaved: false,
    },
    {
        id: 'sober-dating',
        title: 'Sober Dating Movement',
        description: 'Growing trend of alcohol-free dates. Users seeking authentic connections, prioritizing clarity and genuine chemistry over liquid courage.',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-12-10'),
        mentionCount: 41200,
        growthRate: 234,
        sentimentScore: 0.7,
        platformBreakdown: [
            { sourceId: 'reddit', percentage: 48 },
            { sourceId: 'tiktok', percentage: 40 },
            { sourceId: 'twitter', percentage: 12 },
        ],
        sparklineData: generateSparkline(600, 'up'),
        topPhrases: ['sober date', 'dry dating', 'no alcohol', 'coffee date', 'clear headed connection'],
        representativePosts: [
            { text: 'tried my first sober date and actually remembered the whole conversation', source: 'TikTok', engagement: 780000 },
            { text: 'Sober dating changed my life. I actually know if I like them now.', source: 'Reddit', engagement: 2300 },
            { text: 'hot take: if you need alcohol to have chemistry, there\'s no chemistry', source: 'Twitter', engagement: 156000 },
        ],
        linkedPersonas: [
            { personaId: 'slow-burner', confidence: 0.89 },
            { personaId: 'practical-matcher', confidence: 0.82 },
            { personaId: 'hopeful-romantic', confidence: 0.61 },
        ],
        isSaved: false,
    },
    {
        id: 'ghosting-closure',
        title: 'Anti-Ghosting & Closure Seeking',
        description: 'Pushback against ghosting culture. Users demanding explanations, sending closure texts, and advocating for basic communication.',
        createdAt: new Date('2024-06-15'),
        updatedAt: new Date('2024-12-11'),
        mentionCount: 267800,
        growthRate: 56,
        sentimentScore: -0.3,
        platformBreakdown: [
            { sourceId: 'reddit', percentage: 45 },
            { sourceId: 'tiktok', percentage: 42 },
            { sourceId: 'twitter', percentage: 13 },
        ],
        sparklineData: generateSparkline(4500, 'up'),
        topPhrases: ['ghosting', 'closure text', 'just say you\'re not interested', 'zombie-ing', 'orbiting'],
        representativePosts: [
            { text: 'sent my ghost a "I deserved a goodbye" text and honestly? Closure achieved.', source: 'TikTok', engagement: 3400000 },
            { text: 'It takes 10 seconds to say "I\'m not feeling it." Why is everyone ghosting?', source: 'Reddit', engagement: 6700 },
            { text: 'normalize rejection texts over ghosting challenge', source: 'Twitter', engagement: 234000 },
        ],
        linkedPersonas: [
            { personaId: 'overthinker', confidence: 0.93 },
            { personaId: 'hopeful-romantic', confidence: 0.86 },
            { personaId: 'slow-burner', confidence: 0.72 },
        ],
        isSaved: true,
    },
]

// ============================================
// Opportunity Cards
// ============================================

export const opportunityCards: OpportunityCard[] = [
    {
        id: 'opp-texting-scaffolding',
        title: 'Guided Conversation Scaffolding for Anxious Texters',
        problemStatement: 'Overthinkers spend excessive time crafting messages and experience anxiety around response times. This leads to delayed conversations, missed connections, and app abandonment.',
        whyNow: 'Texting anxiety mentions up 89% this quarter. Users explicitly asking for help navigating digital communication in dating contexts.',
        personaIds: ['overthinker', 'hopeful-romantic'],
        clusterIds: ['texting-anxiety', 'talking-stage'],
        signals: {
            mentionCount: 156800,
            growthPercentage: 89,
            topPhrases: ['typing indicator panic', 'when should I reply', 'overthinking texts'],
        },
        evidenceSnippets: [
            { text: 'I wish there was a feature that helped me know when to text without looking desperate', source: 'Reddit' },
            { text: 'someone needs to make a dating app for people with texting anxiety', source: 'TikTok' },
        ],
        potentialDirections: [
            'Prompt packs with pre-written conversation starters based on profile context',
            'Gentle nudges when conversations go stale, with suggested re-engagement messages',
            'Response time insights showing average reply times to normalize wait periods',
            '"Slow mode" messaging option that sets expectations for both parties',
        ],
        severity: 'high',
        confidence: 0.87,
        status: 'new',
        notes: '',
        createdAt: new Date('2024-12-01'),
        createdBy: 'AI Generated',
    },
    {
        id: 'opp-relationship-clarity',
        title: 'Relationship Definition Tools & Milestone Tracking',
        problemStatement: 'Users are frustrated with ambiguous situationships and endless talking stages. They want clarity on where things stand but fear having awkward "what are we" conversations.',
        whyNow: 'Situationship fatigue up 156%. Green flag/healthy relationship content simultaneously surging – users want the good stuff but don\'t know how to get there.',
        personaIds: ['hopeful-romantic', 'practical-matcher', 'slow-burner'],
        clusterIds: ['situationship-culture', 'talking-stage', 'green-flags'],
        signals: {
            mentionCount: 234500,
            growthPercentage: 156,
            topPhrases: ['what are we', 'DTR', 'define the relationship', 'labels'],
        },
        evidenceSnippets: [
            { text: 'Why isn\'t there a button to just ASK where this is going without making it weird?', source: 'TikTok' },
            { text: 'Dating apps should have milestone tracking so we\'re on the same page', source: 'Reddit' },
        ],
        potentialDirections: [
            'Mutual "milestone check-ins" where both parties indicate readiness for next steps',
            'Relationship intent badges or filters ("Looking for commitment" with verification)',
            'Gentle in-app prompts after X dates suggesting relationship conversations',
            'Template "DTR" conversation guides',
        ],
        severity: 'critical',
        confidence: 0.91,
        status: 'reviewed',
        notes: 'This aligns with Q1 focus on relationship progression features. Schedule for discovery sprint.',
        createdAt: new Date('2024-11-15'),
        createdBy: 'AI Generated',
        reviewedAt: new Date('2024-11-20'),
        reviewedBy: 'Sarah (PM)',
    },
    {
        id: 'opp-sober-dating',
        title: 'Sober/Activity-First Date Facilitation',
        problemStatement: 'Users are increasingly seeking alcohol-free dates but finding it awkward to suggest. They want authentic connections without liquid courage but lack easy alternatives to "grab drinks."',
        whyNow: 'Sober dating content up 234% – fastest growing trend. Aligns with broader wellness movement and Gen Z drinking habits.',
        personaIds: ['slow-burner', 'practical-matcher'],
        clusterIds: ['sober-dating', 'date-draining'],
        signals: {
            mentionCount: 41200,
            growthPercentage: 234,
            topPhrases: ['dry date', 'coffee date', 'activity date', 'no drinks'],
        },
        evidenceSnippets: [
            { text: 'I need an app that specifically suggests non-drinking date ideas', source: 'Reddit' },
            { text: 'Sober dating is the vibe but how do I suggest it without sounding boring?', source: 'TikTok' },
        ],
        potentialDirections: [
            'Activity-first date suggestions integrated into matching (mutual interests → date ideas)',
            'Sober dating badge or preference filter',
            'Partnership with coffee shops, activity venues for easy non-bar date booking',
            'Date idea generator based on shared interests',
        ],
        severity: 'high',
        confidence: 0.84,
        status: 'in_discovery',
        notes: 'Currently researching venue partnership opportunities. User research scheduled for next week.',
        createdAt: new Date('2024-11-22'),
        createdBy: 'AI Generated',
        reviewedAt: new Date('2024-11-25'),
        reviewedBy: 'Mike (PM)',
    },
    {
        id: 'opp-soft-launch-tools',
        title: 'Relationship Announcement & Social Integration Features',
        problemStatement: 'Couples want to share their relationship status but stress about timing and presentation. The soft-launch phenomenon shows desire for graduated publicity.',
        whyNow: 'Soft-launching up 127%. Social validation remains important but users want control over the narrative.',
        personaIds: ['energy-extrovert', 'hopeful-romantic'],
        clusterIds: ['soft-launching'],
        signals: {
            mentionCount: 48200,
            growthPercentage: 127,
            topPhrases: ['soft launch', 'hard launch', 'instagram official'],
        },
        evidenceSnippets: [
            { text: 'An app that helps you plan your soft launch would be elite', source: 'TikTok' },
            { text: 'I wish my dating app connected to IG for when I\'m ready to share', source: 'Twitter' },
        ],
        potentialDirections: [
            'Graduation from dating app to "couples mode" with shareable content',
            'Soft-launch photo templates or suggestions',
            'Mutual consent "go public" feature',
            'Integration with social platforms for relationship announcements',
        ],
        severity: 'medium',
        confidence: 0.72,
        status: 'new',
        notes: '',
        createdAt: new Date('2024-12-05'),
        createdBy: 'AI Generated',
    },
    {
        id: 'opp-ghosting-prevention',
        title: 'Graceful Exit & Communication Closure Tools',
        problemStatement: 'Ghosting causes significant emotional harm but people do it because rejection is uncomfortable. Users want closure but don\'t know how to provide or request it.',
        whyNow: 'Anti-ghosting content consistently high. Users advocating for basic communication standards in dating.',
        personaIds: ['overthinker', 'hopeful-romantic', 'slow-burner'],
        clusterIds: ['ghosting-closure', 'texting-anxiety'],
        signals: {
            mentionCount: 267800,
            growthPercentage: 56,
            topPhrases: ['ghosting is cowardly', 'just tell me', 'closure'],
        },
        evidenceSnippets: [
            { text: 'Dating apps should have a "not interested" button that sends a nice message for you', source: 'Reddit' },
            { text: 'I\'d rather get rejected than ghosted any day', source: 'TikTok' },
        ],
        potentialDirections: [
            'Pre-written kind rejection messages users can send with one tap',
            'Mutual unmatch with optional anonymous feedback',
            'Conversation inactivity warnings before unmatch',
            'Reputation/reliability scores based on communication patterns',
        ],
        severity: 'high',
        confidence: 0.89,
        status: 'new',
        notes: '',
        createdAt: new Date('2024-12-08'),
        createdBy: 'AI Generated',
    },
    {
        id: 'opp-group-dating',
        title: 'Group & Friend-Integrated Dating Experiences',
        problemStatement: 'Energy Extroverts want to integrate dating with their social life. Friend approval matters. Group dates reduce pressure but are hard to coordinate.',
        whyNow: 'Group date and friend validation content growing. Users seeking lower-pressure first meeting contexts.',
        personaIds: ['energy-extrovert', 'chaos-creative'],
        clusterIds: ['soft-launching', 'roster-dating'],
        signals: {
            mentionCount: 89000,
            growthPercentage: 78,
            topPhrases: ['group date', 'double date', 'friends need to approve', 'bring your bestie'],
        },
        evidenceSnippets: [
            { text: 'Why isn\'t there a dating app where you swipe with your friends?', source: 'TikTok' },
            { text: 'Group dates are so underrated for first meetings', source: 'Reddit' },
        ],
        potentialDirections: [
            'Group date coordination features (match groups for activities)',
            'Friend wingman mode (let friends help curate matches)',
            'Verified friend endorsements on profiles',
            'Lower-stakes group activity matching before 1:1 dates',
        ],
        severity: 'medium',
        confidence: 0.76,
        status: 'new',
        notes: '',
        createdAt: new Date('2024-12-09'),
        createdBy: 'AI Generated',
    },
    {
        id: 'opp-ick-compatibility',
        title: 'Deep Compatibility & Deal-Breaker Surfacing',
        problemStatement: 'The "ick" phenomenon reveals that small incompatibilities can kill attraction. Users want to discover deal-breakers earlier rather than investing time.',
        whyNow: 'Ick content highly engaged. Users want to avoid wasting time on people they\'ll eventually reject for preventable reasons.',
        personaIds: ['practical-matcher', 'overthinker'],
        clusterIds: ['ick-culture', 'date-draining'],
        signals: {
            mentionCount: 178300,
            growthPercentage: 67,
            topPhrases: ['ick', 'dealbreaker', 'not gonna work', 'pet peeve'],
        },
        evidenceSnippets: [
            { text: 'There should be a compatibility quiz for icks before you match', source: 'TikTok' },
            { text: 'I want to know their icks before I catch feelings', source: 'Reddit' },
        ],
        potentialDirections: [
            'Expanded compatibility questions including lifestyle preferences',
            'Playful "ick or no ick" matching game',
            'Deal-breaker alerts before matching',
            'Compatibility percentage breakdowns by category',
        ],
        severity: 'medium',
        confidence: 0.68,
        status: 'not_relevant',
        notes: 'While interesting, this could be seen as too negative. Parking for now.',
        createdAt: new Date('2024-11-28'),
        createdBy: 'AI Generated',
        reviewedAt: new Date('2024-12-02'),
        reviewedBy: 'Sarah (PM)',
    },
]

// ============================================
// Quiz Questions
// ============================================

export const quizQuestions: QuizQuestion[] = [
    {
        id: 'q1',
        order: 1,
        text: 'You match with someone great. What\'s your first move?',
        subtext: 'Be honest – we\'ve all got our styles!',
        options: [
            { id: 'q1-a', text: 'Draft the perfect message in my notes app first', scores: { 'overthinker': 3, 'slow-burner': 1 } },
            { id: 'q1-b', text: 'Send something wild and see what happens', scores: { 'chaos-creative': 3, 'energy-extrovert': 1 } },
            { id: 'q1-c', text: 'A thoughtful opener based on their profile', scores: { 'hopeful-romantic': 2, 'practical-matcher': 2 } },
            { id: 'q1-d', text: 'Ask when they\'re free to meet – why waste time?', scores: { 'practical-matcher': 3, 'energy-extrovert': 1 } },
        ],
    },
    {
        id: 'q2',
        order: 2,
        text: 'They take 4 hours to reply. Your reaction?',
        options: [
            { id: 'q2-a', text: 'Check if I\'m still breathing. Spiral a little.', scores: { 'overthinker': 3, 'hopeful-romantic': 1 } },
            { id: 'q2-b', text: 'They have a life! I have a life! It\'s fine.', scores: { 'slow-burner': 3, 'practical-matcher': 1 } },
            { id: 'q2-c', text: 'Already forgot – talking to 3 other people', scores: { 'chaos-creative': 2, 'energy-extrovert': 2 } },
            { id: 'q2-d', text: 'Note it as potential red flag, proceed with caution', scores: { 'practical-matcher': 3 } },
        ],
    },
    {
        id: 'q3',
        order: 3,
        text: 'Your ideal first date is...',
        options: [
            { id: 'q3-a', text: 'Long dinner with deep conversation', scores: { 'hopeful-romantic': 3, 'slow-burner': 2 } },
            { id: 'q3-b', text: 'Something spontaneous – surprise me!', scores: { 'chaos-creative': 3, 'energy-extrovert': 1 } },
            { id: 'q3-c', text: 'Quick coffee to see if there\'s chemistry', scores: { 'practical-matcher': 3, 'slow-burner': 1 } },
            { id: 'q3-d', text: 'Group activity with friends involved', scores: { 'energy-extrovert': 3, 'chaos-creative': 1 } },
        ],
    },
    {
        id: 'q4',
        order: 4,
        text: 'You\'ve been on 3 great dates. What\'s next?',
        options: [
            { id: 'q4-a', text: 'Time for "the talk" – where is this going?', scores: { 'hopeful-romantic': 2, 'practical-matcher': 3 } },
            { id: 'q4-b', text: 'Keep vibing, let it develop naturally', scores: { 'slow-burner': 3, 'chaos-creative': 1 } },
            { id: 'q4-c', text: 'Introduce them to my friends ASAP', scores: { 'energy-extrovert': 3, 'hopeful-romantic': 1 } },
            { id: 'q4-d', text: 'Analyze every interaction to decode their feelings', scores: { 'overthinker': 3 } },
        ],
    },
    {
        id: 'q5',
        order: 5,
        text: 'Someone you like starts pulling away. You...',
        options: [
            { id: 'q5-a', text: 'Replay every moment trying to find what went wrong', scores: { 'overthinker': 3, 'hopeful-romantic': 1 } },
            { id: 'q5-b', text: 'Ask directly – communication is key', scores: { 'practical-matcher': 3, 'slow-burner': 1 } },
            { id: 'q5-c', text: 'Match their energy – I can be distant too', scores: { 'chaos-creative': 2, 'overthinker': 1 } },
            { id: 'q5-d', text: 'Talk to friends about it – need outside perspective', scores: { 'energy-extrovert': 3, 'hopeful-romantic': 1 } },
        ],
    },
    {
        id: 'q6',
        order: 6,
        text: 'How do you feel about "situationships"?',
        options: [
            { id: 'q6-a', text: 'Absolutely not – give me clarity or give me death', scores: { 'hopeful-romantic': 3, 'practical-matcher': 2 } },
            { id: 'q6-b', text: 'Fine for now, but not forever', scores: { 'slow-burner': 2, 'chaos-creative': 2 } },
            { id: 'q6-c', text: 'They work if everyone\'s on the same page', scores: { 'practical-matcher': 2, 'slow-burner': 2 } },
            { id: 'q6-d', text: 'Kinda fun actually? Low pressure', scores: { 'chaos-creative': 3, 'energy-extrovert': 1 } },
        ],
    },
    {
        id: 'q7',
        order: 7,
        text: 'Your friends\' opinion of your date matters...',
        options: [
            { id: 'q7-a', text: 'A LOT – they know me better than I know myself', scores: { 'energy-extrovert': 3, 'overthinker': 1 } },
            { id: 'q7-b', text: 'Somewhat – I value their input', scores: { 'hopeful-romantic': 2, 'slow-burner': 2 } },
            { id: 'q7-c', text: 'Not really – this is my journey', scores: { 'practical-matcher': 2, 'slow-burner': 2 } },
            { id: 'q7-d', text: 'They\'ll find out eventually if it works out', scores: { 'chaos-creative': 2, 'slow-burner': 2 } },
        ],
    },
    {
        id: 'q8',
        order: 8,
        text: 'What\'s your texting style in early dating?',
        options: [
            { id: 'q8-a', text: 'Carefully crafted, proofread, emoji-considered', scores: { 'overthinker': 3, 'hopeful-romantic': 1 } },
            { id: 'q8-b', text: 'Voice notes, memes, whatever feels right', scores: { 'chaos-creative': 3, 'energy-extrovert': 1 } },
            { id: 'q8-c', text: 'Consistent but not excessive – I have boundaries', scores: { 'slow-burner': 2, 'practical-matcher': 2 } },
            { id: 'q8-d', text: 'Warm, expressive, I want them to feel special', scores: { 'hopeful-romantic': 3, 'energy-extrovert': 1 } },
        ],
    },
    {
        id: 'q9',
        order: 9,
        text: 'How quickly do you catch feelings?',
        options: [
            { id: 'q9-a', text: 'Instantly – their first good text and I\'m planning the wedding', scores: { 'hopeful-romantic': 3, 'overthinker': 1 } },
            { id: 'q9-b', text: 'Slowly – I need consistent vibes over time', scores: { 'slow-burner': 3, 'practical-matcher': 1 } },
            { id: 'q9-c', text: 'Depends on how much chaos they bring to my life', scores: { 'chaos-creative': 3 } },
            { id: 'q9-d', text: 'When my friends approve and I see long-term potential', scores: { 'energy-extrovert': 2, 'practical-matcher': 2 } },
        ],
    },
    {
        id: 'q10',
        order: 10,
        text: 'Dating apps make you feel...',
        options: [
            { id: 'q10-a', text: 'Exhausted but hopeful something will work', scores: { 'hopeful-romantic': 3, 'overthinker': 1 } },
            { id: 'q10-b', text: 'Fine – it\'s a tool, I use it efficiently', scores: { 'practical-matcher': 3 } },
            { id: 'q10-c', text: 'Like I need a 3-month break minimum', scores: { 'slow-burner': 3, 'overthinker': 1 } },
            { id: 'q10-d', text: 'Entertained – chaos mode activated', scores: { 'chaos-creative': 2, 'energy-extrovert': 2 } },
        ],
    },
]

// ============================================
// Helper functions
// ============================================

export function getPersonaById(id: string): Persona | undefined {
    return personas.find(p => p.id === id)
}

export function getTrendById(id: string): BehaviorTrend | undefined {
    return behaviorTrends.find(t => t.id === id)
}

export function getOpportunityById(id: string): OpportunityCard | undefined {
    return opportunityCards.find(o => o.id === id)
}

export function getTrendsForPersona(personaId: string): BehaviorTrend[] {
    return behaviorTrends.filter(trend =>
        trend.linkedPersonas.some(lp => lp.personaId === personaId)
    ).sort((a, b) => {
        const aScore = a.linkedPersonas.find(lp => lp.personaId === personaId)?.confidence || 0
        const bScore = b.linkedPersonas.find(lp => lp.personaId === personaId)?.confidence || 0
        return bScore - aScore
    })
}

export function getOpportunitiesForPersona(personaId: string): OpportunityCard[] {
    return opportunityCards.filter(opp => opp.personaIds.includes(personaId))
}

export function calculateQuizResults(answers: Record<string, string>): { primary: string; secondary: string | null; scores: Record<string, number> } {
    const scores: Record<string, number> = {
        'overthinker': 0,
        'slow-burner': 0,
        'chaos-creative': 0,
        'energy-extrovert': 0,
        'hopeful-romantic': 0,
        'practical-matcher': 0,
    }

    Object.entries(answers).forEach(([questionId, optionId]) => {
        const question = quizQuestions.find(q => q.id === questionId)
        if (question) {
            const option = question.options.find(o => o.id === optionId)
            if (option) {
                Object.entries(option.scores).forEach(([personaId, score]) => {
                    scores[personaId] = (scores[personaId] || 0) + score
                })
            }
        }
    })

    const sortedPersonas = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const primary = sortedPersonas[0][0]
    const secondary = sortedPersonas[1][1] > 0 ? sortedPersonas[1][0] : null

    return { primary, secondary, scores }
}
