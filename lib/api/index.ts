/**
 * API Service Index
 *
 * Barrel export for all PocketBase API services.
 * Import individual functions or entire service namespaces.
 *
 * @example
 * // Import individual functions
 * import { login, logout, getCurrentUser } from '@/lib/api';
 * import { listSprints, getActiveSprint } from '@/lib/api';
 *
 * // Import service namespaces
 * import { auth, sprints, submissions } from '@/lib/api';
 * await auth.login({ email, password });
 * await sprints.getActiveSprint();
 */

// =============================================================================
// Auth Service
// =============================================================================

export {
  register,
  login,
  logout,
  refreshAuth,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  getToken,
  updateProfile,
  updateAvatar,
  getAvatarUrl,
  requestPasswordReset,
  confirmPasswordReset,
  requestVerification,
  confirmVerification,
  onAuthStateChange,
} from './auth';

export type { RegisterData, LoginData, AuthResponse } from './auth';

// =============================================================================
// Challenges Service
// =============================================================================

export {
  listChallenges,
  getChallenge,
  getChallengeByNumber,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getRandomChallenge,
  getAllChallenges,
  searchChallenges,
  getChallengeCount,
} from './challenges';

export type {
  CreateChallengeData,
  UpdateChallengeData,
} from './challenges';

// =============================================================================
// Sprints Service
// =============================================================================

export {
  listSprints,
  getSprint,
  getSprintWithChallenge,
  getSprintsByStatus,
  getActiveSprint,
  getCurrentSprint,
  createSprint,
  updateSprint,
  deleteSprint,
  activateSprint,
  transitionToVoting,
  transitionToRetro,
  completeSprint,
  cancelSprint,
  getNextSprintNumber,
  isAcceptingSubmissions,
  isAcceptingVotes,
} from './sprints';

export type {
  CreateSprintData,
  UpdateSprintData,
} from './sprints';

// =============================================================================
// Participants Service
// =============================================================================

export {
  joinSprint,
  leaveSprint,
  getSprintParticipants,
  getSprintParticipantsWithUsers,
  getUserSprints,
  isUserParticipant,
  getParticipantCount,
} from './participants';

// =============================================================================
// Submissions Service
// =============================================================================

export {
  createSubmission,
  getSubmission,
  getSubmissionWithRelations,
  updateSubmission,
  submitDesign,
  deleteSubmission,
  getSubmissionsBySprint,
  getSubmittedSubmissionsBySprint,
  getUserSubmissions,
  getUserSubmissionForSprint,
  hasUserSubmitted,
  getSubmissionCount,
} from './submissions';

export type {
  CreateSubmissionData,
  UpdateSubmissionData,
} from './submissions';

// =============================================================================
// Assets Service
// =============================================================================

export {
  uploadAsset,
  getAssets,
  getAsset,
  getAssetUrl,
  getAssetThumbnailUrl,
  deleteAsset,
  reorderAssets,
  getAssetCount,
  detectAssetType,
  validateAssetFile,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
} from './assets';

// =============================================================================
// Votes Service
// =============================================================================

export {
  createVote,
  updateVote,
  deleteVote,
  getVote,
  getVotesBySubmission,
  getUserVote,
  hasUserVoted,
  getVoteStats,
  getUserVotesForSprint,
  getVoteCount,
} from './votes';

export type { VoteRatings, CreateVoteData, UpdateVoteData } from './votes';

// =============================================================================
// Feedback Service
// =============================================================================

export {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedback,
  getFeedbackWithAuthor,
  getFeedbackBySubmission,
  getUserFeedbackForSubmission,
  markFeedbackHelpful,
  unmarkFeedbackHelpful,
  hasUserMarkedHelpful,
  getHelpfulCount,
  getFeedbackCount,
} from './feedback';

export type { CreateFeedbackData, UpdateFeedbackData } from './feedback';

// =============================================================================
// Skills Service
// =============================================================================

export {
  listSkills,
  getSkill,
  getSkillBySlug,
  tagSubmissionWithSkill,
  removeSkillTag,
  getSubmissionSkills,
  getPrimarySkill,
  getUserSkillProgress,
  getUserSkillProgressForSkill,
  getTopSkills,
} from './skills';

// =============================================================================
// XP Service
// =============================================================================

export {
  createXPEvent,
  getUserXPTotal,
  getUserXPBySprint,
  getUserXPEvents,
  getUserXPSummary,
  getXPEventsBySource,
  getXPLeaderboard,
  getSprintXPLeaderboard,
  hasEarnedXPForSource,
  XP_AMOUNTS,
} from './xp';

export type { XPLeaderboardEntry, SprintXPLeaderboardEntry } from './xp';

// =============================================================================
// Badges Service
// =============================================================================

export {
  listBadges,
  getBadge,
  getBadgeBySlug,
  awardBadge,
  awardBadgeBySlug,
  getUserBadges,
  getUserBadgesWithDetails,
  hasUserBadge,
  getBadgeHolders,
  getRecentBadges,
} from './badges';

// =============================================================================
// Retrospectives Service
// =============================================================================

export {
  createRetroSummary,
  updateRetroSummary,
  getRetroSummary,
  createRetroResource,
  getRetroResources,
  deleteRetroResource,
  createSprintAward,
  getSprintAwards,
  getSprintAwardsWithDetails,
  getUserAwards,
  getAwardByType,
} from './retrospectives';

export type {
  CreateRetroSummaryData,
  UpdateRetroSummaryData,
  CreateRetroResourceData,
} from './retrospectives';

// =============================================================================
// Realtime Service
// =============================================================================

export {
  subscribeToVotes,
  subscribeToSprintVotes,
  subscribeToFeedback,
  subscribeToSprintFeedback,
  subscribeToSubmissions,
  subscribeToSubmission,
  subscribeToSprintStatus,
  subscribeToSprints,
  subscribeToParticipants,
  unsubscribe,
  unsubscribeAll,
  isRealtimeConnected,
} from './realtime';

export type { SubscriptionCallback, SubscriptionAction } from './realtime';

// =============================================================================
// Challenge Hub Service
// =============================================================================

export {
  getChallengeHubData,
  getLastCompletedSprintAwards,
  getLastCompletedSprintRetro,
  getDisplaySprint,
  hasDisplayableContent,
} from './challenge-hub';

export type {
  ChallengeHubData,
  ChallengeHubOptions,
} from './challenge-hub';

// =============================================================================
// Namespace Exports
// =============================================================================

export * as auth from './auth';
export * as challenges from './challenges';
export * as sprints from './sprints';
export * as participants from './participants';
export * as submissions from './submissions';
export * as assets from './assets';
export * as votes from './votes';
export * as feedback from './feedback';
export * as skills from './skills';
export * as xp from './xp';
export * as badges from './badges';
export * as retrospectives from './retrospectives';
export * as realtime from './realtime';
export * as challengeHub from './challenge-hub';
export * as sprintTasks from './sprint-tasks';

// =============================================================================
// Sprint Tasks Service
// =============================================================================

export {
  getSprintTaskCompletion,
  getDefaultSprintTasks,
} from './sprint-tasks';

export type {
  TaskItem,
  SprintTaskCompletion,
} from './sprint-tasks';
