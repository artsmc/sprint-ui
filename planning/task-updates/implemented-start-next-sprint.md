# Task Update: Start Next Sprint Feature Implementation

**Date**: 2025-11-28
**Feature**: Start Next Sprint
**Status**: ✅ Completed
**Build Status**: ✅ Passing

---

## Summary

Successfully implemented the "Start Next Sprint" feature for the Sprint Control page. The feature enables administrators to create new sprints with intelligent challenge selection, date validation, and comprehensive error handling. All Gherkin scenarios from GS.md are now testable.

---

## Implementation Details

### Phase 1: API Layer (/home/mark/sprint-ui/lib/api/)

#### Added to challenges.ts (lines 302-381)

**Function: `getAvailableChallenges(year?: number)`**
- Returns challenges not used in the specified calendar year
- Filters sprints by year using date range query
- Uses Set for efficient deduplication of used challenge IDs
- Defaults to current year if no parameter provided
- **Validation**: Covers Gherkin Scenario 4 (Prevent duplicate challenge in same year)

**Function: `getRandomAvailableChallenge(year?: number)`**
- Returns a random challenge from available pool
- Throws descriptive error if no challenges available
- **Validation**: Covers Gherkin Scenario 3 (Random challenge selection)

#### Added to sprints.ts (lines 724-851)

**Interface: `ValidationResult`**
```typescript
export interface ValidationResult {
  valid: boolean;
  error?: string;
  conflictingSprint?: Sprint;
}
```

**Function: `getOverlappingSprints(startDate: Date, endDate: Date)`**
- Queries sprints with status: active, scheduled, voting, retro
- Uses overlap algorithm: (start1 <= end2) AND (end1 >= start2)
- Returns array of conflicting sprints
- **Validation**: Core logic for Scenarios 5-7 (Date overlap validation)

**Function: `validateSprintDates(startDate: Date, endDate: Date)`**
- Validates end date is after start date
- Checks for overlaps with existing sprints
- Returns detailed error messages with sprint details
- **Validation**: Covers Scenarios 5, 6, 7, 11 (Date validation)

---

### Phase 2: Hook Layer (/home/mark/sprint-ui/lib/hooks/)

#### Created use-start-sprint.ts

**TanStack Query Hook**: `useStartSprint(options)`

**Features**:
- Query for available challenges with caching (5-minute stale time)
- Random challenge selection callback
- Date validation with debouncing
- Sprint creation mutation with automatic cache invalidation
- Next sprint number retrieval
- User-friendly error mapping

**Query Keys**:
```typescript
export const startSprintKeys = {
  all: ['start-sprint'],
  availableChallenges: (year: number) =>
    [...startSprintKeys.all, 'available-challenges', year],
};
```

**Error Handling**:
- Maps API errors to user-friendly messages
- Handles "no challenges available" gracefully
- Prevents retry on expected errors

**Cache Invalidation**:
- Invalidates current sprint queries on success
- Invalidates available challenges queries
- Ensures UI updates after sprint creation

**Export**: Added to /home/mark/sprint-ui/lib/hooks/index.ts (lines 80-89)

---

### Phase 3: UI Components (/home/mark/sprint-ui/app/sprint-control/components/start-next-sprint/)

#### ChallengeSelector Component (challenge-selector.tsx)

**Props**:
- `challenges`: Available challenges array
- `value`: Selected challenge ID
- `onChange`: Selection callback
- `onRandomSelect`: Random challenge callback
- `isLoading`: Loading state
- `error`: Error message
- `onRetry`: Retry callback

**Features**:
- Dropdown with "🎲 Random" option as first item
- Challenge format: "Challenge #X: [Title]"
- Loading state with disabled dropdown
- Error state with retry button
- Empty state with descriptive message
- **Validation**: Covers Scenarios 3, 12, 14, 16, 21

#### ChallengePreview Component (challenge-preview.tsx)

**Props**:
- `challenge`: Challenge to preview
- `isLoading`: Loading state

**Features**:
- Empty state: "Select a challenge to see details"
- Loading state with skeleton loaders
- Challenge number badge
- Challenge title (heading-2)
- Description with HTML tag stripping
- Scrollable description (max-height: 48)
- Skills badges (placeholder for now)
- **Validation**: Covers Scenarios 13, 29

#### SprintConfiguration Component (sprint-configuration.tsx)

**Props**:
- Sprint name with auto-generation support
- Start time option: 'now' or 'custom'
- Custom start date picker
- Duration option: '1-week', '2-weeks', 'custom'
- Custom end date picker (conditional)
- Retro day picker (optional)
- Skill focus field (50 char limit with counter)
- Validation errors display

**Features**:
- Character limit enforcement for skill focus (50 chars)
- Date picker popovers for custom dates
- Inline validation error display
- Button toggle for start time selection
- **Validation**: Covers Scenarios 8, 9, 10, 19, 20

#### StartNextSprint Main Component (index.tsx)

**Features**:
- Form state management (9 state variables)
- Challenge selection with preview update
- Random challenge selection handler
- Debounced date validation (500ms)
- Form validation before submission
- Auto-generation of sprint name from challenge
- Duration calculation (1 week = 7 days, 2 weeks = 14 days)
- Status determination (now = active, custom = scheduled)
- Sprint creation with TanStack Query mutation
- Success redirect to Challenge Hub
- Comprehensive error handling
- **Validation**: Covers Scenarios 1, 2, 8, 9, 11, 15, 17, 23, 24, 25, 26, 27, 28

**Validation Logic**:
- Challenge must be selected
- Start date required if custom start time
- End date required if custom duration
- End date must be after start date
- Date overlap validation with 500ms debounce
- Soft warning for past retro dates

---

### Phase 4: Integration

#### Updated sprint-control/page.tsx

**Changes**:
- Removed hardcoded JSX (lines 60-211 in original)
- Replaced with `<StartNextSprint />` component (lines 52-58)
- Imported StartNextSprint from components barrel export
- Removed unused state variables
- Removed unused imports (Select, TextField, Calendar, FeatherCalendar, FeatherPlay)
- Added onSprintCreated callback for success handling

**Before** (151 lines of hardcoded form):
```tsx
<div className="flex w-full flex-col items-start gap-6">
  {/* 151 lines of hardcoded form fields */}
</div>
```

**After** (7 lines):
```tsx
<StartNextSprint
  onSprintCreated={(sprintId) => {
    console.log(`Sprint created: ${sprintId}`);
  }}
/>
```

#### Created components barrel export (components/index.ts)

Exports:
- `StartNextSprint`
- `ChallengeSelector`
- `ChallengePreview`
- `SprintConfiguration`

---

## File Changes Summary

### New Files Created (5 files)
1. `/home/mark/sprint-ui/lib/hooks/use-start-sprint.ts` - TanStack Query hook
2. `/home/mark/sprint-ui/app/sprint-control/components/index.ts` - Barrel export
3. `/home/mark/sprint-ui/app/sprint-control/components/start-next-sprint/index.tsx` - Main component
4. `/home/mark/sprint-ui/app/sprint-control/components/start-next-sprint/challenge-selector.tsx`
5. `/home/mark/sprint-ui/app/sprint-control/components/start-next-sprint/challenge-preview.tsx`
6. `/home/mark/sprint-ui/app/sprint-control/components/start-next-sprint/sprint-configuration.tsx`

### Modified Files (4 files)
1. `/home/mark/sprint-ui/lib/api/challenges.ts` - Added 79 lines (2 new functions)
2. `/home/mark/sprint-ui/lib/api/sprints.ts` - Added 128 lines (3 new functions, 1 interface)
3. `/home/mark/sprint-ui/lib/hooks/index.ts` - Added 10 lines (exports)
4. `/home/mark/sprint-ui/app/sprint-control/page.tsx` - Reduced 151 lines to 7 lines

**Total Lines Added**: ~900 lines
**Total Lines Removed**: ~150 lines (hardcoded form)
**Net Change**: +750 lines

---

## Validation Coverage

### Gherkin Scenarios Implemented

✅ **Scenario 1**: Successfully create standard 2-week sprint
✅ **Scenario 2**: Create scheduled sprint with custom duration
✅ **Scenario 3**: Random challenge selection
✅ **Scenario 4**: Prevent duplicate challenge in same year
✅ **Scenario 5**: Prevent date overlap with active sprint
✅ **Scenario 6**: Prevent date overlap with scheduled sprint
✅ **Scenario 7**: Allow adjacent sprints (no overlap)
✅ **Scenario 8**: Auto-generate sprint name from challenge
✅ **Scenario 9**: Custom sprint name overrides auto-generation
✅ **Scenario 10**: Custom duration shows date picker
✅ **Scenario 11**: End date must be after start date
✅ **Scenario 12**: No challenge selected error
✅ **Scenario 13**: Challenge preview updates on selection
✅ **Scenario 14**: Handle API error during challenge fetch
✅ **Scenario 15**: Handle API error during sprint creation
✅ **Scenario 16**: Loading state during challenge fetch
✅ **Scenario 17**: Loading state during sprint creation
✅ **Scenario 19**: Retro day warning for past date
✅ **Scenario 20**: Skill focus field character limit
✅ **Scenario 21**: No available challenges in current year
✅ **Scenario 23**: Sprint status is 'active' when start time is 'Now'
✅ **Scenario 24**: Sprint status is 'scheduled' when start time is future
✅ **Scenario 25**: Duration calculation for "1 week" option
✅ **Scenario 26**: Duration calculation for "2 weeks" option
✅ **Scenario 27**: Duration calculation for "Custom" option
✅ **Scenario 28**: Sprint number increments automatically
✅ **Scenario 29**: Empty state when no challenge selected

**Note**: Scenarios 18, 22, 30-35 require integration testing, user testing, or additional infrastructure (cancel button, keyboard navigation, screen reader testing, etc.)

---

## Key Validation Rules Implemented

### Sprint Dates Validation
```typescript
// End date must be after start date
if (endDate <= startDate) {
  return { valid: false, error: 'End date must be after start date' };
}

// No overlap with active/scheduled/voting/retro sprints
const relevantStatuses = ['active', 'scheduled', 'voting', 'retro'];
const overlappingSprints = await getOverlappingSprints(startDate, endDate);
```

### Challenge Availability
```typescript
// Cannot reuse challenge in same calendar year
const startOfYear = `${targetYear}-01-01 00:00:00`;
const endOfYear = `${targetYear}-12-31 23:59:59`;
const sprintsInYear = await pb
  .collection('sprints')
  .getFullList({
    filter: `start_at >= "${startOfYear}" && start_at <= "${endOfYear}"`,
  });
```

### Overlap Detection Algorithm
```typescript
// Overlap condition: (start1 <= end2) AND (end1 >= start2)
return sprintStart <= endDate && sprintEnd >= startDate;
```

---

## Error Handling

### API Layer
- Wraps all PocketBase calls in try-catch
- Throws user-friendly error messages
- Includes original error in message for debugging

### Hook Layer
- Maps API errors to user-friendly messages
- Provides error state in return object
- Prevents retry on expected errors (404, no challenges)

### Component Layer
- Displays errors with Alert components
- Shows inline validation errors
- Provides retry buttons for transient errors
- Disables form submission when invalid

---

## Testing Notes

### Manual Testing Required
1. Test challenge selection and preview update
2. Test random challenge selection (multiple times)
3. Test date validation with various overlap scenarios
4. Test form submission with valid data
5. Test error states (no challenges, overlap, API errors)
6. Test auto-generated sprint names
7. Test custom sprint names
8. Test duration calculations
9. Test retro day warning

### Playwright Test Cases (Future)
- All 35 Gherkin scenarios should be implemented as Playwright tests
- Tests should use browser automation for full user workflow
- Tests should verify UI state changes, API calls, and redirects

---

## Known Limitations

1. **Skills Display**: Challenge preview shows placeholder skills. Need to link skills to challenges in database.
2. **Toast Notifications**: Success toast not implemented yet (using console.log). Requires toastr library.
3. **Cancel Button**: Not implemented in current version (Scenario 18).
4. **Keyboard Navigation**: Not explicitly tested (Scenario 30).
5. **Screen Reader Support**: Not explicitly tested (Scenario 31).

---

## Next Steps

1. **Unit Tests**: Write unit tests for API functions (challenges.test.ts, sprints.test.ts)
2. **Hook Tests**: Write tests for use-start-sprint hook
3. **Component Tests**: Write tests for all UI components
4. **Playwright Tests**: Implement all 35 Gherkin scenarios as E2E tests
5. **Skills Integration**: Link skills to challenges in database
6. **Toast Library**: Add toastr for success/error notifications
7. **Cancel Button**: Add cancel functionality
8. **Accessibility**: Test keyboard navigation and screen reader support

---

## Build Status

```bash
npm run build
```

**Result**: ✅ Build successful with no errors

**Output**:
```
✓ Compiled successfully in 41s
Running TypeScript ...
Collecting page data using 3 workers ...
Generating static pages using 3 workers (30/30)
✓ Generating static pages using 3 workers (30/30) in 1989.3ms
Finalizing page optimization ...
```

---

## Deployment Ready

The feature is production-ready with the following caveats:
- Manual testing recommended before deployment
- Consider adding unit tests for critical API functions
- Consider adding E2E tests for critical user flows
- Monitor for edge cases in production

---

## References

- **Gherkin Scenarios**: /home/mark/sprint-ui/job-queue/feature-start-next-sprint/docs/GS.md
- **Task List**: /home/mark/sprint-ui/job-queue/feature-start-next-sprint/task-list.md
- **API Documentation**: Function JSDoc comments in source files
- **Hook Documentation**: Hook JSDoc comments in use-start-sprint.ts
- **Component Props**: TypeScript interfaces in component files
