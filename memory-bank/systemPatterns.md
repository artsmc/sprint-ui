# System Patterns: Sprint UI

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   App Router │  │  Components │  │   lib/              │  │
│  │   (pages)    │  │  (@/ui/*)   │  │   ├── pocketbase.ts │  │
│  │             │  │             │  │   ├── types/        │  │
│  │             │  │             │  │   └── api/ (planned)│  │
│  └─────────────┘  └─────────────┘  └──────────┬──────────┘  │
└───────────────────────────────────────────────┼─────────────┘
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │   PocketBase    │
                                      │   (19 tables)   │
                                      └─────────────────┘
```

## Key Patterns

### Environment Variable Management

Using T3 Env (`@t3-oss/env-nextjs`) for type-safe environment variables:

```typescript
// env.ts - Central env configuration
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: { /* server-only vars */ },
  client: { /* NEXT_PUBLIC_ vars */ },
  runtimeEnv: { /* map to process.env */ },
});
```

### PocketBase Client Pattern

Singleton PocketBase client in `lib/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';
import { env } from '@/env';

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);
export default pb;
```

### Type-Safe Queries

```typescript
import type { Sprint, SprintWithChallenge } from '@/lib/types';
import { Collections } from '@/lib/types';
import pb from '@/lib/pocketbase';

// List with type safety
const sprints = await pb.collection(Collections.SPRINTS).getList<Sprint>();

// Expand relations
const sprint = await pb.collection(Collections.SPRINTS).getOne<SprintWithChallenge>(id, {
  expand: 'challenge_id'
});
console.log(sprint.expand?.challenge_id.title);
```

### Path Aliases

Using `@/` alias for clean imports (configured in `tsconfig.json`):
- `@/env` → `./env.ts`
- `@/lib/*` → `./lib/*`
- `@/lib/types` → `./lib/types/index.ts`
- `@/ui/*` → `./app/ui/*` (Subframe components)

### Subframe UI Components

Subframe provides pre-built, customizable UI components:

```typescript
import { Button } from "@/ui/components/Button";
```

## Implemented Data Model

### Core Collections

| Collection | Type | Purpose |
|------------|------|---------|
| users | auth | Designer profiles with roles (designer/admin) |
| challenges | base | 100 UI design prompts |
| sprints | base | Biweekly challenge periods |
| sprint_participants | base | User-sprint membership |

### Submission Collections

| Collection | Type | Purpose |
|------------|------|---------|
| submissions | base | Design submissions (draft/submitted) |
| submission_assets | base | File attachments (images, PDFs, zips) |
| submission_skill_tags | base | Skill tags on submissions |

### Feedback Collections

| Collection | Type | Purpose |
|------------|------|---------|
| votes | base | 4-category ratings (clarity, usability, visual_craft, originality) |
| feedback | base | Structured written feedback (works_well, to_improve, question) |
| feedback_helpful_marks | base | Tracks helpful votes on feedback |

### Gamification Collections

| Collection | Type | Purpose |
|------------|------|---------|
| skills | base | 20 design skills |
| user_skill_progress | base | User XP per skill |
| badges | base | 15 achievement badges |
| user_badges | base | Awarded badges |
| xp_events | base | XP earning ledger |
| user_sprint_tasks | base | Sprint task checklist |

### Retrospective Collections

| Collection | Type | Purpose |
|------------|------|---------|
| sprint_retro_summaries | base | AI-generated sprint summaries |
| sprint_retro_resources | base | Learning resources |
| sprint_awards | base | Sprint awards (top_visual, feedback_mvp, etc.) |

## Sprint Lifecycle

```
scheduled → active → voting → retro → completed
                                   ↘ cancelled
```

- **scheduled**: Sprint created, not yet started
- **active**: Designers can submit designs
- **voting**: Designers vote and provide feedback
- **retro**: Review period, awards assigned
- **completed**: Sprint archived

## API Rules Pattern

| Rule Type | Example |
|-----------|---------|
| Public read | `listRule: ""` (challenges, skills, badges) |
| Auth required | `listRule: "@request.auth.id != ''"` |
| Owner only | `updateRule: "@request.auth.id = user_id"` |
| Admin only | `createRule: "@request.auth.role = 'admin'"` |
| Phase-based | `createRule: "... && sprint_id.status = 'voting'"` |

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| T3 Env for env vars | Type safety, build-time validation |
| PocketBase singleton | Single instance, consistent state |
| App Router | Latest Next.js patterns, server components |
| TypeScript interfaces | Type-safe API interactions |
| Modular types | Separate base vs expanded types |
| Collection constants | Avoid string typos in queries |
