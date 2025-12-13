import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Persona seed data based on existing mock-data.ts
const personas = [
    {
        name: 'The Overthinker',
        tagline: 'Analyzes every text, double-checks every move',
        description: 'The Overthinker approaches dating like a chess match. Every message is carefully crafted, every response is analyzed for hidden meaning. They spend more time thinking about what to say than actually saying it.',
        emoji: '🧠',
        color: '#8b5cf6',
        keywords: ['overthinking', 'texting anxiety', 'what does it mean', 'response time', 'double text', 'left on read', 'analysis paralysis'],
        motivations: ['Finding genuine connection', 'Avoiding rejection and embarrassment', 'Understanding their match deeply'],
        fears: ['Saying the wrong thing', 'Being ghosted without explanation', 'Moving too fast or too slow'],
        datingGoals: ['Build emotional intimacy before physical', 'Find someone patient and understanding', 'Take things at a comfortable pace'],
        typicalBehaviors: ['Drafts messages in notes app first', 'Screenshots conversations for friend analysis', 'Researches matches extensively', 'Delays responses to seem less eager'],
        communicationStyle: 'Thoughtful, sometimes delayed, wants meaningful conversations over small talk',
        painPoints: ['Texting anxiety', 'Fear of coming on too strong', 'Analysis paralysis on when to meet', 'Ghosting triggers spiraling thoughts'],
    },
    {
        name: 'The Slow Burner',
        tagline: 'Patience is a virtue, especially in love',
        description: 'The Slow Burner believes real connections take time. They prefer phone calls over texting, long dates over quick coffee meetups, and genuine getting-to-know-you phases over instant chemistry.',
        emoji: '🕯️',
        color: '#f59e0b',
        keywords: ['slow burn', 'take it slow', 'no rush', 'getting to know', 'long term', 'patience', 'friendship first'],
        motivations: ['Building lasting relationships', 'Finding depth over excitement', 'Creating genuine emotional bonds'],
        fears: ['Rushing into something wrong', 'Superficial connections', 'Being pressured to commit too fast'],
        datingGoals: ['Develop friendship first', 'Multiple dates before labels', 'Natural progression of intimacy'],
        typicalBehaviors: ['Prefers phone/video calls', 'Suggests activity dates over drinks', 'Takes weeks to define the relationship', 'Values consistency over grand gestures'],
        communicationStyle: 'Steady, prefers voice over text, values quality over quantity of interaction',
        painPoints: ['Pressure to DTR too quickly', 'Matching with impatient people', 'App fatigue from swiping culture', 'Feeling "too slow" for modern dating'],
    },
    {
        name: 'The Chaos Creative',
        tagline: "Life's too short for boring dates",
        description: 'The Chaos Creative thrives on spontaneity and novelty. They suggest unconventional dates, send voice notes at 2am, and believe that the best connections happen when you break the rules.',
        emoji: '🌪️',
        color: '#ec4899',
        keywords: ['spontaneous', 'adventure', 'unconventional', 'voice notes', 'energy', 'fun', 'wild'],
        motivations: ['Excitement and novelty', 'Authentic, unfiltered connections', 'Breaking out of dating app monotony'],
        fears: ['Boring, predictable relationships', 'Being seen as "too much"', 'Settling for less than fireworks'],
        datingGoals: ['Find someone who matches their energy', 'Have adventures together', 'Keep the spark alive long-term'],
        typicalBehaviors: ['Proposes unusual first date ideas', 'Heavy use of voice notes and videos', 'Impulsive "are you free right now?" messages', 'Bold, flirty openers'],
        communicationStyle: "High energy, multimedia-heavy, loves banter and doesn't wait for 'the right time'",
        painPoints: ['Matching with people who are "too serious"', 'Being misread as not relationship material', 'Finding others who can keep up', 'Burnout from always initiating fun'],
    },
    {
        name: 'The Energy Extrovert',
        tagline: 'Dating is a social sport',
        description: 'The Energy Extrovert brings friends into everything. Double dates, group hangs, meeting the squad early – they believe your partner should mesh with your world, not exist separately from it.',
        emoji: '⚡',
        color: '#06b6d4',
        keywords: ['group date', 'friends', 'social', 'squad', 'double date', 'party', 'outgoing'],
        motivations: ['Finding someone who fits their social life', 'Getting friend validation', 'Building a shared friend group'],
        fears: ['Partner who isolates them', 'Awkward friend introductions', 'Having to choose between partner and friends'],
        datingGoals: ['Integrate partner into friend group', 'Active social life as a couple', 'Adventures with a team'],
        typicalBehaviors: ['Suggests group dates early', 'Talks about their friends constantly', 'Active on social/dating simultaneously', 'Soft-launches relationships quickly'],
        communicationStyle: 'Gregarious, references friend opinions, prefers public social spaces',
        painPoints: ["Matches who don't want to meet friends", 'Finding group-friendly date ideas', 'Balancing 1:1 time with social time', 'Friends not approving of matches'],
    },
    {
        name: 'The Hopeful Romantic',
        tagline: 'Still believes in love stories',
        description: 'The Hopeful Romantic is keeping the dream alive despite dating app fatigue. They love grand gestures, believe in "when you know, you know," and are looking for their person amidst the chaos.',
        emoji: '💕',
        color: '#f43f5e',
        keywords: ['romantic', 'soulmate', 'the one', 'love story', 'commitment', 'labels', 'real love'],
        motivations: ['Finding "the one"', 'Experiencing movie-worthy moments', 'Deep emotional connection'],
        fears: ['Becoming cynical', 'Never finding real love', 'Casual culture ruining romance'],
        datingGoals: ['Committed, loving relationship', 'Traditional milestones (eventually)', 'Someone who believes in love too'],
        typicalBehaviors: ['Creates date playlists', 'Remembers small details', 'Plans thoughtful gestures', 'Gets invested quickly'],
        communicationStyle: 'Warm, expressive, asks deep questions early, uses lots of emojis',
        painPoints: ['Situationships and ambiguity', 'Casual dating culture', 'Feeling naive for wanting romance', 'Getting hurt by people "not looking for anything serious"'],
    },
    {
        name: 'The Practical Matcher',
        tagline: 'Efficient dating for busy lives',
        description: "The Practical Matcher treats dating like a well-optimized process. They have clear criteria, don't waste time on dead-ends, and believe compatibility can be assessed relatively quickly.",
        emoji: '📊',
        color: '#10b981',
        keywords: ['efficient', 'dealbreakers', 'compatibility', 'goals', 'direct', 'no games', 'practical'],
        motivations: ['Finding a compatible partner efficiently', 'Not wasting time on wrong matches', 'Clear communication and expectations'],
        fears: ['Wasting months on incompatible people', 'Unclear intentions from matches', 'Emotional manipulation'],
        datingGoals: ['Find someone with aligned life goals', 'Skip the games, get to real compatibility', 'Build a partnership that works'],
        typicalBehaviors: ['Asks important questions early', 'Has clear dealbreakers', 'Efficient at filtering matches', 'Prefers quick first meets to assess chemistry'],
        communicationStyle: 'Direct, efficient, values clarity, asks about intentions early',
        painPoints: ['People who play games', 'Unclear profile bios', 'Wasting time on small talk', 'Being seen as "too intense" for being direct'],
    },
]

// Quiz questions seed data
const quizQuestions = [
    {
        order: 1,
        text: 'Someone you matched with hasn\'t replied in 6 hours. What do you do?',
        subtext: 'Be honest – we\'ve all been there.',
        options: [
            { text: 'Check if they\'ve been online. Analyze our last conversation for red flags.', scores: { 'The Overthinker': 3, 'The Hopeful Romantic': 1 } },
            { text: 'Send a funny meme to break the ice again.', scores: { 'The Chaos Creative': 3, 'The Energy Extrovert': 2 } },
            { text: 'Wait it out – if they\'re interested, they\'ll reply.', scores: { 'The Slow Burner': 3, 'The Practical Matcher': 2 } },
            { text: 'Move on to chatting with someone else.', scores: { 'The Practical Matcher': 3, 'The Chaos Creative': 1 } },
        ],
    },
    {
        order: 2,
        text: 'What\'s your ideal first date?',
        options: [
            { text: 'Something adventurous – escape room, rock climbing, or a spontaneous road trip.', scores: { 'The Chaos Creative': 3, 'The Energy Extrovert': 2 } },
            { text: 'A cozy coffee shop where we can really talk and get to know each other.', scores: { 'The Slow Burner': 3, 'The Hopeful Romantic': 2 } },
            { text: 'Something efficient – a quick drink to see if there\'s chemistry.', scores: { 'The Practical Matcher': 3, 'The Overthinker': 1 } },
            { text: 'A group hangout so my friends can vet them.', scores: { 'The Energy Extrovert': 3 } },
        ],
    },
    {
        order: 3,
        text: 'How do you feel about \"the talking stage\"?',
        options: [
            { text: 'I need at least a few weeks of getting to know someone before anything serious.', scores: { 'The Slow Burner': 3, 'The Hopeful Romantic': 1 } },
            { text: 'It gives me anxiety – I overanalyze everything they say.', scores: { 'The Overthinker': 3 } },
            { text: 'It should have a time limit – fish or cut bait.', scores: { 'The Practical Matcher': 3, 'The Hopeful Romantic': 2 } },
            { text: 'I skip it – I just ask them out immediately.', scores: { 'The Chaos Creative': 3, 'The Energy Extrovert': 2 } },
        ],
    },
    {
        order: 4,
        text: 'You\'ve been on three great dates. What\'s next?',
        options: [
            { text: 'Time for the \"what are we\" conversation – I need clarity.', scores: { 'The Hopeful Romantic': 3, 'The Practical Matcher': 2 } },
            { text: 'Introduce them to my friends and see how they vibe.', scores: { 'The Energy Extrovert': 3 } },
            { text: 'Keep enjoying the moment – no need to rush labels.', scores: { 'The Slow Burner': 3, 'The Chaos Creative': 1 } },
            { text: 'Soft-launch them on social media.', scores: { 'The Energy Extrovert': 2, 'The Hopeful Romantic': 2 } },
        ],
    },
    {
        order: 5,
        text: 'When it comes to texting, you...',
        options: [
            { text: 'Draft my messages in notes first and time my responses carefully.', scores: { 'The Overthinker': 3 } },
            { text: 'Send voice notes, memes, and random thoughts throughout the day.', scores: { 'The Chaos Creative': 3, 'The Energy Extrovert': 2 } },
            { text: 'Prefer calls – texting feels impersonal.', scores: { 'The Slow Burner': 3 } },
            { text: 'Use texting to set up dates, not for endless chatting.', scores: { 'The Practical Matcher': 3 } },
        ],
    },
    {
        order: 6,
        text: 'How do you handle getting ghosted?',
        options: [
            { text: 'Replay every interaction trying to figure out what went wrong.', scores: { 'The Overthinker': 3, 'The Hopeful Romantic': 1 } },
            { text: 'Send a closure text – I deserve an explanation.', scores: { 'The Hopeful Romantic': 3, 'The Overthinker': 1 } },
            { text: 'Delete their number and move on immediately.', scores: { 'The Practical Matcher': 3, 'The Chaos Creative': 2 } },
            { text: 'Vent to my friends – they always help me feel better.', scores: { 'The Energy Extrovert': 3 } },
        ],
    },
    {
        order: 7,
        text: 'What\'s a dating dealbreaker for you?',
        options: [
            { text: 'Someone who\'s not clear about what they want.', scores: { 'The Practical Matcher': 3, 'The Hopeful Romantic': 2 } },
            { text: 'Someone who doesn\'t get along with my friends.', scores: { 'The Energy Extrovert': 3 } },
            { text: 'Someone who moves too fast and doesn\'t respect my pace.', scores: { 'The Slow Burner': 3, 'The Overthinker': 1 } },
            { text: 'Someone who\'s boring and doesn\'t want to try new things.', scores: { 'The Chaos Creative': 3 } },
        ],
    },
]

async function main() {
    console.log('🌱 Starting seed...')

    // Seed personas
    console.log('📝 Seeding personas...')
    for (const persona of personas) {
        await prisma.persona.upsert({
            where: { name: persona.name },
            update: persona,
            create: persona,
        })
        console.log(`  ✓ ${persona.name}`)
    }

    // Seed quiz questions
    console.log('📝 Seeding quiz questions...')
    for (const question of quizQuestions) {
        const { options, ...questionData } = question

        const created = await prisma.quizQuestion.upsert({
            where: { order: question.order },
            update: questionData,
            create: questionData,
        })

        // Delete existing options and recreate
        await prisma.quizOption.deleteMany({
            where: { questionId: created.id },
        })

        for (const option of options) {
            await prisma.quizOption.create({
                data: {
                    questionId: created.id,
                    text: option.text,
                    scores: option.scores,
                },
            })
        }
        console.log(`  ✓ Question ${question.order}`)
    }

    console.log('✅ Seed completed successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
