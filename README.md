# MatchPulse - Dating Behavior Intelligence Platform

A data pipeline that analyzes dating-related content from YouTube and Reddit to surface behavioral trends, map them to user personas, and generate product opportunities.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│   YouTube API   │     │   Reddit API    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│         Ingestion Layer                 │
│  • Fetch content • Deduplicate          │
│  • Language filter • Normalize          │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         Processing Pipeline             │
│  • Embeddings (OpenAI)                  │
│  • Clustering (K-Means variant)         │
│  • Labeling (N-gram + LLM)              │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         Analysis Layer                  │
│  • Persona Mapping                      │
│  • Opportunity Generation               │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         API Layer (Next.js)             │
│  • /api/behaviors                       │
│  • /api/personas                        │
│  • /api/opportunities                   │
│  • /api/quiz-results                    │
└─────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- API keys for:
  - YouTube Data API v3
  - Reddit API (client ID + secret)
  - OpenAI API

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database:**
   ```bash
   npm run db:push    # Push schema to database
   npm run db:seed    # Seed personas and quiz questions
   ```

4. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

### Running the Application

**Development server:**
```bash
npm run dev
```

**Run individual ingestion jobs:**
```bash
npm run ingest:youtube   # Fetch YouTube content
npm run ingest:reddit    # Fetch Reddit content
```

**Run full pipeline:**
```bash
npm run pipeline:run     # Run all 8 pipeline steps
```

**View database:**
```bash
npm run db:studio        # Open Prisma Studio
```

## API Endpoints

### Behaviors (Trends)
- `GET /api/behaviors` - List behavior clusters with filtering
- `GET /api/behaviors/:id` - Get cluster details

### Personas
- `GET /api/personas` - List all personas
- `GET /api/personas/:id` - Get persona details

### Opportunities
- `GET /api/opportunities` - List opportunity cards
- `GET /api/opportunities/:id` - Get opportunity details
- `PATCH /api/opportunities/:id` - Update status/notes

### Quiz
- `GET /api/quiz-results` - Get quiz questions
- `POST /api/quiz-results` - Submit quiz answers
- `GET /api/quiz/persona-distribution` - Get result stats

## Pipeline Schedule

When running the scheduler, jobs execute daily (UTC):

| Time  | Job                    |
|-------|------------------------|
| 03:00 | YouTube Ingestion      |
| 03:30 | Reddit Ingestion       |
| 04:00 | Content Cleaning       |
| 04:15 | Embedding Generation   |
| 05:00 | Clustering             |
| 05:30 | Cluster Labeling       |
| 06:00 | Persona Mapping        |
| 06:15 | Opportunity Generation |

## Project Structure

```
src/
├── app/
│   └── api/          # API route handlers
├── lib/
│   ├── ingestion/    # YouTube, Reddit, content cleaning
│   ├── processing/   # Embeddings, clustering, labeling
│   ├── analysis/     # Persona mapping, opportunities
│   └── jobs/         # Runner scripts, scheduler
├── components/       # React components
└── types/            # TypeScript types
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Persona/quiz seed data
```

## Tech Stack

- **Framework:** Next.js 14
- **Database:** PostgreSQL + Prisma ORM
- **Embeddings:** OpenAI text-embedding-3-small
- **Scheduling:** node-cron
- **UI:** React + Tailwind CSS + Framer Motion
