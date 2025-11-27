# Glossary: Sprint UI

## Domain-Specific Terms

### Design Challenge Platform Terms

| Term | Definition | Context |
|------|------------|---------|
| **Sprint** | A biweekly challenge period with submission, voting, and retro phases | Core unit of the challenge cycle |
| **Challenge/Prompt** | A UI design task (e.g., "Sign Up", "Credit Card Checkout") | 100 pre-defined prompts available |
| **Submission** | A designer's uploaded design for a sprint challenge | Linked to user and sprint |
| **Vote** | 4-category rating given to a peer's submission | Anonymous during voting period |
| **Feedback** | Structured text critique provided on a submission | Anonymous to reduce bias |
| **Leaderboard** | Ranking of designers based on votes received | Displayed after voting ends |
| **Designer Attribution** | The name attached to a submission | Visible after voting period |

---

### Vote Rating Categories

| Category | Definition | Scale |
|----------|------------|-------|
| **Clarity** | How clear and understandable the design is | 1-5 |
| **Usability** | How easy and intuitive the design is to use | 1-5 |
| **Visual Craft** | Quality of visual design execution | 1-5 |
| **Originality** | Creativity and uniqueness of the solution | 1-5 |

---

### Sprint Lifecycle Statuses

| Status | Definition | What Happens |
|--------|------------|--------------|
| **scheduled** | Sprint created but not started | Waiting for start date |
| **active** | Designers can submit designs | Submission window open |
| **voting** | Designers vote and provide feedback | Submissions locked |
| **retro** | Review period, awards assigned | AI summary generated |
| **completed** | Sprint archived | Results visible |
| **cancelled** | Sprint terminated early | No results |

---

### Gamification Terms

| Term | Definition | Context |
|------|------------|---------|
| **XP (Experience Points)** | Points earned for platform activities | Tracks overall progress |
| **Skill** | A design capability category | 20 skills defined |
| **Skill XP** | Points earned for a specific skill | Tracks skill mastery |
| **Badge** | Achievement award for milestones | 15 badges available |
| **XP Event** | A logged instance of XP being earned | Ledger for tracking |
| **Sprint Task** | Checklist item for sprint participation | 5 task types |

---

### XP Event Types

| Type | Definition | Trigger |
|------|------------|---------|
| **submission** | XP for submitting a design | Design submitted |
| **vote_given** | XP for voting on others' work | Vote cast |
| **feedback_given** | XP for providing feedback | Feedback submitted |
| **feedback_helpful** | XP when feedback marked helpful | Helpful mark received |
| **badge_earned** | XP bonus for earning a badge | Badge awarded |
| **award_received** | XP for sprint awards | Award given |

---

### Award Types

| Type | Definition | Criteria |
|------|------------|----------|
| **top_visual** | Best visual craft score | Highest visual_craft rating |
| **top_usability** | Best usability score | Highest usability rating |
| **top_clarity** | Best clarity score | Highest clarity rating |
| **top_originality** | Best originality score | Highest originality rating |
| **feedback_mvp** | Most helpful feedback | Most helpful marks received |
| **people_choice** | Most overall votes | Highest vote count |
| **most_improved** | Biggest improvement | Compared to previous sprint |

---

### Application Terms

| Term | Definition | Context |
|------|------------|---------|
| `pb` | PocketBase client instance | Variable name used throughout for the PocketBase SDK client |
| `env` | Validated environment object | Export from `env.ts` containing type-safe environment variables |
| `Collections` | Constant object with collection names | Type-safe collection name references |

---

### Technology Terms

| Term | Definition | Usage |
|------|------------|-------|
| **App Router** | Next.js 13+ routing system using the `app/` directory | File-based routing with layouts and server components |
| **T3 Env** | Type-safe environment variable library (`@t3-oss/env-nextjs`) | Validates env vars at build/runtime with Zod schemas |
| **PocketBase** | Open-source backend-as-a-service | Provides database, auth, real-time, and file storage |
| **Zod** | TypeScript-first schema validation library | Used by T3 Env for environment variable validation |
| **Subframe** | UI component library | Pre-built React components for the interface |

---

### TypeScript Pattern Terms

| Term | Definition | Example |
|------|------------|---------|
| **Base Type** | Interface for a single collection | `User`, `Sprint`, `Vote` |
| **Expanded Type** | Type with PocketBase relation expansions | `SprintWithChallenge` |
| **Union Type** | Type-safe enum alternative | `SprintStatus = 'active' \| 'voting' \| ...` |
| **Aggregation Type** | Computed data structure | `VoteStats`, `LeaderboardEntry` |
| **Barrel Export** | Re-export from index file | `export * from './pocketbase'` |

---

### Infrastructure Terms

| Term | Definition | Context |
|------|------------|---------|
| **Container Network** | Docker internal network for service communication | Services reference each other by name (e.g., `pocketbase:8090`) |
| `SKIP_ENV_VALIDATION` | Flag to bypass T3 Env validation | Used during Docker builds where env vars aren't available |

---

### Configuration Patterns

| Pattern | Definition | Example |
|---------|------------|---------|
| `NEXT_PUBLIC_*` | Client-exposed environment variables | `NEXT_PUBLIC_POCKETBASE_URL` is available in browser |
| `@/` | Path alias for project root | `import { env } from '@/env'` |
| `@/lib/types` | Path alias for type imports | `import type { User } from '@/lib/types'` |
| `runtimeEnv` | T3 Env mapping of process.env values | Required because `process.env` can't be destructured in edge/client |

---

### Code Conventions

| Convention | Meaning |
|------------|---------|
| Singleton export | `export default pb` - single shared instance |
| Schema validation | All external inputs validated with Zod |
| Type-safe imports | Using `@/` alias for clean, absolute imports |
| Collection constants | Use `Collections.SPRINTS` instead of `'sprints'` string |

---

## Abbreviations

| Abbrev. | Full Form |
|---------|-----------|
| BaaS | Backend as a Service |
| DX | Developer Experience |
| SSR | Server-Side Rendering |
| RSC | React Server Components |
| XP | Experience Points |
| MVP | Most Valuable Player/Participant |

---

*This glossary is auto-updated as new domain terms are introduced in the codebase.*
