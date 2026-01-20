import axios from 'axios';
import { User, UserProfile } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Response interface for photo upload
interface PhotoUploadResponse {
  photoUrl: string;
}

/**
 * UserService handles all user profile-related API calls
 */
const UserService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Update user profile data
   */
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put<UserProfile>(`${API_BASE_URL}/users/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Compress an image file before upload
   * @param file - The image file to compress
   * @param maxWidth - Maximum width in pixels (default: 800)
   * @param maxHeight - Maximum height in pixels (default: 800)
   * @param quality - JPEG quality 0-1 (default: 0.8)
   * @returns Compressed image blob
   */
  async compressImage(
    file: File, 
    maxWidth: number = 800, 
    maxHeight: number = 800, 
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  },

  /**
   * Upload profile photo with compression
   * Images are automatically compressed to max 800x800 pixels
   */
  async uploadPhoto(file: File): Promise<string> {
    const token = localStorage.getItem('accessToken');
    
    // Compress image before upload
    const compressedBlob = await this.compressImage(file);
    
    const formData = new FormData();
    formData.append('photo', compressedBlob, file.name);

    const response = await axios.post<PhotoUploadResponse>(`${API_BASE_URL}/users/photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.photoUrl;
  },
};

export default UserService;