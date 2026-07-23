import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, announcementSchema } from './validators';

describe('loginSchema', () => {
  it('should validate correct credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'Password123!',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'Password123!',
    });
    expect(result.success).toBe(false);
  });

  it('should reject weak password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'weak',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('should validate correct registration data', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'ORTU',
    });
    expect(result.success).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Different123!',
      role: 'ORTU',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid role', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('announcementSchema', () => {
  it('should validate correct announcement', () => {
    const result = announcementSchema.safeParse({
      title: 'Test Announcement',
      content: 'This is a test',
      targetAudience: 'ALL',
    });
    expect(result.success).toBe(true);
  });

  it('should reject too short title', () => {
    const result = announcementSchema.safeParse({
      title: 'A',
      content: 'This is a test',
      targetAudience: 'ALL',
    });
    expect(result.success).toBe(false);
  });
});
