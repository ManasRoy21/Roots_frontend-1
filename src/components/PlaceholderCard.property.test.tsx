import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import PlaceholderCard from './PlaceholderCard';

describe('PlaceholderCard Property Tests', () => {
  // Feature: family-tree, Property 10: Empty positions show placeholders
  // Validates: Requirements 5.1
  it('should display placeholder with appropriate label for any empty position', () => {
    // Generator for placeholder types and their corresponding labels
    const placeholderArb = fc.constantFrom(
      { type: 'father', label: 'Add Father' },
      { type: 'mother', label: 'Add Mother' },
      { type: 'child', label: 'Add Child' },
      { type: 'spouse', label: 'Add Spouse' }
    );

    fc.assert(
      fc.property(
        placeholderArb,
        (placeholder) => {
          const { container } = render(
            <PlaceholderCard 
              type={placeholder.type} 
              label={placeholder.label}
            />
          );

          // Property: The placeholder should have the correct CSS class
          const placeholderElement = container.querySelector('.placeholder-card');
          expect(placeholderElement).toBeTruthy();
          expect(placeholderElement.classList.contains('placeholder-card')).toBe(true);

          // Property: The placeholder should display the appropriate label
          const labelElement = container.querySelector('.placeholder-card-label');
          expect(labelElement).toBeTruthy();
          expect(labelElement.textContent).toBe(placeholder.label);

          // Property: The placeholder should have a plus icon
          const iconElement = container.querySelector('.placeholder-card-icon');
          expect(iconElement).toBeTruthy();
          const svgElement = iconElement.querySelector('svg');
          expect(svgElement).toBeTruthy();

          // Property: The placeholder should be keyboard accessible
          expect(placeholderElement.getAttribute('role')).toBe('button');
          expect(placeholderElement.getAttribute('tabIndex')).toBe('0');
          expect(placeholderElement.getAttribute('aria-label')).toBe(placeholder.label);

          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
