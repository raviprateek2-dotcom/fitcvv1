import { analyzeResume } from '../ai-resume-analyzer';
import { aiRateLimiter } from '@/lib/rate-limit';

// Mock the core AI flow so we don't actually call GenAI APIs during tests
jest.mock('@/ai/flows/ai-resume-analyzer', () => ({
  analyzeResume: jest.fn().mockResolvedValue({ score: 85, feedback: 'Great!' })
}));

describe('Integration: ai-resume-analyzer action', () => {

  const validTargetUserId = 'test-integration-user';

  beforeEach(() => {
    // Reset the internal rate limiter token bucket for our test user
    // The exact implementation might vary, but resetting internal maps usually works if exposed. 
    // If not exposed, we just use a random user ID for each test block.
    jest.clearAllMocks();
  });

  it('succeeds with valid input', async () => {
    const input = {
      resumeContent: 'Software Engineer with 5 years of experience in React and Node.js.',
      jobDescription: 'Looking for a Senior Frontend Developer proficient in React.'
    };
    
    const userId = `user-${Date.now()}`;
    const result = await analyzeResume(input as any, userId);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ score: 85, feedback: 'Great!' });
  });

  it('fails validation if input is empty', async () => {
    const input = {
      resumeContent: '',
      jobDescription: ''
    };
    
    const result = await analyzeResume(input as any, 'user-2');
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.error).toContain('Resume content is required');
  });

  it('fails validation if input exceeds max length (50,000 for resume, 10,000 for JD)', async () => {
    const input = {
      resumeContent: 'a'.repeat(50001),
      jobDescription: 'Looking for a React developer.'
    };
    
    const result = await analyzeResume(input as any, 'user-3');
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.error).toContain('too large');
  });

  it('enforces rate limiting after 10 requests', async () => {
    const input = {
      resumeContent: 'Test resume',
      jobDescription: 'Test JD'
    };
    
    const rateLimitUserId = `rl-user-${Date.now()}`;

    // Make 10 successful requests
    for (let i = 0; i < 10; i++) {
        const res = await analyzeResume(input as any, rateLimitUserId);
        expect(res.success).toBe(true);
    }

    // The 11th request should fail with RATE_LIMIT
    const result11 = await analyzeResume(input as any, rateLimitUserId);
    expect(result11.success).toBe(false);
    expect(result11.code).toBe('RATE_LIMIT');
    expect(result11.error).toContain('Rate limit exceeded');
  });

});
