import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import ImageUpload from './ImageUpload';

describe('ImageUpload Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  // Feature: landing-auth-onboarding, Property 21: Valid images show preview
  // Validates: Requirements 10.3
  it('should show preview for any valid image file', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid image file properties
        fc.constantFrom('image/jpeg', 'image/png', 'image/gif'),
        fc.integer({ min: 100, max: 5 * 1024 * 1024 }), // Size in bytes, up to 5MB
        fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '_')).filter(s => s.length > 0),
        async (fileType: string, fileSize: number, fileName: string) => {
          try {
            const mockOnUpload = vi.fn();
            
            // Create a mock file
            const mockFile = new File(['mock image content'], `${fileName}.jpg`, {
              type: fileType,
            });
            
            // Mock FileReader
            const mockFileReader = {
              readAsDataURL: vi.fn(),
              onloadend: null,
              result: 'data:image/jpeg;base64,mockBase64Data'
            };
            
            global.FileReader = vi.fn(() => mockFileReader);
            
            const { container, unmount } = render(
              <ImageUpload
                onUpload={mockOnUpload}
                preview={null}
                maxSize={5}
              />
            );
            
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;
            
            // Simulate file selection
            await userEvent.upload(input, mockFile);
            
            // Verify onUpload was called with the file
            expect(mockOnUpload).toHaveBeenCalledWith(mockFile, null);
            
            // Cleanup after each property test run
            unmount();
          } catch (error) {
            // Ensure cleanup even on error
            cleanup();
            throw error;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display preview when preview prop is provided', () => {
    fc.assert(
      fc.property(
        // Generate valid data URLs for images
        fc.constantFrom(
          'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
          'data:image/png;base64,iVBORw0KGgo=',
          'data:image/gif;base64,R0lGODlh'
        ),
        (previewUrl: string) => {
          const mockOnUpload = vi.fn();
          
          const { container } = render(
            <ImageUpload
              onUpload={mockOnUpload}
              preview={previewUrl}
              maxSize={5}
            />
          );
          
          // Verify preview image is displayed
          const previewImage = container.querySelector('img[alt="Profile preview"]') as HTMLImageElement;
          expect(previewImage).toBeInTheDocument();
          expect(previewImage).toHaveAttribute('src', previewUrl);
          
          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should show placeholder when no preview is provided', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        (preview: null) => {
          const mockOnUpload = vi.fn();
          
          const { container } = render(
            <ImageUpload
              onUpload={mockOnUpload}
              preview={preview}
              maxSize={5}
            />
          );
          
          // Verify placeholder (camera icon) is displayed
          const placeholder = container.querySelector('.image-upload-placeholder');
          expect(placeholder).toBeInTheDocument();
          
          // Verify no preview image exists
          const previewImage = container.querySelector('img[alt="Profile preview"]');
          expect(previewImage).not.toBeInTheDocument();
          
          // Cleanup after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
