import { api, uploadFile } from './index';
import { ApiResponse } from '../../types/api.types';

export class TeamsImagesService {
  /**
   * Upload team logo
   */
  static async uploadTeamLogo(teamId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string; file: any }>> {
    const response = await uploadFile(`/files/team/${teamId}/logo`, file, onProgress);

    if (response.success && response.data) {
      // Also update the team with the new logo URL
      await api.patch(`/teams/${teamId}`, {
        logo: response.data.url
      });
    }

    return response;
  }

  /**
   * Upload team banner
   */
  static async uploadTeamBanner(teamId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string; file: any }>> {
    const response = await uploadFile(`/files/team/${teamId}/banners`, file, onProgress);

    if (response.success && response.data) {
      // Get current team data to update banners array
      const teamResponse = await api.get(`/teams/${teamId}`);

      if (teamResponse.success && teamResponse.data) {
        const currentBanners = teamResponse.data.banners || [];
        const updatedBanners = [...currentBanners, response.data.url];

        // Update team with new banner
        await api.patch(`/teams/${teamId}`, {
          banners: updatedBanners
        });
      }
    }

    return response;
  }

  /**
   * Upload multiple team banners
   */
  static async uploadMultipleBanners(
    teamId: string,
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ uploaded: any[]; urls: string[] }>> {
    const uploadPromises = files.map(file =>
      uploadFile(`/files/team/${teamId}/banners`, file, (progress) => {
        if (onProgress) {
          onProgress((progress / files.length) + ((files.indexOf(file) * 100) / files.length));
        }
      })
    );

    try {
      const responses = await Promise.all(uploadPromises);
      const successfulUploads = responses.filter(res => res.success);
      const uploadedFiles = successfulUploads.map(res => res.data);
      const urls = uploadedFiles.map(file => file.url);

      if (urls.length > 0) {
        // Get current team data
        const teamResponse = await api.get(`/teams/${teamId}`);

        if (teamResponse.success && teamResponse.data) {
          const currentBanners = teamResponse.data.banners || [];
          const updatedBanners = [...currentBanners, ...urls];

          // Update team with new banners
          await api.patch(`/teams/${teamId}`, {
            banners: updatedBanners
          });
        }
      }

      return {
        success: true,
        data: {
          uploaded: uploadedFiles,
          urls
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error.message || 'Failed to upload banners',
          details: []
        }
      };
    }
  }

  /**
   * Get team files (logos, banners, images)
   */
  static async getTeamFiles(teamId: string, fileType?: string): Promise<ApiResponse<any[]>> {
    return api.get(`/files/entity/team/${teamId}`, {
      params: { fileType }
    });
  }

  /**
   * Delete team file
   */
  static async deleteTeamFile(fileId: string): Promise<ApiResponse<void>> {
    return api.delete(`/files/${fileId}`);
  }

  /**
   * Set team logo as primary
   */
  static async setPrimaryLogo(teamId: string, fileId: string): Promise<ApiResponse<any>> {
    return api.patch(`/files/${fileId}`, {
      isPrimary: true
    });
  }

  /**
   * Set team banner order
   */
  static async setBannerOrder(teamId: string, bannerIds: string[]): Promise<ApiResponse<any>> {
    // First update team banners array with new order
    const teamResponse = await api.get(`/teams/${teamId}`);

    if (teamResponse.success && teamResponse.data) {
      const allBanners = teamResponse.data.banners || [];
      const reorderedBanners = bannerIds.map(id =>
        allBanners.find((banner: any) => banner.id === id)
      ).filter(Boolean);

      await api.patch(`/teams/${teamId}`, {
        banners: reorderedBanners
      });
    }

    return {
      success: true,
      data: { bannerIds }
    };
  }

  /**
   * Compress team image before upload
   */
  static async compressTeamImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
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
   * Validate team image file
   */
  static validateTeamImageFile(file: File, type: 'logo' | 'banner'): { isValid: boolean; error?: string; recommendations?: string[] } {
    const recommendations: string[] = [];

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `${type} must be a JPEG, PNG, or WebP image`,
        recommendations: ['Use JPEG, PNG, or WebP format']
      };
    }

    // Check file size
    let maxSize = 5 * 1024 * 1024; // 5MB default
    let sizeRecommendation = '';

    if (type === 'logo') {
      maxSize = 2 * 1024 * 1024; // 2MB for logo
      sizeRecommendation = 'Logo should be less than 2MB for optimal loading';
    } else if (type === 'banner') {
      maxSize = 10 * 1024 * 1024; // 10MB for banner
      sizeRecommendation = 'Banner should be less than 10MB for optimal loading';
    }

    if (file.size > maxSize) {
      recommendations.push(sizeRecommendation);
    }

    // Check image dimensions
    if (type === 'logo') {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          let dimensionRecs: string[] = [];

          // Logo recommendations
          if (img.width < 200 || img.height < 200) {
            dimensionRecs.push('Logo should be at least 200x200 pixels for better visibility');
          }
          if (img.width > 1024 || img.height > 1024) {
            dimensionRecs.push('Logo should not exceed 1024x1024 pixels for optimal loading');
          }
          if (img.width !== img.height) {
            dimensionRecs.push('Square logos (1:1 ratio) work best for team avatars');
          }

          if (dimensionRecs.length > 0) {
            recommendations.push(...dimensionRecs);
          }

          resolve({
            isValid: recommendations.length === 0,
            error: recommendations.length > 0 ? recommendations[0] : undefined,
            recommendations: recommendations.length > 0 ? recommendations : undefined
          });
        };
        img.onerror = () => {
          resolve({
            isValid: false,
            error: 'Failed to validate image dimensions'
          });
        };
        img.src = URL.createObjectURL(file);
      });
    }

    // Banner dimensions check
    if (type === 'banner') {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          let dimensionRecs: string[] = [];

          // Banner recommendations
          const aspectRatio = img.width / img.height;
          if (aspectRatio < 3 || aspectRatio > 6) {
            dimensionRecs.push('Banner aspect ratio should be between 3:1 and 6:1 for optimal display');
          }
          if (img.width < 800) {
            dimensionRecs.push('Banner width should be at least 800px for better quality');
          }
          if (img.height < 200) {
            dimensionRecs.push('Banner height should be at least 200px for better visibility');
          }

          if (dimensionRecs.length > 0) {
            recommendations.push(...dimensionRecs);
          }

          resolve({
            isValid: recommendations.length === 0,
            error: recommendations.length > 0 ? recommendations[0] : undefined,
            recommendations: recommendations.length > 0 ? recommendations : undefined
          });
        };
        img.onerror = () => {
          resolve({
            isValid: false,
            error: 'Failed to validate image dimensions'
          });
        };
        img.src = URL.createObjectURL(file);
      });
    }

    return {
      isValid: true,
      error: undefined,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  }

  /**
   * Get team gallery
   */
  static async getTeamGallery(teamId: string, params?: {
    page?: number;
    limit?: number;
    fileType?: string;
  }): Promise<ApiResponse<any>> {
    return api.get(`/files/entity/team/${teamId}`, {
      params: {
        fileType: 'gallery',
        ...params
      }
    });
  }

  /**
   * Add photo to team gallery
   */
  static async addToGallery(
    teamId: string,
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<any[]>> {
    const uploadPromises = files.map(file =>
      uploadFile(`/files/team/${teamId}/gallery`, file, (progress) => {
        if (onProgress) {
          onProgress((progress / files.length) + ((files.indexOf(file) * 100) / files.length));
        }
      })
    );

    try {
      const responses = await Promise.all(uploadPromises);
      const uploadedFiles = responses.filter(res => res.success).map(res => res.data);

      return {
        success: true,
        data: uploadedFiles
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'GALLERY_UPLOAD_FAILED',
          message: error.message || 'Failed to upload gallery photos',
          details: []
        }
      };
    }
  }

  /**
   * Remove photo from team gallery
   */
  static async removeFromGallery(teamId: string, fileId: string): Promise<ApiResponse<void>> {
    return api.delete(`/files/team/${teamId}/gallery/${fileId}`);
  }

  /**
   * Get team branding assets
   */
  static async getTeamBranding(teamId: string): Promise<ApiResponse<{
    logo?: string;
    banners?: string[];
    colors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  }>> {
    return api.get(`/teams/${teamId}/branding`);
  }

  /**
   * Update team branding
   */
  static async updateTeamBranding(
    teamId: string,
    branding: {
      logo?: string;
      banners?: string[];
      colors?: {
        primary: string;
        secondary: string;
        accent: string;
      };
    }
  ): Promise<ApiResponse<any>> {
    return api.put(`/teams/${teamId}/branding`, branding);
  }
}

export default TeamsImagesService;