import { PlayCircle, Zap, Layers, Users } from 'lucide-react'

export interface Guide {
    id: string
    title: string
    duration: string
    icon: any
    color: string
    description: string
    content: {
        section: string
        text: string
    }[]
}

export const helpGuides: Guide[] = [
    {
        id: 'dashboard-overview',
        title: "Dashboard Overview",
        duration: "5 min",
        icon: PlayCircle,
        color: "text-pulse-400",
        description: "Master the basics of the MatchPulse interface and key metrics.",
        content: [
            {
                section: "Introduction",
                text: "MatchPulse is designed to give you a real-time 'pulse' on cultural shifts specifically within the dating landscape. The main dashboard is divided into three core pillars: Rising Behaviors, Personas, and Opportunities."
            },
            {
                section: "The Sidebar",
                text: "Navigate between the dashboard views using the left-hand sidebar. 'Rising Behaviors' shows high-growth trends, 'Personas' explores the archetypes driving these trends, and 'Opportunities' provides actionable product insights derived from the data."
            },
            {
                section: "Time Filtering",
                text: "Every metric on the dashboard can be filtered by time. Use the dropdown in the top right header to switch between 24h, 7d, 30d, and all-time views. This is crucial for distinguishing between temporary social media fads and long-term cultural shifts."
            }
        ]
    },
    {
        id: 'analyzing-growth-signals',
        title: "Analyzing Growth Signals",
        duration: "8 min",
        icon: Zap,
        color: "text-amber-400",
        description: "How to interpret growth percentages and mention counts effectively.",
        content: [
            {
                section: "Growth Rate vs. Mentions",
                text: "A high growth rate (e.g., +500%) is often more significant than a high mention count. A behavior with high mentions but low growth is already established. We define 'Rising Behaviors' as those with accelerating growth across multiple social platforms."
            },
            {
                section: "Pulse Scores",
                text: "Each trend is assigned a 'Pulse Score'—a weighted average of mention velocity and sentiment sentiment. A positive Pulse Score indicates growing adoption with positive user sentiment, while a high velocity but negative score might indicate a cultural controversy."
            },
            {
                section: "Cross-Platform Propagation",
                text: "We monitor signal 'jumps'. A trend that starts on Reddit and jumps to TikTok within 48 hours is a high-confidence signal for mainstream adoption. Watch for the 'Platform Distribution' section in the Detail Drawer for these insights."
            }
        ]
    },
    {
        id: 'product-mapping-basics',
        title: "Product Mapping Basics",
        duration: "6 min",
        icon: Layers,
        color: "text-accent-400",
        description: "Learn how we translate behavior trends into actionable product opportunities.",
        content: [
            {
                section: "The Opportunity Lifecycle",
                text: "Every 'Opportunity' starts as a Cluster. When our NLP engine identifies a group of related high-growth behaviors, our AI generates a product hypothesis. These are surfaced in the 'Opportunities' page."
            },
            {
                section: "Severity and Impact",
                text: "Opportunities are ranked by Severity (High, Medium, Low). This isn't just about popularity; it's about the depth of the user 'pain point' described in the raw social data. High severity opportunities represent critical gaps in current dating apps."
            },
            {
                section: "Evidence-Based Design",
                text: "Every opportunity card includes 'Evidence Snippets'—direct quotes from users on social media. These should be the foundation of your product design process, ensuring your solutions are grounded in actual user sentiment."
            }
        ]
    },
    {
        id: 'persona-intelligence',
        title: "Persona Intelligence",
        duration: "10 min",
        icon: Users,
        color: "text-emerald-400",
        description: "Deep dive into how we build and iterate on our dating archetypes.",
        content: [
            {
                section: "Dynamic Archetypes",
                text: "Unlike static marketing personas, MatchPulse personas are dynamic. They are built using clustering analysis of thousands of social media posts. As behaviors change, the 'core' of a persona might shift or brand new archetypes might emerge."
            },
            {
                section: "Alignment and Confidence",
                text: "When you see a persona linked to a behavior, pay attention to the Confidence Score. A score of 90%+ means that specific behavior is a defining characteristic of that persona's current experience."
            },
            {
                section: "Persona Quotes",
                text: "Representative quotes are selected because they encapsulate the unique 'voice' of that archetype. Use these to tailor your product messaging and UX copy to specific segments of your user base."
            }
        ]
    }
]
