# Key Pair Responsibility: Sprint UI

## Project Overview & Business Context

**Sprint UI** is a biweekly design challenge platform where design teams practice UI skills through structured prompts, peer voting, and anonymous feedback. Built with Next.js 16 and PocketBase.

### Business Goals
- Facilitate designer skill development through structured challenges
- Enable peer feedback without attribution bias (anonymous during voting)
- Provide 100 pre-defined UI challenge prompts
- Support biweekly sprint cadence with submission deadlines

### Core Features
1. **Sprint Management** - Biweekly design challenges with prompts
2. **Design Submission** - Upload designs with designer attribution
3. **Anonymous Voting** - Vote on peer submissions without bias
4. **Anonymous Feedback** - Provide constructive feedback privately
5. **Leaderboard** - Track challenge results

### Target Users
- Design teams participating in skill-building challenges
- Individual designers seeking structured practice
- Team leads managing design sprint programs

---

## Key Modules & Responsibilities

### 1. App Router (`app/`)

**Responsibility:** Page routing, layouts, and server/client component orchestration.

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout wrapper, global providers |
| `page.tsx` | Home page component |

**Depends On:** `lib/`, `env.ts`

---

### 2. Library Layer (`lib/`)

**Responsibility:** Shared utilities and service clients.

| File | Purpose |
|------|---------|
| `pocketbase.ts` | Singleton PocketBase client instance |

**Depends On:** `env.ts`

**Key Export:**
```typescript
export default pb; // PocketBase instance
```

---

### 3. Environment Configuration (`env.ts`)

**Responsibility:** Type-safe environment variable validation and access.

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_POCKETBASE_URL` | Client | PocketBase API endpoint |
| `NODE_ENV` | Server | Runtime environment |

**Depends On:** `@t3-oss/env-nextjs`, `zod`

**Key Export:**
```typescript
export const env; // Validated environment object
```

---

### 4. Infrastructure (`Dockerfile`, `docker-compose.yml`)

**Responsibility:** Container definitions and orchestration.

| File | Purpose |
|------|---------|
| `Dockerfile` | Next.js app container build |
| `docker-compose.yml` | Multi-container setup (Next.js + PocketBase) |

**Services Defined:**
- `sprint-ui` - Next.js application (port 3000)
- `pocketbase` - PocketBase backend (port 8090)

---

## Module Dependency Graph

```mermaid
flowchart TD
    App["app/<br/>(Pages)"] --> Lib["lib/<br/>(Utilities)"]
    App --> Env["env.ts<br/>(Config)"]
    Lib --> Env
    Lib --> PB["PocketBase<br/>(External)"]
```

---

## Responsibility Matrix

| Concern | Owner Module | Notes |
|---------|--------------|-------|
| Routing | `app/` | Next.js App Router |
| State Management | TBD | To be implemented |
| API Communication | `lib/pocketbase.ts` | Via PocketBase SDK |
| Authentication | `lib/pocketbase.ts` | Via PocketBase Auth |
| Environment Config | `env.ts` | T3 Env pattern |
| Containerization | `Dockerfile` | Docker |
| Orchestration | `docker-compose.yml` | Docker Compose |
| AI Context | `CLAUDE.md` | Claude Code guidance |
