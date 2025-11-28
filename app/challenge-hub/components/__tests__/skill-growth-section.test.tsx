/**
 * Unit Tests for SkillGrowthSection Component
 */

import { render, screen } from '@testing-library/react';
import { SkillGrowthSection } from '../skill-growth-section';
import type { UserSkillProgressWithSkill } from '@/lib/api/skills';

// Mock the utility functions
jest.mock('@/lib/utils/skill-calculations', () => ({
  calculateSkillLevel: jest.fn((xp: number) => Math.floor(xp / 100) + 1),
  calculateSkillProgress: jest.fn((xp: number) => xp % 100),
  getSkillTip: jest.fn(() => 'Keep practicing to improve!'),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) =>
    args
      .filter(Boolean)
      .flat()
      .filter((x) => typeof x === 'string')
      .join(' '),
}));

describe('SkillGrowthSection', () => {
  const mockSkillProgress: UserSkillProgressWithSkill[] = [
    {
      id: 'sp-1',
      user_id: 'user-123',
      skill_id: 'skill-visual',
      xp: 250,
      created: '2025-01-01T00:00:00Z',
      updated: '2025-01-15T00:00:00Z',
      collectionId: 'user_skill_progress',
      collectionName: 'user_skill_progress',
      expand: {
        skill_id: {
          id: 'skill-visual',
          name: 'Visual Design',
          slug: 'visual',
          description: 'Visual design skills',
          icon_url: null,
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-01T00:00:00Z',
          collectionId: 'skills',
          collectionName: 'skills',
        },
      },
    },
    {
      id: 'sp-2',
      user_id: 'user-123',
      skill_id: 'skill-usability',
      xp: 150,
      created: '2025-01-01T00:00:00Z',
      updated: '2025-01-15T00:00:00Z',
      collectionId: 'user_skill_progress',
      collectionName: 'user_skill_progress',
      expand: {
        skill_id: {
          id: 'skill-usability',
          name: 'Usability',
          slug: 'usability',
          description: 'Usability skills',
          icon_url: null,
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-01T00:00:00Z',
          collectionId: 'skills',
          collectionName: 'skills',
        },
      },
    },
    {
      id: 'sp-3',
      user_id: 'user-123',
      skill_id: 'skill-clarity',
      xp: 100,
      created: '2025-01-01T00:00:00Z',
      updated: '2025-01-15T00:00:00Z',
      collectionId: 'user_skill_progress',
      collectionName: 'user_skill_progress',
      expand: {
        skill_id: {
          id: 'skill-clarity',
          name: 'Clarity',
          slug: 'clarity',
          description: 'Clarity skills',
          icon_url: null,
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-01T00:00:00Z',
          collectionId: 'skills',
          collectionName: 'skills',
        },
      },
    },
  ];

  describe('rendering', () => {
    it('should render section title', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} />);

      expect(screen.getByText('Skill Growth')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(
        <SkillGrowthSection skillProgress={mockSkillProgress} title="My Skills" />
      );

      expect(screen.getByText('My Skills')).toBeInTheDocument();
    });

    it('should render all skills', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} />);

      expect(screen.getByText('Visual Design')).toBeInTheDocument();
      expect(screen.getByText('Usability')).toBeInTheDocument();
      expect(screen.getByText('Clarity')).toBeInTheDocument();
    });
  });

  describe('skill levels', () => {
    it('should display skill levels', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} />);

      // Level = floor(xp / 100) + 1
      // visual: 250 -> Level 3
      // usability: 150 -> Level 2
      // clarity: 100 -> Level 2
      expect(screen.getByText('Lv. 3')).toBeInTheDocument();
      expect(screen.getAllByText('Lv. 2')).toHaveLength(2);
    });
  });

  describe('skill XP', () => {
    it('should display XP for each skill', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} />);

      expect(screen.getByText('250 XP')).toBeInTheDocument();
      expect(screen.getByText('150 XP')).toBeInTheDocument();
      expect(screen.getByText('100 XP')).toBeInTheDocument();
    });
  });

  describe('improvement tip', () => {
    it('should show improvement tip for lowest skill', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} />);

      // Tip should be shown for lowest skill (Clarity)
      expect(screen.getByText('Tip for Clarity')).toBeInTheDocument();
      expect(screen.getByText('Keep practicing to improve!')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render empty state when no skills', () => {
      render(<SkillGrowthSection skillProgress={[]} />);

      expect(screen.getByText(/no skills tracked yet/i)).toBeInTheDocument();
    });
  });

  describe('maxSkills prop', () => {
    it('should limit displayed skills', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} maxSkills={2} />);

      // Only top 2 skills by XP should be shown
      expect(screen.getByText('Visual Design')).toBeInTheDocument();
      expect(screen.getByText('Usability')).toBeInTheDocument();
      expect(screen.queryByText('Clarity')).not.toBeInTheDocument();
    });

    it('should show view all link when more skills available', () => {
      render(<SkillGrowthSection skillProgress={mockSkillProgress} maxSkills={2} />);

      expect(screen.getByText('View all 3 skills')).toBeInTheDocument();
    });
  });

  describe('skill ordering', () => {
    it('should sort skills by XP in descending order', () => {
      const { container } = render(
        <SkillGrowthSection skillProgress={mockSkillProgress} />
      );

      // Skills should be in order: Visual Design (250), Usability (150), Clarity (100)
      const skillNames = container.querySelectorAll('.text-body');
      const names = Array.from(skillNames).map((el) => el.textContent);

      // First skill should be Visual Design
      expect(names[0]).toBe('Visual Design');
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SkillGrowthSection skillProgress={mockSkillProgress} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('skills without expand data', () => {
    it('should filter out skills without expanded skill data', () => {
      const skillsWithMissing: UserSkillProgressWithSkill[] = [
        ...mockSkillProgress,
        {
          id: 'sp-missing',
          user_id: 'user-123',
          skill_id: 'skill-missing',
          xp: 500,
          created: '2025-01-01T00:00:00Z',
          updated: '2025-01-15T00:00:00Z',
          collectionId: 'user_skill_progress',
          collectionName: 'user_skill_progress',
          // No expand data
        } as unknown as UserSkillProgressWithSkill,
      ];

      render(<SkillGrowthSection skillProgress={skillsWithMissing} />);

      // Should still show the 3 valid skills
      expect(screen.getByText('Visual Design')).toBeInTheDocument();
      expect(screen.getByText('Usability')).toBeInTheDocument();
      expect(screen.getByText('Clarity')).toBeInTheDocument();
    });
  });
});
