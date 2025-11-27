# Active Context: Sprint UI

## Current Focus

**Database layer complete.** Awaiting architecture decisions for Next.js application integration (auth strategy, routing patterns, state management).

## Completed Work

### PocketBase Schema Feature - COMPLETE

**Phase 0-4 of pocketbase-schema feature completed:**

1. **Schema (19 Collections)**
   - Core: users, challenges, sprints
   - Participation: sprint_participants
   - Submissions: submissions, submission_assets
   - Skills: skills, submission_skill_tags, user_skill_progress
   - Voting/Feedback: votes, feedback, feedback_helpful_marks
   - Gamification: xp_events, user_sprint_tasks, badges, user_badges
   - Retrospectives: sprint_retro_summaries, sprint_retro_resources, sprint_awards

2. **Seed Data**
   - 100 design challenges
   - 20 design skills (4 categories)
   - 15 achievement badges

3. **TypeScript Types** (`lib/types/`)
   - Base interfaces for all 19 collections
   - Expanded types for relation queries
   - Union types for enums (SprintStatus, UserRole, etc.)

4. **API Services** (`lib/api/`)
   - 14 service modules with full CRUD operations
   - Filter sanitization for secure queries
   - Pagination for analytics/leaderboard functions
   - Realtime subscription helpers

## Architecture Decisions Needed

Before building frontend features, these decisions are pending:

| Decision | Options | Notes |
|----------|---------|-------|
| **Auth Strategy** | PocketBase native, NextAuth, Clerk | PocketBase has built-in auth; services already use it |
| **Route Patterns** | App Router conventions | Middleware for protected routes? |
| **State Management** | React Context, Zustand, Jotai | For auth state, UI state |
| **Server/Client Boundary** | Server Components default | Which components need "use client"? |
| **Data Fetching** | Server actions, client-side, hybrid | API services work both ways |

## Available APIs

All services in `lib/api/` are ready to use:

```typescript
// Authentication
import { login, register, logout, getCurrentUser, isAdmin } from '@/lib/api';

// Sprints & Challenges
import { getActiveSprint, getChallenge, joinSprint } from '@/lib/api';

// Submissions
import { createSubmission, submitDesign, uploadAsset } from '@/lib/api';

// Voting & Feedback
import { createVote, getVoteStats, createFeedback, markFeedbackHelpful } from '@/lib/api';

// Gamification
import { getUserXPTotal, getXPLeaderboard, getUserBadges } from '@/lib/api';

// Realtime
import { subscribeToVotes, subscribeToFeedback } from '@/lib/api';
```

## Next Steps

1. **Spec out Next.js application architecture**
   - Auth strategy and session handling
   - Route structure and protected routes
   - Component patterns (Server vs Client)

2. **Build authentication flow first**
   - Login/register pages
   - Auth context/provider
   - Protected route wrappers

3. **Then build core user flows**
   - Sprint dashboard
   - Submission workflow
   - Voting interface

## Working Notes

- PocketBase MCP available for direct collection queries
- API services use filter sanitization (`lib/utils/filter.ts`)
- All services handle pagination for large datasets
- Realtime subscriptions ready for live updates
