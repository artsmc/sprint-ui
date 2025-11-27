# Technical Context: Sprint UI

## Tech Stack

### Frontend
- **Next.js 16.0.4** - React framework with App Router
- **React 19.2.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript 5** - Type-safe JavaScript
- **Subframe** - UI component library (project: SprintUI)

### Backend
- **PocketBase** - Backend as a service (BaaS)
  - Database (SQLite)
  - Authentication
  - Real-time subscriptions
  - File storage

### Environment & Validation
- **@t3-oss/env-nextjs** - Type-safe environment variables
- **Zod** - Schema validation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Docker (full stack)
docker-compose up --build
```

## Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_POCKETBASE_URL` | Client | PocketBase server URL |
| `NODE_ENV` | Server | Environment mode |
| `SKIP_ENV_VALIDATION` | Build | Skip env validation (for Docker) |

## Project Structure

```
sprint-ui/
├── app/                      # Next.js App Router pages
│   ├── ui/                   # Subframe UI components
│   ├── layout.tsx
│   └── page.tsx
├── lib/                      # Shared utilities
│   ├── pocketbase.ts         # PocketBase client singleton
│   ├── types/                # TypeScript type definitions
│   │   ├── pocketbase.ts     # Base collection interfaces (19)
│   │   ├── expanded.ts       # Expanded types with relations
│   │   └── index.ts          # Barrel export
│   ├── api/                  # API service modules (14)
│   │   ├── auth.ts           # Authentication & session
│   │   ├── challenges.ts     # Challenge CRUD & search
│   │   ├── sprints.ts        # Sprint CRUD & lifecycle
│   │   ├── participants.ts   # Sprint participation
│   │   ├── submissions.ts    # Submission CRUD & workflow
│   │   ├── assets.ts         # File upload/download
│   │   ├── votes.ts          # Voting & statistics
│   │   ├── feedback.ts       # Feedback & helpful marks
│   │   ├── skills.ts         # Skill tagging & progress
│   │   ├── xp.ts             # XP events & leaderboards
│   │   ├── badges.ts         # Badge awards
│   │   ├── retrospectives.ts # Retro summaries & awards
│   │   ├── realtime.ts       # Realtime subscriptions
│   │   └── index.ts          # Barrel export
│   └── utils/                # Utility functions
│       ├── filter.ts         # PocketBase filter sanitization
│       └── index.ts          # Barrel export
├── seed-data/                # JSON seed data files
│   ├── challenges.json       # 100 design challenges
│   ├── skills.json           # 20 design skills
│   └── badges.json           # 15 achievement badges
├── pb_schema.json            # PocketBase schema export
├── memory-bank/              # Project documentation
├── cline-docs/               # Architecture documentation
├── env.ts                    # T3 Env configuration
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Dependencies

See `package.json` for full list. Key dependencies:
- `next`: ^16.0.4
- `react`: ^19.2.0
- `pocketbase`: ^0.26.3
- `@t3-oss/env-nextjs`: latest
- `zod`: latest

## API Service Layer

### Type Imports

```typescript
// Import types from lib/types
import type { User, Sprint, Submission, VoteStats } from '@/lib/types';
import { Collections } from '@/lib/types';
```

### Service Imports

```typescript
// Import services from lib/api
import {
  // Auth
  login, register, logout, getCurrentUser, isAdmin,

  // Challenges & Sprints
  getChallenge, listChallenges,
  getSprint, getActiveSprint, transitionSprintStatus,

  // Participation
  joinSprint, leaveSprint, isUserParticipant,

  // Submissions
  createSubmission, updateSubmission, submitDesign,
  getSubmissionsBySprint, getUserSubmission,

  // Assets
  uploadAsset, deleteAsset, getAssetUrl,

  // Voting
  createVote, updateVote, getVoteStats, hasUserVoted,

  // Feedback
  createFeedback, updateFeedback, markFeedbackHelpful,

  // Skills
  listSkills, tagSubmissionWithSkill, getUserSkillProgress,

  // XP & Badges
  createXPEvent, getUserXPTotal, getXPLeaderboard,
  awardBadge, getUserBadges,

  // Retrospectives
  createRetroSummary, createSprintAward, getSprintAwards,

  // Realtime
  subscribeToVotes, subscribeToFeedback, subscribeToSubmissions,
} from '@/lib/api';
```

### Filter Utilities

```typescript
// Import filter utilities for custom queries
import { filterEquals, filterAnd, filterOr, filterContains } from '@/lib/utils';

// Build safe PocketBase filters
const filter = filterAnd([
  filterEquals('sprint_id', sprintId),
  filterEquals('status', 'submitted'),
]);
```

## PocketBase Collections

19 collections configured with API rules:

| Collection | Type | Description |
|------------|------|-------------|
| `users` | auth | User accounts with roles |
| `challenges` | base | Design challenge prompts |
| `sprints` | base | Biweekly sprint cycles |
| `sprint_participants` | base | Sprint participation tracking |
| `submissions` | base | User design submissions |
| `submission_assets` | base | Uploaded files for submissions |
| `submission_skill_tags` | base | Skills tagged on submissions |
| `skills` | base | Design skill definitions |
| `user_skill_progress` | base | User skill level tracking |
| `votes` | base | 4-category ratings |
| `feedback` | base | Structured feedback |
| `feedback_helpful_marks` | base | Helpful feedback markers |
| `xp_events` | base | XP earning ledger |
| `user_sprint_tasks` | base | Sprint task checklist |
| `badges` | base | Badge definitions |
| `user_badges` | base | Awarded badges |
| `sprint_retro_summaries` | base | Retrospective summaries |
| `sprint_retro_resources` | base | Learning resources |
| `sprint_awards` | base | Sprint awards |
