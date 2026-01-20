import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import AuthService from './AuthService';

// Mock axios
vi.mock('axios');

describe('AuthService Password Hashing Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Feature: landing-auth-onboarding, Property 14: Passwords are hashed before storage
  // Validates: Requirements 8.4
  it('should send password to backend for hashing during registration', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid registration data
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 })
            .filter(p => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p)),
          fullName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
        }),
        async ({ email, password, fullName }) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          // Mock backend response (backend has hashed the password)
          const mockResponse = {
            data: {
              user: {
                id: 'user-' + Date.now(),
                email,
                fullName,
                authProvider: 'email',
                createdAt: new Date().toISOString(),
                emailVerified: false
              },
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          };
          axios.post.mockResolvedValue(mockResponse);

          // Call register
          const result = await AuthService.register(email, password, fullName);

          // Verify that axios.post was called with the password
          // The password is sent to backend where it will be hashed
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/register'),
            expect.objectContaining({
              email,
              password, // Password sent as plaintext to backend for hashing
              fullName
            })
          );

          // Verify the response contains user data (but not the password)
          expect(result.user).toBeDefined();
          expect(result.user.email).toBe(email);
          expect(result.user).not.toHaveProperty('password');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: landing-auth-onboarding, Property 15: Authentication uses hashed comparison
  // Validates: Requirements 8.5
  it('should send password to backend for hash comparison during login', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid login credentials
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 50 })
            .filter(p => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p))
        }),
        async ({ email, password }) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          // Mock backend response (backend has compared hashed passwords)
          const mockResponse = {
            data: {
              user: {
                id: 'user-' + Date.now(),
                email,
                fullName: 'Test User',
                authProvider: 'email',
                lastLoginAt: new Date().toISOString()
              },
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token'
            }
          };
          axios.post.mockResolvedValue(mockResponse);

          // Call login
          const result = await AuthService.login(email, password);

          // Verify that axios.post was called with the password
          // The password is sent to backend where it will be compared with stored hash
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/login'),
            expect.objectContaining({
              email,
              password // Password sent as plaintext to backend for hash comparison
            })
          );

          // Verify the response contains user data (but not the password)
          expect(result.user).toBeDefined();
          expect(result.user.email).toBe(email);
          expect(result.user).not.toHaveProperty('password');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should send new password to backend for hashing during password reset', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid password reset data
        fc.record({
          token: fc.uuid(),
          newPassword: fc.string({ minLength: 8, maxLength: 50 })
            .filter(p => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p))
        }),
        async ({ token, newPassword }) => {
          // Import axios to mock it
          const axios = (await import('axios')).default;
          
          // Clear mocks for this property test run
          vi.clearAllMocks();
          
          // Mock backend response
          const mockResponse = {
            data: {
              success: true,
              message: 'Password reset successful'
            }
          };
          axios.post.mockResolvedValue(mockResponse);

          // Call resetPassword
          await AuthService.resetPassword(token, newPassword);

          // Verify that axios.post was called with the new password
          // The password is sent to backend where it will be hashed before storage
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/reset-password'),
            expect.objectContaining({
              token,
              newPassword // New password sent to backend for hashing
            })
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call register API with correct parameters', async () => {
    const axios = (await import('axios')).default;
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com', fullName: 'Test User' },
        accessToken: 'token',
        refreshToken: 'refresh'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await AuthService.register('test@example.com', 'Password123', 'Test User');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      {
        email: 'test@example.com',
        password: 'Password123',
        fullName: 'Test User'
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle valid login credentials', async () => {
    const axios = (await import('axios')).default;
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token',
        refreshToken: 'refresh'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await AuthService.login('test@example.com', 'Password123');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      {
        email: 'test@example.com',
        password: 'Password123'
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle invalid login credentials', async () => {
    const axios = (await import('axios')).default;
    const error = new Error('Invalid credentials');
    axios.post.mockRejectedValue(error);

    await expect(AuthService.login('test@example.com', 'WrongPassword')).rejects.toThrow('Invalid credentials');
  });

  it('should send password reset email', async () => {
    const axios = (await import('axios')).default;
    const mockResponse = { data: { success: true } };
    axios.post.mockResolvedValue(mockResponse);

    await AuthService.requestPasswordReset('test@example.com');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/forgot-password'),
      { email: 'test@example.com' }
    );
  });

  it('should handle API failures for password reset', async () => {
    const axios = (await import('axios')).default;
    const error = new Error('Network error');
    axios.post.mockRejectedValue(error);

    await expect(AuthService.requestPasswordReset('test@example.com')).rejects.toThrow('Network error');
  });

  it('should call Google OAuth endpoint', async () => {
    const axios = (await import('axios')).default;
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token',
        refreshToken: 'refresh'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await AuthService.loginWithGoogle('google-token');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/google'),
      { token: 'google-token' }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should call Apple Sign-In endpoint', async () => {
    const axios = (await import('axios')).default;
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token',
        refreshToken: 'refresh'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await AuthService.loginWithApple('apple-token');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/apple'),
      { token: 'apple-token' }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle logout', async () => {
    const axios = (await import('axios')).default;
    localStorage.setItem('accessToken', 'test-token');
    axios.post.mockResolvedValue({ data: { success: true } });

    await AuthService.logout();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      {},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });

  it('should refresh access token', async () => {
    const axios = (await import('axios')).default;
    localStorage.setItem('refreshToken', 'refresh-token');
    const mockResponse = { data: { accessToken: 'new-token' } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await AuthService.refreshToken();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      { refreshToken: 'refresh-token' }
    );
    expect(result).toBe('new-token');
  });
});