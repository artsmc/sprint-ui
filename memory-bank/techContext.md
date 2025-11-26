# Technical Context: Sprint UI

## Tech Stack

### Frontend
- **Next.js 16.0.4** - React framework with App Router
- **React 19.2.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript 5** - Type-safe JavaScript

### Backend
- **PocketBase** - Backend as a service (BaaS)
  - Database
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
│   ├── layout.tsx
│   └── page.tsx
├── lib/                  # Shared utilities
│   └── pocketbase.ts     # PocketBase client
├── memory-bank/          # Project documentation
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
