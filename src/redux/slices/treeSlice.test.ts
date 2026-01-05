import { describe, it, expect, vi, beforeEach } from 'vitest';
import treeReducer, {
  setSelectedMember,
  setSearchQuery,
  performSearch,
  clearSearch,
  setZoomLevel,
  zoomIn,
  zoomOut,
  adjustZoom,
  setPanOffset,
  pan,
  resetTreeView,
  dismissTooltip,
  checkFirstTimeVisit,
  selectSelectedMemberId,
  selectSearchQuery,
  selectSearchResults,
  selectZoomLevel,
  selectPanOffset,
  selectShowTooltip,
} from './treeSlice';
import { TreeState } from '../../types/redux';
import { FamilyMember } from '../../types/api';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('treeSlice', () => {
  const initialState: TreeState = {
    selectedMemberId: null,
    searchQuery: '',
    searchResults: [],
    zoomLevel: 100,
    panOffset: { x: 0, y: 0 },
    showFirstTimeTooltip: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(treeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should have correct initial values', () => {
      const state = treeReducer(undefined, { type: 'unknown' });
      expect(state.selectedMemberId).toBeNull();
      expect(state.searchQuery).toBe('');
      expect(state.searchResults).toEqual([]);
      expect(state.zoomLevel).toBe(100);
      expect(state.panOffset).toEqual({ x: 0, y: 0 });
      expect(state.showFirstTimeTooltip).toBe(false);
    });
  });

  describe('setSelectedMember reducer', () => {
    it('should set selected member ID', () => {
      const memberId = 'member-123';
      const action = setSelectedMember(memberId);
      const state = treeReducer(initialState, action);
      expect(state.selectedMemberId).toBe(memberId);
    });

    it('should update selected member ID when already set', () => {
      const currentState = { ...initialState, selectedMemberId: 'old-member' };
      const newMemberId = 'new-member';
      const action = setSelectedMember(newMemberId);
      const state = treeReducer(currentState, action);
      expect(state.selectedMemberId).toBe(newMemberId);
    });

    it('should set to null when passed null', () => {
      const currentState = { ...initialState, selectedMemberId: 'member-123' };
      const action = setSelectedMember(null);
      const state = treeReducer(currentState, action);
      expect(state.selectedMemberId).toBeNull();
    });
  });

  describe('setSearchQuery reducer', () => {
    it('should set search query', () => {
      const query = 'John Doe';
      const action = setSearchQuery(query);
      const state = treeReducer(initialState, action);
      expect(state.searchQuery).toBe(query);
    });

    it('should update search query when already set', () => {
      const currentState = { ...initialState, searchQuery: 'old query' };
      const newQuery = 'new query';
      const action = setSearchQuery(newQuery);
      const state = treeReducer(currentState, action);
      expect(state.searchQuery).toBe(newQuery);
    });

    it('should set empty string', () => {
      const currentState = { ...initialState, searchQuery: 'some query' };
      const action = setSearchQuery('');
      const state = treeReducer(currentState, action);
      expect(state.searchQuery).toBe('');
    });
  });

  describe('performSearch reducer', () => {
    const mockMembers: FamilyMember[] = [
      { id: '1', firstName: 'John', lastName: 'Doe' } as FamilyMember,
      { id: '2', firstName: 'Jane', lastName: 'Smith' } as FamilyMember,
      { id: '3', firstName: 'Bob', lastName: 'Johnson' } as FamilyMember,
      { id: '4', firstName: 'Alice', lastName: 'Brown' } as FamilyMember,
    ];

    it('should perform search and set results', () => {
      const query = 'John';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchQuery).toBe(query);
      expect(state.searchResults).toEqual(['1', '3']); // John Doe and Bob Johnson
    });

    it('should search by first name case-insensitively', () => {
      const query = 'jane';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual(['2']);
    });

    it('should search by last name case-insensitively', () => {
      const query = 'SMITH';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual(['2']);
    });

    it('should return empty results for no matches', () => {
      const query = 'xyz';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual([]);
    });

    it('should return empty results for empty query', () => {
      const query = '';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual([]);
    });

    it('should return empty results for whitespace-only query', () => {
      const query = '   ';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual([]);
    });

    it('should handle partial matches', () => {
      const query = 'Jo';
      const action = performSearch({ query, members: mockMembers });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual(['1', '3']); // John and Johnson
    });

    it('should handle empty members array', () => {
      const query = 'John';
      const action = performSearch({ query, members: [] });
      const state = treeReducer(initialState, action);
      expect(state.searchResults).toEqual([]);
    });
  });

  describe('clearSearch reducer', () => {
    it('should clear search query and results', () => {
      const currentState = {
        ...initialState,
        searchQuery: 'John',
        searchResults: ['1', '2'],
      };
      const action = clearSearch();
      const state = treeReducer(currentState, action);
      expect(state.searchQuery).toBe('');
      expect(state.searchResults).toEqual([]);
    });

    it('should not affect other state properties', () => {
      const currentState = {
        ...initialState,
        selectedMemberId: 'member-123',
        zoomLevel: 150,
        searchQuery: 'John',
        searchResults: ['1', '2'],
      };
      const action = clearSearch();
      const state = treeReducer(currentState, action);
      expect(state.selectedMemberId).toBe('member-123');
      expect(state.zoomLevel).toBe(150);
    });
  });

  describe('zoom level constraints (10-200%)', () => {
    describe('setZoomLevel reducer', () => {
      it('should set zoom level within valid range', () => {
        const action = setZoomLevel(150);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(150);
      });

      it('should constrain zoom level to minimum 10%', () => {
        const action = setZoomLevel(5);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(10);
      });

      it('should constrain zoom level to maximum 200%', () => {
        const action = setZoomLevel(250);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(200);
      });

      it('should handle exactly minimum value', () => {
        const action = setZoomLevel(10);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(10);
      });

      it('should handle exactly maximum value', () => {
        const action = setZoomLevel(200);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(200);
      });

      it('should handle negative values', () => {
        const action = setZoomLevel(-50);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(10);
      });

      it('should handle zero value', () => {
        const action = setZoomLevel(0);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(10);
      });
    });

    describe('zoomIn reducer', () => {
      it('should increase zoom level by 10', () => {
        const action = zoomIn();
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(110);
      });

      it('should not exceed maximum zoom level', () => {
        const currentState = { ...initialState, zoomLevel: 195 };
        const action = zoomIn();
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(200);
      });

      it('should not go beyond 200% when already at maximum', () => {
        const currentState = { ...initialState, zoomLevel: 200 };
        const action = zoomIn();
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(200);
      });
    });

    describe('zoomOut reducer', () => {
      it('should decrease zoom level by 10', () => {
        const currentState = { ...initialState, zoomLevel: 120 };
        const action = zoomOut();
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(110);
      });

      it('should not go below minimum zoom level', () => {
        const currentState = { ...initialState, zoomLevel: 15 };
        const action = zoomOut();
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(10);
      });

      it('should not go below 10% when already at minimum', () => {
        const currentState = { ...initialState, zoomLevel: 10 };
        const action = zoomOut();
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(10);
      });
    });

    describe('adjustZoom reducer', () => {
      it('should increase zoom level by positive delta', () => {
        const action = adjustZoom(25);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(125);
      });

      it('should decrease zoom level by negative delta', () => {
        const currentState = { ...initialState, zoomLevel: 150 };
        const action = adjustZoom(-30);
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(120);
      });

      it('should constrain to minimum with large negative delta', () => {
        const action = adjustZoom(-200);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(10);
      });

      it('should constrain to maximum with large positive delta', () => {
        const action = adjustZoom(200);
        const state = treeReducer(initialState, action);
        expect(state.zoomLevel).toBe(200);
      });

      it('should handle zero delta', () => {
        const currentState = { ...initialState, zoomLevel: 120 };
        const action = adjustZoom(0);
        const state = treeReducer(currentState, action);
        expect(state.zoomLevel).toBe(120);
      });
    });
  });

  describe('setPanOffset reducer', () => {
    it('should set pan offset', () => {
      const offset = { x: 100, y: 50 };
      const action = setPanOffset(offset);
      const state = treeReducer(initialState, action);
      expect(state.panOffset).toEqual(offset);
    });

    it('should update existing pan offset', () => {
      const currentState = { ...initialState, panOffset: { x: 10, y: 20 } };
      const newOffset = { x: 200, y: 150 };
      const action = setPanOffset(newOffset);
      const state = treeReducer(currentState, action);
      expect(state.panOffset).toEqual(newOffset);
    });

    it('should handle negative values', () => {
      const offset = { x: -50, y: -100 };
      const action = setPanOffset(offset);
      const state = treeReducer(initialState, action);
      expect(state.panOffset).toEqual(offset);
    });

    it('should handle zero values', () => {
      const currentState = { ...initialState, panOffset: { x: 100, y: 200 } };
      const offset = { x: 0, y: 0 };
      const action = setPanOffset(offset);
      const state = treeReducer(currentState, action);
      expect(state.panOffset).toEqual(offset);
    });
  });

  describe('pan reducer', () => {
    it('should add delta to current pan offset', () => {
      const currentState = { ...initialState, panOffset: { x: 50, y: 30 } };
      const delta = { deltaX: 20, deltaY: 10 };
      const action = pan(delta);
      const state = treeReducer(currentState, action);
      expect(state.panOffset).toEqual({ x: 70, y: 40 });
    });

    it('should handle negative deltas', () => {
      const currentState = { ...initialState, panOffset: { x: 100, y: 80 } };
      const delta = { deltaX: -30, deltaY: -20 };
      const action = pan(delta);
      const state = treeReducer(currentState, action);
      expect(state.panOffset).toEqual({ x: 70, y: 60 });
    });

    it('should handle zero deltas', () => {
      const currentState = { ...initialState, panOffset: { x: 50, y: 30 } };
      const delta = { deltaX: 0, deltaY: 0 };
      const action = pan(delta);
      const state = treeReducer(currentState, action);
      expect(state.panOffset).toEqual({ x: 50, y: 30 });
    });

    it('should work from initial state', () => {
      const delta = { deltaX: 25, deltaY: 15 };
      const action = pan(delta);
      const state = treeReducer(initialState, action);
      expect(state.panOffset).toEqual({ x: 25, y: 15 });
    });
  });

  describe('resetTreeView reducer', () => {
    it('should reset zoom, pan, and selection to defaults', () => {
      const currentState = {
        ...initialState,
        selectedMemberId: 'member-123',
        zoomLevel: 150,
        panOffset: { x: 100, y: 50 },
        searchQuery: 'John',
        searchResults: ['1', '2'],
      };
      const action = resetTreeView();
      const state = treeReducer(currentState, action);
      expect(state.zoomLevel).toBe(100);
      expect(state.panOffset).toEqual({ x: 0, y: 0 });
      expect(state.selectedMemberId).toBeNull();
      // Should not affect search
      expect(state.searchQuery).toBe('John');
      expect(state.searchResults).toEqual(['1', '2']);
    });

    it('should work from initial state', () => {
      const action = resetTreeView();
      const state = treeReducer(initialState, action);
      expect(state.zoomLevel).toBe(100);
      expect(state.panOffset).toEqual({ x: 0, y: 0 });
      expect(state.selectedMemberId).toBeNull();
    });
  });

  describe('localStorage persistence for tooltip', () => {
    describe('dismissTooltip reducer', () => {
      it('should set showFirstTimeTooltip to false', () => {
        const currentState = { ...initialState, showFirstTimeTooltip: true };
        const action = dismissTooltip();
        const state = treeReducer(currentState, action);
        expect(state.showFirstTimeTooltip).toBe(false);
      });

      it('should persist dismissal to localStorage', () => {
        const currentState = { ...initialState, showFirstTimeTooltip: true };
        const action = dismissTooltip();
        treeReducer(currentState, action);
        expect(localStorageMock.getItem('familyTreeTooltipDismissed')).toBe('true');
      });

      it('should work when already dismissed', () => {
        const currentState = { ...initialState, showFirstTimeTooltip: false };
        const action = dismissTooltip();
        const state = treeReducer(currentState, action);
        expect(state.showFirstTimeTooltip).toBe(false);
        expect(localStorageMock.getItem('familyTreeTooltipDismissed')).toBe('true');
      });
    });

    describe('checkFirstTimeVisit reducer', () => {
      it('should show tooltip when not previously dismissed', () => {
        const action = checkFirstTimeVisit();
        const state = treeReducer(initialState, action);
        expect(state.showFirstTimeTooltip).toBe(true);
      });

      it('should not show tooltip when previously dismissed', () => {
        localStorageMock.setItem('familyTreeTooltipDismissed', 'true');
        const action = checkFirstTimeVisit();
        const state = treeReducer(initialState, action);
        expect(state.showFirstTimeTooltip).toBe(false);
      });

      it('should not show tooltip when localStorage has any value', () => {
        localStorageMock.setItem('familyTreeTooltipDismissed', 'false');
        const action = checkFirstTimeVisit();
        const state = treeReducer(initialState, action);
        expect(state.showFirstTimeTooltip).toBe(false);
      });

      it('should show tooltip when localStorage is empty', () => {
        localStorageMock.clear();
        const action = checkFirstTimeVisit();
        const state = treeReducer(initialState, action);
        expect(state.showFirstTimeTooltip).toBe(true);
      });
    });

    describe('tooltip persistence integration', () => {
      it('should persist dismissal and check correctly', () => {
        // Start with tooltip showing
        let state = treeReducer(initialState, checkFirstTimeVisit());
        expect(state.showFirstTimeTooltip).toBe(true);

        // Dismiss tooltip
        state = treeReducer(state, dismissTooltip());
        expect(state.showFirstTimeTooltip).toBe(false);
        expect(localStorageMock.getItem('familyTreeTooltipDismissed')).toBe('true');

        // Check again - should remain dismissed
        state = treeReducer(state, checkFirstTimeVisit());
        expect(state.showFirstTimeTooltip).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      tree: {
        selectedMemberId: 'member-123',
        searchQuery: 'John Doe',
        searchResults: ['1', '2', '3'],
        zoomLevel: 150,
        panOffset: { x: 100, y: 50 },
        showFirstTimeTooltip: true,
      } as TreeState,
    };

    it('selectSelectedMemberId should return selected member ID', () => {
      expect(selectSelectedMemberId(mockState)).toBe('member-123');
    });

    it('selectSelectedMemberId should return null when no selection', () => {
      const emptyState = { tree: { ...initialState } };
      expect(selectSelectedMemberId(emptyState)).toBeNull();
    });

    it('selectSearchQuery should return search query', () => {
      expect(selectSearchQuery(mockState)).toBe('John Doe');
    });

    it('selectSearchQuery should return empty string when no query', () => {
      const emptyState = { tree: { ...initialState } };
      expect(selectSearchQuery(emptyState)).toBe('');
    });

    it('selectSearchResults should return search results array', () => {
      expect(selectSearchResults(mockState)).toEqual(['1', '2', '3']);
    });

    it('selectSearchResults should return empty array when no results', () => {
      const emptyState = { tree: { ...initialState } };
      expect(selectSearchResults(emptyState)).toEqual([]);
    });

    it('selectZoomLevel should return zoom level', () => {
      expect(selectZoomLevel(mockState)).toBe(150);
    });

    it('selectZoomLevel should return default zoom level', () => {
      const defaultState = { tree: { ...initialState } };
      expect(selectZoomLevel(defaultState)).toBe(100);
    });

    it('selectPanOffset should return pan offset object', () => {
      expect(selectPanOffset(mockState)).toEqual({ x: 100, y: 50 });
    });

    it('selectPanOffset should return default pan offset', () => {
      const defaultState = { tree: { ...initialState } };
      expect(selectPanOffset(defaultState)).toEqual({ x: 0, y: 0 });
    });

    it('selectShowTooltip should return tooltip visibility', () => {
      expect(selectShowTooltip(mockState)).toBe(true);
    });

    it('selectShowTooltip should return false when tooltip hidden', () => {
      const hiddenState = { tree: { ...initialState } };
      expect(selectShowTooltip(hiddenState)).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should handle multiple actions in sequence', () => {
      let state = initialState;

      // Set selected member
      state = treeReducer(state, setSelectedMember('member-123'));
      expect(state.selectedMemberId).toBe('member-123');

      // Zoom in
      state = treeReducer(state, zoomIn());
      expect(state.zoomLevel).toBe(110);

      // Pan
      state = treeReducer(state, pan({ deltaX: 50, deltaY: 30 }));
      expect(state.panOffset).toEqual({ x: 50, y: 30 });

      // Search
      const members: FamilyMember[] = [{ id: '1', firstName: 'John', lastName: 'Doe' } as FamilyMember];
      state = treeReducer(state, performSearch({ query: 'John', members }));
      expect(state.searchQuery).toBe('John');
      expect(state.searchResults).toEqual(['1']);

      // Reset should clear zoom, pan, and selection but not search
      state = treeReducer(state, resetTreeView());
      expect(state.selectedMemberId).toBeNull();
      expect(state.zoomLevel).toBe(100);
      expect(state.panOffset).toEqual({ x: 0, y: 0 });
      expect(state.searchQuery).toBe('John'); // Search should remain
      expect(state.searchResults).toEqual(['1']);
    });

    it('should handle tooltip lifecycle', () => {
      let state = initialState;

      // Check first time visit
      state = treeReducer(state, checkFirstTimeVisit());
      expect(state.showFirstTimeTooltip).toBe(true);

      // Dismiss tooltip
      state = treeReducer(state, dismissTooltip());
      expect(state.showFirstTimeTooltip).toBe(false);

      // Check again - should remain dismissed
      state = treeReducer(state, checkFirstTimeVisit());
      expect(state.showFirstTimeTooltip).toBe(false);
    });

    it('should maintain state consistency during zoom operations', () => {
      let state = { ...initialState, zoomLevel: 50 }; // Start below minimum

      // Set zoom should constrain to minimum
      state = treeReducer(state, setZoomLevel(5));
      expect(state.zoomLevel).toBe(10);

      // Zoom out should not go below minimum
      state = treeReducer(state, zoomOut());
      expect(state.zoomLevel).toBe(10);

      // Zoom in should work normally
      state = treeReducer(state, zoomIn());
      expect(state.zoomLevel).toBe(20);

      // Adjust zoom with large positive value should constrain to maximum
      state = treeReducer(state, adjustZoom(300));
      expect(state.zoomLevel).toBe(200);

      // Zoom in should not exceed maximum
      state = treeReducer(state, zoomIn());
      expect(state.zoomLevel).toBe(200);
    });
  });
});