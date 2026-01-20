import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import FamilyService from '../../services/FamilyService';
import { FamilyState, AddFamilyMemberPayload, UpdateFamilyMemberPayload, AsyncThunkConfig } from '../../types/redux';
import { FamilyMember, Relationship } from '../../types/api';

// Mock mode for development
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

// Initial state
const initialState: FamilyState = {
  familyMembers: [],
  relationships: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const addFamilyMember = createAsyncThunk<FamilyMember, AddFamilyMemberPayload, AsyncThunkConfig>(
  'family/addFamilyMember',
  async (memberData, { dispatch, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMember: FamilyMember = {
          id: 'mock-member-' + Date.now(),
          userId: null,
          ...memberData,
          createdBy: 'mock-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Create relationship if provided
        if (memberData.relatedTo && memberData.relationshipType) {
          const newRelationship: Relationship = {
            id: 'mock-relationship-' + Date.now(),
            fromUserId: memberData.relatedTo,
            toUserId: newMember.id,
            relationshipType: memberData.relationshipType,
            specificLabel: memberData.specificLabel,
            createdAt: new Date().toISOString(),
          };
          
          // Automatically refresh relationships after adding member
          setTimeout(() => {
            dispatch(getRelationships(false));
          }, 0);
        }
        
        return newMember;
      }
      
      const newMember = await FamilyService.addFamilyMember(memberData);
      
      // Automatically refresh relationships if a relationship was created
      if (memberData.relatedTo && memberData.relationshipType) {
        dispatch(getRelationships(false));
      }
      
      return newMember;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to add family member');
    }
  }
);

export const updateFamilyMember = createAsyncThunk<FamilyMember, UpdateFamilyMemberPayload, AsyncThunkConfig>(
  'family/updateFamilyMember',
  async ({ memberId, memberData }, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedMember: FamilyMember = {
          ...memberData,
          id: memberId,
          updatedAt: new Date().toISOString(),
        } as FamilyMember;
        return updatedMember;
      }
      
      const updatedMember = await FamilyService.updateFamilyMember(memberId, memberData);
      return updatedMember;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to update family member');
    }
  }
);

export const getFamilyMembers = createAsyncThunk<FamilyMember[], boolean, AsyncThunkConfig>(
  'family/getFamilyMembers',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // If we already have members in state and not forcing refresh, return them
        const currentMembers = getState().family.familyMembers;
        if (currentMembers.length > 0 && !forceRefresh) {
          return currentMembers;
        }
        
        // Otherwise return empty array (tree owner will be shown)
        return [];
      }
      
      const members = await FamilyService.getFamilyMembers();
      return members;
    } catch (error) {
      // Don't reject for empty results, just return empty array
      console.error('Error fetching family members:', error);
      return [];
    }
  }
);

export const getRelationships = createAsyncThunk<Relationship[], boolean, AsyncThunkConfig>(
  'family/getRelationships',
  async (forceRefresh = false, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // If we already have relationships in state and not forcing refresh, return them
        const currentRelationships = getState().family.relationships;
        if (currentRelationships.length > 0 && !forceRefresh) {
          return currentRelationships;
        }
        
        // Otherwise return empty array (new tree with no relationships yet)
        return [];
      }
      
      const relationships = await FamilyService.getRelationships();
      return relationships;
    } catch (error) {
      // Don't reject for empty results, just return empty array
      console.error('Error fetching relationships:', error);
      return [];
    }
  }
);

// Family slice
const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add Family Member
    builder
      .addCase(addFamilyMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFamilyMember.fulfilled, (state, action: PayloadAction<FamilyMember>) => {
        state.isLoading = false;
        state.familyMembers.push(action.payload);
        state.error = null;
      })
      .addCase(addFamilyMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Family Member
    builder
      .addCase(updateFamilyMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFamilyMember.fulfilled, (state, action: PayloadAction<FamilyMember>) => {
        state.isLoading = false;
        const index = state.familyMembers.findIndex(
          member => member.id === action.payload.id
        );
        if (index !== -1) {
          state.familyMembers[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateFamilyMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Family Members
    builder
      .addCase(getFamilyMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFamilyMembers.fulfilled, (state, action: PayloadAction<FamilyMember[]>) => {
        state.isLoading = false;
        state.familyMembers = action.payload;
        state.error = null;
      })
      .addCase(getFamilyMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Relationships
    builder
      .addCase(getRelationships.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRelationships.fulfilled, (state, action: PayloadAction<Relationship[]>) => {
        state.isLoading = false;
        state.relationships = action.payload;
        state.error = null;
      })
      .addCase(getRelationships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectFamilyMembers = (state: { family: FamilyState }) => state.family.familyMembers;
export const selectRelationships = (state: { family: FamilyState }) => state.family.relationships;
export const selectFamilyLoading = (state: { family: FamilyState }) => state.family.isLoading;
export const selectFamilyError = (state: { family: FamilyState }) => state.family.error;

// Memoized selector for getting a member by ID
export const selectMemberById = createSelector(
  [selectFamilyMembers, (state: { family: FamilyState }, memberId: string) => memberId],
  (members, memberId) => members.find(member => member.id === memberId)
);

// Export actions and reducer
export const { clearError } = familySlice.actions;
export default familySlice.reducer;
