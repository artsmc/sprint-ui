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
├── app/                  # Next.js App Router pages
│   ├── ui/               # Subframe UI components
│   ├── layout.tsx
│   └── page.tsx
├── lib/                  # Shared utilities
│   ├── pocketbase.ts     # PocketBase client singleton
│   └── types/            # TypeScript type definitions
│       ├── pocketbase.ts # Base collection interfaces
│       ├── expanded.ts   # Expanded types with relations
│       └── index.ts      # Barrel export
├── seed-data/            # JSON seed data files
│   ├── challenges.json   # 100 design challenges
│   ├── skills.json       # 20 design skills
│   └── badges.json       # 15 achievement badges
├── pb_schema.json        # PocketBase schema export
├── memory-bank/          # Project documentation
├── cline-docs/           # Architecture documentation
├── env.ts                # T3 Env configuration
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

## Type Imports

```typescript
// Import types from lib/types
import type { User, Sprint, Submission, VoteStats } from '@/lib/types';
import { Collections } from '@/lib/types';

// Type-safe PocketBase queries
const sprints = await pb.collection(Collections.SPRINTS).getList<Sprint>();
```
