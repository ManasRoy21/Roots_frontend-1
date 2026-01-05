import { describe, it, expect, vi, beforeEach } from 'vitest';
import familyReducer, {
  addFamilyMember,
  updateFamilyMember,
  getFamilyMembers,
  getRelationships,
  clearError,
  selectFamilyMembers,
  selectRelationships,
  selectFamilyLoading,
  selectFamilyError,
  selectMemberById,
} from './familySlice';
import { FamilyState } from '../../types/redux';
import { FamilyMember, Relationship } from '../../types/api';

// Mock FamilyService
vi.mock('../../services/FamilyService', () => ({
  default: {
    addFamilyMember: vi.fn(),
    updateFamilyMember: vi.fn(),
    getFamilyMembers: vi.fn(),
    getRelationships: vi.fn(),
  },
}));

describe('familySlice', () => {
  const initialState: FamilyState = {
    familyMembers: [],
    relationships: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(familyReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('clearError reducer', () => {
    it('should clear error state', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error message',
      };
      const actual = familyReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });

    it('should not affect other state properties', () => {
      const stateWithData = {
        familyMembers: [{ id: '1', firstName: 'John' }],
        relationships: [{ id: '1', fromUserId: '1', toUserId: '2' }],
        isLoading: false,
        error: 'Some error',
      };
      const actual = familyReducer(stateWithData, clearError());
      expect(actual.familyMembers).toEqual(stateWithData.familyMembers);
      expect(actual.relationships).toEqual(stateWithData.relationships);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBeNull();
    });
  });

  describe('addFamilyMember async thunk', () => {
    const mockMember: FamilyMember = {
      id: 'member-1',
      userId: null,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      createdBy: 'user-1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should handle addFamilyMember.pending', () => {
      const action = { type: addFamilyMember.pending.type };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle addFamilyMember.fulfilled', () => {
      const action = {
        type: addFamilyMember.fulfilled.type,
        payload: mockMember,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.familyMembers).toEqual([mockMember]);
      expect(state.error).toBeNull();
    });

    it('should handle addFamilyMember.rejected', () => {
      const errorMessage = 'Failed to add family member';
      const action = {
        type: addFamilyMember.rejected.type,
        payload: errorMessage,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.familyMembers).toEqual([]);
    });

    it('should add member to existing family members list', () => {
      const existingMember = {
        id: 'member-0',
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const stateWithMembers = {
        ...initialState,
        familyMembers: [existingMember],
      };
      const action = {
        type: addFamilyMember.fulfilled.type,
        payload: mockMember,
      };
      const state = familyReducer(stateWithMembers, action);
      expect(state.familyMembers).toEqual([existingMember, mockMember]);
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: addFamilyMember.pending.type };
      const state = familyReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('updateFamilyMember async thunk', () => {
    const existingMember: FamilyMember = {
      id: 'member-1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
    } as FamilyMember;

    const updatedMember: FamilyMember = {
      ...existingMember,
      firstName: 'Johnny',
      updatedAt: '2024-01-02T00:00:00.000Z',
    };

    it('should handle updateFamilyMember.pending', () => {
      const action = { type: updateFamilyMember.pending.type };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle updateFamilyMember.fulfilled', () => {
      const stateWithMember = {
        ...initialState,
        familyMembers: [existingMember],
      };
      const action = {
        type: updateFamilyMember.fulfilled.type,
        payload: updatedMember,
      };
      const state = familyReducer(stateWithMember, action);
      expect(state.isLoading).toBe(false);
      expect(state.familyMembers[0]).toEqual(updatedMember);
      expect(state.error).toBeNull();
    });

    it('should handle updateFamilyMember.rejected', () => {
      const errorMessage = 'Failed to update family member';
      const action = {
        type: updateFamilyMember.rejected.type,
        payload: errorMessage,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should not modify state if member not found', () => {
      const otherMember = {
        id: 'member-2',
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const stateWithMember = {
        ...initialState,
        familyMembers: [otherMember],
      };
      const action = {
        type: updateFamilyMember.fulfilled.type,
        payload: updatedMember, // Different ID
      };
      const state = familyReducer(stateWithMember, action);
      expect(state.familyMembers).toEqual([otherMember]); // Unchanged
    });

    it('should update correct member in list with multiple members', () => {
      const member1 = { id: 'member-1', firstName: 'John' };
      const member2 = { id: 'member-2', firstName: 'Jane' };
      const member3 = { id: 'member-3', firstName: 'Bob' };
      const stateWithMembers = {
        ...initialState,
        familyMembers: [member1, member2, member3],
      };
      const updatedMember2 = { ...member2, firstName: 'Janet' };
      const action = {
        type: updateFamilyMember.fulfilled.type,
        payload: updatedMember2,
      };
      const state = familyReducer(stateWithMembers, action);
      expect(state.familyMembers[0]).toEqual(member1);
      expect(state.familyMembers[1]).toEqual(updatedMember2);
      expect(state.familyMembers[2]).toEqual(member3);
    });
  });

  describe('getFamilyMembers async thunk', () => {
    const mockMembers: FamilyMember[] = [
      {
        id: 'member-1',
        firstName: 'John',
        lastName: 'Doe',
      } as FamilyMember,
      {
        id: 'member-2',
        firstName: 'Jane',
        lastName: 'Smith',
      } as FamilyMember,
    ];

    it('should handle getFamilyMembers.pending', () => {
      const action = { type: getFamilyMembers.pending.type };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getFamilyMembers.fulfilled', () => {
      const action = {
        type: getFamilyMembers.fulfilled.type,
        payload: mockMembers,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.familyMembers).toEqual(mockMembers);
      expect(state.error).toBeNull();
    });

    it('should handle getFamilyMembers.rejected', () => {
      const errorMessage = 'Failed to fetch family members';
      const action = {
        type: getFamilyMembers.rejected.type,
        payload: errorMessage,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should replace existing family members', () => {
      const existingMembers = [{ id: 'old-1', firstName: 'Old' }];
      const stateWithMembers = {
        ...initialState,
        familyMembers: existingMembers,
      };
      const action = {
        type: getFamilyMembers.fulfilled.type,
        payload: mockMembers,
      };
      const state = familyReducer(stateWithMembers, action);
      expect(state.familyMembers).toEqual(mockMembers);
    });

    it('should handle empty members array', () => {
      const action = {
        type: getFamilyMembers.fulfilled.type,
        payload: [],
      };
      const state = familyReducer(initialState, action);
      expect(state.familyMembers).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('getRelationships async thunk', () => {
    const mockRelationships: Relationship[] = [
      {
        id: 'rel-1',
        fromUserId: 'member-1',
        toUserId: 'member-2',
        relationshipType: 'parent',
        specificLabel: null,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'rel-2',
        fromUserId: 'member-2',
        toUserId: 'member-3',
        relationshipType: 'sibling',
        specificLabel: 'brother',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    it('should handle getRelationships.pending', () => {
      const action = { type: getRelationships.pending.type };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getRelationships.fulfilled', () => {
      const action = {
        type: getRelationships.fulfilled.type,
        payload: mockRelationships,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.relationships).toEqual(mockRelationships);
      expect(state.error).toBeNull();
    });

    it('should handle getRelationships.rejected', () => {
      const errorMessage = 'Failed to fetch relationships';
      const action = {
        type: getRelationships.rejected.type,
        payload: errorMessage,
      };
      const state = familyReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should replace existing relationships', () => {
      const existingRelationships = [{ id: 'old-rel-1', fromUserId: 'old-1' }];
      const stateWithRelationships = {
        ...initialState,
        relationships: existingRelationships,
      };
      const action = {
        type: getRelationships.fulfilled.type,
        payload: mockRelationships,
      };
      const state = familyReducer(stateWithRelationships, action);
      expect(state.relationships).toEqual(mockRelationships);
    });

    it('should handle empty relationships array', () => {
      const action = {
        type: getRelationships.fulfilled.type,
        payload: [],
      };
      const state = familyReducer(initialState, action);
      expect(state.relationships).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('relationship refresh logic', () => {
    it('should handle relationship refresh after adding member with relationship', () => {
      // This tests the automatic relationship refresh logic in addFamilyMember
      // The actual dispatch is tested in integration tests, but we can test the state changes
      const memberWithRelationship = {
        id: 'member-1',
        firstName: 'John',
        relatedTo: 'parent-1',
        relationshipType: 'child',
      };

      // First, add the member
      let state = familyReducer(initialState, {
        type: addFamilyMember.fulfilled.type,
        payload: memberWithRelationship,
      });
      expect(state.familyMembers).toContain(memberWithRelationship);

      // Then simulate the relationship refresh
      const newRelationships = [
        {
          id: 'rel-1',
          fromUserId: 'parent-1',
          toUserId: 'member-1',
          relationshipType: 'parent',
        },
      ];
      state = familyReducer(state, {
        type: getRelationships.fulfilled.type,
        payload: newRelationships,
      });
      expect(state.relationships).toEqual(newRelationships);
    });

    it('should maintain member data during relationship refresh', () => {
      const existingMembers = [
        { id: 'member-1', firstName: 'John' },
        { id: 'member-2', firstName: 'Jane' },
      ];
      const stateWithMembers = {
        ...initialState,
        familyMembers: existingMembers,
      };

      // Add a new member that triggers relationship refresh
      const newMember = {
        id: 'member-3',
        firstName: 'Bob',
        relatedTo: 'member-1',
        relationshipType: 'child',
      };
      let state = familyReducer(stateWithMembers, {
        type: addFamilyMember.fulfilled.type,
        payload: newMember,
      });

      // Verify member was added
      expect(state.familyMembers).toHaveLength(3);
      expect(state.familyMembers).toContain(newMember);

      // Simulate relationship refresh
      const relationships = [
        {
          id: 'rel-1',
          fromUserId: 'member-1',
          toUserId: 'member-3',
          relationshipType: 'parent',
        },
      ];
      state = familyReducer(state, {
        type: getRelationships.fulfilled.type,
        payload: relationships,
      });

      // Verify both members and relationships are maintained
      expect(state.familyMembers).toHaveLength(3);
      expect(state.relationships).toEqual(relationships);
    });
  });

  describe('selectors', () => {
    const mockMembers: FamilyMember[] = [
      {
        id: 'member-1',
        firstName: 'John',
        lastName: 'Doe',
      } as FamilyMember,
      {
        id: 'member-2',
        firstName: 'Jane',
        lastName: 'Smith',
      } as FamilyMember,
    ];

    const mockRelationships: Relationship[] = [
      {
        id: 'rel-1',
        fromUserId: 'member-1',
        toUserId: 'member-2',
        relationshipType: 'parent',
      } as Relationship,
    ];

    const mockState = {
      family: {
        familyMembers: mockMembers,
        relationships: mockRelationships,
        isLoading: false,
        error: 'Some error',
      } as FamilyState,
    };

    it('selectFamilyMembers should return family members from state', () => {
      expect(selectFamilyMembers(mockState)).toEqual(mockMembers);
    });

    it('selectFamilyMembers should return empty array when no members', () => {
      const emptyState = { family: { ...initialState } };
      expect(selectFamilyMembers(emptyState)).toEqual([]);
    });

    it('selectRelationships should return relationships from state', () => {
      expect(selectRelationships(mockState)).toEqual(mockRelationships);
    });

    it('selectRelationships should return empty array when no relationships', () => {
      const emptyState = { family: { ...initialState } };
      expect(selectRelationships(emptyState)).toEqual([]);
    });

    it('selectFamilyLoading should return loading state', () => {
      expect(selectFamilyLoading(mockState)).toBe(false);
    });

    it('selectFamilyLoading should return true when loading', () => {
      const loadingState = {
        family: { ...initialState, isLoading: true },
      };
      expect(selectFamilyLoading(loadingState)).toBe(true);
    });

    it('selectFamilyError should return error message', () => {
      expect(selectFamilyError(mockState)).toBe('Some error');
    });

    it('selectFamilyError should return null when no error', () => {
      const noErrorState = { family: { ...initialState } };
      expect(selectFamilyError(noErrorState)).toBeNull();
    });
  });

  describe('selectMemberById memoized selector', () => {
    const mockMembers: FamilyMember[] = [
      {
        id: 'member-1',
        firstName: 'John',
        lastName: 'Doe',
      } as FamilyMember,
      {
        id: 'member-2',
        firstName: 'Jane',
        lastName: 'Smith',
      } as FamilyMember,
      {
        id: 'member-3',
        firstName: 'Bob',
        lastName: 'Johnson',
      } as FamilyMember,
    ];

    const mockState = {
      family: {
        familyMembers: mockMembers,
        relationships: [],
        isLoading: false,
        error: null,
      } as FamilyState,
    };

    it('should return correct member by ID', () => {
      const member = selectMemberById(mockState, 'member-2');
      expect(member).toEqual(mockMembers[1]);
    });

    it('should return undefined for non-existent member ID', () => {
      const member = selectMemberById(mockState, 'non-existent');
      expect(member).toBeUndefined();
    });

    it('should return undefined when members array is empty', () => {
      const emptyState = { family: { ...initialState } };
      const member = selectMemberById(emptyState, 'member-1');
      expect(member).toBeUndefined();
    });

    it('should handle null or undefined member ID', () => {
      const memberNull = selectMemberById(mockState, null as any);
      const memberUndefined = selectMemberById(mockState, undefined as any);
      expect(memberNull).toBeUndefined();
      expect(memberUndefined).toBeUndefined();
    });

    it('should be memoized - return same reference for same inputs', () => {
      const member1 = selectMemberById(mockState, 'member-1');
      const member2 = selectMemberById(mockState, 'member-1');
      expect(member1).toBe(member2); // Same reference
    });

    it('should return different references for different member IDs', () => {
      const member1 = selectMemberById(mockState, 'member-1');
      const member2 = selectMemberById(mockState, 'member-2');
      expect(member1).not.toBe(member2);
      expect(member1.id).toBe('member-1');
      expect(member2.id).toBe('member-2');
    });

    it('should handle state changes correctly', () => {
      // Initial state
      const member = selectMemberById(mockState, 'member-1');
      expect(member.firstName).toBe('John');

      // Updated state with modified member
      const updatedMembers = mockMembers.map(m =>
        m.id === 'member-1' ? { ...m, firstName: 'Johnny' } : m
      );
      const updatedState = {
        family: {
          ...mockState.family,
          familyMembers: updatedMembers,
        },
      };

      const updatedMember = selectMemberById(updatedState, 'member-1');
      expect(updatedMember.firstName).toBe('Johnny');
    });
  });

  describe('state transitions', () => {
    it('should transition from initial to loading on addFamilyMember.pending', () => {
      const action = { type: addFamilyMember.pending.type };
      const state = familyReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to success on addFamilyMember.fulfilled', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockMember = { id: '1', firstName: 'John' };
      const action = {
        type: addFamilyMember.fulfilled.type,
        payload: mockMember,
      };
      const state = familyReducer(loadingState, action);
      expect(state).toEqual({
        familyMembers: [mockMember],
        relationships: [],
        isLoading: false,
        error: null,
      });
    });

    it('should transition from loading to error on addFamilyMember.rejected', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Add failed';
      const action = {
        type: addFamilyMember.rejected.type,
        payload: errorMessage,
      };
      const state = familyReducer(loadingState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage,
      });
    });

    it('should clear error when clearError is called', () => {
      const errorState = {
        ...initialState,
        error: 'Some error',
      };
      const state = familyReducer(errorState, clearError());
      expect(state.error).toBeNull();
    });

    it('should handle multiple operations in sequence', () => {
      // Start with initial state
      let state = initialState;

      // Add first member
      state = familyReducer(state, { type: addFamilyMember.pending.type });
      expect(state.isLoading).toBe(true);

      const member1 = { id: 'member-1', firstName: 'John' };
      state = familyReducer(state, {
        type: addFamilyMember.fulfilled.type,
        payload: member1,
      });
      expect(state.familyMembers).toEqual([member1]);
      expect(state.isLoading).toBe(false);

      // Add second member
      state = familyReducer(state, { type: addFamilyMember.pending.type });
      expect(state.isLoading).toBe(true);

      const member2 = { id: 'member-2', firstName: 'Jane' };
      state = familyReducer(state, {
        type: addFamilyMember.fulfilled.type,
        payload: member2,
      });
      expect(state.familyMembers).toEqual([member1, member2]);
      expect(state.isLoading).toBe(false);

      // Get relationships
      state = familyReducer(state, { type: getRelationships.pending.type });
      expect(state.isLoading).toBe(true);

      const relationships = [
        { id: 'rel-1', fromUserId: 'member-1', toUserId: 'member-2' },
      ];
      state = familyReducer(state, {
        type: getRelationships.fulfilled.type,
        payload: relationships,
      });
      expect(state.relationships).toEqual(relationships);
      expect(state.familyMembers).toEqual([member1, member2]);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear previous error when starting new operation', () => {
      const errorState = {
        ...initialState,
        error: 'Previous error',
      };
      const action = { type: addFamilyMember.pending.type };
      const state = familyReducer(errorState, action);
      expect(state.error).toBeNull();
    });

    it('should preserve family data when operation fails', () => {
      const existingMembers = [{ id: '1', firstName: 'John' }];
      const existingRelationships = [{ id: '1', fromUserId: '1' }];
      const stateWithData = {
        familyMembers: existingMembers,
        relationships: existingRelationships,
        isLoading: false,
        error: null,
      };
      const action = {
        type: addFamilyMember.rejected.type,
        payload: 'Add failed',
      };
      const state = familyReducer(stateWithData, action);
      expect(state.familyMembers).toEqual(existingMembers);
      expect(state.relationships).toEqual(existingRelationships);
      expect(state.error).toBe('Add failed');
    });

    it('should handle concurrent operations correctly', () => {
      // Start with some data
      const existingMembers = [{ id: '1', firstName: 'John' }];
      let state = {
        ...initialState,
        familyMembers: existingMembers,
      };

      // Start add operation
      state = familyReducer(state, { type: addFamilyMember.pending.type });
      expect(state.isLoading).toBe(true);

      // Start get relationships operation (should also set loading)
      state = familyReducer(state, { type: getRelationships.pending.type });
      expect(state.isLoading).toBe(true);

      // Complete get relationships
      const relationships = [{ id: 'rel-1', fromUserId: '1' }];
      state = familyReducer(state, {
        type: getRelationships.fulfilled.type,
        payload: relationships,
      });
      expect(state.relationships).toEqual(relationships);
      expect(state.isLoading).toBe(false);

      // Complete add member (should add to existing members)
      const newMember = { id: '2', firstName: 'Jane' };
      state = familyReducer(state, {
        type: addFamilyMember.fulfilled.type,
        payload: newMember,
      });
      expect(state.familyMembers).toEqual([...existingMembers, newMember]);
      expect(state.relationships).toEqual(relationships);
      expect(state.isLoading).toBe(false);
    });
  });
});