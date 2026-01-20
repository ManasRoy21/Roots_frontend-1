import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, {
  signUp,
  signIn,
  signInWithGoogle,
  signInWithApple,
  signOut,
  resetPassword,
  updatePassword,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from './authSlice';
import { AuthState } from '../../types/redux';
import { User } from '../../types/api';

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

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('clearError reducer', () => {
    it('should clear error state', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error message',
      };
      const actual = authReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });

    it('should not affect other state properties', () => {
      const stateWithData = {
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false,
        error: 'Some error',
      };
      const actual = authReducer(stateWithData, clearError());
      expect(actual.user).toEqual(stateWithData.user);
      expect(actual.isAuthenticated).toBe(true);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBeNull();
    });
  });

  describe('signUp async thunk', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      authProvider: 'email',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLoginAt: '2024-01-01T00:00:00.000Z',
      emailVerified: false,
    };

    it('should handle signUp.pending', () => {
      const action = { type: signUp.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signUp.fulfilled', () => {
      const action = {
        type: signUp.fulfilled.type,
        payload: mockUser,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signUp.rejected', () => {
      const errorMessage = 'Failed to sign up';
      const action = {
        type: signUp.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should set loading to true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: signUp.pending.type };
      const state = authReducer(stateWithError, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('signIn async thunk', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      authProvider: 'email',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLoginAt: '2024-01-01T00:00:00.000Z',
      emailVerified: true,
    };

    it('should handle signIn.pending', () => {
      const action = { type: signIn.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signIn.fulfilled', () => {
      const action = {
        type: signIn.fulfilled.type,
        payload: mockUser,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signIn.rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: signIn.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('signInWithGoogle async thunk', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@gmail.com',
      fullName: 'Google User',
      authProvider: 'google',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLoginAt: '2024-01-01T00:00:00.000Z',
      emailVerified: true,
    };

    it('should handle signInWithGoogle.pending', () => {
      const action = { type: signInWithGoogle.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signInWithGoogle.fulfilled', () => {
      const action = {
        type: signInWithGoogle.fulfilled.type,
        payload: mockUser,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signInWithGoogle.rejected', () => {
      const errorMessage = 'Failed to sign in with Google';
      const action = {
        type: signInWithGoogle.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('signInWithApple async thunk', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@icloud.com',
      fullName: 'Apple User',
      authProvider: 'apple',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLoginAt: '2024-01-01T00:00:00.000Z',
      emailVerified: true,
    };

    it('should handle signInWithApple.pending', () => {
      const action = { type: signInWithApple.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signInWithApple.fulfilled', () => {
      const action = {
        type: signInWithApple.fulfilled.type,
        payload: mockUser,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signInWithApple.rejected', () => {
      const errorMessage = 'Failed to sign in with Apple';
      const action = {
        type: signInWithApple.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('signOut async thunk', () => {
    it('should handle signOut.pending', () => {
      const action = { type: signOut.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle signOut.fulfilled', () => {
      const authenticatedState = {
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      const action = { type: signOut.fulfilled.type };
      const state = authReducer(authenticatedState, action);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle signOut.rejected', () => {
      const errorMessage = 'Failed to sign out';
      const action = {
        type: signOut.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should clear user data on successful sign out', () => {
      const authenticatedState = {
        user: { id: '1', email: 'test@example.com', fullName: 'Test User' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      const action = { type: signOut.fulfilled.type };
      const state = authReducer(authenticatedState, action);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('resetPassword async thunk', () => {
    it('should handle resetPassword.pending', () => {
      const action = { type: resetPassword.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle resetPassword.fulfilled', () => {
      const action = { type: resetPassword.fulfilled.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle resetPassword.rejected', () => {
      const errorMessage = 'Failed to send reset email';
      const action = {
        type: resetPassword.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should not modify user state during password reset', () => {
      const authenticatedState = {
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      const action = { type: resetPassword.fulfilled.type };
      const state = authReducer(authenticatedState, action);
      expect(state.user).toEqual(authenticatedState.user);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('updatePassword async thunk', () => {
    it('should handle updatePassword.pending', () => {
      const action = { type: updatePassword.pending.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle updatePassword.fulfilled', () => {
      const action = { type: updatePassword.fulfilled.type };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle updatePassword.rejected', () => {
      const errorMessage = 'Failed to reset password';
      const action = {
        type: updatePassword.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should not modify user state during password update', () => {
      const authenticatedState = {
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      const action = { type: updatePassword.fulfilled.type };
      const state = authReducer(authenticatedState, action);
      expect(state.user).toEqual(authenticatedState.user);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('selectors', () => {
    const mockState = {
      auth: {
        user: {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
        } as User,
        isAuthenticated: true,
        isLoading: false,
        error: 'Some error',
      } as AuthState,
    };

    it('selectUser should return user from state', () => {
      expect(selectUser(mockState)).toEqual(mockState.auth.user);
    });

    it('selectUser should return null when no user', () => {
      const emptyState = { auth: { ...initialState } };
      expect(selectUser(emptyState)).toBeNull();
    });

    it('selectIsAuthenticated should return authentication status', () => {
      expect(selectIsAuthenticated(mockState)).toBe(true);
    });

    it('selectIsAuthenticated should return false when not authenticated', () => {
      const unauthState = { auth: { ...initialState } };
      expect(selectIsAuthenticated(unauthState)).toBe(false);
    });

    it('selectAuthLoading should return loading state', () => {
      expect(selectAuthLoading(mockState)).toBe(false);
    });

    it('selectAuthLoading should return true when loading', () => {
      const loadingState = {
        auth: { ...initialState, isLoading: true },
      };
      expect(selectAuthLoading(loadingState)).toBe(true);
    });

    it('selectAuthError should return error message', () => {
      expect(selectAuthError(mockState)).toBe('Some error');
    });

    it('selectAuthError should return null when no error', () => {
      const noErrorState = { auth: { ...initialState } };
      expect(selectAuthError(noErrorState)).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('should transition from initial to loading on signIn.pending', () => {
      const action = { type: signIn.pending.type };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
      });
    });

    it('should transition from loading to authenticated on signIn.fulfilled', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockUser: User = { id: '1', email: 'test@example.com' } as User;
      const action = {
        type: signIn.fulfilled.type,
        payload: mockUser,
      };
      const state = authReducer(loadingState, action);
      expect(state).toEqual({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    });

    it('should transition from loading to error on signIn.rejected', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Invalid credentials';
      const action = {
        type: signIn.rejected.type,
        payload: errorMessage,
      };
      const state = authReducer(loadingState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage,
      });
    });

    it('should transition from authenticated to unauthenticated on signOut.fulfilled', () => {
      const authenticatedState: AuthState = {
        user: { id: '1', email: 'test@example.com' } as User,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      const action = { type: signOut.fulfilled.type };
      const state = authReducer(authenticatedState, action);
      expect(state).toEqual(initialState);
    });

    it('should clear error when clearError is called', () => {
      const errorState = {
        ...initialState,
        error: 'Some error',
      };
      const state = authReducer(errorState, clearError());
      expect(state.error).toBeNull();
    });
  });
});
