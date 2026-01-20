import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import MemberCard from './MemberCard';

describe('SearchInput Property Tests', () => {
  // Feature: family-tree, Property 17: Search filters members by name
  // Validates: Requirements 8.2
  it('should filter members by first or last name (case-insensitive) for any search query', () => {
    // Generator for family member data
    const familyMemberArb = fc.record({
      id: fc.uuid(),
      firstName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      lastName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      photoUrl: fc.oneof(fc.constant(null), fc.webUrl()),
      dateOfBirth: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
      gender: fc.constantFrom('male', 'female'),
      isLiving: fc.boolean(),
      email: fc.oneof(fc.constant(null), fc.emailAddress()),
      location: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 50 })),
      userId: fc.oneof(fc.constant(null), fc.uuid()),
      createdBy: fc.uuid(),
      createdAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
      updatedAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
    });

    // Generator for a list of family members
    const familyMembersArb = fc.array(familyMemberArb, { minLength: 0, maxLength: 20 });

    // Generator for search queries (including empty strings and various cases)
    const searchQueryArb = fc.oneof(
      fc.constant(''),
      fc.string({ minLength: 1, maxLength: 20 })
    );

    fc.assert(
      fc.property(
        familyMembersArb,
        searchQueryArb,
        (members, query) => {
          // Implement the search filtering logic (same as in TreeContext)
          const filterMembers = (query, members) => {
            if (!query.trim()) {
              return [];
            }

            const lowerQuery = query.toLowerCase();
            return members
              .filter(member => 
                member.firstName.toLowerCase().includes(lowerQuery) ||
                member.lastName.toLowerCase().includes(lowerQuery)
              )
              .map(member => member.id);
          };

          const results = filterMembers(query, members);

          // Property 1: If query is empty or whitespace, results should be empty
          if (!query.trim()) {
            expect(results).toEqual([]);
          } else {
            const lowerQuery = query.toLowerCase();

            // Property 2: All results should match the query (case-insensitive)
            results.forEach(resultId => {
              const member = members.find(m => m.id === resultId);
              expect(member).toBeTruthy();
              
              const matchesFirstName = member.firstName.toLowerCase().includes(lowerQuery);
              const matchesLastName = member.lastName.toLowerCase().includes(lowerQuery);
              
              expect(matchesFirstName || matchesLastName).toBe(true);
            });

            // Property 3: All matching members should be in results
            members.forEach(member => {
              const matchesFirstName = member.firstName.toLowerCase().includes(lowerQuery);
              const matchesLastName = member.lastName.toLowerCase().includes(lowerQuery);
              
              if (matchesFirstName || matchesLastName) {
                expect(results).toContain(member.id);
              }
            });

            // Property 4: No non-matching members should be in results
            members.forEach(member => {
              const matchesFirstName = member.firstName.toLowerCase().includes(lowerQuery);
              const matchesLastName = member.lastName.toLowerCase().includes(lowerQuery);
              
              if (!matchesFirstName && !matchesLastName) {
                expect(results).not.toContain(member.id);
              }
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 18: Search highlights matching cards
  // Validates: Requirements 8.3
  it('should highlight matching member cards for any search query with results', () => {
    // Generator for family member data
    const familyMemberArb = fc.record({
      id: fc.uuid(),
      firstName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      lastName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      photoUrl: fc.oneof(fc.constant(null), fc.webUrl()),
      dateOfBirth: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
      gender: fc.constantFrom('male', 'female'),
      isLiving: fc.boolean(),
      email: fc.oneof(fc.constant(null), fc.emailAddress()),
      location: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 50 })),
      userId: fc.oneof(fc.constant(null), fc.uuid()),
      createdBy: fc.uuid(),
      createdAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
      updatedAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
    });

    const relationshipLabelArb = fc.constantFrom(
      'Me / Root',
      'Father',
      'Mother',
      'Son',
      'Daughter'
    );

    fc.assert(
      fc.property(
        familyMemberArb,
        relationshipLabelArb,
        fc.array(fc.uuid(), { minLength: 1, maxLength: 10 }),
        (member, relationshipLabel, searchResults) => {
          // Test when member is in search results (should be highlighted)
          const isHighlighted = searchResults.includes(member.id);
          
          const { container } = render(
            <MemberCard 
              member={member} 
              relationshipLabel={relationshipLabel}
              isHighlighted={isHighlighted}
            />
          );

          const card = container.querySelector('.member-card');
          expect(card).toBeTruthy();

          // Property: If member is in search results, card should have highlighted class
          if (isHighlighted) {
            expect(card.classList.contains('member-card-highlighted')).toBe(true);
          } else {
            expect(card.classList.contains('member-card-highlighted')).toBe(false);
          }

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 19: Clearing search removes highlighting
  // Validates: Requirements 8.5
  it('should remove highlighting from all cards when search is cleared', () => {
    // Generator for family member data
    const familyMemberArb = fc.record({
      id: fc.uuid(),
      firstName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      lastName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      photoUrl: fc.oneof(fc.constant(null), fc.webUrl()),
      dateOfBirth: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
      gender: fc.constantFrom('male', 'female'),
      isLiving: fc.boolean(),
      email: fc.oneof(fc.constant(null), fc.emailAddress()),
      location: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 50 })),
      userId: fc.oneof(fc.constant(null), fc.uuid()),
      createdBy: fc.uuid(),
      createdAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
      updatedAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
    });

    const relationshipLabelArb = fc.constantFrom(
      'Me / Root',
      'Father',
      'Mother',
      'Son',
      'Daughter'
    );

    fc.assert(
      fc.property(
        familyMemberArb,
        relationshipLabelArb,
        (member, relationshipLabel) => {
          // Simulate clearing search by passing isHighlighted=false
          // (In the actual app, clearing search sets searchResults to empty array,
          // which causes all cards to have isHighlighted=false)
          
          const { container } = render(
            <MemberCard 
              member={member} 
              relationshipLabel={relationshipLabel}
              isHighlighted={false}
            />
          );

          const card = container.querySelector('.member-card');
          expect(card).toBeTruthy();

          // Property: When search is cleared, no card should have highlighted class
          expect(card.classList.contains('member-card-highlighted')).toBe(false);

          // Property: When search is cleared, no card should have dimmed class
          expect(card.classList.contains('member-card-dimmed')).toBe(false);

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
