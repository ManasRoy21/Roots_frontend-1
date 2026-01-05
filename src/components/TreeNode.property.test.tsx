import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import TreeNode from './TreeNode';
import { buildTreeStructure } from '../utils/treeLayout';

describe('TreeNode Property Tests', () => {
  // Helper to create a family member
  const createMember = (id, firstName, lastName, gender) => ({
    id,
    firstName,
    lastName,
    gender,
    dateOfBirth: new Date().toISOString(),
    isLiving: true,
    email: null,
    photoUrl: null,
    location: null,
    userId: null,
    createdBy: 'test-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Feature: family-tree, Property 2: Parent positioning is correct
  // Validates: Requirements 2.4
  it('should position parent cards above child card for any parent-child relationship', () => {
    // Generator for parent-child scenarios
    const parentChildArb = fc.record({
      childName: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0),
      parentName: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0),
      parentGender: fc.constantFrom('male', 'female'),
    });

    fc.assert(
      fc.property(
        parentChildArb,
        (scenario) => {
          // Create members
          const child = createMember('child-1', scenario.childName, 'Smith', 'male');
          const parent = createMember('parent-1', scenario.parentName, 'Smith', scenario.parentGender);
          
          const members = [child, parent];
          const relationships = [
            {
              id: 'rel-1',
              fromUserId: 'parent-1',
              toUserId: 'child-1',
              relationshipType: 'parent',
              specificLabel: null,
              createdAt: new Date().toISOString(),
            }
          ];

          // Build tree structure
          const treeNode = buildTreeStructure(members, relationships, 'child-1');
          
          // Render the tree
          const { container } = render(
            <TreeNode
              node={treeNode}
              allMembers={members}
              relationships={relationships}
              isRoot={true}
              onMemberClick={() => {}}
              onPlaceholderClick={() => {}}
            />
          );

          // Property: Parent section should exist above the current member
          const parentsSection = container.querySelector('.tree-node-parents');
          expect(parentsSection).toBeTruthy();

          // Property: Parent card should be rendered in the parents section
          const parentCards = parentsSection.querySelectorAll('.member-card');
          expect(parentCards.length).toBeGreaterThan(0);

          // Property: Parent card should contain the parent's name
          const parentCard = Array.from(parentCards).find(card => 
            card.textContent.includes(scenario.parentName)
          );
          expect(parentCard).toBeTruthy();

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 3: Spouse positioning is correct
  // Validates: Requirements 3.2
  it('should position spouse card adjacent to member card at same level for any spouse relationship', () => {
    // Generator for spouse scenarios
    const spouseArb = fc.record({
      memberName: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0),
      spouseName: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0),
      spouseGender: fc.constantFrom('male', 'female'),
    });

    fc.assert(
      fc.property(
        spouseArb,
        (scenario) => {
          // Create members
          const member = createMember('member-1', scenario.memberName, 'Smith', 'male');
          const spouse = createMember('spouse-1', scenario.spouseName, 'Jones', scenario.spouseGender);
          
          const members = [member, spouse];
          const relationships = [
            {
              id: 'rel-1',
              fromUserId: 'member-1',
              toUserId: 'spouse-1',
              relationshipType: 'spouse',
              specificLabel: null,
              createdAt: new Date().toISOString(),
            }
          ];

          // Build tree structure
          const treeNode = buildTreeStructure(members, relationships, 'member-1');
          
          // Render the tree
          const { container } = render(
            <TreeNode
              node={treeNode}
              allMembers={members}
              relationships={relationships}
              isRoot={true}
              onMemberClick={() => {}}
              onPlaceholderClick={() => {}}
            />
          );

          // Property: Member row should contain both member and spouse
          const memberRow = container.querySelector('.tree-node-member-row');
          expect(memberRow).toBeTruthy();

          // Property: Should have both member and spouse sections
          const memberSection = memberRow.querySelector('.tree-node-member');
          const spouseSection = memberRow.querySelector('.tree-node-spouse');
          expect(memberSection).toBeTruthy();
          expect(spouseSection).toBeTruthy();

          // Property: Both cards should be rendered
          const allCards = memberRow.querySelectorAll('.member-card');
          expect(allCards.length).toBe(2);

          // Property: Spouse card should contain the spouse's name
          const spouseCard = Array.from(allCards).find(card => 
            card.textContent.includes(scenario.spouseName)
          );
          expect(spouseCard).toBeTruthy();

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 7: Child positioning is correct
  // Validates: Requirements 4.3
  it('should position child cards below parent card for any parent-child relationship', () => {
    // Generator for parent-child scenarios
    const parentChildArb = fc.record({
      parentName: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0),
      childName: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0),
      childGender: fc.constantFrom('male', 'female'),
    });

    fc.assert(
      fc.property(
        parentChildArb,
        (scenario) => {
          // Create members
          const parent = createMember('parent-1', scenario.parentName, 'Smith', 'male');
          const child = createMember('child-1', scenario.childName, 'Smith', scenario.childGender);
          
          const members = [parent, child];
          const relationships = [
            {
              id: 'rel-1',
              fromUserId: 'parent-1',
              toUserId: 'child-1',
              relationshipType: 'parent',
              specificLabel: null,
              createdAt: new Date().toISOString(),
            }
          ];

          // Build tree structure
          const treeNode = buildTreeStructure(members, relationships, 'parent-1');
          
          // Render the tree
          const { container } = render(
            <TreeNode
              node={treeNode}
              allMembers={members}
              relationships={relationships}
              isRoot={true}
              onMemberClick={() => {}}
              onPlaceholderClick={() => {}}
            />
          );

          // Property: Children section should exist below the current member
          const childrenSection = container.querySelector('.tree-node-children');
          expect(childrenSection).toBeTruthy();

          // Property: Child card should be rendered in the children section
          const childCards = childrenSection.querySelectorAll('.member-card');
          expect(childCards.length).toBeGreaterThan(0);

          // Property: Child card should contain the child's name
          const childCard = Array.from(childCards).find(card => 
            card.textContent.includes(scenario.childName)
          );
          expect(childCard).toBeTruthy();

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
