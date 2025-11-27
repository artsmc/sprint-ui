# Active Context: Sprint UI

## Current Focus

Subframe UI component library integrated. Ready for feature development with pre-built components.

## Recent Changes

### Session: 2025-11-26

1. **Subframe Integration**
   - Synced correct Subframe project (`d54d6bb0b72d` / SprintUI)
   - UI components available in `app/ui/` directory
   - Import alias configured: `@/ui/*`
   - Using Tailwind CSS v4 compatible components

### Session: 2025-11-25 (continued)

3. **CLAUDE.md Created**
   - Added Claude Code guidance file for future AI sessions
   - Documents commands, architecture, environment setup
   - Points to cline-docs/ and memory-bank/ for detailed docs

4. **Project Context Discovered**
   - Sprint UI is a biweekly design challenge platform
   - 100 UI challenge prompts defined (Sign Up through Redesign Daily UI)
   - Features: submission, voting, anonymous feedback, sprints

### Session: 2025-11-25 (earlier)

1. **T3 Env Setup**
   - Installed `@t3-oss/env-nextjs` and `zod`
   - Created `env.ts` with validation schema
   - Updated `lib/pocketbase.ts` to use validated env

2. **Memory Bank Initialization**
   - Created all six core documentation files

## Active Decisions

- Using T3 Env pattern for all environment variables going forward
- PocketBase client initialized as singleton
- CLAUDE.md provides quick-start for AI sessions
- Subframe for UI components (`@/ui/*` imports)

## Next Steps

1. Define PocketBase collections for:
   - Users/Designers
   - Sprints (challenge periods)
   - Submissions (design uploads)
   - Votes
   - Feedback
2. Build sprint dashboard UI
3. Implement authentication flow
4. Create submission workflow

## Current Issues

None at this time.

## Working Notes

- 100 challenge prompts available (challengeId 1-100)
- Sprints are biweekly cadence
- Feedback is anonymous during voting
- Build passes successfully
- Docker setup already in place
- PocketBase URL configured for container networking (`http://pocketbase:8090`)
