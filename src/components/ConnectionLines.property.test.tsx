import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import ConnectionLines from './ConnectionLines';

describe('ConnectionLines Property Tests', () => {
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

  // Feature: family-tree, Property 20: Parent-child connection lines
  // Validates: Requirements 10.1, 10.3
  it('should draw vertical connecting lines for any parent-child relationship', () => {
    // Generator for parent-child scenarios
    const parentChildArb = fc.record({
      parentCount: fc.constantFrom(1, 2),
      childCount: fc.integer({ min: 1, max: 5 }),
      zoomLevel: fc.integer({ min: 10, max: 200 }),
    });

    fc.assert(
      fc.property(
        parentChildArb,
        (scenario) => {
          // Create members
          const member = createMember('member-1', 'John', 'Smith', 'male');
          
          const parents = [];
          for (let i = 0; i < scenario.parentCount; i++) {
            const gender = i === 0 ? 'male' : 'female';
            parents.push({
              member: createMember(`parent-${i}`, `Parent${i}`, 'Smith', gender),
            });
          }

          const children = [];
          for (let i = 0; i < scenario.childCount; i++) {
            children.push({
              member: createMember(`child-${i}`, `Child${i}`, 'Smith', 'male'),
            });
          }

          const node = {
            member,
            parents,
            children,
            spouse: null,
          };

          // Render the connection lines
          const { container } = render(
            <ConnectionLines node={node} zoomLevel={scenario.zoomLevel} />
          );

          // Property: SVG element should exist
          const svg = container.querySelector('svg.connection-lines');
          expect(svg).toBeTruthy();

          // Property: Should have vertical lines for parent-child connections
          const lines = svg.querySelectorAll('line');
          expect(lines.length).toBeGreaterThan(0);

          // Property: Should have a line from parents to member
          const parentToMemberLine = Array.from(lines).find(line => 
            line.getAttribute('y1') === '0' && line.getAttribute('y2') === '40'
          );
          expect(parentToMemberLine).toBeTruthy();

          // Property: Should have a line from member to children
          const memberToChildrenLine = Array.from(lines).find(line => 
            line.getAttribute('y1') === '100%' && 
            line.getAttribute('y2') === 'calc(100% + 40px)'
          );
          expect(memberToChildrenLine).toBeTruthy();

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 21: Spouse connection line
  // Validates: Requirements 10.4
  it('should draw horizontal connecting line for any spouse relationship', () => {
    // Generator for spouse scenarios
    const spouseArb = fc.record({
      hasSpouse: fc.boolean(),
      zoomLevel: fc.integer({ min: 10, max: 200 }),
    });

    fc.assert(
      fc.property(
        spouseArb,
        (scenario) => {
          // Create members
          const member = createMember('member-1', 'John', 'Smith', 'male');
          const spouse = scenario.hasSpouse 
            ? { member: createMember('spouse-1', 'Jane', 'Smith', 'female') }
            : null;

          const node = {
            member,
            parents: [],
            children: [],
            spouse,
          };

          // Render the connection lines
          const { container } = render(
            <ConnectionLines node={node} zoomLevel={scenario.zoomLevel} />
          );

          // Property: SVG element should exist
          const svg = container.querySelector('svg.connection-lines');
          expect(svg).toBeTruthy();

          const lines = svg.querySelectorAll('line');

          if (scenario.hasSpouse) {
            // Property: Should have a horizontal line connecting spouses
            const spouseLine = Array.from(lines).find(line => 
              line.getAttribute('y1') === '50%' && line.getAttribute('y2') === '50%'
            );
            expect(spouseLine).toBeTruthy();
          } else {
            // Property: Should not have a spouse line when no spouse exists
            const spouseLine = Array.from(lines).find(line => 
              line.getAttribute('y1') === '50%' && line.getAttribute('y2') === '50%'
            );
            expect(spouseLine).toBeFalsy();
          }

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 22: Multiple children connection lines
  // Validates: Requirements 10.5
  it('should draw branching lines from common point for any family with multiple children', () => {
    // Generator for multiple children scenarios
    const multipleChildrenArb = fc.record({
      childCount: fc.integer({ min: 2, max: 6 }),
      zoomLevel: fc.integer({ min: 10, max: 200 }),
    });

    fc.assert(
      fc.property(
        multipleChildrenArb,
        (scenario) => {
          // Create members
          const member = createMember('member-1', 'John', 'Smith', 'male');
          
          const children = [];
          for (let i = 0; i < scenario.childCount; i++) {
            children.push({
              member: createMember(`child-${i}`, `Child${i}`, 'Smith', 'male'),
            });
          }

          const node = {
            member,
            parents: [],
            children,
            spouse: null,
          };

          // Render the connection lines
          const { container } = render(
            <ConnectionLines node={node} zoomLevel={scenario.zoomLevel} />
          );

          // Property: SVG element should exist
          const svg = container.querySelector('svg.connection-lines');
          expect(svg).toBeTruthy();

          const lines = svg.querySelectorAll('line');

          // Property: Should have a horizontal line connecting children
          // The horizontal line should be at y="calc(100% + 40px)"
          const childrenHorizontalLine = Array.from(lines).find(line => {
            const y1 = line.getAttribute('y1');
            const y2 = line.getAttribute('y2');
            return y1 === 'calc(100% + 40px)' && y2 === 'calc(100% + 40px)' && 
                   line.getAttribute('x1') !== line.getAttribute('x2');
          });
          expect(childrenHorizontalLine).toBeTruthy();

          // Property: Should have vertical lines for each child (from horizontal bar down)
          const childVerticalLines = Array.from(lines).filter(line => {
            const y1 = line.getAttribute('y1');
            const y2 = line.getAttribute('y2');
            return y1 === 'calc(100% + 40px)' && y2 === 'calc(100% + 60px)';
          });
          expect(childVerticalLines.length).toBe(scenario.childCount);

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
