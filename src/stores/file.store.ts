import { create } from 'zustand';
import type { FileEntity, UploadResponse } from '@/types/api.types';
import { uploadFile as apiUploadFile } from '@/services/api/index';

interface UploadProgress {
  fileId: string;
  progress: number;
  fileName: string;
}

interface FileState {
  // State
  uploadedFiles: Map<string, FileEntity>; // entityId -> files
  isLoading: boolean;
  uploadProgress: Map<string, UploadProgress>; // fileId -> progress
  error: string | null;

  // ========== State Management Actions ==========
  setUploadedFiles: (files: Map<string, FileEntity>) => void;
  addUploadedFile: (entityId: string, file: FileEntity) => void;
  removeUploadedFile: (entityId: string, fileId: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setUploadProgress: (fileId: string, progress: number, fileName: string) => void;
  removeUploadProgress: (fileId: string) => void;

  // ========== API Methods ==========

  /**
   * Upload file
   * POST /files/upload
   */
  uploadFile: (
    file: File,
    entityType: 'team' | 'user' | 'match',
    entityId: string,
    fileType: 'avatar' | 'logo' | 'banner' | 'document' | 'image' | 'video',
    onProgress?: (progress: number) => void
  ) => Promise<FileEntity>;

  /**
   * Upload team logo
   * POST /files/team/:teamId/logo
   */
  uploadTeamLogo: (
    teamId: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<FileEntity>;

  /**
   * Upload team banner
   * POST /files/team/:teamId/banners
   */
  uploadTeamBanner: (
    teamId: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<FileEntity>;

  /**
   * Upload user avatar
   * POST /files/user/avatar
   */
  uploadUserAvatar: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<FileEntity>;

  /**
   * Upload user banner
   * POST /files/user/banner
   */
  uploadUserBanner: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<FileEntity>;

  /**
   * Get entity files
   * GET /files/entity/:entityType/:entityId
   */
  getEntityFiles: (entityType: 'team' | 'user' | 'match', entityId: string) => Promise<FileEntity[]>;

  /**
   * Delete file
   * DELETE /files/:fileId
   */
  deleteFile: (fileId: string) => Promise<void>;
}

// Helper to generate a unique file ID for tracking upload progress
const generateFileId = () => `upload_${Date.now()}_${Math.random().toString(36).substring(7)}`;

export const useFileStore = create<FileState>((set, get) => ({
  // Initial state
  uploadedFiles: new Map(),
  isLoading: false,
  uploadProgress: new Map(),
  error: null,

  // ========== State Management Actions ==========

  setUploadedFiles: (files) => set({ uploadedFiles: files }),

  addUploadedFile: (entityId, file) =>
    set((state) => {
      const newMap = new Map(state.uploadedFiles);
      const existingFiles = newMap.get(entityId) || [];
      newMap.set(entityId, [...existingFiles, file]);
      return { uploadedFiles: newMap };
    }),

  removeUploadedFile: (entityId, fileId) =>
    set((state) => {
      const newMap = new Map(state.uploadedFiles);
      const existingFiles = newMap.get(entityId) || [];
      newMap.set(
        entityId,
        existingFiles.filter((f) => f.id !== fileId)
      );
      return { uploadedFiles: newMap };
    }),

  clearError: () => set({ error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setUploadProgress: (fileId, progress, fileName) =>
    set((state) => {
      const newMap = new Map(state.uploadProgress);
      newMap.set(fileId, { fileId, progress, fileName });
      return { uploadProgress: newMap };
    }),

  removeUploadProgress: (fileId) =>
    set((state) => {
      const newMap = new Map(state.uploadProgress);
      newMap.delete(fileId);
      return { uploadProgress: newMap };
    }),

  // ========== API Methods ==========

  /**
   * Upload file
   * POST /files/upload
   */
  uploadFile: async (file, entityType, entityId, fileType, onProgress) => {
    const fileId = generateFileId();

    try {
      set({ isLoading: true, error: null });

      const response = await apiUploadFile(
        `/files/upload`,
        file,
        (progress) => {
          get().setUploadProgress(fileId, progress, file.name);
          onProgress?.(progress);
        }
      );

      if (response.success && response.data) {
        // Add to uploaded files
        get().addUploadedFile(entityId, response.data);

        // Remove upload progress
        get().removeUploadProgress(fileId);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to upload file');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải lên file';
      set({ error: errorMessage, isLoading: false });

      // Remove upload progress on error
      get().removeUploadProgress(fileId);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Upload team logo
   * POST /files/team/:teamId/logo
   */
  uploadTeamLogo: async (teamId, file, onProgress) => {
    const fileId = generateFileId();

    try {
      set({ isLoading: true, error: null });

      const response = await apiUploadFile(
        `/files/team/${teamId}/logo`,
        file,
        (progress) => {
          get().setUploadProgress(fileId, progress, file.name);
          onProgress?.(progress);
        }
      );

      if (response.success && response.data) {
        // Add to uploaded files
        get().addUploadedFile(teamId, response.data);

        // Remove upload progress
        get().removeUploadProgress(fileId);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to upload logo');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải lên logo';
      set({ error: errorMessage, isLoading: false });

      // Remove upload progress on error
      get().removeUploadProgress(fileId);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Upload team banner
   * POST /files/team/:teamId/banners
   */
  uploadTeamBanner: async (teamId, file, onProgress) => {
    const fileId = generateFileId();

    try {
      set({ isLoading: true, error: null });

      const response = await apiUploadFile(
        `/files/team/${teamId}/banners`,
        file,
        (progress) => {
          get().setUploadProgress(fileId, progress, file.name);
          onProgress?.(progress);
        }
      );

      if (response.success && response.data) {
        // Add to uploaded files
        get().addUploadedFile(teamId, response.data);

        // Remove upload progress
        get().removeUploadProgress(fileId);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to upload banner');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải lên banner';
      set({ error: errorMessage, isLoading: false });

      // Remove upload progress on error
      get().removeUploadProgress(fileId);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Upload user avatar
   * POST /files/user/avatar
   */
  uploadUserAvatar: async (file, onProgress) => {
    const fileId = generateFileId();

    try {
      set({ isLoading: true, error: null });

      const response = await apiUploadFile(
        `/files/user/avatar`,
        file,
        (progress) => {
          get().setUploadProgress(fileId, progress, file.name);
          onProgress?.(progress);
        }
      );

      if (response.success && response.data) {
        // Remove upload progress
        get().removeUploadProgress(fileId);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to upload avatar');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải lên ảnh đại diện';
      set({ error: errorMessage, isLoading: false });

      // Remove upload progress on error
      get().removeUploadProgress(fileId);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Upload user banner
   * POST /files/user/banner
   *
   * Note: Using /files/upload with fileType=banner if dedicated endpoint doesn't exist
   */
  uploadUserBanner: async (file, onProgress) => {
    const fileId = generateFileId();

    try {
      set({ isLoading: true, error: null });

      const response = await apiUploadFile(
        `/files/user/banner`,
        file,
        (progress) => {
          get().setUploadProgress(fileId, progress, file.name);
          onProgress?.(progress);
        }
      );

      if (response.success && response.data) {
        // Remove upload progress
        get().removeUploadProgress(fileId);

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to upload banner');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải lên ảnh bìa';
      set({ error: errorMessage, isLoading: false });

      // Remove upload progress on error
      get().removeUploadProgress(fileId);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Get entity files
   * GET /files/entity/:entityType/:entityId
   */
  getEntityFiles: async (entityType, entityId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/v1/files/entity/${entityType}/${entityId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const files = Array.isArray(data.data) ? data.data : [data.data];

        // Store in uploaded files map
        set((state) => {
          const newMap = new Map(state.uploadedFiles);
          newMap.set(entityId, files);
          return { uploadedFiles: newMap, error: null };
        });

        return files;
      } else {
        throw new Error(data.message || 'Failed to fetch files');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể tải danh sách file';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Delete file
   * DELETE /files/:fileId
   */
  deleteFile: async (fileId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Remove from uploaded files map
        set((state) => {
          const newMap = new Map(state.uploadedFiles);
          for (const [entityId, files] of newMap.entries()) {
            newMap.set(
              entityId,
              files.filter((f) => f.id !== fileId)
            );
          }
          return { uploadedFiles: newMap };
        });
      } else {
        throw new Error(data.message || 'Failed to delete file');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể xóa file';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Selectors
export const useUploadedFiles = () => useFileStore((state) => state.uploadedFiles);

export const useUploadProgress = (fileId: string) =>
  useFileStore((state) => state.uploadProgress.get(fileId));

export const useAllUploadProgress = () => useFileStore((state) => state.uploadProgress);

export const useFileActions = () => {
  const store = useFileStore();
  return {
    setUploadedFiles: store.setUploadedFiles,
    addUploadedFile: store.addUploadedFile,
    removeUploadedFile: store.removeUploadedFile,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    setUploadProgress: store.setUploadProgress,
    removeUploadProgress: store.removeUploadProgress,
    // API methods
    uploadFile: store.uploadFile,
    uploadTeamLogo: store.uploadTeamLogo,
    uploadTeamBanner: store.uploadTeamBanner,
    uploadUserAvatar: store.uploadUserAvatar,
    uploadUserBanner: store.uploadUserBanner,
    getEntityFiles: store.getEntityFiles,
    deleteFile: store.deleteFile,
  };
};

export default useFileStore;
