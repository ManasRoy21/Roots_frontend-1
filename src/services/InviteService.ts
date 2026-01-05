import axios from 'axios';
import { InviteResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Response interfaces for invite operations
interface ValidateInviteResponse {
  valid: boolean;
  treeId: string;
  treeName: string;
  ownerName: string;
}

interface JoinTreeResponse {
  success: boolean;
  treeId: string;
  treeName: string;
  message: string;
}

interface AcceptInvitationResponse {
  success: boolean;
  message: string;
}

interface DeclineInvitationResponse {
  success: boolean;
  message: string;
}

/**
 * Retry a failed request with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @returns Result of the function
 */
const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on network errors or 5xx server errors
      const shouldRetry = 
        !error.response || 
        (error.response?.status >= 500 && error.response?.status < 600);
      
      if (!shouldRetry || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * InviteService handles all family tree invitation API calls
 */
const InviteService = {
  /**
   * Validate an invite code format and existence
   * @param inviteCode - 6-character invite code
   * @returns Validation result with tree information
   */
  async validateInviteCode(inviteCode: string): Promise<ValidateInviteResponse> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post<ValidateInviteResponse>(
          `${API_BASE_URL}/invites/validate`,
          { inviteCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      });
    } catch (error: any) {
      // Handle invalid code errors
      if (error.response?.status === 404) {
        throw new Error('Invalid invite code. Please check the code and try again.');
      }
      // Handle expired code errors
      if (error.response?.status === 410) {
        throw new Error('This invite code has expired. Please request a new one.');
      }
      // Handle already member errors
      if (error.response?.status === 409) {
        throw new Error('You are already a member of this family tree.');
      }
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to validate invite code');
    }
  },

  /**
   * Join a family tree using an invite code
   * @param inviteCode - 6-character invite code
   * @returns Joined tree information
   */
  async joinTree(inviteCode: string): Promise<JoinTreeResponse> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post<JoinTreeResponse>(
          `${API_BASE_URL}/invites/join`,
          { inviteCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      });
    } catch (error: any) {
      // Handle invalid code errors
      if (error.response?.status === 404) {
        throw new Error('Invalid invite code. Please check the code and try again.');
      }
      // Handle expired code errors
      if (error.response?.status === 410) {
        throw new Error('This invite code has expired. Please request a new one.');
      }
      // Handle already member errors
      if (error.response?.status === 409) {
        throw new Error('You are already a member of this family tree.');
      }
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to join family tree');
    }
  },

  /**
   * Get all pending invitations for the current user
   * @returns List of pending invitations
   */
  async getPendingInvitations(): Promise<InviteResponse[]> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<InviteResponse[]>(`${API_BASE_URL}/invites/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      });
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to fetch pending invitations');
    }
  },

  /**
   * Accept a pending invitation
   * @param invitationId - Invitation ID
   * @returns Accepted invitation result
   */
  async acceptInvitation(invitationId: string): Promise<AcceptInvitationResponse> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post<AcceptInvitationResponse>(
          `${API_BASE_URL}/invites/${invitationId}/accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      });
    } catch (error: any) {
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error('Invitation not found');
      }
      // Handle already processed errors
      if (error.response?.status === 409) {
        throw new Error('This invitation has already been processed');
      }
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to accept invitation');
    }
  },

  /**
   * Decline a pending invitation
   * @param invitationId - Invitation ID
   * @returns Declined invitation result
   */
  async declineInvitation(invitationId: string): Promise<DeclineInvitationResponse> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post<DeclineInvitationResponse>(
          `${API_BASE_URL}/invites/${invitationId}/decline`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      });
    } catch (error: any) {
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error('Invitation not found');
      }
      // Handle already processed errors
      if (error.response?.status === 409) {
        throw new Error('This invitation has already been processed');
      }
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to decline invitation');
    }
  },
};

export default InviteService;