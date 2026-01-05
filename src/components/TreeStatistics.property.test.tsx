import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import TreeStatistics from './TreeStatistics';

/**
 * Property-based tests for TreeStatistics component
 * Feature: family-tree
 */

describe('TreeStatistics Property Tests', () => {
  /**
   * **Feature: family-tree, Property 37: Statistics update on tree changes**
   * **Validates: Requirements 17.4**
   * 
   * For any family tree, when a new member is added, the statistics 
   * (member count and generation count) should immediately recalculate and update.
   */
  it('Property 37: Statistics update on tree changes', () => {
    fc.assert(
      fc.property(
        // Generate initial tree with at least 1 member
        fc.array(
          fc.record({
            id: fc.uuid(),
            firstName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            lastName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        // Generate relationships
        fc.array(
          fc.record({
            id: fc.uuid(),
            fromUserId: fc.string(),
            toUserId: fc.string(),
            relationshipType: fc.constantFrom('parent', 'child', 'spouse', 'sibling'),
          }),
          { maxLength: 5 }
        ),
        (initialMembers, initialRelationships) => {
          const rootMemberId = initialMembers[0].id;

          // Render with initial members
          const { rerender, container } = render(
            <TreeStatistics
              members={initialMembers}
              relationships={initialRelationships}
              rootMemberId={rootMemberId}
            />
          );

          // Get initial member count from the rendered component
          const initialMemberCountText = container.querySelector('.tree-statistic-value')?.textContent;
          expect(initialMemberCountText).toContain(`${initialMembers.length} Member`);

          // Add a new member
          const newMember = {
            id: 'new-member-id',
            firstName: 'New',
            lastName: 'Member',
          };
          const updatedMembers = [...initialMembers, newMember];

          // Rerender with updated members
          rerender(
            <TreeStatistics
              members={updatedMembers}
              relationships={initialRelationships}
              rootMemberId={rootMemberId}
            />
          );

          // Verify member count updated
          const updatedMemberCountText = container.querySelector('.tree-statistic-value')?.textContent;
          expect(updatedMemberCountText).toContain(`${updatedMembers.length} Member`);

          // Property: The displayed count should equal the actual member count
          expect(updatedMembers.length).toBe(initialMembers.length + 1);

          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: family-tree, Property 38: Member count formatting**
   * **Validates: Requirements 17.5**
   * 
   * For any member count value, it should be displayed with appropriate labels 
   * (e.g., "42 Members").
   */
  it('Property 38: Member count formatting', () => {
    fc.assert(
      fc.property(
        // Generate a tree with varying number of members (0 to 100)
        fc.integer({ min: 0, max: 100 }),
        (memberCount) => {
          // Generate members array with the specified count
          const members = Array.from({ length: memberCount }, (_, i) => ({
            id: `member-${i}`,
            firstName: `First${i}`,
            lastName: `Last${i}`,
          }));

          const relationships = [];
          const rootMemberId = memberCount > 0 ? members[0].id : 'root';

          // Render the component
          const { container } = render(
            <TreeStatistics
              members={members}
              relationships={relationships}
              rootMemberId={rootMemberId}
            />
          );

          // Get the member count text
          const memberCountText = container.querySelector('.tree-statistic-value')?.textContent;

          // Property: Member count should be formatted with appropriate label
          if (memberCount === 0) {
            expect(memberCountText).toBe('0 Members');
          } else if (memberCount === 1) {
            expect(memberCountText).toBe('1 Member');
          } else {
            expect(memberCountText).toBe(`${memberCount} Members`);
          }

          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
