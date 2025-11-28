/**
 * Unit Tests for Challenge Hub Data Service
 */

import {
  getChallengeHubData,
  getLastCompletedSprintAwards,
  getLastCompletedSprintRetro,
  getDisplaySprint,
  hasDisplayableContent,
} from '../challenge-hub';
import { getActiveSprint } from '../sprints';
import { getUserXPTotal } from '../xp';
import { getUserBadgesWithDetails } from '../badges';
import { getUserSkillProgress } from '../skills';
import { getSprintAwardsWithDetails, getRetroSummary } from '../retrospectives';
import { isUserParticipant } from '../participants';
import { calculateLevel } from '@/lib/utils';
import pb from '@/lib/pocketbase';
import type { Sprint, SprintRetroSummary } from '@/lib/types';

// Mock all dependencies
jest.mock('../sprints', () => ({
  getActiveSprint: jest.fn(),
}));

jest.mock('../xp', () => ({
  getUserXPTotal: jest.fn(),
}));

jest.mock('../badges', () => ({
  getUserBadgesWithDetails: jest.fn(),
}));

jest.mock('../skills', () => ({
  getUserSkillProgress: jest.fn(),
}));

jest.mock('../retrospectives', () => ({
  getSprintAwardsWithDetails: jest.fn(),
  getRetroSummary: jest.fn(),
}));

jest.mock('../participants', () => ({
  isUserParticipant: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  calculateLevel: jest.fn(),
}));

jest.mock('@/lib/pocketbase', () => ({
  __esModule: true,
  default: {
    collection: jest.fn(),
  },
}));

// Mock data
const mockActiveSprint: Sprint = {
  id: 'sprint-123',
  challenge_id: 'challenge-456',
  sprint_number: 1,
  start_date: '2025-01-01T00:00:00Z',
  submission_deadline: '2025-01-14T23:59:59Z',
  voting_deadline: '2025-01-16T23:59:59Z',
  retro_deadline: '2025-01-18T23:59:59Z',
  status: 'active',
  created: '2025-01-01T00:00:00Z',
  updated: '2025-01-01T00:00:00Z',
  collectionId: 'sprints',
  collectionName: 'sprints',
};

const mockCompletedSprint: Sprint = {
  ...mockActiveSprint,
  id: 'sprint-100',
  status: 'completed',
};

const mockRetroSummary: SprintRetroSummary = {
  id: 'retro-123',
  sprint_id: 'sprint-100',
  summary: 'Great sprint!',
  what_went_well: ['Good designs'],
  what_to_improve: ['More time'],
  questions_asked: ['How to improve?'],
  participant_count: 10,
  submission_count: 8,
  vote_count: 45,
  feedback_count: 20,
  created: '2025-01-18T00:00:00Z',
  updated: '2025-01-18T00:00:00Z',
  collectionId: 'sprint_retro_summaries',
  collectionName: 'sprint_retro_summaries',
};

describe('Challenge Hub Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChallengeHubData', () => {
    it('should fetch all data in parallel and return aggregated result', async () => {
      // Setup mocks
      (getActiveSprint as jest.Mock).mockResolvedValue(mockActiveSprint);
      (getUserXPTotal as jest.Mock).mockResolvedValue(1250);
      (getUserBadgesWithDetails as jest.Mock).mockResolvedValue([]);
      (getUserSkillProgress as jest.Mock).mockResolvedValue([]);
      (isUserParticipant as jest.Mock).mockResolvedValue(true);
      (getSprintAwardsWithDetails as jest.Mock).mockResolvedValue([]);
      (getRetroSummary as jest.Mock).mockResolvedValue(null);
      (calculateLevel as jest.Mock).mockReturnValue(5);

      // Mock PocketBase for getLastCompletedSprintRetro
      const mockGetFirstListItem = jest.fn().mockRejectedValue(new Error('Not found'));
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getChallengeHubData('user-123');

      expect(result).toEqual({
        activeSprint: mockActiveSprint,
        userXPTotal: 1250,
        userLevel: 5,
        userBadges: [],
        userSkillProgress: [],
        sprintAwards: [],
        retroSummary: null,
        isParticipant: true,
      });

      // Verify parallel calls were made
      expect(getActiveSprint).toHaveBeenCalled();
      expect(getUserXPTotal).toHaveBeenCalledWith('user-123');
      expect(getUserBadgesWithDetails).toHaveBeenCalledWith('user-123');
      expect(getUserSkillProgress).toHaveBeenCalledWith('user-123');
    });

    it('should handle no active sprint gracefully', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(null);
      (getUserXPTotal as jest.Mock).mockResolvedValue(500);
      (getUserBadgesWithDetails as jest.Mock).mockResolvedValue([]);
      (getUserSkillProgress as jest.Mock).mockResolvedValue([]);
      (calculateLevel as jest.Mock).mockReturnValue(3);

      // Mock PocketBase for helper functions
      const mockGetFirstListItem = jest.fn().mockRejectedValue(new Error('Not found'));
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getChallengeHubData('user-123');

      expect(result.activeSprint).toBeNull();
      expect(result.isParticipant).toBe(false);
      expect(isUserParticipant).not.toHaveBeenCalled();
    });

    it('should fetch from last completed sprint when no active sprint', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(null);
      (getUserXPTotal as jest.Mock).mockResolvedValue(800);
      (getUserBadgesWithDetails as jest.Mock).mockResolvedValue([]);
      (getUserSkillProgress as jest.Mock).mockResolvedValue([]);
      (calculateLevel as jest.Mock).mockReturnValue(4);

      // Mock PocketBase for last completed sprint
      const mockGetFirstListItem = jest.fn().mockResolvedValue(mockCompletedSprint);
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });
      (getSprintAwardsWithDetails as jest.Mock).mockResolvedValue([]);
      (getRetroSummary as jest.Mock).mockResolvedValue(mockRetroSummary);

      const result = await getChallengeHubData('user-123');

      expect(result.activeSprint).toBeNull();
      expect(result.sprintAwards).toEqual([]);
    });

    it('should respect includeRetro option', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(mockActiveSprint);
      (getUserXPTotal as jest.Mock).mockResolvedValue(1000);
      (getUserBadgesWithDetails as jest.Mock).mockResolvedValue([]);
      (getUserSkillProgress as jest.Mock).mockResolvedValue([]);
      (isUserParticipant as jest.Mock).mockResolvedValue(false);
      (getSprintAwardsWithDetails as jest.Mock).mockResolvedValue([]);
      (calculateLevel as jest.Mock).mockReturnValue(4);

      const result = await getChallengeHubData('user-123', { includeRetro: false });

      expect(result.retroSummary).toBeNull();
      // getRetroSummary should not be called when includeRetro is false
    });

    it('should respect includeAwards option', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(mockActiveSprint);
      (getUserXPTotal as jest.Mock).mockResolvedValue(1000);
      (getUserBadgesWithDetails as jest.Mock).mockResolvedValue([]);
      (getUserSkillProgress as jest.Mock).mockResolvedValue([]);
      (isUserParticipant as jest.Mock).mockResolvedValue(false);
      (calculateLevel as jest.Mock).mockReturnValue(4);

      // Mock PocketBase for retro
      const mockGetFirstListItem = jest.fn().mockRejectedValue(new Error('Not found'));
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getChallengeHubData('user-123', { includeAwards: false });

      expect(result.sprintAwards).toEqual([]);
      expect(getSprintAwardsWithDetails).not.toHaveBeenCalled();
    });
  });

  describe('getLastCompletedSprintAwards', () => {
    it('should return awards from last completed sprint', async () => {
      const mockAwards = [{ id: 'award-1', award_type: 'best_design' }];

      const mockGetFirstListItem = jest.fn().mockResolvedValue(mockCompletedSprint);
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });
      (getSprintAwardsWithDetails as jest.Mock).mockResolvedValue(mockAwards);

      const result = await getLastCompletedSprintAwards();

      expect(result).toEqual(mockAwards);
      expect(mockGetFirstListItem).toHaveBeenCalledWith(
        "status='completed'",
        { sort: '-created' }
      );
      expect(getSprintAwardsWithDetails).toHaveBeenCalledWith('sprint-100');
    });

    it('should return empty array when no completed sprints exist', async () => {
      const mockGetFirstListItem = jest.fn().mockRejectedValue(new Error('Not found'));
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getLastCompletedSprintAwards();

      expect(result).toEqual([]);
    });
  });

  describe('getLastCompletedSprintRetro', () => {
    it('should return retro summary from last completed sprint', async () => {
      const mockGetFirstListItem = jest.fn().mockResolvedValue(mockCompletedSprint);
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });
      (getRetroSummary as jest.Mock).mockResolvedValue(mockRetroSummary);

      const result = await getLastCompletedSprintRetro();

      expect(result).toEqual(mockRetroSummary);
      expect(getRetroSummary).toHaveBeenCalledWith('sprint-100');
    });

    it('should return null when no completed sprints exist', async () => {
      const mockGetFirstListItem = jest.fn().mockRejectedValue(new Error('Not found'));
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getLastCompletedSprintRetro();

      expect(result).toBeNull();
    });
  });

  describe('getDisplaySprint', () => {
    it('should return active sprint when available', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(mockActiveSprint);

      const result = await getDisplaySprint();

      expect(result).toEqual(mockActiveSprint);
    });

    it('should fall back to last completed sprint when no active sprint', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(null);

      const mockGetFirstListItem = jest.fn().mockResolvedValue(mockCompletedSprint);
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getDisplaySprint();

      expect(result).toEqual(mockCompletedSprint);
    });

    it('should return null when no sprints exist', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(null);

      const mockGetFirstListItem = jest.fn().mockRejectedValue(new Error('Not found'));
      (pb.collection as jest.Mock).mockReturnValue({
        getFirstListItem: mockGetFirstListItem,
      });

      const result = await getDisplaySprint();

      expect(result).toBeNull();
    });
  });

  describe('hasDisplayableContent', () => {
    it('should return true when active sprint exists', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(mockActiveSprint);

      const mockGetList = jest.fn().mockResolvedValue({ totalItems: 0 });
      (pb.collection as jest.Mock).mockReturnValue({
        getList: mockGetList,
      });

      const result = await hasDisplayableContent();

      expect(result).toEqual({
        hasContent: true,
        hasActiveSprint: true,
        hasCompletedSprints: false,
      });
    });

    it('should return true when completed sprints exist', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(null);

      const mockGetList = jest.fn().mockResolvedValue({ totalItems: 3 });
      (pb.collection as jest.Mock).mockReturnValue({
        getList: mockGetList,
      });

      const result = await hasDisplayableContent();

      expect(result).toEqual({
        hasContent: true,
        hasActiveSprint: false,
        hasCompletedSprints: true,
      });
    });

    it('should return false when no sprints exist', async () => {
      (getActiveSprint as jest.Mock).mockResolvedValue(null);

      const mockGetList = jest.fn().mockResolvedValue({ totalItems: 0 });
      (pb.collection as jest.Mock).mockReturnValue({
        getList: mockGetList,
      });

      const result = await hasDisplayableContent();

      expect(result).toEqual({
        hasContent: false,
        hasActiveSprint: false,
        hasCompletedSprints: false,
      });
    });
  });
});
