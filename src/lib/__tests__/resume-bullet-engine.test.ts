import { enhanceWeakBullet, validateBullet, validateBullets } from '../resume-bullet-engine';

describe('resume bullet engine', () => {
  describe('validateBullet', () => {
    it('accepts a strong bullet with action, context, and metric', () => {
      const result = validateBullet(
        'Improved API response time by 35% by optimizing PostgreSQL indexes and query plans'
      );

      expect(result.isValid).toBe(true);
      expect(result.issues).toEqual([]);
      expect(result.score).toBeGreaterThanOrEqual(90);
    });

    it('flags weak and short bullets', () => {
      const result = validateBullet('Worked on backend tasks');

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('weak_leading_phrase');
      expect(result.issues).toContain('missing_impact_metric');
      expect(result.issues).toContain('missing_task_context');
      expect(result.issues).toContain('too_short');
    });
  });

  describe('validateBullets', () => {
    it('validates arrays of bullets', () => {
      const results = validateBullets([
        'Built onboarding dashboard using React and reduced support tickets by 22%',
        'Responsible for documentation',
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
    });
  });

  describe('enhanceWeakBullet', () => {
    it('enhances weak starters and injects measurable placeholder when missing', () => {
      const result = enhanceWeakBullet('Responsible for improving release process');

      expect(result.changed).toBe(true);
      expect(result.appliedFixes).toContain('removed_weak_leading_phrase');
      expect(result.appliedFixes).toContain('added_action_verb_prefix');
      expect(result.appliedFixes).toContain('added_metric_placeholder');
      expect(result.enhanced).toMatch(/X%/);
    });

    it('keeps already strong bullets mostly unchanged', () => {
      const original =
        'Improved deployment reliability by 40% by automating rollback checks across CI pipelines.';
      const result = enhanceWeakBullet(original);

      expect(result.enhanced).toBe(original);
      expect(result.changed).toBe(false);
    });
  });
});

