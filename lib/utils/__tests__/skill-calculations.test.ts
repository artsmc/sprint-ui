import {
  SKILL_LEVEL_THRESHOLDS,
  SKILL_TIPS,
  calculateSkillLevel,
  calculateSkillProgress,
  getSkillTip,
} from '../skill-calculations';

describe('SKILL_LEVEL_THRESHOLDS', () => {
  it('should have 6 threshold values', () => {
    expect(SKILL_LEVEL_THRESHOLDS).toHaveLength(6);
  });

  it('should have the correct threshold values', () => {
    expect(SKILL_LEVEL_THRESHOLDS).toEqual([0, 100, 250, 500, 1000, 2000]);
  });

  it('should be in ascending order', () => {
    for (let i = 1; i < SKILL_LEVEL_THRESHOLDS.length; i++) {
      expect(SKILL_LEVEL_THRESHOLDS[i]).toBeGreaterThan(SKILL_LEVEL_THRESHOLDS[i - 1]);
    }
  });
});

describe('SKILL_TIPS', () => {
  it('should have tips for all 10 skills', () => {
    expect(Object.keys(SKILL_TIPS)).toHaveLength(10);
  });

  it('should contain the expected skill slugs', () => {
    const expectedSlugs = [
      'visual-design',
      'interaction-design',
      'ux-research',
      'accessibility',
      'information-architecture',
      'prototyping',
      'usability-testing',
      'ui-patterns',
      'design-systems',
      'mobile-design',
    ];

    expectedSlugs.forEach((slug) => {
      expect(SKILL_TIPS).toHaveProperty(slug);
    });
  });
});

describe('calculateSkillLevel', () => {
  describe('Level 1 (0-99 XP)', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateSkillLevel(0)).toBe(1);
    });

    it('should return level 1 for 50 XP', () => {
      expect(calculateSkillLevel(50)).toBe(1);
    });

    it('should return level 1 for 99 XP (just below threshold)', () => {
      expect(calculateSkillLevel(99)).toBe(1);
    });
  });

  describe('Level 2 (100-249 XP)', () => {
    it('should return level 2 for exactly 100 XP (boundary value)', () => {
      expect(calculateSkillLevel(100)).toBe(2);
    });

    it('should return level 2 for 175 XP', () => {
      expect(calculateSkillLevel(175)).toBe(2);
    });

    it('should return level 2 for 249 XP', () => {
      expect(calculateSkillLevel(249)).toBe(2);
    });
  });

  describe('Level 3 (250-499 XP)', () => {
    it('should return level 3 for exactly 250 XP (boundary value)', () => {
      expect(calculateSkillLevel(250)).toBe(3);
    });

    it('should return level 3 for 400 XP', () => {
      expect(calculateSkillLevel(400)).toBe(3);
    });

    it('should return level 3 for 499 XP', () => {
      expect(calculateSkillLevel(499)).toBe(3);
    });
  });

  describe('Level 4 (500-999 XP)', () => {
    it('should return level 4 for exactly 500 XP (boundary value)', () => {
      expect(calculateSkillLevel(500)).toBe(4);
    });

    it('should return level 4 for 750 XP', () => {
      expect(calculateSkillLevel(750)).toBe(4);
    });

    it('should return level 4 for 999 XP', () => {
      expect(calculateSkillLevel(999)).toBe(4);
    });
  });

  describe('Level 5 (1000-1999 XP)', () => {
    it('should return level 5 for exactly 1000 XP (boundary value)', () => {
      expect(calculateSkillLevel(1000)).toBe(5);
    });

    it('should return level 5 for 1500 XP', () => {
      expect(calculateSkillLevel(1500)).toBe(5);
    });

    it('should return level 5 for 1999 XP', () => {
      expect(calculateSkillLevel(1999)).toBe(5);
    });
  });

  describe('Level 6 (2000+ XP - max level)', () => {
    it('should return level 6 for exactly 2000 XP (boundary value)', () => {
      expect(calculateSkillLevel(2000)).toBe(6);
    });

    it('should return level 6 for 3000 XP', () => {
      expect(calculateSkillLevel(3000)).toBe(6);
    });

    it('should return level 6 for very high XP (10000)', () => {
      expect(calculateSkillLevel(10000)).toBe(6);
    });
  });

  describe('Edge cases', () => {
    it('should return level 1 for negative XP', () => {
      expect(calculateSkillLevel(-10)).toBe(1);
    });

    it('should handle very large XP values', () => {
      expect(calculateSkillLevel(999999)).toBe(6);
    });
  });
});

describe('calculateSkillProgress', () => {
  describe('Level 1 progress (0-100 XP range)', () => {
    it('should return 0% progress for 0 XP at level 1', () => {
      expect(calculateSkillProgress(0, 1)).toBe(0);
    });

    it('should return 50% progress for 50 XP at level 1', () => {
      expect(calculateSkillProgress(50, 1)).toBe(50);
    });

    it('should return 99% progress for 99 XP at level 1', () => {
      expect(calculateSkillProgress(99, 1)).toBe(99);
    });
  });

  describe('Level 2 progress (100-250 XP range)', () => {
    it('should return 0% progress for 100 XP at level 2', () => {
      expect(calculateSkillProgress(100, 2)).toBe(0);
    });

    it('should return 50% progress for 175 XP at level 2', () => {
      // (175 - 100) / (250 - 100) = 75 / 150 = 0.5 = 50%
      expect(calculateSkillProgress(175, 2)).toBe(50);
    });

    it('should return approximately 99% progress for 249 XP at level 2', () => {
      // (249 - 100) / (250 - 100) = 149 / 150 = 0.993... = 99% (floored)
      expect(calculateSkillProgress(249, 2)).toBe(99);
    });
  });

  describe('Level 3 progress (250-500 XP range)', () => {
    it('should return 0% progress for 250 XP at level 3', () => {
      expect(calculateSkillProgress(250, 3)).toBe(0);
    });

    it('should return 50% progress for 375 XP at level 3', () => {
      // (375 - 250) / (500 - 250) = 125 / 250 = 0.5 = 50%
      expect(calculateSkillProgress(375, 3)).toBe(50);
    });
  });

  describe('Level 6 (max level)', () => {
    it('should return 100% progress at max level', () => {
      expect(calculateSkillProgress(2000, 6)).toBe(100);
    });

    it('should return 100% progress even with higher XP at max level', () => {
      expect(calculateSkillProgress(5000, 6)).toBe(100);
    });
  });

  describe('Edge cases', () => {
    it('should return 0% for negative XP', () => {
      expect(calculateSkillProgress(-10, 1)).toBe(0);
    });

    it('should handle level above max gracefully', () => {
      expect(calculateSkillProgress(3000, 7)).toBe(100);
    });

    it('should clamp progress to 100% maximum', () => {
      // Even if XP exceeds level threshold somehow, progress should not exceed 100
      expect(calculateSkillProgress(150, 1)).toBeLessThanOrEqual(100);
    });
  });
});

describe('getSkillTip', () => {
  describe('Known skills', () => {
    it('should return the correct tip for visual-design', () => {
      expect(getSkillTip('visual-design')).toBe(
        'Experiment with color theory, typography, and visual hierarchy'
      );
    });

    it('should return the correct tip for interaction-design', () => {
      expect(getSkillTip('interaction-design')).toBe(
        'Study micro-interactions and animation principles'
      );
    });

    it('should return the correct tip for ux-research', () => {
      expect(getSkillTip('ux-research')).toBe(
        'Conduct user interviews and usability testing'
      );
    });

    it('should return the correct tip for accessibility', () => {
      expect(getSkillTip('accessibility')).toBe(
        'Design with keyboard navigation and screen readers in mind'
      );
    });

    it('should return the correct tip for information-architecture', () => {
      expect(getSkillTip('information-architecture')).toBe(
        'Practice card sorting and sitemap creation'
      );
    });

    it('should return the correct tip for prototyping', () => {
      expect(getSkillTip('prototyping')).toBe(
        'Build interactive prototypes with Figma or Framer'
      );
    });

    it('should return the correct tip for usability-testing', () => {
      expect(getSkillTip('usability-testing')).toBe(
        'Run moderated and unmoderated user tests'
      );
    });

    it('should return the correct tip for ui-patterns', () => {
      expect(getSkillTip('ui-patterns')).toBe(
        'Study common UI patterns and when to use them'
      );
    });

    it('should return the correct tip for design-systems', () => {
      expect(getSkillTip('design-systems')).toBe(
        'Learn component-based design and tokens'
      );
    });

    it('should return the correct tip for mobile-design', () => {
      expect(getSkillTip('mobile-design')).toBe(
        'Focus on touch targets and mobile-first thinking'
      );
    });
  });

  describe('Unknown skills', () => {
    it('should return default message for unknown skill slug', () => {
      expect(getSkillTip('unknown-skill')).toBe(
        'Keep practicing to improve this skill!'
      );
    });

    it('should return default message for empty string', () => {
      expect(getSkillTip('')).toBe('Keep practicing to improve this skill!');
    });

    it('should return default message for skill slug with typo', () => {
      expect(getSkillTip('visual-desgin')).toBe(
        'Keep practicing to improve this skill!'
      );
    });

    it('should be case-sensitive (return default for wrong case)', () => {
      expect(getSkillTip('Visual-Design')).toBe(
        'Keep practicing to improve this skill!'
      );
    });
  });
});
