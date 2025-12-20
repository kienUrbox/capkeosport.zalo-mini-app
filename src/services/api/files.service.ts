import { api, uploadFile } from './index';
import {
  FileEntity,
  UploadResponse,
  ApiResponse,
  PaginatedApiResponse
} from '../../types/api.types';

export class FilesService {
  /**
   * Upload a generic file
   */
  static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    return uploadFile('/files/upload', file, onProgress);
  }

  /**
   * Upload team logo
   */
  static async uploadTeamLogo(teamId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    return uploadFile(`/files/team/${teamId}/logo`, file, onProgress);
  }

  /**
   * Upload team banner
   */
  static async uploadTeamBanner(teamId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    return uploadFile(`/files/team/${teamId}/banners`, file, onProgress);
  }

  /**
   * Upload user avatar
   */
  static async uploadUserAvatar(userId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    return uploadFile(`/files/user/avatar`, file, onProgress);
  }

  /**
   * Upload user avatar (alternative endpoint)
   */
  static async uploadUserAvatarV2(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    // Use the simpler endpoint without userId in path
    return uploadFile(`/files/user/avatar`, file, onProgress);
  }

  /**
   * Upload user avatar
   */
  static async uploadUserAvatar(userId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    return uploadFile(`/files/user/${userId}/avatar`, file, onProgress);
  }

  /**
   * Upload match images/documents
   */
  static async uploadMatchFile(matchId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadResponse>> {
    return uploadFile(`/files/match/${matchId}`, file, onProgress);
  }

  /**
   * Get files for an entity
   */
  static async getEntityFiles(
    entityType: 'team' | 'user' | 'match',
    entityId: string,
    fileType?: string
  ): Promise<ApiResponse<FileEntity[]>> {
    return api.get<FileEntity[]>(`/files/entity/${entityType}/${entityId}`, {
      params: { fileType }
    });
  }

  /**
   * Get file by ID
   */
  static async getFile(id: string): Promise<ApiResponse<FileEntity>> {
    return api.get<FileEntity>(`/files/${id}`);
  }

  /**
   * Delete file
   */
  static async deleteFile(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/files/${id}`);
  }

  /**
   * Get team files
   */
  static async getTeamFiles(teamId: string, fileType?: 'avatar' | 'logo' | 'banner' | 'image'): Promise<ApiResponse<FileEntity[]>> {
    return this.getEntityFiles('team', teamId, fileType);
  }

  /**
   * Get user files
   */
  static async getUserFiles(userId: string, fileType?: 'avatar' | 'image'): Promise<ApiResponse<FileEntity[]>> {
    return this.getEntityFiles('user', userId, fileType);
  }

  /**
   * Get match files
   */
  static async getMatchFiles(matchId: string, fileType?: 'image' | 'video' | 'document'): Promise<ApiResponse<FileEntity[]>> {
    return this.getEntityFiles('match', matchId, fileType);
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<UploadResponse[]>> {
    const results: UploadResponse[] = [];
    let totalProgress = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const response = await this.uploadFile(files[i], (progress) => {
          if (onProgress) {
            const overallProgress = ((totalProgress + progress) / (files.length * 100)) * 100;
            onProgress(overallProgress);
          }
        });

        if (response.success && response.data) {
          results.push(response.data);
        }

        totalProgress += 100;
      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error);
      }
    }

    return {
      success: true,
      data: results
    };
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 10): {
    isValid: boolean;
    error?: string;
  } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      };
    }

    return { isValid: true };
  }

  /**
   * Compress image before upload
   */
  static async compressImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
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
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
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
   * Get file preview URL
   */
  static getPreviewUrl(file: FileEntity): string {
    return file.url;
  }

  /**
   * Get file download URL
   */
  static getDownloadUrl(file: FileEntity): string {
    return `${file.url}?download=true`;
  }

  /**
   * Check if file is an image
   */
  static isImage(file: File | FileEntity): boolean {
    const mimeType = file instanceof File ? file.type : file.mimetype;
    return mimeType.startsWith('image/');
  }

  /**
   * Check if file is a video
   */
  static isVideo(file: File | FileEntity): boolean {
    const mimeType = file instanceof File ? file.type : file.mimetype;
    return mimeType.startsWith('video/');
  }

  /**
   * Check if file is a document
   */
  static isDocument(file: File | FileEntity): boolean {
    const mimeType = file instanceof File ? file.type : file.mimetype;
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
    return documentTypes.includes(mimeType);
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension
   */
  static getFileExtension(file: File | FileEntity): string {
    const filename = file instanceof File ? file.name : file.filename;
    return filename.split('.').pop()?.toLowerCase() || '';
  }
}

export default FilesService;