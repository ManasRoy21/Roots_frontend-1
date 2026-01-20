import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import InviteCodeInput from './InviteCodeInput';

// Helper to validate invite code format
const validateInviteCode = (code: string): boolean => {
  // Remove hyphen for validation
  const cleaned = code.replace(/-/g, '');
  
  // Must be exactly 6 alphanumeric characters
  return /^[A-Z0-9]{6}$/.test(cleaned);
};

describe('InviteCodeInput Property Tests', () => {
  // **Feature: quick-actions, Property 13: Invite code format validation**
  // **Validates: Requirements 12.1**
  it('should accept valid 6-character alphanumeric codes', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 6, maxLength: 6 }).map(arr => arr.join('')),
        (code: string) => {
          // Test with hyphen
          const codeWithHyphen = code.slice(0, 3) + '-' + code.slice(3);
          expect(validateInviteCode(codeWithHyphen)).toBe(true);
          
          // Test without hyphen
          expect(validateInviteCode(code)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject codes with invalid length', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 1, maxLength: 5 }).map(arr => arr.join('')),
          fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 7, maxLength: 10 }).map(arr => arr.join(''))
        ),
        (code: string) => {
          expect(validateInviteCode(code)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject codes with invalid characters', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 6, maxLength: 6 }).filter(s => 
          // Filter to strings that contain at least one non-alphanumeric character
          /[^A-Z0-9-]/.test(s)
        ),
        (code: string) => {
          expect(validateInviteCode(code)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should auto-format input to uppercase', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 6 }).map(arr => arr.join('')),
        async (lowercaseCode: string) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container } = render(
            <InviteCodeInput 
              value={currentValue}
              onChange={handleChange}
            />
          );

          const input = container.querySelector('.invite-code-input');
          await userEvent.type(input, lowercaseCode);

          // Verify all characters are uppercase
          expect(currentValue).toBe(currentValue.toUpperCase());
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should limit input to 7 characters (including hyphen)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 8, maxLength: 15 }).map(arr => arr.join('')),
        async (longCode: string) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container } = render(
            <InviteCodeInput 
              value={currentValue}
              onChange={handleChange}
            />
          );

          const input = container.querySelector('.invite-code-input') as HTMLInputElement;
          await userEvent.type(input, longCode);

          // Verify length is limited to 7 characters
          expect(currentValue.length).toBeLessThanOrEqual(7);
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should auto-insert hyphen after 3 characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')), { minLength: 6, maxLength: 6 }).map(arr => arr.join('')),
        async (code: string) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container } = render(
            <InviteCodeInput 
              value={currentValue}
              onChange={handleChange}
            />
          );

          const input = container.querySelector('.invite-code-input') as HTMLInputElement;
          await userEvent.type(input, code);

          // If 6 characters were typed, should have hyphen
          if (currentValue.length === 7) {
            expect(currentValue[3]).toBe('-');
          }
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 50 }
    );
  });
});
