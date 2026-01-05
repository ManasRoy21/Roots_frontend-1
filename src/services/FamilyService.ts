import axios from 'axios';
import { 
  AddFamilyMemberRequest, 
  UpdateFamilyMemberRequest 
} from '../types/api';
import { FamilyMember, Relationship } from '../types/components';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Error interface for validation errors
interface ValidationError {
  message: string;
  validationErrors: Record<string, string>;
  isValidationError: boolean;
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
 * FamilyService handles all family member and relationship API calls
 */
const FamilyService = {
  /**
   * Add a new family member
   * @param memberData - Family member data
   * @returns Created family member
   */
  async addFamilyMember(memberData: AddFamilyMemberRequest): Promise<FamilyMember> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post<FamilyMember>(
          `${API_BASE_URL}/family/members`,
          memberData,
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
      // Handle validation errors from server
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'Invalid family member data';
        const validationErrors = error.response.data.errors || {};
        throw { message, validationErrors, isValidationError: true } as ValidationError;
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
      throw new Error(error.message || 'Failed to add family member');
    }
  },

  /**
   * Update an existing family member
   * @param memberId - Family member ID
   * @param memberData - Updated family member data
   * @returns Updated family member
   */
  async updateFamilyMember(memberId: string, memberData: UpdateFamilyMemberRequest): Promise<FamilyMember> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put<FamilyMember>(
          `${API_BASE_URL}/family/members/${memberId}`,
          memberData,
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
      // Handle validation errors from server
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'Invalid family member data';
        const validationErrors = error.response.data.errors || {};
        throw { message, validationErrors, isValidationError: true } as ValidationError;
      }
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error('Family member not found');
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
      throw new Error(error.message || 'Failed to update family member');
    }
  },

  /**
   * Get all family members for the current user
   * @returns List of family members
   */
  async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<FamilyMember[]>(`${API_BASE_URL}/family/members`, {
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
      throw new Error(error.message || 'Failed to fetch family members');
    }
  },

  /**
   * Get all relationships for the current user's family tree
   * @returns List of relationships
   */
  async getRelationships(): Promise<Relationship[]> {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<Relationship[]>(`${API_BASE_URL}/family/relationships`, {
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
      throw new Error(error.message || 'Failed to fetch relationships');
    }
  },
};

export default FamilyService;