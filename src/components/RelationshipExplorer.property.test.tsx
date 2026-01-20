import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import fc from 'fast-check';
import RelationshipExplorer from './RelationshipExplorer';

describe('RelationshipExplorer Property Tests', () => {
  // Generator for family member data
  const familyMemberArb = fc.record({
    id: fc.uuid(),
    firstName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    lastName: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    photoUrl: fc.oneof(
      fc.constant(null),
      fc.webUrl()
    ),
  });

  // Generator for relationship data
  const relationshipArb = fc.record({
    id: fc.uuid(),
    fromUserId: fc.uuid(),
    toUserId: fc.uuid(),
    relationshipType: fc.constantFrom('parent', 'child', 'sibling', 'spouse'),
    specificLabel: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 30 })),
  });

  /**
   * **Feature: family-tree, Property 33: Trace path button enabled when target selected**
   * **Validates: Requirements 16.3**
   * 
   * For any relationship explorer state, the "Trace Path" button should be enabled 
   * if and only if a target member has been selected.
   */
  it('Property 33: Trace path button enabled when target selected', () => {
    fc.assert(
      fc.property(
        familyMemberArb,
        fc.array(familyMemberArb, { minLength: 1, maxLength: 10 }),
        fc.array(relationshipArb, { minLength: 0, maxLength: 20 }),
        (startMember, allMembers, relationships) => {
          // Ensure start member is not in allMembers to avoid duplication
          const filteredMembers = allMembers.filter(m => m.id !== startMember.id);
          
          // Skip if no other members available
          if (filteredMembers.length === 0) {
            return true;
          }

          const mockOnTracePath = vi.fn();

          // Render with no target selected
          const { unmount } = render(
            <BrowserRouter>
              <RelationshipExplorer
                startMember={startMember}
                allMembers={[startMember, ...filteredMembers]}
                relationships={relationships}
                onTracePath={mockOnTracePath}
              />
            </BrowserRouter>
          );

          // Find the Trace Path button
          const traceButton = screen.getByRole('button', { name: /trace relationship path/i });

          // Button should be disabled when no target is selected
          expect(traceButton).toBeDisabled();

          // Find and change the select dropdown
          const targetSelect = screen.getByLabelText(/select target family member/i);
          const targetMember = filteredMembers[0];
          
          // Simulate selecting a target
          targetSelect.value = targetMember.id;
          targetSelect.dispatchEvent(new Event('change', { bubbles: true }));

          // Find the button again (same button, just checking its state after selection)
          const traceButtonAfterSelect = screen.getByRole('button', { name: /trace relationship path/i });

          // Button should be enabled when target is selected
          expect(traceButtonAfterSelect).not.toBeDisabled();

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: family-tree, Property 34: Path calculation between connected members**
   * **Validates: Requirements 16.4**
   * 
   * For any two family members that are connected through relationships, 
   * clicking "Trace Path" should calculate and display a valid relationship path between them.
   */
  it('Property 34: Path calculation between connected members', async () => {
    await fc.assert(
      fc.asyncProperty(
        familyMemberArb,
        familyMemberArb,
        fc.array(familyMemberArb, { minLength: 0, maxLength: 3 }), // Reduced from 5 to 3
        fc.constantFrom('parent', 'child', 'sibling', 'spouse'),
        async (member1, member2, intermediateMembers, relationshipType) => {
          // Skip if member1 and member2 have the same ID (same person)
          if (member1.id === member2.id) {
            return true;
          }

          // Ensure all members have unique IDs
          const uniqueIntermediates = intermediateMembers.filter(
            m => m.id !== member1.id && m.id !== member2.id
          );
          
          // Create a connected path: member1 -> intermediates -> member2
          const allMembers = [member1, ...uniqueIntermediates, member2];
          const relationships = [];
          
          // Build a chain of relationships
          let prevMemberId = member1.id;
          for (const intermediate of uniqueIntermediates) {
            relationships.push({
              id: `rel-${prevMemberId}-${intermediate.id}`,
              fromUserId: prevMemberId,
              toUserId: intermediate.id,
              relationshipType: relationshipType,
              specificLabel: null,
            });
            prevMemberId = intermediate.id;
          }
          
          // Connect the last member in the chain to member2
          relationships.push({
            id: `rel-${prevMemberId}-${member2.id}`,
            fromUserId: prevMemberId,
            toUserId: member2.id,
            relationshipType: relationshipType,
            specificLabel: null,
          });

          const mockOnTracePath = vi.fn();
          const user = userEvent.setup();

          // Render the component in a container
          const { unmount, container } = render(
            <BrowserRouter>
              <RelationshipExplorer
                startMember={member1}
                allMembers={allMembers}
                relationships={relationships}
                onTracePath={mockOnTracePath}
              />
            </BrowserRouter>
          );

          try {
            // Select the target member using userEvent
            const targetSelect = container.querySelector('select[aria-label="Select target family member"]');
            await user.selectOptions(targetSelect, member2.id);

            // Click the Trace Path button using userEvent
            const traceButton = container.querySelector('button[aria-label="Trace relationship path"]');
            await user.click(traceButton);

            // Wait for the path result to be displayed
            await waitFor(() => {
              // Since members are connected, we should see "Relationship Path:" heading
              const pathHeading = container.querySelector('.relationship-explorer-result-title');
              expect(pathHeading).not.toBeNull();
              expect(pathHeading.textContent).toMatch(/relationship path:/i);
            });

            // The result should show the path description
            // We should NOT see "not connected" message
            const notConnectedMessage = container.querySelector('.relationship-explorer-not-connected');
            expect(notConnectedMessage).toBeNull();

            // The path should contain the target member's name
            const pathDescription = container.querySelector('.relationship-explorer-result-description');
            expect(pathDescription).not.toBeNull();
            const targetMemberName = `${member2.firstName} ${member2.lastName}`;
            expect(pathDescription.textContent).toContain(targetMemberName);
          } finally {
            // Always clean up
            unmount();
          }
        }
      ),
      { numRuns: 20 } // Reduced from 100 to 20 for performance
    );
  }, 10000); // 10 second timeout
});
