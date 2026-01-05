import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import fc from 'fast-check';
import ZoomControls from './ZoomControls';
import treeReducer from '../redux/slices/treeSlice';
import familyReducer from '../redux/slices/familySlice';
import userReducer from '../redux/slices/userSlice';
import authReducer from '../redux/slices/authSlice';
import memoryReducer from '../redux/slices/memorySlice';
import dashboardReducer from '../redux/slices/dashboardSlice';

// Test wrapper with Redux store
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      family: familyReducer,
      memory: memoryReducer,
      dashboard: dashboardReducer,
      tree: treeReducer,
    },
  });
};

const TestWrapper = ({ children }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('ZoomControls Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Feature: family-tree, Property 14: Zoom decrease by 10%
   * Validates: Requirements 7.2
   * 
   * For any current zoom level above 10%, clicking the minus button should decrease the zoom level by exactly 10 percentage points.
   */
  it('Property 14: Zoom decrease by 10%', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 200 }), // Initial zoom level (above minimum)
        (initialZoom) => {
          const { container, unmount } = render(
            <TestWrapper>
              <ZoomControls />
            </TestWrapper>
          );

          try {
            // Get the TreeContext and set initial zoom level
            const zoomDisplay = container.querySelector('.zoom-display');
            const zoomOutButton = screen.getByLabelText('Zoom out');

            // We need to manually set the zoom level in the context
            // Since we can't directly access context, we'll use the zoom in button to set it
            // First, let's get to a known state
            const currentZoom = parseInt(zoomDisplay.textContent);
            
            // Calculate how many clicks needed to reach initialZoom from current
            const clicksNeeded = Math.floor((initialZoom - currentZoom) / 10);
            
            if (clicksNeeded > 0) {
              const zoomInButton = screen.getByLabelText('Zoom in');
              for (let i = 0; i < clicksNeeded && parseInt(container.querySelector('.zoom-display').textContent) < 200; i++) {
                fireEvent.click(zoomInButton);
              }
            } else if (clicksNeeded < 0) {
              for (let i = 0; i < Math.abs(clicksNeeded) && parseInt(container.querySelector('.zoom-display').textContent) > 10; i++) {
                fireEvent.click(zoomOutButton);
              }
            }

            // Get the actual zoom level after setup
            const actualInitialZoom = parseInt(container.querySelector('.zoom-display').textContent);
            
            // Only test if we're above minimum
            if (actualInitialZoom <= 10) {
              return true; // Skip this case
            }

            // Click zoom out button
            fireEvent.click(zoomOutButton);

            // Get final zoom level
            const finalZoom = parseInt(container.querySelector('.zoom-display').textContent);

            // Expected zoom should be 10% less, but not below 10%
            const expectedZoom = Math.max(10, actualInitialZoom - 10);

            return finalZoom === expectedZoom;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: family-tree, Property 15: Zoom increase by 10%
   * Validates: Requirements 7.3
   * 
   * For any current zoom level below 200%, clicking the plus button should increase the zoom level by exactly 10 percentage points.
   */
  it('Property 15: Zoom increase by 10%', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 190 }), // Initial zoom level (below maximum)
        (initialZoom) => {
          const { container, unmount } = render(
            <TestWrapper>
              <ZoomControls />
            </TestWrapper>
          );

          try {
            const zoomDisplay = container.querySelector('.zoom-display');
            const zoomInButton = screen.getByLabelText('Zoom in');
            const zoomOutButton = screen.getByLabelText('Zoom out');

            // Get to initial zoom level
            const currentZoom = parseInt(zoomDisplay.textContent);
            const clicksNeeded = Math.floor((initialZoom - currentZoom) / 10);
            
            if (clicksNeeded > 0) {
              for (let i = 0; i < clicksNeeded && parseInt(container.querySelector('.zoom-display').textContent) < 200; i++) {
                fireEvent.click(zoomInButton);
              }
            } else if (clicksNeeded < 0) {
              for (let i = 0; i < Math.abs(clicksNeeded) && parseInt(container.querySelector('.zoom-display').textContent) > 10; i++) {
                fireEvent.click(zoomOutButton);
              }
            }

            // Get the actual zoom level after setup
            const actualInitialZoom = parseInt(container.querySelector('.zoom-display').textContent);
            
            // Only test if we're below maximum
            if (actualInitialZoom >= 200) {
              return true; // Skip this case
            }

            // Click zoom in button
            fireEvent.click(zoomInButton);

            // Get final zoom level
            const finalZoom = parseInt(container.querySelector('.zoom-display').textContent);

            // Expected zoom should be 10% more, but not above 200%
            const expectedZoom = Math.min(200, actualInitialZoom + 10);

            return finalZoom === expectedZoom;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: family-tree, Property 16: Zoom display updates
   * Validates: Requirements 7.4
   * 
   * For any zoom level change, the percentage display should immediately update to show the new zoom level.
   */
  it('Property 16: Zoom display updates', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('in', 'out'), // zoom direction
        fc.integer({ min: 1, max: 10 }), // number of clicks
        (direction, numClicks) => {
          const { container, unmount } = render(
            <TestWrapper>
              <ZoomControls />
            </TestWrapper>
          );

          try {
            const zoomDisplay = container.querySelector('.zoom-display');
            const button = direction === 'in' 
              ? screen.getByLabelText('Zoom in')
              : screen.getByLabelText('Zoom out');

            // Get initial zoom level
            const initialZoom = parseInt(zoomDisplay.textContent);

            // Click button multiple times
            let expectedZoom = initialZoom;
            for (let i = 0; i < numClicks; i++) {
              const currentZoom = parseInt(container.querySelector('.zoom-display').textContent);
              
              // Check if we can continue
              if (direction === 'in' && currentZoom >= 200) break;
              if (direction === 'out' && currentZoom <= 10) break;

              // Click button
              fireEvent.click(button);

              // Update expected zoom
              if (direction === 'in') {
                expectedZoom = Math.min(200, expectedZoom + 10);
              } else {
                expectedZoom = Math.max(10, expectedZoom - 10);
              }

              // Check that display updated immediately
              const displayedZoom = parseInt(container.querySelector('.zoom-display').textContent);
              if (displayedZoom !== expectedZoom) {
                return false;
              }
            }

            // Final check
            const finalZoom = parseInt(container.querySelector('.zoom-display').textContent);
            return finalZoom === expectedZoom;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
