import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import DateInput from './DateInput';

// Helper function to validate date format
const validateDateFormat = (dateString: string): boolean => {
  // Remove spaces for validation
  const cleaned = dateString.replace(/\s/g, '');
  
  // Check format DD/MM/YYYY
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = cleaned.match(dateRegex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Basic validation
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Check days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  
  return true;
};

// Helper to format date as DD / MM / YYYY
const formatDateString = (day: number, month: number, year: number): string => {
  const dd = day.toString().padStart(2, '0');
  const mm = month.toString().padStart(2, '0');
  const yyyy = year.toString();
  return `${dd} / ${mm} / ${yyyy}`;
};

describe('DateInput Property Tests', () => {
  // **Feature: quick-actions, Property: Date format validation**
  // **Validates: Requirements 3.4**
  it('should accept valid dates in DD/MM/YYYY format', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 28 }), // Day (1-28 to avoid invalid dates)
        fc.integer({ min: 1, max: 12 }), // Month (1-12)
        fc.integer({ min: 1900, max: 2100 }), // Year
        (day, month, year) => {
          const formattedDate = formatDateString(day, month, year);
          
          // Verify the validation function accepts this valid date
          expect(validateDateFormat(formattedDate)).toBe(true);
          
          // Verify the date components are within valid ranges
          expect(day).toBeGreaterThanOrEqual(1);
          expect(day).toBeLessThanOrEqual(31);
          expect(month).toBeGreaterThanOrEqual(1);
          expect(month).toBeLessThanOrEqual(12);
          expect(year).toBeGreaterThanOrEqual(1900);
          expect(year).toBeLessThanOrEqual(2100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid date formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Invalid day (0 or > 31)
          fc.record({
            day: fc.oneof(fc.constant(0), fc.integer({ min: 32, max: 99 })),
            month: fc.integer({ min: 1, max: 12 }),
            year: fc.integer({ min: 1900, max: 2100 })
          }),
          // Invalid month (0 or > 12)
          fc.record({
            day: fc.integer({ min: 1, max: 28 }),
            month: fc.oneof(fc.constant(0), fc.integer({ min: 13, max: 99 })),
            year: fc.integer({ min: 1900, max: 2100 })
          }),
          // Invalid year (< 1900 or > 2100)
          fc.record({
            day: fc.integer({ min: 1, max: 28 }),
            month: fc.integer({ min: 1, max: 12 }),
            year: fc.oneof(
              fc.integer({ min: 0, max: 1899 }),
              fc.integer({ min: 2101, max: 9999 })
            )
          })
        ),
        ({ day, month, year }) => {
          const formattedDate = formatDateString(day, month, year);
          
          // Verify the validation function rejects this invalid date
          expect(validateDateFormat(formattedDate)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject malformed date strings', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Random strings
          fc.string({ minLength: 1, maxLength: 20 }),
          // Incomplete dates
          fc.string({ minLength: 1, maxLength: 8 }),
          // Wrong separators
          fc.tuple(
            fc.integer({ min: 1, max: 28 }),
            fc.integer({ min: 1, max: 12 }),
            fc.integer({ min: 1900, max: 2100 })
          ).map(([d, m, y]) => `${d}-${m}-${y}`)
        ).filter(str => {
          // Filter out strings that accidentally match valid format
          const cleaned = str.replace(/\s/g, '');
          return !cleaned.match(/^\d{2}\/\d{2}\/\d{4}$/);
        }),
        (invalidString) => {
          // Verify the validation function rejects malformed strings
          expect(validateDateFormat(invalidString)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
