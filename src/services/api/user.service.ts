import { api } from './index';
import { ApiResponse, UpdateProfileDto } from '../../types/api.types';

export class UserService {
  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<{ url: string; file: any }>> {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/files/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get user files (avatar, images, documents)
   */
  static async getUserFiles(entityId: string, fileType?: string): Promise<ApiResponse<any[]>> {
    return api.get(`/files/entity/user/${entityId}`, {
      params: { fileType }
    });
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ApiResponse<any>> {
    return api.get('/auth/profile');
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileDto): Promise<ApiResponse<any>> {
    return api.put('/auth/profile', data);
  }

  /**
   * Delete user file
   */
  static async deleteUserFile(fileId: string): Promise<ApiResponse<void>> {
    return api.delete(`/files/${fileId}`);
  }

  /**
   * Compress user avatar before upload
   */
  static async compressAvatar(file: File, quality: number = 0.8, maxWidth: number = 1024): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Validate avatar file
   */
  static validateAvatarFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Avatar must be a JPEG, PNG, or WebP image'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Avatar size must be less than 5MB'
      };
    }

    // Check image dimensions (max 2048x2048)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 2048 || img.height > 2048) {
          resolve({
            isValid: false,
            error: 'Avatar dimensions must be less than 2048x2048 pixels'
          });
        } else {
          resolve({ isValid: true });
        }
      };
      img.onerror = () => resolve({ isValid: true });
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<ApiResponse<{
    totalTeams: number;
    totalMatches: number;
    totalSwipes: number;
    totalLikes: number;
    winRate: number;
    joinDate: string;
    lastActive: string;
  }>> {
    return api.get('/auth/stats');
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    inAppNotifications?: boolean;
    language?: string;
    timezone?: string;
  }): Promise<ApiResponse<any>> {
    return api.put('/auth/preferences', preferences);
  }

  /**
   * Get user preferences
   */
  static async getPreferences(): Promise<ApiResponse<any>> {
    return api.get('/auth/preferences');
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(): Promise<ApiResponse<void>> {
    return api.post('/auth/deactivate');
  }

  /**
   * Change user password
   */
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<void>> {
    return api.post('/auth/change-password', data);
  }

  /**
   * Get user activity log
   */
  static async getActivityLog(params?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<any>> {
    return api.get('/auth/activity-log', { params });
  }

  /**
   * Export user data
   */
  static async exportUserData(): Promise<ApiResponse<Blob>> {
    return api.get('/auth/export', {
      responseType: 'blob'
    });
  }
}

export default UserService;