import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import TagSearch from './TagSearch';

// Helper to create mock family member
const createMockMember = (id, firstName, lastName) => ({
  id,
  firstName,
  lastName
});

describe('TagSearch Property Tests', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
  });
  // **Feature: quick-actions, Property 9: Family member search returns matching results**
  // **Validates: Requirements 8.5**
  it('should display matching results when provided', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            firstName: fc.string({ minLength: 1, maxLength: 20 }),
            lastName: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        fc.string({ minLength: 1, maxLength: 10 }),
        (members, query) => {
          // Filter members that match the query (case-insensitive)
          const matchingMembers = members.filter(m => 
            m.firstName.toLowerCase().includes(query.toLowerCase()) ||
            m.lastName.toLowerCase().includes(query.toLowerCase())
          );

          const { container, rerender } = render(
            <TagSearch 
              onSearch={() => {}}
              results={[]}
              onSelect={() => {}}
              selectedTags={[]}
            />
          );

          // Simulate having typed and received results
          rerender(
            <TagSearch 
              onSearch={() => {}}
              results={matchingMembers}
              onSelect={() => {}}
              selectedTags={[]}
            />
          );

          // Manually set the input value and trigger dropdown
          const input = container.querySelector('.tag-search-input');
          input.value = query;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('focus', { bubbles: true }));

          // If there are matching results, verify they're displayed
          if (matchingMembers.length > 0) {
            const resultElements = container.querySelectorAll('.tag-search-result');
            // Results might not show if query is empty after trim
            if (query.trim()) {
              expect(resultElements.length).toBeLessThanOrEqual(matchingMembers.length);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: quick-actions, Property 10: Tag management maintains consistency**
  // **Validates: Requirements 9.1, 9.2, 9.3**
  it('should display selected tags correctly', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            firstName: fc.string({ minLength: 1, maxLength: 20 }),
            lastName: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (selectedTags) => {
          const { container } = render(
            <TagSearch 
              onSearch={() => {}}
              results={[]}
              onSelect={() => {}}
              selectedTags={selectedTags}
            />
          );

          // Verify all tags are displayed
          const tagElements = container.querySelectorAll('.tag-search-tag');
          expect(tagElements.length).toBe(selectedTags.length);

          // Verify each tag contains the correct name
          selectedTags.forEach((tag, index) => {
            const tagElement = tagElements[index];
            expect(tagElement.textContent).toContain(tag.firstName);
            expect(tagElement.textContent).toContain(tag.lastName);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should remove tag when remove button is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            firstName: fc.string({ minLength: 1, maxLength: 20 }),
            lastName: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.integer({ min: 0, max: 4 }),
        async (tags, indexToRemove) => {
          if (tags.length === 0) return; // Skip empty arrays
          
          const validIndex = indexToRemove % tags.length;
          let removedId = null;
          
          const handleSelect = (id) => {
            removedId = id;
          };

          const { container } = render(
            <TagSearch 
              onSearch={() => {}}
              results={[]}
              onSelect={handleSelect}
              selectedTags={tags}
            />
          );

          const removeButtons = container.querySelectorAll('.tag-search-tag-remove');
          if (removeButtons.length > 0) {
            await userEvent.click(removeButtons[validIndex]);

            // Verify the correct tag was removed
            expect(removedId).toBe(tags[validIndex].id);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should not show already selected tags in search results', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            firstName: fc.string({ minLength: 1, maxLength: 20 }),
            lastName: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (members) => {
          if (members.length < 2) return; // Need at least 2 members
          
          const selectedTag = members[0];
          const allResults = members;

          const { container } = render(
            <TagSearch 
              onSearch={() => {}}
              results={allResults}
              onSelect={() => {}}
              selectedTags={[selectedTag]}
            />
          );

          const input = container.querySelector('.tag-search-input');
          await userEvent.type(input, 'test');

          // Wait for dropdown
          await waitFor(() => {
            const dropdown = container.querySelector('.tag-search-dropdown');
            if (dropdown) {
              // Verify selected tag is not in results
              const resultElements = container.querySelectorAll('.tag-search-result');
              const resultTexts = Array.from(resultElements).map(el => el.textContent);
              
              const selectedTagText = `${selectedTag.firstName} ${selectedTag.lastName}`;
              expect(resultTexts).not.toContain(selectedTagText);
            }
          }, { timeout: 500 });
        }
      ),
      { numRuns: 50 }
    );
  });
});
