import axios from 'axios';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  GoogleAuthRequest, 
  AppleAuthRequest, 
  PasswordResetRequest, 
  PasswordUpdateRequest, 
  RefreshTokenRequest, 
  RefreshTokenResponse 
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * AuthService handles all authentication-related API calls.
 * 
 * Security Note: Passwords are sent as plaintext to the backend API,
 * where they are hashed using bcrypt (≥10 salt rounds) before storage.
 * Password hashing MUST be done server-side for security.
 */
const AuthService = {
  /**
   * Register a new user with email and password
   * Backend will hash the password before storage
   */
  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      fullName,
    } as RegisterRequest);
    return response.data;
  },

  /**
   * Login with email and password
   * Backend will compare hashed password with stored hash
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    } as LoginRequest);
    return response.data;
  },

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(token: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/google`, {
      token,
    } as GoogleAuthRequest);
    return response.data;
  },

  /**
   * Login with Apple Sign-In
   */
  async loginWithApple(token: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/apple`, {
      token,
    } as AppleAuthRequest);
    return response.data;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    } as PasswordResetRequest);
  },

  /**
   * Reset password with token
   * Backend will hash the new password before storage
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      newPassword,
    } as PasswordUpdateRequest);
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    } as RefreshTokenRequest);
    return response.data.accessToken;
  },
};

export default AuthService;