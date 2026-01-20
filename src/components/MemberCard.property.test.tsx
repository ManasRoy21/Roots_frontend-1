import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import MemberCard from './MemberCard';

describe('MemberCard Property Tests', () => {
  // Feature: family-tree, Property 1: Member card displays complete information
  // Validates: Requirements 1.2, 6.2, 15.2
  it('should display complete member information for any family member', () => {
    // Generator for family member data
    const familyMemberArb = fc.record({
      id: fc.uuid(),
      firstName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      lastName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
      photoUrl: fc.oneof(
        fc.constant(null),
        fc.webUrl()
      ),
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
      'Daughter',
      'Partner',
      'Wife',
      'Husband',
      'Brother',
      'Sister',
      'Grandfather',
      'Grandmother'
    );

    fc.assert(
      fc.property(
        familyMemberArb,
        relationshipLabelArb,
        (member, relationshipLabel) => {
          const { container } = render(
            <MemberCard 
              member={member} 
              relationshipLabel={relationshipLabel}
            />
          );

          // Property: The card should contain the member's full name
          const nameElement = container.querySelector('.member-card-name');
          expect(nameElement).toBeTruthy();
          expect(nameElement.textContent).toContain(member.firstName);
          expect(nameElement.textContent).toContain(member.lastName);

          // Property: The card should contain the relationship label
          const labelElement = container.querySelector('.member-card-label');
          expect(labelElement).toBeTruthy();
          expect(labelElement.textContent).toBe(relationshipLabel);

          // Property: The card should have a photo or placeholder
          const photoContainer = container.querySelector('.member-card-photo');
          expect(photoContainer).toBeTruthy();

          if (member.photoUrl) {
            // If photoUrl exists, should render an image
            const imageElement = container.querySelector('.member-card-image');
            expect(imageElement).toBeTruthy();
            expect(imageElement.getAttribute('src')).toBe(member.photoUrl);
            expect(imageElement.getAttribute('alt')).toContain(member.firstName);
            expect(imageElement.getAttribute('alt')).toContain(member.lastName);
          } else {
            // If no photoUrl, should render placeholder with initials
            const placeholderElement = container.querySelector('.member-card-placeholder');
            expect(placeholderElement).toBeTruthy();
            
            const expectedInitials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
            expect(placeholderElement.textContent).toBe(expectedInitials);
          }

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
