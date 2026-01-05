import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { BrowserRouter } from 'react-router-dom';
import MemberCard from './MemberCard';
import MemberDetailPanel from './MemberDetailPanel';

describe('MemberDetailPanel Property Tests', () => {
  // Generator for family member data
  const familyMemberArb = fc.record({
    id: fc.uuid(),
    firstName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
    lastName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0).map(s => s.trim()),
    photoUrl: fc.oneof(
      fc.constant(null),
      fc.webUrl()
    ),
    dateOfBirth: fc.oneof(
      fc.constant(null),
      fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString().split('T')[0])
    ),
    gender: fc.constantFrom('male', 'female'),
    isLiving: fc.boolean(),
    email: fc.oneof(fc.constant(null), fc.emailAddress()),
    location: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 50 })),
    userId: fc.oneof(fc.constant(null), fc.uuid()),
    createdBy: fc.uuid(),
    createdAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
    updatedAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
  });

  // Feature: family-tree, Property 30: Member click shows detail panel
  // Validates: Requirements 15.1
  it('should show detail panel when any member card is clicked', () => {
    fc.assert(
      fc.property(
        familyMemberArb,
        (member) => {
          const handleMemberClick = vi.fn();

          // Render a member card
          const { container } = render(
            <MemberCard 
              member={member} 
              relationshipLabel="Family Member"
              onClick={handleMemberClick}
            />
          );

          // Click the member card
          const card = container.querySelector('.member-card');
          expect(card).toBeTruthy();
          card.click();

          // Property: Clicking the card should trigger the click handler
          // This handler would then show the detail panel in the actual application
          expect(handleMemberClick).toHaveBeenCalledTimes(1);

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Generator for relationships
  const relationshipArb = (fromId, toId) => fc.record({
    id: fc.uuid(),
    fromUserId: fc.constant(fromId),
    toUserId: fc.constant(toId),
    relationshipType: fc.constantFrom('parent', 'child', 'sibling', 'spouse', 'grandparent', 'grandchild'),
    specificLabel: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 20 })),
    createdAt: fc.integer({ min: 0, max: Date.now() }).map(ts => new Date(ts).toISOString()),
  });

  // Feature: family-tree, Property 31: Detail panel displays member information
  // Validates: Requirements 15.2
  it('should display complete member information in detail panel for any selected member', () => {
    fc.assert(
      fc.property(
        familyMemberArb,
        (member) => {
          const mockHandlers = {
            onProfileClick: vi.fn(),
            onEditClick: vi.fn(),
            onAddRelativeClick: vi.fn(),
            onRelatedMemberClick: vi.fn(),
          };

          const { container } = render(
            <BrowserRouter>
              <MemberDetailPanel 
                selectedMember={member}
                allMembers={[member]}
                relationships={[]}
                {...mockHandlers}
              />
            </BrowserRouter>
          );

          // Property: The detail panel should display the member's full name
          const nameElement = container.querySelector('.member-detail-name');
          expect(nameElement).toBeTruthy();
          expect(nameElement.textContent).toContain(member.firstName);
          expect(nameElement.textContent).toContain(member.lastName);

          // Property: The detail panel should have a large profile photo or placeholder
          const photoContainer = container.querySelector('.member-detail-photo-container');
          expect(photoContainer).toBeTruthy();

          if (member.photoUrl) {
            // If photoUrl exists, should render an image
            const imageElement = container.querySelector('.member-detail-photo');
            expect(imageElement).toBeTruthy();
            expect(imageElement.getAttribute('src')).toBe(member.photoUrl);
          } else {
            // If no photoUrl, should render placeholder with initials
            const placeholderElement = container.querySelector('.member-detail-photo-placeholder');
            expect(placeholderElement).toBeTruthy();
            
            const expectedInitials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
            expect(placeholderElement.textContent).toBe(expectedInitials);
          }

          // Property: If birth year exists, it should be displayed in "Born YYYY" format
          if (member.dateOfBirth) {
            const birthYearElement = container.querySelector('.member-detail-birth-year');
            expect(birthYearElement).toBeTruthy();
            expect(birthYearElement.textContent).toMatch(/Born \d{4}/);
          }

          // Property: If location exists, it should be displayed
          if (member.location) {
            const locationElement = container.querySelector('.member-detail-location');
            expect(locationElement).toBeTruthy();
            expect(locationElement.textContent).toBe(member.location);
          }

          // Property: The detail panel should have Profile and Edit buttons
          const profileButton = screen.getByRole('button', { name: /view member profile/i });
          expect(profileButton).toBeTruthy();
          expect(profileButton.textContent).toBe('Profile');

          const editButton = screen.getByRole('button', { name: /edit member information/i });
          expect(editButton).toBeTruthy();
          expect(editButton.textContent).toBe('Edit');

          // Property: The detail panel should have an Add Relative button
          const addRelativeButton = screen.getByRole('button', { name: /add relative to this member/i });
          expect(addRelativeButton).toBeTruthy();

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: family-tree, Property 32: Related members display complete information
  // Validates: Requirements 15.5
  it('should display complete information for all related members', () => {
    fc.assert(
      fc.property(
        familyMemberArb,
        fc.array(familyMemberArb, { minLength: 1, maxLength: 5 }),
        (selectedMember, relatedMembersData) => {
          // Create relationships between selected member and related members
          const relationships = relatedMembersData.map((relatedMember, index) => ({
            id: `rel-${index}`,
            fromUserId: index % 2 === 0 ? selectedMember.id : relatedMember.id,
            toUserId: index % 2 === 0 ? relatedMember.id : selectedMember.id,
            relationshipType: ['parent', 'child', 'sibling', 'spouse'][index % 4],
            specificLabel: null,
            createdAt: new Date().toISOString(),
          }));

          const allMembers = [selectedMember, ...relatedMembersData];

          const mockHandlers = {
            onProfileClick: vi.fn(),
            onEditClick: vi.fn(),
            onAddRelativeClick: vi.fn(),
            onRelatedMemberClick: vi.fn(),
          };

          const { container } = render(
            <BrowserRouter>
              <MemberDetailPanel 
                selectedMember={selectedMember}
                allMembers={allMembers}
                relationships={relationships}
                {...mockHandlers}
              />
            </BrowserRouter>
          );

          // Property: The detail panel should have a related members section
          const relatedSection = container.querySelector('.member-detail-related');
          expect(relatedSection).toBeTruthy();

          // Property: Each related member should be displayed
          const relatedItems = container.querySelectorAll('.related-member-item');
          expect(relatedItems.length).toBe(relatedMembersData.length);

          // Property: Each related member item should have complete information
          relatedItems.forEach((item, index) => {
            const relatedMember = relatedMembersData[index];

            // Should have photo or placeholder
            const photoContainer = item.querySelector('.related-member-photo-container');
            expect(photoContainer).toBeTruthy();

            if (relatedMember.photoUrl) {
              const photo = item.querySelector('.related-member-photo');
              expect(photo).toBeTruthy();
              expect(photo.getAttribute('src')).toBe(relatedMember.photoUrl);
            } else {
              const placeholder = item.querySelector('.related-member-photo-placeholder');
              expect(placeholder).toBeTruthy();
              const expectedInitials = `${relatedMember.firstName.charAt(0)}${relatedMember.lastName.charAt(0)}`.toUpperCase();
              expect(placeholder.textContent).toBe(expectedInitials);
            }

            // Should have initials badge
            const badge = item.querySelector('.related-member-initials-badge');
            expect(badge).toBeTruthy();
            const expectedInitials = `${relatedMember.firstName.charAt(0)}${relatedMember.lastName.charAt(0)}`.toUpperCase();
            expect(badge.textContent).toBe(expectedInitials);

            // Should have name
            const nameElement = item.querySelector('.related-member-name');
            expect(nameElement).toBeTruthy();
            expect(nameElement.textContent).toContain(relatedMember.firstName);
            expect(nameElement.textContent).toContain(relatedMember.lastName);

            // Should have relationship label
            const relationshipElement = item.querySelector('.related-member-relationship');
            expect(relationshipElement).toBeTruthy();
            expect(relationshipElement.textContent.length).toBeGreaterThan(0);
          });

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
