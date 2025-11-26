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

*PocketBase collections to be defined as features are built.*

```mermaid
erDiagram
    USERS {
        string id PK
        string email
        string name
        datetime created
        datetime updated
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
├── memory-bank/            # Documentation Hub
│   ├── systemArchitecture.md
│   ├── keyPairResponsibility.md
│   ├── glossary.md
│   └── techStack.md
├── env.ts                  # T3 Env configuration
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
