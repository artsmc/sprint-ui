# Glossary: Sprint UI

## Domain-Specific Terms

### Application Terms

| Term | Definition | Context |
|------|------------|---------|
| `pb` | PocketBase client instance | Variable name used throughout for the PocketBase SDK client |
| `env` | Validated environment object | Export from `env.ts` containing type-safe environment variables |

---

### Technology Terms

| Term | Definition | Usage |
|------|------------|-------|
| **App Router** | Next.js 13+ routing system using the `app/` directory | File-based routing with layouts and server components |
| **T3 Env** | Type-safe environment variable library (`@t3-oss/env-nextjs`) | Validates env vars at build/runtime with Zod schemas |
| **PocketBase** | Open-source backend-as-a-service | Provides database, auth, real-time, and file storage |
| **Zod** | TypeScript-first schema validation library | Used by T3 Env for environment variable validation |

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
| `runtimeEnv` | T3 Env mapping of process.env values | Required because `process.env` can't be destructured in edge/client |

---

### Code Conventions

| Convention | Meaning |
|------------|---------|
| Singleton export | `export default pb` - single shared instance |
| Schema validation | All external inputs validated with Zod |
| Type-safe imports | Using `@/` alias for clean, absolute imports |

---

## Abbreviations

| Abbrev. | Full Form |
|---------|-----------|
| BaaS | Backend as a Service |
| DX | Developer Experience |
| SSR | Server-Side Rendering |
| RSC | React Server Components |

---

*This glossary is auto-updated as new domain terms are introduced in the codebase.*
