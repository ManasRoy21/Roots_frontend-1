import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import Toggle from './Toggle';

describe('Toggle Property Tests', () => {
  // **Feature: quick-actions, Property 3: Living status toggle updates state**
  // **Validates: Requirements 4.2**
  it('should flip state to opposite value when toggled', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(), // Initial state
        async (initialState) => {
          let currentState = initialState;
          const handleChange = (newState) => {
            currentState = newState;
          };

          const { container } = render(
            <Toggle 
              checked={initialState} 
              onChange={handleChange} 
              label="Test Toggle"
            />
          );

          const toggleButton = container.querySelector('.toggle-switch');
          
          // Click the toggle
          await userEvent.click(toggleButton);
          
          // Verify state flipped to opposite
          expect(currentState).toBe(!initialState);
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should support keyboard interaction (Space/Enter)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(), // Initial state
        fc.constantFrom('Space', 'Enter'), // Key to press
        async (initialState, key) => {
          let changedState = null;
          const handleChange = (newState) => {
            changedState = newState;
          };

          const user = userEvent.setup();
          const { container } = render(
            <Toggle 
              checked={initialState} 
              onChange={handleChange} 
              label="Test Toggle"
            />
          );

          const toggleButton = container.querySelector('.toggle-switch');
          
          // Focus and press the key
          await user.click(toggleButton); // Focus the element
          await user.keyboard(`{${key}}`);
          
          // Verify onChange was called with opposite state
          expect(changedState).toBe(!initialState);
          
          // Cleanup
          container.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
