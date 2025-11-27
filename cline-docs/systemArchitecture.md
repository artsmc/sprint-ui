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

## Database Schema

*PocketBase collections for the design challenge platform:*

```mermaid
erDiagram
    USERS ||--o{ SUBMISSIONS : creates
    USERS ||--o{ VOTES : casts
    USERS ||--o{ FEEDBACK : writes
    SPRINTS ||--o{ SUBMISSIONS : contains
    SPRINTS }|--|| CHALLENGES : uses
    SUBMISSIONS ||--o{ VOTES : receives
    SUBMISSIONS ||--o{ FEEDBACK : receives

    USERS {
        string id PK
        string email
        string name
        string avatar
        datetime created
        datetime updated
    }

    CHALLENGES {
        int id PK
        string prompt
        string details
    }

    SPRINTS {
        string id PK
        int challenge_id FK
        datetime start_date
        datetime submission_deadline
        datetime voting_deadline
        string status
    }

    SUBMISSIONS {
        string id PK
        string sprint_id FK
        string user_id FK
        string design_url
        string designer_name
        datetime created
    }

    VOTES {
        string id PK
        string submission_id FK
        string voter_id FK
        int score
        datetime created
    }

    FEEDBACK {
        string id PK
        string submission_id FK
        string author_id FK
        string content
        datetime created
    }
```

## File Architecture

```
sprint-ui/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── lib/                    # Shared utilities
│   └── pocketbase.ts       # PocketBase singleton client
├── cline-docs/             # Architecture Documentation Hub
│   ├── systemArchitecture.md
│   ├── keyPairResponsibility.md
│   ├── glossary.md
│   └── techStack.md
├── memory-bank/            # Project Progress & Context
├── env.ts                  # T3 Env configuration
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
