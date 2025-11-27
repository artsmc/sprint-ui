# System Architecture: Sprint UI

## High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client["Client Browser"]
        UI["React Components"]
    end

    subgraph NextJS["Next.js Application"]
        subgraph AppRouter["App Router"]
            Pages["Pages (app/)"]
            Layouts["Layouts"]
        end

        subgraph Lib["Library Layer"]
            PBClient["PocketBase Client"]
            Types["TypeScript Types"]
            EnvConfig["T3 Env Config"]
        end
    end

    subgraph Backend["PocketBase Backend"]
        Auth["Authentication"]
        DB["SQLite Database"]
        Realtime["Real-time Subscriptions"]
        Files["File Storage"]
    end

    subgraph Infra["Infrastructure"]
        Docker["Docker Containers"]
        Compose["Docker Compose"]
    end

    Client --> NextJS
    NextJS --> Backend
    Docker --> NextJS
    Docker --> Backend
```

## Request Flow

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Next.js App
    participant PB as PocketBase

    User->>NextJS: HTTP Request
    NextJS->>NextJS: Validate Env (T3 Env)
    NextJS->>PB: API Call (via pb client)
    PB->>PB: Auth / Query / Mutation
    PB-->>NextJS: Response
    NextJS-->>User: Rendered Page/Data
```

## Database Schema (19 Collections)

### Entity Relationships

```mermaid
erDiagram
    %% Core Entities
    USERS ||--o{ SPRINT_PARTICIPANTS : joins
    USERS ||--o{ SUBMISSIONS : creates
    USERS ||--o{ VOTES : casts
    USERS ||--o{ FEEDBACK : writes
    USERS ||--o{ USER_SKILL_PROGRESS : tracks
    USERS ||--o{ USER_BADGES : earns
    USERS ||--o{ XP_EVENTS : receives
    USERS ||--o{ USER_SPRINT_TASKS : completes

    CHALLENGES ||--o{ SPRINTS : used_in
    SPRINTS ||--o{ SPRINT_PARTICIPANTS : has
    SPRINTS ||--o{ SUBMISSIONS : contains
    SPRINTS ||--o{ SPRINT_RETRO_SUMMARIES : summarized_by
    SPRINTS ||--o{ SPRINT_RETRO_RESOURCES : has
    SPRINTS ||--o{ SPRINT_AWARDS : awards

    SUBMISSIONS ||--o{ SUBMISSION_ASSETS : has
    SUBMISSIONS ||--o{ SUBMISSION_SKILL_TAGS : tagged_with
    SUBMISSIONS ||--o{ VOTES : receives
    SUBMISSIONS ||--o{ FEEDBACK : receives

    SKILLS ||--o{ USER_SKILL_PROGRESS : tracked_in
    SKILLS ||--o{ SUBMISSION_SKILL_TAGS : applied_to

    BADGES ||--o{ USER_BADGES : awarded_as

    FEEDBACK ||--o{ FEEDBACK_HELPFUL_MARKS : marked

    %% Core Collections
    USERS {
        string id PK
        string email
        string name
        string avatar
        string role "designer|admin"
    }

    CHALLENGES {
        string id PK
        int challenge_number
        string title
        string prompt
        string details
    }

    SPRINTS {
        string id PK
        string challenge_id FK
        datetime start_date
        datetime submission_deadline
        datetime voting_deadline
        datetime retro_deadline
        string status "scheduled|active|voting|retro|completed|cancelled"
    }

    SUBMISSIONS {
        string id PK
        string sprint_id FK
        string user_id FK
        string description
        string status "draft|submitted"
    }

    VOTES {
        string id PK
        string submission_id FK
        string voter_id FK
        int clarity "1-5"
        int usability "1-5"
        int visual_craft "1-5"
        int originality "1-5"
    }

    FEEDBACK {
        string id PK
        string submission_id FK
        string author_id FK
        string works_well
        string to_improve
        string question
        boolean is_anonymous
    }
```

### Collection Groups

| Group | Collections | Purpose |
|-------|-------------|---------|
| **Core** | users, challenges, sprints, sprint_participants | Platform foundation |
| **Submissions** | submissions, submission_assets, submission_skill_tags | Design entries |
| **Feedback** | votes, feedback, feedback_helpful_marks | Peer evaluation |
| **Gamification** | skills, user_skill_progress, badges, user_badges, xp_events, user_sprint_tasks | Engagement |
| **Retrospective** | sprint_retro_summaries, sprint_retro_resources, sprint_awards | Sprint wrap-up |

## Sprint Lifecycle

```mermaid
stateDiagram-v2
    [*] --> scheduled: Sprint created
    scheduled --> active: Start date reached
    active --> voting: Submission deadline passed
    voting --> retro: Voting deadline passed
    retro --> completed: Retro deadline passed
    scheduled --> cancelled: Admin cancels
    active --> cancelled: Admin cancels

    note right of active: Designers submit designs
    note right of voting: 4-category voting + feedback
    note right of retro: Awards assigned, AI summary
```

## File Architecture

```
sprint-ui/
├── app/                    # Next.js App Router
│   ├── ui/                 # Subframe UI components
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── lib/                    # Shared utilities
│   ├── pocketbase.ts       # PocketBase singleton client
│   └── types/              # TypeScript type definitions
│       ├── pocketbase.ts   # Base collection interfaces
│       ├── expanded.ts     # Expanded types with relations
│       └── index.ts        # Barrel export
├── seed-data/              # JSON seed data files
│   ├── challenges.json     # 100 design challenges
│   ├── skills.json         # 20 design skills
│   └── badges.json         # 15 achievement badges
├── cline-docs/             # Architecture Documentation Hub
├── memory-bank/            # Project Progress & Context
├── env.ts                  # T3 Env configuration
├── pb_schema.json          # PocketBase schema export
├── CLAUDE.md               # AI assistant guidance
├── Dockerfile              # Container definition
└── docker-compose.yml      # Multi-container setup
```

## Architecture Patterns

| Pattern | Implementation | Location |
|---------|---------------|----------|
| Singleton | PocketBase client instance | `lib/pocketbase.ts` |
| Validation | Environment variable schema | `env.ts` |
| Composition | App Router layouts | `app/layout.tsx` |
| Type Safety | Collection interfaces | `lib/types/` |
| Barrel Export | Clean imports | `lib/types/index.ts` |

## Container Architecture

```mermaid
flowchart LR
    subgraph DockerNetwork["Docker Network"]
        NextContainer["sprint-ui<br/>(Next.js)"]
        PBContainer["pocketbase<br/>(PocketBase)"]
    end

    NextContainer -->|"http://pocketbase:8090"| PBContainer

    User["External User"] -->|":3000"| NextContainer
    Admin["Admin"] -->|":8090"| PBContainer
```
