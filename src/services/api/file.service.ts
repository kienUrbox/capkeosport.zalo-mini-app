import { api, uploadFile } from './index';
import { ApiResponse } from '@/types/api.types';

// File entity response from API
export interface FileEntity {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  storageProvider: string;
  publicUrl: string;
  thumbnailUrl?: string;
  entityType: 'team' | 'user' | 'match';
  entityId: string;
  fileType: 'logo' | 'banner' | 'gallery' | 'avatar' | 'document';
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  data: FileEntity;
}

export interface UploadFileParams {
  file: File;
  fileType?: 'logo' | 'banner' | 'avatar' | 'gallery' | 'document';
}

/**
 * File Service
 *
 * API methods for file upload and management
 */
export const FileService = {
  /**
   * Standalone file upload
   * POST /files/upload
   *
   * Uploads a file and returns the public URL.
   * No entityType or entityId needed - just upload and get URL.
   */
  uploadFile: async (
    params: UploadFileParams,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileEntity>> => {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.fileType) {
      formData.append('fileType', params.fileType);
    }

    return api.post<FileEntity>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  /**
   * Upload team logo
   * POST /files/team/:teamId/logo
   */
  uploadTeamLogo: async (
    teamId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileEntity>> => {
    return uploadFile(`/files/team/${teamId}/logo`, file, onProgress);
  },

  /**
   * Upload team banner
   * POST /files/team/:teamId/banners
   */
  uploadTeamBanner: async (
    teamId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileEntity>> => {
    return uploadFile(`/files/team/${teamId}/banners`, file, onProgress);
  },

  /**
   * Upload user avatar
   * POST /files/user/avatar
   */
  uploadUserAvatar: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileEntity>> => {
    return uploadFile(`/files/user/avatar`, file, onProgress);
  },

  /**
   * Upload user banner
   * POST /files/user/banner
   */
  uploadUserBanner: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileEntity>> => {
    return uploadFile(`/files/user/banner`, file, onProgress);
  },

  /**
   * Get files by entity
   * GET /files/entity/:entityType/:entityId?fileType=logo
   */
  getEntityFiles: async (
    entityType: 'team' | 'user' | 'match',
    entityId: string,
    fileType?: 'logo' | 'banner' | 'gallery' | 'avatar'
  ): Promise<ApiResponse<FileEntity[]>> => {
    const params = fileType ? { fileType } : {};
    return api.get<FileEntity[]>(`/files/entity/${entityType}/${entityId}`, { params });
  },

  /**
   * Delete file
   * DELETE /files/:fileId
   */
  deleteFile: async (fileId: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/files/${fileId}`);
  },
};

export default FileService;
