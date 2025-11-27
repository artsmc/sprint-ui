# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sprint UI is a biweekly design challenge platform where designers receive prompts, submit designs, and vote/provide anonymous feedback on each other's work. Built with Next.js 16 (App Router), React 19, PocketBase backend, and Docker.

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint check

# Docker (recommended for full stack)
docker-compose up --build  # Next.js (3000) + PocketBase (8090)
```

PocketBase admin: http://localhost:8090/_/

## Architecture

```
Client Browser
    ↓
Next.js App Router (app/)
    ↓
Library Layer (lib/pocketbase.ts, env.ts)
    ↓
PocketBase Backend (Auth, SQLite DB, Realtime, Files)
```

**Key files:**
- `env.ts` - T3 Env with Zod validation for type-safe environment variables
- `lib/pocketbase.ts` - Singleton PocketBase client instance
- `app/layout.tsx` - Root layout with global styles
- `app/page.tsx` - Home page

**Path alias:** `@/` maps to project root (e.g., `import { env } from '@/env'`)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

For Docker builds, `SKIP_ENV_VALIDATION=1` bypasses T3 Env validation.

## Docker Networking

- Next.js connects to PocketBase via service name: `http://pocketbase:8090`
- External ports: 3000 (Next.js), 8090 (PocketBase)

## Documentation

Detailed architecture docs in `cline-docs/` and `memory-bank/` directories.
