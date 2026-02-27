import type { ResumeData } from '@/components/editor/types';

/**
 * Calculates a "Hiring Readiness" score (0–100) based on resume completeness.
 *
 * This is extracted from `ResumeEditor.tsx` so it can be:
 *  - Independently unit-tested
 *  - Reused across components (dashboard cards, score badge, etc.)
 *  - Easily updated without touching UI code
 *
 * Scoring breakdown:
 *  - Name filled in (not default)     → +10
 *  - Email + location present         → +10
 *  - Website present                  → +5
 *  - Summary > 100 chars              → +15
 *  - At least 1 experience entry      → +20
 *  - At least 1 education entry       → +10
 *  - At least 5 skills                → +10
 *  - Job match score provided by AI   → +20
 *                               Total → 100
 */
export function calcHiringReadiness(resumeData: ResumeData): number {
    let score = 0;

    if (resumeData.personalInfo.name && resumeData.personalInfo.name !== 'Your Name') {
        score += 10;
    }
    if (resumeData.personalInfo.email && resumeData.personalInfo.location) {
        score += 10;
    }
    if (resumeData.personalInfo.website) {
        score += 5;
    }
    if (resumeData.summary && resumeData.summary.length > 100) {
        score += 15;
    }
    if (resumeData.experience.length > 0) {
        score += 20;
    }
    if (resumeData.education.length > 0) {
        score += 10;
    }
    if ((resumeData.skills?.length ?? 0) >= 5) {
        score += 10;
    }
    if (resumeData.matchScore !== undefined) {
        score += 20;
    }

    return Math.min(score, 100);
}

/**
 * Returns a colour class for the score band used for highlighting.
 */
export function scoreColourClass(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-400';
}

/**
 * Returns a human-readable label for the score band.
 */
export function scoreLabel(score: number): string {
    if (score >= 80) return 'Strong';
    if (score >= 50) return 'Fair';
    return 'Weak';
}
