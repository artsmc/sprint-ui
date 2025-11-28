/**
 * Challenge Hub Page
 *
 * Main dashboard for the design challenge platform.
 * Server component that fetches user data and renders the Challenge Hub.
 *
 * @module app/challenge-hub/page
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import pb from '@/lib/pocketbase';
import { getChallengeHubData } from '@/lib/api/challenge-hub';
import { getChallenge } from '@/lib/api/challenges';
import { getSprintTaskCompletion, getDefaultSprintTasks } from '@/lib/api/sprint-tasks';
import { getCurrentUser, isAdmin as checkIsAdmin } from '@/lib/api/auth';
import { getUserStreaks } from '@/lib/utils/streak-calculations';
import { ChallengeHubHeader } from './components/challenge-hub-header';
import {
  ActiveChallengeCard,
  UserProfileCard,
  SkillGrowthSection,
  SprintProgressTracker,
  SprintHighlightsSection,
  RetrospectiveSummary,
} from './components';
import type { User, Challenge } from '@/lib/types';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Challenge Hub | Sprint UI',
  description:
    'Join biweekly design challenges, get feedback from peers, and level up your design skills.',
  openGraph: {
    title: 'Design Challenge Hub',
    description:
      'Join biweekly design challenges, get feedback from peers, and level up your design skills.',
  },
};

// =============================================================================
// Server-Side Data Helpers
// =============================================================================

/**
 * Get the authenticated user from the server-side auth store.
 * This reads the auth cookie and validates the session.
 */
async function getAuthenticatedUser(): Promise<User | null> {
  try {
    // Access cookies to get auth token
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('pb_auth');

    if (!authCookie?.value) {
      return null;
    }

    // Load the auth store from the cookie
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);

    if (!pb.authStore.isValid) {
      return null;
    }

    // Return the current user from auth store
    return getCurrentUser();
  } catch {
    return null;
  }
}


// =============================================================================
// Page Component
// =============================================================================

export default async function ChallengeHubPage() {
  // Get authenticated user
  const user = await getAuthenticatedUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?redirect=/challenge-hub');
  }

  // Check if user is admin
  const isAdmin = checkIsAdmin();

  // Fetch all Challenge Hub data
  const hubData = await getChallengeHubData(user.id);

  // Fetch challenge details if there's an active sprint
  let challenge: Challenge | null = null;
  if (hubData.activeSprint?.challenge_id) {
    try {
      challenge = await getChallenge(hubData.activeSprint.challenge_id);
    } catch {
      // Challenge not found, continue without it
      challenge = null;
    }
  }

  // Get sprint task completion status
  const taskCompletion = hubData.activeSprint && hubData.isParticipant
    ? await getSprintTaskCompletion(hubData.activeSprint.id, user.id)
    : getDefaultSprintTasks();

  // Get user streaks
  const streaks = await getUserStreaks(user.id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <ChallengeHubHeader
        isAdmin={isAdmin}
        isParticipant={hubData.isParticipant}
        activeSprintId={hubData.activeSprint?.id}
      />

      {/* Active Challenge Section */}
      {hubData.activeSprint && challenge && (
        <section aria-labelledby="active-challenge-heading">
          <h2 id="active-challenge-heading" className="sr-only">
            Active Challenge
          </h2>
          <ActiveChallengeCard
            sprint={hubData.activeSprint}
            challenge={challenge}
            isParticipant={hubData.isParticipant}
          />
        </section>
      )}

      {/* Sprint Progress Section */}
      {hubData.activeSprint && hubData.isParticipant && (
        <section aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="sr-only">
            Sprint Progress
          </h2>
          <SprintProgressTracker
            tasks={taskCompletion.tasks}
            totalXP={taskCompletion.totalXP}
            maxXP={taskCompletion.maxXP}
          />
        </section>
      )}

      {/* Two Column Grid: Profile & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Section */}
        <section aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="sr-only">
            Your Profile
          </h2>
          <UserProfileCard
            user={user}
            xpTotal={hubData.userXPTotal}
            level={hubData.userLevel}
            badges={hubData.userBadges}
            streaks={streaks}
          />
        </section>

        {/* Skill Growth Section */}
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="sr-only">
            Skill Growth
          </h2>
          <SkillGrowthSection
            skillProgress={hubData.userSkillProgress}
            maxSkills={5}
          />
        </section>
      </div>

      {/* Sprint Highlights Section */}
      {hubData.sprintAwards.length > 0 && (
        <section aria-labelledby="highlights-heading">
          <h2 id="highlights-heading" className="sr-only">
            Sprint Highlights
          </h2>
          <SprintHighlightsSection
            awards={hubData.sprintAwards}
            sprintNumber={hubData.activeSprint?.sprint_number}
          />
        </section>
      )}

      {/* Retrospective Summary Section */}
      {hubData.retroSummary && (
        <section aria-labelledby="retro-heading">
          <h2 id="retro-heading" className="sr-only">
            Retrospective Summary
          </h2>
          <RetrospectiveSummary summary={hubData.retroSummary} />
        </section>
      )}

      {/* No Active Sprint Message */}
      {!hubData.activeSprint && (
        <section className="text-center py-12 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No Active Challenge
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            There&apos;s no active design challenge at the moment.
            Check back soon for the next sprint!
          </p>
        </section>
      )}
    </div>
  );
}
