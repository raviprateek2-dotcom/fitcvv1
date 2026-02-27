import { calcHiringReadiness, scoreColourClass, scoreLabel } from '../resume-scoring';
import type { ResumeData } from '@/components/editor/types';

describe('Resume Scoring Utility', () => {

  const emptyResume: ResumeData = {
    personalInfo: {
      name: 'Your Name',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    jobDescription: ''
  };

  describe('calcHiringReadiness', () => {

    it('returns 0 for an empty resume with default name', () => {
      expect(calcHiringReadiness(emptyResume)).toBe(0);
    });

    it('adds 10 points for a custom name', () => {
      const resume = { ...emptyResume, personalInfo: { ...emptyResume.personalInfo, name: 'John Doe' } };
      expect(calcHiringReadiness(resume)).toBe(10);
    });

    it('adds 10 points for having both email and location', () => {
      const resume1 = { ...emptyResume, personalInfo: { ...emptyResume.personalInfo, email: 'a@a.com' } };
      expect(calcHiringReadiness(resume1)).toBe(0); // Only email, no location
      
      const resume2 = { ...emptyResume, personalInfo: { ...emptyResume.personalInfo, email: 'a@a.com', location: 'NY' } };
      expect(calcHiringReadiness(resume2)).toBe(10);
    });

    it('adds 5 points for a website', () => {
      const resume = { ...emptyResume, personalInfo: { ...emptyResume.personalInfo, website: 'example.com' } };
      expect(calcHiringReadiness(resume)).toBe(5);
    });

    it('adds 15 points for a summary > 100 chars', () => {
      const resumeShort = { ...emptyResume, summary: 'Short' };
      expect(calcHiringReadiness(resumeShort)).toBe(0);

      const resumeLong = { ...emptyResume, summary: 'a'.repeat(101) };
      expect(calcHiringReadiness(resumeLong)).toBe(15);
    });

    it('adds 20 points for having at least 1 experience', () => {
      const resume = { ...emptyResume, experience: [{ id: 1, role: 'Dev', company: 'Inc', date: '', description: '' }] };
      expect(calcHiringReadiness(resume)).toBe(20);
    });

    it('adds 10 points for having at least 1 education', () => {
      const resume = { ...emptyResume, education: [{ id: 1, degree: 'BS', institution: 'Univ', date: '' }] };
      expect(calcHiringReadiness(resume)).toBe(10);
    });

    it('adds 10 points for having at least 5 skills', () => {
      const skill = { name: 'React', level: 'Intermediate' as const };
      const resume = { ...emptyResume, skills: [{ ...skill, id: 1 }, { ...skill, id: 2 }, { ...skill, id: 3 }, { ...skill, id: 4 }] };
      expect(calcHiringReadiness(resume)).toBe(0); // Only 4 skills

      const resume5 = { ...resume, skills: [...resume.skills!, { ...skill, id: 5 }] };
      expect(calcHiringReadiness(resume5)).toBe(10);
    });

    it('adds 20 points for having a matchScore', () => {
      const resume = { ...emptyResume, matchScore: 85 };
      expect(calcHiringReadiness(resume)).toBe(20);
    });

    it('calculates total correctly and caps at 100', () => {
      const perfectResume: ResumeData = {
        personalInfo: {
          name: 'Jane Doe',
          title: 'Developer',
          email: 'jane@example.com',
          phone: '',
          location: 'London',
          website: 'jane.dev'
        },
        summary: 'a'.repeat(101),
        experience: [{ id: 1, role: 'Dev', company: 'Inc', date: '', description: '' }],
        education: [{ id: 1, degree: 'BS', institution: 'Univ', date: '' }],
        skills: [
          { id: 1, name: 'S1', level: 'Beginner' },
          { id: 2, name: 'S2', level: 'Beginner' },
          { id: 3, name: 'S3', level: 'Beginner' },
          { id: 4, name: 'S4', level: 'Beginner' },
          { id: 5, name: 'S5', level: 'Beginner' },
        ],
        projects: [],
        jobDescription: '',
        matchScore: 90
      };
      
      // Expected breakdown:
      // name: 10
      // email+loc: 10
      // website: 5
      // summary: 15
      // exp: 20
      // edu: 10
      // skills: 10
      // matchScore: 20
      // Total = 100
      expect(calcHiringReadiness(perfectResume)).toBe(100);
    });
  });

  describe('scoreColourClass', () => {
    it('returns text-red-400 for < 50', () => {
      expect(scoreColourClass(0)).toBe('text-red-400');
      expect(scoreColourClass(49)).toBe('text-red-400');
    });

    it('returns text-yellow-500 for 50-79', () => {
      expect(scoreColourClass(50)).toBe('text-yellow-500');
      expect(scoreColourClass(79)).toBe('text-yellow-500');
    });

    it('returns text-green-500 for >= 80', () => {
      expect(scoreColourClass(80)).toBe('text-green-500');
      expect(scoreColourClass(100)).toBe('text-green-500');
    });
  });

  describe('scoreLabel', () => {
    it('returns Weak for < 50', () => {
      expect(scoreLabel(49)).toBe('Weak');
    });

    it('returns Fair for 50-79', () => {
      expect(scoreLabel(60)).toBe('Fair');
    });

    it('returns Strong for >= 80', () => {
      expect(scoreLabel(95)).toBe('Strong');
    });
  });

});
