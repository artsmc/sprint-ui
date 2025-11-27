# Active Context: Sprint UI

## Current Focus

Database schema complete with seed data and TypeScript types. Ready for API service development.

## Recent Changes

### Session: 2025-11-27

1. **PocketBase Schema Complete**
   - All 19 collections created and configured
   - API rules implemented per security requirements
   - Schema exported to `pb_schema.json`

2. **Seed Data Loaded**
   - 100 design challenges loaded
   - 20 design skills loaded
   - 15 achievement badges loaded

3. **TypeScript Types Created**
   - Base types for all 19 collections (`lib/types/pocketbase.ts`)
   - Expanded types for relations (`lib/types/expanded.ts`)
   - Barrel export (`lib/types/index.ts`)

### Previous Sessions

- Subframe UI component library integrated (`@/ui/*`)
- T3 Env for type-safe environment variables
- Memory Bank and cline-docs documentation

## Active Decisions

- Type-safe development: All PocketBase collections have TypeScript interfaces
- Modular API layer: Services in `lib/api/` will use types from `lib/types/`
- Sprint lifecycle: scheduled → active → voting → retro → completed
- Anonymous feedback: author_id hidden when is_anonymous=true

## Next Steps

1. Create API service modules (`lib/api/`)
2. Implement authentication flow
3. Build sprint dashboard UI
4. Create submission workflow

## Working Notes

- PocketBase running on port 8090
- 19 collections with full API rules
- XP system: 6 event types for gamification
- Voting: 4 rating categories (clarity, usability, visual_craft, originality)
