import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import PhotoPreviewGrid from './PhotoPreviewGrid';

// Helper to create mock File objects
const createMockFile = (name) => {
  return new File(['test'], name, { type: 'image/jpeg' });
};

// Helper to create data URL for preview
const createPreviewUrl = (index) => {
  return `data:image/jpeg;base64,preview${index}`;
};

describe('PhotoPreviewGrid Property Tests', () => {
  // **Feature: quick-actions, Property 7: Photo selection creates previews**
  // **Validates: Requirements 7.1**
  it('should display exactly the same number of previews as files', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }), // Number of files
        (numFiles) => {
          const files = Array.from({ length: numFiles }, (_, i) => 
            createMockFile(`photo${i}.jpg`)
          );
          const previews = Array.from({ length: numFiles }, (_, i) => 
            createPreviewUrl(i)
          );

          const { container } = render(
            <PhotoPreviewGrid 
              files={files}
              previews={previews}
              onClearAll={() => {}}
              onRemove={() => {}}
            />
          );

          // Count preview items
          const previewItems = container.querySelectorAll('.photo-preview-item');
          expect(previewItems.length).toBe(numFiles);

          // Verify count in header
          const header = container.querySelector('.photo-preview-title');
          expect(header.textContent).toContain(`(${numFiles})`);
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: quick-actions, Property 8: Clear all removes all photos**
  // **Validates: Requirements 7.3**
  it('should call onClearAll when clear all button is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }), // Number of files
        async (numFiles) => {
          const files = Array.from({ length: numFiles }, (_, i) => 
            createMockFile(`photo${i}.jpg`)
          );
          const previews = Array.from({ length: numFiles }, (_, i) => 
            createPreviewUrl(i)
          );

          let clearAllCalled = false;
          const handleClearAll = () => {
            clearAllCalled = true;
          };

          const { container } = render(
            <PhotoPreviewGrid 
              files={files}
              previews={previews}
              onClearAll={handleClearAll}
              onRemove={() => {}}
            />
          );

          const clearButton = container.querySelector('.photo-preview-clear-all');
          await userEvent.click(clearButton);

          // Verify clear all was called
          expect(clearAllCalled).toBe(true);
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should call onRemove with correct index when remove button is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 10 }), // Number of files (at least 2)
        fc.integer({ min: 0, max: 9 }), // Index to remove
        async (numFiles, indexToRemove) => {
          // Ensure index is within bounds
          const validIndex = indexToRemove % numFiles;
          
          const files = Array.from({ length: numFiles }, (_, i) => 
            createMockFile(`photo${i}.jpg`)
          );
          const previews = Array.from({ length: numFiles }, (_, i) => 
            createPreviewUrl(i)
          );

          let removedIndex = null;
          const handleRemove = (index) => {
            removedIndex = index;
          };

          const { container } = render(
            <PhotoPreviewGrid 
              files={files}
              previews={previews}
              onClearAll={() => {}}
              onRemove={handleRemove}
            />
          );

          const removeButtons = container.querySelectorAll('.photo-preview-remove');
          await userEvent.click(removeButtons[validIndex]);

          // Verify correct index was passed
          expect(removedIndex).toBe(validIndex);
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not render when files array is empty', () => {
    fc.assert(
      fc.property(
        fc.constant([]), // Empty array
        (files) => {
          const { container } = render(
            <PhotoPreviewGrid 
              files={files}
              previews={[]}
              onClearAll={() => {}}
              onRemove={() => {}}
            />
          );

          // Should not render anything
          const wrapper = container.querySelector('.photo-preview-grid-wrapper');
          expect(wrapper).toBeNull();
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
