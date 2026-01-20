import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';
import { AuthState, SignUpPayload, SignInPayload, AsyncThunkConfig } from '../../types/redux';
import { User } from '../../types/api';

// Mock mode for development
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const signUp = createAsyncThunk<User, SignUpPayload, AsyncThunkConfig>(
  'auth/signUp',
  async ({ email, password, fullName }, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'mock-user-' + Date.now(),
          email,
          fullName,
          authProvider: 'email',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: false
        };
        const mockToken = 'mock-token-' + Date.now();
        
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        return mockUser;
      }
      
      const response = await AuthService.register(email, password, fullName);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to sign up');
    }
  }
);

export const signIn = createAsyncThunk<User, SignInPayload, AsyncThunkConfig>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'mock-user-' + Date.now(),
          email,
          fullName: email.split('@')[0],
          authProvider: 'email',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: true
        };
        const mockToken = 'mock-token-' + Date.now();
        
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        return mockUser;
      }
      
      const response = await AuthService.login(email, password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to sign in');
    }
  }
);

export const signInWithGoogle = createAsyncThunk<User, string, AsyncThunkConfig>(
  'auth/signInWithGoogle',
  async (token, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'mock-user-google-' + Date.now(),
          email: 'user@gmail.com',
          fullName: 'Google User',
          authProvider: 'google',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: true
        };
        const mockToken = 'mock-token-google-' + Date.now();
        
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        return mockUser;
      }
      
      const response = await AuthService.loginWithGoogle(token);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to sign in with Google');
    }
  }
);

export const signInWithApple = createAsyncThunk<User, string, AsyncThunkConfig>(
  'auth/signInWithApple',
  async (token, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'mock-user-apple-' + Date.now(),
          email: 'user@icloud.com',
          fullName: 'Apple User',
          authProvider: 'apple',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: true
        };
        const mockToken = 'mock-token-apple-' + Date.now();
        
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        return mockUser;
      }
      
      const response = await AuthService.loginWithApple(token);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to sign in with Apple');
    }
  }
);

export const signOut = createAsyncThunk<void, void, AsyncThunkConfig>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock sign out
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('mockUser');
        return;
      }
      
      await AuthService.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to sign out');
    }
  }
);

export const resetPassword = createAsyncThunk<void, string, AsyncThunkConfig>(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock password reset
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
      
      await AuthService.requestPasswordReset(email);
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to send reset email');
    }
  }
);

export const updatePassword = createAsyncThunk<void, { token: string; newPassword: string }, AsyncThunkConfig>(
  'auth/updatePassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock password update
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
      
      await AuthService.resetPassword(token, newPassword);
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to reset password');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In with Google
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In with Apple
    builder
      .addCase(signInWithApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithApple.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Export actions and reducer
export const { clearError } = authSlice.actions;
export default authSlice.reducer;
