# System Patterns: Sprint UI

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   App Router │  │  Components │  │   lib/          │  │
│  │   (pages)    │  │             │  │   pocketbase.ts │  │
│  └─────────────┘  └─────────────┘  └────────┬────────┘  │
└────────────────────────────────────────────┼────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   PocketBase    │
                                    │   (Backend)     │
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

**Usage pattern:**
```typescript
import { env } from '@/env';
// Type-safe, validated at build/runtime
const url = env.NEXT_PUBLIC_POCKETBASE_URL;
```

### PocketBase Client Pattern

Singleton PocketBase client in `lib/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';
import { env } from '@/env';

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);
export default pb;
```

### Path Aliases

Using `@/` alias for clean imports (configured in `tsconfig.json`):
- `@/env` → `./env.ts`
- `@/lib/*` → `./lib/*`
- `@/app/*` → `./app/*`

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| T3 Env for env vars | Type safety, build-time validation, better DX |
| PocketBase singleton | Single instance, consistent state |
| App Router | Latest Next.js patterns, server components |

## Component Patterns

*To be defined as components are built*

## Data Flow Patterns

*To be defined as features are implemented*
