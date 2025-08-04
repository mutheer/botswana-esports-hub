import { z } from 'zod';

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, ''); // Remove angle brackets
};

// Validation schemas
export const profileUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .transform(sanitizeInput),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, apostrophes, and hyphens')
    .transform(sanitizeInput),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, apostrophes, and hyphens')
    .transform(sanitizeInput),
});

export const gameRegistrationSchema = z.object({
  gamer_tag: z.string()
    .min(3, 'Gamer tag must be at least 3 characters')
    .max(50, 'Gamer tag must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Gamer tag can only contain letters, numbers, underscores, dots, and hyphens')
    .transform(sanitizeInput),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    errorMap: () => ({ message: 'Please select a valid skill level' })
  }),
});

export const eventRegistrationSchema = z.object({
  team_name: z.string()
    .min(3, 'Team name must be at least 3 characters')
    .max(100, 'Team name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s_.-]+$/, 'Team name can only contain letters, numbers, spaces, underscores, dots, and hyphens')
    .transform(sanitizeInput)
    .optional(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .transform(sanitizeInput)
    .optional(),
});

export const omangNumberSchema = z.string()
  .length(9, 'Omang number must be exactly 9 digits')
  .regex(/^\d{9}$/, 'Omang number must contain only digits');

export const authSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform((email) => email.toLowerCase().trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

// Rate limiting helper (simple client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return true;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return false;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();