import { describe, it, expect, vi, beforeEach } from 'vitest';
import dashboardReducer, {
  loadDashboardData,
  refreshDashboard,
  setSectionError,
  clearSectionError,
  selectDashboardData,
  selectDashboardLoading,
  selectSectionLoading,
  selectSectionError,
} from './dashboardSlice';
import { DashboardState } from '../../types/redux';
import { DashboardData } from '../../types/api';

describe('dashboardSlice', () => {
  const initialState: DashboardState = {
    dashboardData: null,
    isLoading: false,
    error: null,
    sectionLoading: {
      recentUpdates: false,
      upcomingEvents: false,
      memorySpotlight: false,
      treeStats: false,
      onlineUsers: false,
    },
    sectionErrors: {
      recentUpdates: null,
      upcomingEvents: null,
      memorySpotlight: null,
      treeStats: null,
      onlineUsers: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(dashboardReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setSectionError reducer', () => {
    it('should set error for specific section', () => {
      const action = setSectionError({ section: 'recentUpdates', error: 'Failed to load updates' });
      const state = dashboardReducer(initialState, action);
      expect(state.sectionErrors.recentUpdates).toBe('Failed to load updates');
      expect(state.sectionErrors.upcomingEvents).toBeNull();
    });

    it('should not affect other state properties', () => {
      const stateWithData = {
        ...initialState,
        dashboardData: { user: { id: '1' } },
        isLoading: true,
      };
      const action = setSectionError({ section: 'treeStats', error: 'Stats error' });
      const state = dashboardReducer(stateWithData, action);
      expect(state.dashboardData).toEqual(stateWithData.dashboardData);
      expect(state.isLoading).toBe(true);
      expect(state.sectionErrors.treeStats).toBe('Stats error');
    });

    it('should handle multiple section errors', () => {
      let state = initialState;
      state = dashboardReducer(state, setSectionError({ section: 'recentUpdates', error: 'Updates error' }));
      state = dashboardReducer(state, setSectionError({ section: 'memorySpotlight', error: 'Memory error' }));
      
      expect(state.sectionErrors.recentUpdates).toBe('Updates error');
      expect(state.sectionErrors.memorySpotlight).toBe('Memory error');
      expect(state.sectionErrors.upcomingEvents).toBeNull();
    });
  });

  describe('clearSectionError reducer', () => {
    it('should clear error for specific section', () => {
      const stateWithError = {
        ...initialState,
        sectionErrors: {
          ...initialState.sectionErrors,
          recentUpdates: 'Some error',
          upcomingEvents: 'Another error',
        },
      };
      const action = clearSectionError('recentUpdates');
      const state = dashboardReducer(stateWithError, action);
      expect(state.sectionErrors.recentUpdates).toBeNull();
      expect(state.sectionErrors.upcomingEvents).toBe('Another error');
    });

    it('should not affect other state properties', () => {
      const stateWithData = {
        ...initialState,
        dashboardData: { user: { id: '1' } },
        isLoading: true,
        sectionErrors: {
          ...initialState.sectionErrors,
          treeStats: 'Stats error',
        },
      };
      const action = clearSectionError('treeStats');
      const state = dashboardReducer(stateWithData, action);
      expect(state.dashboardData).toEqual(stateWithData.dashboardData);
      expect(state.isLoading).toBe(true);
      expect(state.sectionErrors.treeStats).toBeNull();
    });

    it('should handle clearing non-existent error gracefully', () => {
      const action = clearSectionError('recentUpdates');
      const state = dashboardReducer(initialState, action);
      expect(state.sectionErrors.recentUpdates).toBeNull();
      expect(state).toEqual(initialState);
    });
  });

  describe('loadDashboardData async thunk', () => {
    const mockDashboardData: DashboardData = {
      user: {
        id: 'mock-user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        photoUrl: null,
      },
      recentUpdates: [],
      upcomingEvents: [],
      memorySpotlight: null,
      treeStats: {
        memberCount: 0,
        generationCount: 0,
      },
      onlineUsers: [],
    };

    it('should handle loadDashboardData.pending', () => {
      const action = { type: loadDashboardData.pending.type };
      const state = dashboardReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loadDashboardData.fulfilled', () => {
      const action = {
        type: loadDashboardData.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.dashboardData).toEqual(mockDashboardData);
      expect(state.error).toBeNull();
    });

    it('should handle loadDashboardData.rejected', () => {
      const errorMessage = 'Failed to load dashboard data';
      const action = {
        type: loadDashboardData.rejected.type,
        payload: errorMessage,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.dashboardData).toBeNull();
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: loadDashboardData.pending.type };
      const state = dashboardReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should replace existing dashboard data on fulfilled', () => {
      const existingData = {
        user: { id: 'old-user' },
        recentUpdates: [{ id: 'old-update' }],
      };
      const stateWithData = {
        ...initialState,
        dashboardData: existingData,
      };
      const action = {
        type: loadDashboardData.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(stateWithData, action);
      expect(state.dashboardData).toEqual(mockDashboardData);
    });

    it('should preserve section errors during dashboard load', () => {
      const stateWithSectionErrors = {
        ...initialState,
        sectionErrors: {
          ...initialState.sectionErrors,
          recentUpdates: 'Section error',
        },
      };
      const action = {
        type: loadDashboardData.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(stateWithSectionErrors, action);
      expect(state.sectionErrors.recentUpdates).toBe('Section error');
    });
  });

  describe('refreshDashboard async thunk', () => {
    const mockDashboardData: DashboardData = {
      user: {
        id: 'mock-user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        photoUrl: null,
      },
      recentUpdates: [{ id: 'new-update' } as any],
      upcomingEvents: [{ id: 'new-event' } as any],
      memorySpotlight: { id: 'new-memory' } as any,
      treeStats: {
        memberCount: 5,
        generationCount: 3,
      },
      onlineUsers: [{ id: 'user-1' } as any],
    };

    it('should handle refreshDashboard.pending', () => {
      const action = { type: refreshDashboard.pending.type };
      const state = dashboardReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle refreshDashboard.fulfilled', () => {
      const action = {
        type: refreshDashboard.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.dashboardData).toEqual(mockDashboardData);
      expect(state.error).toBeNull();
    });

    it('should handle refreshDashboard.rejected', () => {
      const errorMessage = 'Failed to refresh dashboard';
      const action = {
        type: refreshDashboard.rejected.type,
        payload: errorMessage,
      };
      const state = dashboardReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should update existing dashboard data on refresh', () => {
      const existingData = {
        user: { id: 'user-1', firstName: 'Jane' },
        recentUpdates: [],
        treeStats: { memberCount: 2 },
      };
      const stateWithData = {
        ...initialState,
        dashboardData: existingData,
      };
      const action = {
        type: refreshDashboard.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(stateWithData, action);
      expect(state.dashboardData).toEqual(mockDashboardData);
      expect(state.dashboardData.user.firstName).toBe('John');
      expect(state.dashboardData.treeStats.memberCount).toBe(5);
    });

    it('should clear main error but preserve section errors on refresh', () => {
      const stateWithErrors = {
        ...initialState,
        error: 'Main error',
        sectionErrors: {
          ...initialState.sectionErrors,
          memorySpotlight: 'Memory error',
        },
      };
      const action = {
        type: refreshDashboard.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(stateWithErrors, action);
      expect(state.error).toBeNull();
      expect(state.sectionErrors.memorySpotlight).toBe('Memory error');
    });
  });

  describe('selectors', () => {
    const mockDashboardData: DashboardData = {
      user: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
      },
      recentUpdates: [{ id: 'update-1' } as any],
      upcomingEvents: [{ id: 'event-1' } as any],
      treeStats: { memberCount: 10, generationCount: 3 },
      memorySpotlight: null,
      onlineUsers: [],
    };

    const mockState = {
      dashboard: {
        dashboardData: mockDashboardData,
        isLoading: false,
        error: 'Some error',
        sectionLoading: {
          recentUpdates: true,
          upcomingEvents: false,
          memorySpotlight: false,
          treeStats: true,
          onlineUsers: false,
        },
        sectionErrors: {
          recentUpdates: 'Updates error',
          upcomingEvents: null,
          memorySpotlight: 'Memory error',
          treeStats: null,
          onlineUsers: 'Online users error',
        },
      } as DashboardState,
    };

    describe('selectDashboardData', () => {
      it('should return dashboard data from state', () => {
        expect(selectDashboardData(mockState)).toEqual(mockDashboardData);
      });

      it('should return null when no dashboard data', () => {
        const emptyState = { dashboard: { ...initialState } };
        expect(selectDashboardData(emptyState)).toBeNull();
      });
    });

    describe('selectDashboardLoading', () => {
      it('should return loading state', () => {
        expect(selectDashboardLoading(mockState)).toBe(false);
      });

      it('should return true when loading', () => {
        const loadingState = {
          dashboard: { ...initialState, isLoading: true },
        };
        expect(selectDashboardLoading(loadingState)).toBe(true);
      });
    });

    describe('selectSectionLoading', () => {
      it('should return loading state for specific section', () => {
        expect(selectSectionLoading(mockState, 'recentUpdates')).toBe(true);
        expect(selectSectionLoading(mockState, 'upcomingEvents')).toBe(false);
        expect(selectSectionLoading(mockState, 'treeStats')).toBe(true);
      });

      it('should return false for non-existent section', () => {
        expect(selectSectionLoading(mockState, 'nonExistentSection' as any)).toBeUndefined();
      });

      it('should handle empty state', () => {
        const emptyState = { dashboard: { ...initialState } };
        expect(selectSectionLoading(emptyState, 'recentUpdates')).toBe(false);
      });

      it('should work with all valid section names', () => {
        const sections = ['recentUpdates', 'upcomingEvents', 'memorySpotlight', 'treeStats', 'onlineUsers'];
        sections.forEach(section => {
          const result = selectSectionLoading(mockState, section);
          expect(typeof result).toBe('boolean');
        });
      });
    });

    describe('selectSectionError', () => {
      it('should return error for specific section', () => {
        expect(selectSectionError(mockState, 'recentUpdates')).toBe('Updates error');
        expect(selectSectionError(mockState, 'upcomingEvents')).toBeNull();
        expect(selectSectionError(mockState, 'memorySpotlight')).toBe('Memory error');
        expect(selectSectionError(mockState, 'onlineUsers')).toBe('Online users error');
      });

      it('should return undefined for non-existent section', () => {
        expect(selectSectionError(mockState, 'nonExistentSection' as any)).toBeUndefined();
      });

      it('should handle empty state', () => {
        const emptyState = { dashboard: { ...initialState } };
        expect(selectSectionError(emptyState, 'recentUpdates')).toBeNull();
      });

      it('should work with all valid section names', () => {
        const sections = ['recentUpdates', 'upcomingEvents', 'memorySpotlight', 'treeStats', 'onlineUsers'];
        sections.forEach(section => {
          const result = selectSectionError(mockState, section);
          expect(result === null || typeof result === 'string').toBe(true);
        });
      });

      it('should handle null and undefined section parameters', () => {
        expect(selectSectionError(mockState, null as any)).toBeUndefined();
        expect(selectSectionError(mockState, undefined as any)).toBeUndefined();
      });
    });
  });

  describe('state transitions', () => {
    it('should transition from initial to loading on loadDashboardData.pending', () => {
      const action = { type: loadDashboardData.pending.type };
      const state = dashboardReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to success on loadDashboardData.fulfilled', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockData = { user: { id: '1' }, recentUpdates: [] };
      const action = {
        type: loadDashboardData.fulfilled.type,
        payload: mockData,
      };
      const state = dashboardReducer(loadingState, action);
      expect(state).toEqual({
        ...initialState,
        dashboardData: mockData,
        isLoading: false,
        error: null,
      });
    });

    it('should transition from loading to error on loadDashboardData.rejected', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Load failed';
      const action = {
        type: loadDashboardData.rejected.type,
        payload: errorMessage,
      };
      const state = dashboardReducer(loadingState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage,
      });
    });

    it('should handle section error management independently', () => {
      let state = initialState;

      // Set section error
      state = dashboardReducer(state, setSectionError({ section: 'recentUpdates', error: 'Updates failed' }));
      expect(state.sectionErrors.recentUpdates).toBe('Updates failed');
      expect(state.error).toBeNull();

      // Load dashboard data (should not affect section errors)
      state = dashboardReducer(state, { type: loadDashboardData.pending.type });
      expect(state.sectionErrors.recentUpdates).toBe('Updates failed');
      expect(state.isLoading).toBe(true);

      // Complete dashboard load
      const mockData = { user: { id: '1' } };
      state = dashboardReducer(state, {
        type: loadDashboardData.fulfilled.type,
        payload: mockData,
      });
      expect(state.dashboardData).toEqual(mockData);
      expect(state.sectionErrors.recentUpdates).toBe('Updates failed');
      expect(state.isLoading).toBe(false);

      // Clear section error
      state = dashboardReducer(state, clearSectionError('recentUpdates'));
      expect(state.sectionErrors.recentUpdates).toBeNull();
      expect(state.dashboardData).toEqual(mockData);
    });

    it('should handle multiple async operations correctly', () => {
      let state = initialState;

      // Start load
      state = dashboardReducer(state, { type: loadDashboardData.pending.type });
      expect(state.isLoading).toBe(true);

      // Complete load
      const initialData = { user: { id: '1' }, recentUpdates: [] };
      state = dashboardReducer(state, {
        type: loadDashboardData.fulfilled.type,
        payload: initialData,
      });
      expect(state.dashboardData).toEqual(initialData);
      expect(state.isLoading).toBe(false);

      // Start refresh
      state = dashboardReducer(state, { type: refreshDashboard.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.dashboardData).toEqual(initialData); // Preserved during refresh

      // Complete refresh with new data
      const refreshedData = { user: { id: '1' }, recentUpdates: [{ id: 'new' }] };
      state = dashboardReducer(state, {
        type: refreshDashboard.fulfilled.type,
        payload: refreshedData,
      });
      expect(state.dashboardData).toEqual(refreshedData);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear previous error when starting new operation', () => {
      const errorState = {
        ...initialState,
        error: 'Previous error',
      };
      const action = { type: loadDashboardData.pending.type };
      const state = dashboardReducer(errorState, action);
      expect(state.error).toBeNull();
    });

    it('should preserve dashboard data when operation fails', () => {
      const existingData = { user: { id: '1' }, recentUpdates: [] };
      const stateWithData = {
        ...initialState,
        dashboardData: existingData,
      };
      const action = {
        type: loadDashboardData.rejected.type,
        payload: 'Load failed',
      };
      const state = dashboardReducer(stateWithData, action);
      expect(state.dashboardData).toEqual(existingData);
      expect(state.error).toBe('Load failed');
    });

    it('should handle section errors independently of main errors', () => {
      let state = {
        ...initialState,
        error: 'Main error',
        sectionErrors: {
          ...initialState.sectionErrors,
          recentUpdates: 'Section error',
        },
      };

      // Clear main error with successful operation
      const mockData = { user: { id: '1' } };
      state = dashboardReducer(state, {
        type: loadDashboardData.fulfilled.type,
        payload: mockData,
      });
      expect(state.error).toBeNull();
      expect(state.sectionErrors.recentUpdates).toBe('Section error');

      // Clear section error
      state = dashboardReducer(state, clearSectionError('recentUpdates'));
      expect(state.sectionErrors.recentUpdates).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should handle concurrent section errors', () => {
      let state = initialState;

      // Set multiple section errors
      state = dashboardReducer(state, setSectionError({ section: 'recentUpdates', error: 'Updates error' }));
      state = dashboardReducer(state, setSectionError({ section: 'treeStats', error: 'Stats error' }));
      state = dashboardReducer(state, setSectionError({ section: 'onlineUsers', error: 'Users error' }));

      expect(state.sectionErrors.recentUpdates).toBe('Updates error');
      expect(state.sectionErrors.treeStats).toBe('Stats error');
      expect(state.sectionErrors.onlineUsers).toBe('Users error');
      expect(state.sectionErrors.upcomingEvents).toBeNull();
      expect(state.sectionErrors.memorySpotlight).toBeNull();

      // Clear one section error
      state = dashboardReducer(state, clearSectionError('treeStats'));
      expect(state.sectionErrors.recentUpdates).toBe('Updates error');
      expect(state.sectionErrors.treeStats).toBeNull();
      expect(state.sectionErrors.onlineUsers).toBe('Users error');
    });
  });
});