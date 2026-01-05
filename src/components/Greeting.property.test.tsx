import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import Greeting, { getTimeBasedGreeting, formatDate } from './Greeting';

describe('Greeting Property Tests', () => {
  // Feature: dashboard, Property 1: Time-based greeting correctness
  // Validates: Requirements 1.2, 1.3, 1.4
  it('should display correct salutation for any time of day', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }), // Hour of day
        fc.integer({ min: 0, max: 59 }), // Minute
        (hour, minute) => {
          // Create a date with the specified hour and minute
          const testDate = new Date(2025, 0, 1, hour, minute);
          
          // Get the greeting
          const greeting = getTimeBasedGreeting(testDate);
          
          // Verify correct greeting based on hour
          if (hour >= 0 && hour < 12) {
            expect(greeting).toBe('Good Morning');
          } else if (hour >= 12 && hour < 18) {
            expect(greeting).toBe('Good Afternoon');
          } else {
            expect(greeting).toBe('Good Evening');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: dashboard, Property 2: Greeting personalization
  // Validates: Requirements 1.1
  it('should include user first name in greeting for any valid name', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (firstName: string) => {
          const trimmedName = firstName.trim();
          const { container } = render(<Greeting firstName={trimmedName} />);
          
          // Check that the greeting contains the user's first name
          const greetingElement = container.querySelector('.greeting-title') as HTMLElement;
          expect(greetingElement.textContent).toContain(trimmedName);
          
          // Cleanup after each property test iteration
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: dashboard, Property 3: Date formatting consistency
  // Validates: Requirements 1.5
  it('should format date as "Month DD, YYYY" for any valid date', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2100 }), // Year
        fc.integer({ min: 0, max: 11 }), // Month (0-11)
        fc.integer({ min: 1, max: 28 }), // Day (1-28 to avoid invalid dates)
        (year, month, day) => {
          const testDate = new Date(year, month, day);
          const formatted = formatDate(testDate);
          
          // Verify format matches "Month DD, YYYY"
          // Should contain the year
          expect(formatted).toContain(year.toString());
          
          // Should contain a comma
          expect(formatted).toContain(',');
          
          // Should match the pattern: word(s), number, comma, number
          const pattern = /^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/;
          expect(formatted).toMatch(pattern);
          
          // Verify it's a valid date string
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          expect(formatted).toContain(monthNames[month]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
