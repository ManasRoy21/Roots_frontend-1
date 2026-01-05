import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TreeState, PerformSearchPayload, PanPayload } from '../../types/redux';

// Initial state
const initialState: TreeState = {
  selectedMemberId: null,
  searchQuery: '',
  searchResults: [],
  zoomLevel: 100, // 10-200%
  panOffset: { x: 0, y: 0 },
  showFirstTimeTooltip: false,
};

// Tree slice
const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setSelectedMember: (state, action: PayloadAction<string | null>) => {
      state.selectedMemberId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    performSearch: (state, action: PayloadAction<PerformSearchPayload>) => {
      const { query, members } = action.payload;
      state.searchQuery = query;
      
      if (!query.trim()) {
        state.searchResults = [];
        return;
      }

      const lowerQuery = query.toLowerCase();
      const results = members
        .filter(member => 
          member.firstName.toLowerCase().includes(lowerQuery) ||
          member.lastName.toLowerCase().includes(lowerQuery)
        )
        .map(member => member.id);
      
      state.searchResults = results;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      const level = action.payload;
      state.zoomLevel = Math.max(10, Math.min(200, level));
    },
    zoomIn: (state) => {
      state.zoomLevel = Math.min(200, state.zoomLevel + 10);
    },
    zoomOut: (state) => {
      state.zoomLevel = Math.max(10, state.zoomLevel - 10);
    },
    adjustZoom: (state, action: PayloadAction<number>) => {
      const delta = action.payload;
      state.zoomLevel = Math.max(10, Math.min(200, state.zoomLevel + delta));
    },
    setPanOffset: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.panOffset = action.payload;
    },
    pan: (state, action: PayloadAction<PanPayload>) => {
      const { deltaX, deltaY } = action.payload;
      state.panOffset = {
        x: state.panOffset.x + deltaX,
        y: state.panOffset.y + deltaY,
      };
    },
    resetTreeView: (state) => {
      state.zoomLevel = 100;
      state.panOffset = { x: 0, y: 0 };
      state.selectedMemberId = null;
    },
    dismissTooltip: (state) => {
      state.showFirstTimeTooltip = false;
      localStorage.setItem('familyTreeTooltipDismissed', 'true');
    },
    checkFirstTimeVisit: (state) => {
      const dismissed = localStorage.getItem('familyTreeTooltipDismissed');
      if (!dismissed) {
        state.showFirstTimeTooltip = true;
      }
    },
  },
});

// Selectors
export const selectSelectedMemberId = (state: { tree: TreeState }) => state.tree.selectedMemberId;
export const selectSearchQuery = (state: { tree: TreeState }) => state.tree.searchQuery;
export const selectSearchResults = (state: { tree: TreeState }) => state.tree.searchResults;
export const selectZoomLevel = (state: { tree: TreeState }) => state.tree.zoomLevel;
export const selectPanOffset = (state: { tree: TreeState }) => state.tree.panOffset;
export const selectShowTooltip = (state: { tree: TreeState }) => state.tree.showFirstTimeTooltip;

// Export actions and reducer
export const {
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
} = treeSlice.actions;

export default treeSlice.reducer;
