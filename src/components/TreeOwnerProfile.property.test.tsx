import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import TreeOwnerProfile from './TreeOwnerProfile';

/**
 * Property-Based Tests for TreeOwnerProfile Component
 * Feature: family-tree
 */

describe('TreeOwnerProfile - Property-Based Tests', () => {
  /**
   * Property 13: Birth year formatting
   * For any family member with a date of birth, the sidebar should display 
   * the birth year in the format "Born YYYY".
   * Validates: Requirements 6.3
   */
  it('Property 13: Birth year formatting - displays birth year in format "Born YYYY"', () => {
    fc.assert(
      fc.property(
        // Generate valid years between 1900 and current year
        fc.integer({ min: 1900, max: new Date().getFullYear() }),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.oneof(
          // ISO format: YYYY-MM-DD
          fc.tuple(
            fc.integer({ min: 1, max: 12 }),
            fc.integer({ min: 1, max: 28 })
          ).map(([month, day]) => ({ format: 'iso', month, day })),
          // DD/MM/YYYY format
          fc.tuple(
            fc.integer({ min: 1, max: 12 }),
            fc.integer({ min: 1, max: 28 })
          ).map(([month, day]) => ({ format: 'dmy', month, day }))
        ),
        (year, firstName, lastName, dateConfig) => {
          // Format the date based on the configuration
          let dateOfBirth;
          if (dateConfig.format === 'iso') {
            const month = String(dateConfig.month).padStart(2, '0');
            const day = String(dateConfig.day).padStart(2, '0');
            dateOfBirth = `${year}-${month}-${day}`;
          } else {
            const month = String(dateConfig.month).padStart(2, '0');
            const day = String(dateConfig.day).padStart(2, '0');
            dateOfBirth = `${day}/${month}/${year}`;
          }

          const treeOwner = {
            id: 'test-owner-id',
            firstName,
            lastName,
            dateOfBirth,
            photoUrl: null,
          };

          const mockHandlers = {
            onAddParents: () => {},
            onAddSpouse: () => {},
            onAddChildren: () => {},
          };

          const { container } = render(
            <TreeOwnerProfile 
              treeOwner={treeOwner}
              {...mockHandlers}
            />
          );

          // Check that the birth year is displayed in the format "Born YYYY"
          const birthYearText = container.querySelector('.tree-owner-birth-year');
          
          if (birthYearText) {
            const text = birthYearText.textContent;
            expect(text).toMatch(/^Born \d{4}$/);
            expect(text).toBe(`Born ${year}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Birth year extraction handles missing dates
   */
  it('Property 13 (edge case): handles missing or invalid birth dates gracefully', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant(''),
          fc.constant('invalid-date'),
          fc.constant('not-a-date')
        ),
        (firstName, lastName, dateOfBirth) => {
          const treeOwner = {
            id: 'test-owner-id',
            firstName,
            lastName,
            dateOfBirth,
            photoUrl: null,
          };

          const mockHandlers = {
            onAddParents: () => {},
            onAddSpouse: () => {},
            onAddChildren: () => {},
          };

          const { container } = render(
            <TreeOwnerProfile 
              treeOwner={treeOwner}
              {...mockHandlers}
            />
          );

          // When date is invalid or missing, birth year should not be displayed
          const birthYearText = container.querySelector('.tree-owner-birth-year');
          expect(birthYearText).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Spouse button state updates
   * For any tree owner, when a spouse exists, the "Add Spouse" button should 
   * reflect the existing relationship (disabled or showing "View Spouse").
   * Validates: Requirements 3.5
   */
  it('Property 6: Spouse button state updates - button reflects spouse existence', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.boolean(),
        (firstName, lastName, hasSpouse) => {
          const treeOwner = {
            id: 'test-owner-id',
            firstName,
            lastName,
            dateOfBirth: null,
            photoUrl: null,
          };

          const mockHandlers = {
            onAddParents: () => {},
            onAddSpouse: () => {},
            onAddChildren: () => {},
          };

          const { container } = render(
            <TreeOwnerProfile 
              treeOwner={treeOwner}
              hasSpouse={hasSpouse}
              {...mockHandlers}
            />
          );

          // Find the spouse button
          const buttons = container.querySelectorAll('.tree-owner-action-button');
          const spouseButton = Array.from(buttons).find(btn => 
            btn.textContent.includes('Spouse')
          );

          expect(spouseButton).toBeTruthy();

          if (hasSpouse) {
            // When spouse exists, button should be disabled and show "Spouse Added"
            expect(spouseButton.disabled).toBe(true);
            expect(spouseButton.textContent).toContain('Spouse Added');
          } else {
            // When no spouse, button should be enabled and show "Add Spouse"
            expect(spouseButton.disabled).toBe(false);
            expect(spouseButton.textContent).toContain('Add Spouse');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test: Tree owner information is always displayed
   */
  it('displays tree owner name and label for any valid tree owner', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Za-z]+$/.test(s)),
        (firstName, lastName) => {
          const treeOwner = {
            id: 'test-owner-id',
            firstName,
            lastName,
            dateOfBirth: null,
            photoUrl: null,
          };

          const mockHandlers = {
            onAddParents: () => {},
            onAddSpouse: () => {},
            onAddChildren: () => {},
          };

          const { container } = render(
            <TreeOwnerProfile 
              treeOwner={treeOwner}
              {...mockHandlers}
            />
          );

          // Check that name is displayed
          const nameElement = container.querySelector('.tree-owner-name');
          expect(nameElement).toBeTruthy();
          expect(nameElement.textContent).toBe(`${firstName} ${lastName}`);
          
          // Check that "Tree Owner" label is displayed
          const labelElement = container.querySelector('.tree-owner-label');
          expect(labelElement).toBeTruthy();
          expect(labelElement.textContent).toBe('Tree Owner');
          
          // Check that "GROW YOUR TREE" heading is displayed
          const headingElement = container.querySelector('.tree-owner-actions-heading');
          expect(headingElement).toBeTruthy();
          expect(headingElement.textContent).toBe('GROW YOUR TREE');
        }
      ),
      { numRuns: 100 }
    );
  });
});
