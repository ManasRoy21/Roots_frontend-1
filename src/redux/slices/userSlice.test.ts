import { describe, it, expect, beforeEach } from 'vitest';
import userReducer, {
  updateProfile,
  uploadProfilePhoto,
  clearError,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
} from './userSlice';
import { UserState } from '../../types/redux';
import { UserProfile } from '../../types/api';

describe('userSlice', () => {
  const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    // Clear any mocks if needed
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('clearError reducer', () => {
    it('should clear error state', () => {
      const stateWithError: UserState = {
        ...initialState,
        error: 'Some error message',
      };
      const actual = userReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });

    it('should not affect other state properties', () => {
      const stateWithData: UserState = {
        profile: {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
          photoUrl: 'https://example.com/photo.jpg',
        } as UserProfile,
        isLoading: false,
        error: 'Some error',
      };
      const actual = userReducer(stateWithData, clearError());
      expect(actual.profile).toEqual(stateWithData.profile);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBeNull();
    });
  });

  describe('updateProfile async thunk', () => {
    const mockProfile: UserProfile = {
      userId: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      photoUrl: 'https://example.com/photo.jpg',
      biography: 'Test bio',
      location: 'Test City',
      isComplete: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should handle updateProfile.pending', () => {
      const action = { type: updateProfile.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle updateProfile.fulfilled', () => {
      const action = {
        type: updateProfile.fulfilled.type,
        payload: mockProfile,
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.profile).toEqual(mockProfile);
      expect(state.error).toBeNull();
    });

    it('should handle updateProfile.rejected', () => {
      const errorMessage = 'Failed to update profile';
      const action = {
        type: updateProfile.rejected.type,
        payload: errorMessage,
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.profile).toBeNull();
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError: UserState = { ...initialState, error: 'Previous error' };
      const action = { type: updateProfile.pending.type };
      const state = userReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update existing profile data', () => {
      const existingProfile: UserProfile = {
        userId: '1',
        firstName: 'Jane',
        lastName: 'Smith',
        photoUrl: 'https://example.com/old.jpg',
      } as UserProfile;
      const stateWithProfile: UserState = {
        ...initialState,
        profile: existingProfile,
      };
      const updatedProfile: UserProfile = {
        ...existingProfile,
        firstName: 'John',
        biography: 'Updated bio',
      };
      const action = {
        type: updateProfile.fulfilled.type,
        payload: updatedProfile,
      };
      const state = userReducer(stateWithProfile, action);
      expect(state.profile).toEqual(updatedProfile);
    });
  });

  describe('uploadProfilePhoto async thunk', () => {
    const mockPhotoUrl = 'https://example.com/new-photo.jpg';

    it('should handle uploadProfilePhoto.pending', () => {
      const action = { type: uploadProfilePhoto.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle uploadProfilePhoto.fulfilled with existing profile', () => {
      const existingProfile: UserProfile = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        photoUrl: 'https://example.com/old-photo.jpg',
      } as UserProfile;
      const stateWithProfile: UserState = {
        ...initialState,
        profile: existingProfile,
      };
      const action = {
        type: uploadProfilePhoto.fulfilled.type,
        payload: mockPhotoUrl,
      };
      const state = userReducer(stateWithProfile, action);
      expect(state.isLoading).toBe(false);
      expect(state.profile!.photoUrl).toBe(mockPhotoUrl);
      expect(state.profile!.firstName).toBe('John');
      expect(state.profile!.lastName).toBe('Doe');
      expect(state.error).toBeNull();
    });

    it('should handle uploadProfilePhoto.fulfilled without existing profile', () => {
      const action = {
        type: uploadProfilePhoto.fulfilled.type,
        payload: mockPhotoUrl,
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.profile).toEqual({ photoUrl: mockPhotoUrl });
      expect(state.error).toBeNull();
    });

    it('should handle uploadProfilePhoto.rejected', () => {
      const errorMessage = 'Failed to upload photo';
      const action = {
        type: uploadProfilePhoto.rejected.type,
        payload: errorMessage,
      };
      const state = userReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should preserve other profile fields when updating photo', () => {
      const existingProfile: UserProfile = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        biography: 'Test bio',
        location: 'Test City',
        photoUrl: 'https://example.com/old-photo.jpg',
      } as UserProfile;
      const stateWithProfile: UserState = {
        ...initialState,
        profile: existingProfile,
      };
      const action = {
        type: uploadProfilePhoto.fulfilled.type,
        payload: mockPhotoUrl,
      };
      const state = userReducer(stateWithProfile, action);
      expect(state.profile!.userId).toBe('1');
      expect(state.profile!.firstName).toBe('John');
      expect(state.profile!.lastName).toBe('Doe');
      expect(state.profile!.dateOfBirth).toBe('1990-01-01');
      expect(state.profile!.biography).toBe('Test bio');
      expect(state.profile!.location).toBe('Test City');
      expect(state.profile!.photoUrl).toBe(mockPhotoUrl);
    });

    it('should not affect profile when upload fails', () => {
      const existingProfile: Partial<UserProfile> = {
        userId: '1',
        firstName: 'John',
        photoUrl: 'https://example.com/old-photo.jpg',
      };
      const stateWithProfile: UserState = {
        ...initialState,
        profile: existingProfile as UserProfile,
      };
      const action = {
        type: uploadProfilePhoto.rejected.type,
        payload: 'Upload failed',
      };
      const state = userReducer(stateWithProfile, action);
      expect(state.profile).toEqual(existingProfile);
    });
  });

  describe('selectors', () => {
    const mockProfile: UserProfile = {
      userId: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      photoUrl: 'https://example.com/photo.jpg',
      biography: 'Test bio',
      location: 'Test City',
      isComplete: true,
    } as UserProfile;

    const mockState = {
      user: {
        profile: mockProfile,
        isLoading: false,
        error: 'Some error',
      } as UserState,
    };

    it('selectProfile should return profile from state', () => {
      expect(selectProfile(mockState)).toEqual(mockProfile);
    });

    it('selectProfile should return null when no profile', () => {
      const emptyState = { user: { ...initialState } };
      expect(selectProfile(emptyState)).toBeNull();
    });

    it('selectProfileLoading should return loading state', () => {
      expect(selectProfileLoading(mockState)).toBe(false);
    });

    it('selectProfileLoading should return true when loading', () => {
      const loadingState = {
        user: { ...initialState, isLoading: true },
      };
      expect(selectProfileLoading(loadingState)).toBe(true);
    });

    it('selectProfileError should return error message', () => {
      expect(selectProfileError(mockState)).toBe('Some error');
    });

    it('selectProfileError should return null when no error', () => {
      const noErrorState = { user: { ...initialState } };
      expect(selectProfileError(noErrorState)).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('should transition from initial to loading on updateProfile.pending', () => {
      const action = { type: updateProfile.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to success on updateProfile.fulfilled', () => {
      const loadingState: UserState = { ...initialState, isLoading: true };
      const mockProfile: UserProfile = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
      } as UserProfile;
      const action = {
        type: updateProfile.fulfilled.type,
        payload: mockProfile,
      };
      const state = userReducer(loadingState, action);
      expect(state).toEqual({
        profile: mockProfile,
        isLoading: false,
        error: null,
      });
    });

    it('should transition from loading to error on updateProfile.rejected', () => {
      const loadingState: UserState = { ...initialState, isLoading: true };
      const errorMessage = 'Update failed';
      const action = {
        type: updateProfile.rejected.type,
        payload: errorMessage,
      };
      const state = userReducer(loadingState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage,
      });
    });

    it('should transition from initial to loading on uploadProfilePhoto.pending', () => {
      const action = { type: uploadProfilePhoto.pending.type };
      const state = userReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to success on uploadProfilePhoto.fulfilled', () => {
      const loadingState: UserState = { ...initialState, isLoading: true };
      const photoUrl = 'https://example.com/photo.jpg';
      const action = {
        type: uploadProfilePhoto.fulfilled.type,
        payload: photoUrl,
      };
      const state = userReducer(loadingState, action);
      expect(state).toEqual({
        profile: { photoUrl },
        isLoading: false,
        error: null,
      });
    });

    it('should clear error when clearError is called', () => {
      const errorState: UserState = {
        ...initialState,
        error: 'Some error',
      };
      const state = userReducer(errorState, clearError());
      expect(state.error).toBeNull();
    });

    it('should handle multiple operations in sequence', () => {
      // Start with initial state
      let state: UserState = initialState;

      // Update profile
      state = userReducer(state, { type: updateProfile.pending.type });
      expect(state.isLoading).toBe(true);

      const profile: UserProfile = { userId: '1', firstName: 'John' } as UserProfile;
      state = userReducer(state, {
        type: updateProfile.fulfilled.type,
        payload: profile,
      });
      expect(state.profile).toEqual(profile);
      expect(state.isLoading).toBe(false);

      // Upload photo
      state = userReducer(state, { type: uploadProfilePhoto.pending.type });
      expect(state.isLoading).toBe(true);

      const photoUrl = 'https://example.com/photo.jpg';
      state = userReducer(state, {
        type: uploadProfilePhoto.fulfilled.type,
        payload: photoUrl,
      });
      expect(state.profile!.photoUrl).toBe(photoUrl);
      expect(state.profile!.firstName).toBe('John');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear previous error when starting new operation', () => {
      const errorState: UserState = {
        ...initialState,
        error: 'Previous error',
      };
      const action = { type: updateProfile.pending.type };
      const state = userReducer(errorState, action);
      expect(state.error).toBeNull();
    });

    it('should preserve profile data when operation fails', () => {
      const existingProfile: Partial<UserProfile> = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
      };
      const stateWithProfile: UserState = {
        profile: existingProfile as UserProfile,
        isLoading: false,
        error: null,
      };
      const action = {
        type: updateProfile.rejected.type,
        payload: 'Update failed',
      };
      const state = userReducer(stateWithProfile, action);
      expect(state.profile).toEqual(existingProfile);
      expect(state.error).toBe('Update failed');
    });

    it('should handle error during photo upload without affecting profile', () => {
      const existingProfile: Partial<UserProfile> = {
        userId: '1',
        firstName: 'John',
        photoUrl: 'https://example.com/old.jpg',
      };
      const stateWithProfile: UserState = {
        profile: existingProfile as UserProfile,
        isLoading: false,
        error: null,
      };
      const action = {
        type: uploadProfilePhoto.rejected.type,
        payload: 'Upload failed',
      };
      const state = userReducer(stateWithProfile, action);
      expect(state.profile).toEqual(existingProfile);
      expect(state.error).toBe('Upload failed');
    });
  });
});