import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import ValidationService from './ValidationService';

describe('ValidationService', () => {
  describe('Email Validation Property Tests', () => {
    // Feature: landing-auth-onboarding, Property 2: Invalid email formats are rejected
    // Validates: Requirements 2.5
    it('should reject invalid email formats', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Emails without @ symbol
            fc.string().filter(s => !s.includes('@')),
            // Emails without domain
            fc.string().map(s => s + '@'),
            // Emails without TLD
            fc.string().map(s => s.replace('@', '') + '@domain'),
            // Emails with spaces
            fc.string().map(s => s + ' @domain.com'),
            // Empty string
            fc.constant(''),
            // Just @ symbol
            fc.constant('@'),
            // Multiple @ symbols
            fc.string().map(s => s + '@@domain.com'),
            // Missing local part
            fc.constant('@domain.com'),
            // Missing domain part
            fc.string().map(s => s + '@'),
          ),
          (invalidEmail) => {
            const result = ValidationService.validateEmail(invalidEmail);
            // All invalid emails should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid email formats', () => {
      fc.assert(
        fc.property(
          fc.emailAddress(),
          (validEmail) => {
            const result = ValidationService.validateEmail(validEmail);
            // All valid emails should be accepted
            expect(result.isValid).toBe(true);
            expect(result.error).toBe(null);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Password Validation Property Tests', () => {
    // Feature: landing-auth-onboarding, Property 11: Short passwords are rejected
    // Validates: Requirements 8.1
    it('should reject passwords shorter than 8 characters', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 7 }),
          (shortPassword) => {
            const result = ValidationService.validatePassword(shortPassword);
            // All passwords shorter than 8 characters should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must be at least 8 characters');
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: landing-auth-onboarding, Property 12: Passwords without required characters are rejected
    // Validates: Requirements 8.2
    it('should reject passwords without uppercase letters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 8 })
            .filter(s => !/[A-Z]/.test(s))
            .filter(s => /[a-z]/.test(s)) // Ensure has lowercase
            .filter(s => /[0-9]/.test(s)), // Ensure has number
          (passwordNoUppercase) => {
            const result = ValidationService.validatePassword(passwordNoUppercase);
            // Passwords without uppercase should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('uppercase');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject passwords without lowercase letters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 8 })
            .filter(s => !/[a-z]/.test(s))
            .filter(s => /[A-Z]/.test(s)) // Ensure has uppercase
            .filter(s => /[0-9]/.test(s)), // Ensure has number
          (passwordNoLowercase) => {
            const result = ValidationService.validatePassword(passwordNoLowercase);
            // Passwords without lowercase should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('lowercase');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject passwords without numbers', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 8 })
            .filter(s => !/[0-9]/.test(s))
            .filter(s => /[A-Z]/.test(s)) // Ensure has uppercase
            .filter(s => /[a-z]/.test(s)), // Ensure has lowercase
          (passwordNoNumber) => {
            const result = ValidationService.validatePassword(passwordNoNumber);
            // Passwords without numbers should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('number');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept passwords with all required characteristics', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')),
            fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
            fc.constantFrom(...'0123456789'.split('')),
            fc.string({ minLength: 5 })
          ).map(([lower, upper, num, rest]) => {
            // Shuffle to create a valid password
            const chars = (lower + upper + num + rest).split('');
            for (let i = chars.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [chars[i], chars[j]] = [chars[j], chars[i]];
            }
            return chars.join('');
          }),
          (validPassword) => {
            const result = ValidationService.validatePassword(validPassword);
            // All valid passwords should be accepted
            expect(result.isValid).toBe(true);
            expect(result.error).toBe(null);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('File Validation Property Tests', () => {
    // Feature: landing-auth-onboarding, Property 22: Non-image files are rejected
    // Validates: Requirements 10.5
    it('should reject non-image file types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'application/pdf',
            'text/plain',
            'application/json',
            'video/mp4',
            'audio/mpeg',
            'application/zip',
            'text/html',
            'application/javascript'
          ),
          fc.nat(10000000), // File size in bytes
          (fileType, fileSize) => {
            // Create a mock file object
            const mockFile = {
              type: fileType,
              size: fileSize,
              name: 'test-file'
            };
            
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const result = ValidationService.validateFileType(mockFile, allowedTypes);
            
            // All non-image files should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Only image files are accepted (JPG, PNG, GIF)');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid image file types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('image/jpeg', 'image/png', 'image/gif'),
          fc.nat(10000000), // File size in bytes
          (fileType, fileSize) => {
            // Create a mock file object
            const mockFile = {
              type: fileType,
              size: fileSize,
              name: 'test-image'
            };
            
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const result = ValidationService.validateFileType(mockFile, allowedTypes);
            
            // All valid image files should be accepted
            expect(result.isValid).toBe(true);
            expect(result.error).toBe(null);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject files larger than max size', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 6, max: 100 }), // Size in MB, larger than 5MB limit
          (sizeMB) => {
            const sizeBytes = sizeMB * 1024 * 1024;
            const mockFile = {
              type: 'image/jpeg',
              size: sizeBytes,
              name: 'large-image.jpg'
            };
            
            const maxSizeMB = 5;
            const result = ValidationService.validateFileSize(mockFile, maxSizeMB);
            
            // All files larger than max size should be rejected
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Image must be smaller than 5MB');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept files within size limit', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 * 1024 * 1024 }), // Size in bytes, up to 5MB
          (sizeBytes) => {
            const mockFile = {
              type: 'image/jpeg',
              size: sizeBytes,
              name: 'valid-image.jpg'
            };
            
            const maxSizeMB = 5;
            const result = ValidationService.validateFileSize(mockFile, maxSizeMB);
            
            // All files within size limit should be accepted
            expect(result.isValid).toBe(true);
            expect(result.error).toBe(null);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});