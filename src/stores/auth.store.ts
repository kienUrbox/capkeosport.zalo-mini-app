import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  AuthTokens,
  ZaloLoginDto,
  ZaloThreeStepDto,
  RefreshTokenDto,
  UpdateProfileDto,
} from '@/types/api.types';
import { api } from '@/services/api/index';

// Auth metadata for tracking authentication state
export interface AuthMetadata {
  authTimestamp?: number; // When auth occurred
  authMethod?: 'zalo_oauth' | 'zalo_three_step' | 'phone' | null; // How user authenticated
  silentAuthInProgress?: boolean; // Prevent concurrent silent auth attempts
}

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth metadata (persisted)
  metadata: AuthMetadata;

  // Actions - State management
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setMetadata: (metadata: Partial<AuthMetadata>) => void;

  // Actions - API methods
  zaloLogin: (data: ZaloLoginDto) => Promise<void>;
  zaloThreeStepVerify: (data: ZaloThreeStepDto) => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  getProfile: () => Promise<User>;
  updateProfile: (data: UpdateProfileDto) => Promise<User>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      metadata: {},

      // ========== State Management Actions ==========

      login: (tokens: AuthTokens, user: User) => {
        set({
          tokens,
          user,
          isAuthenticated: true,
          error: null,
          metadata: {
            ...get().metadata,
            authTimestamp: Date.now(),
          },
        });
      },

      logout: async () => {
        // Call API logout first if we have a token
        const { tokens } = get();
        if (tokens?.accessToken) {
          try {
            await api.post('/auth/logout');
          } catch (error) {
            console.error('Logout API call failed:', error);
            // Continue with local logout even if API call fails
          }
        }

        // Clear state
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
          metadata: {},
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string) => set({ error }),

      setMetadata: (metadata: Partial<AuthMetadata>) =>
        set((state) => ({
          metadata: { ...state.metadata, ...metadata },
        })),

      // ========== API Methods ==========

      /**
       * Login with Zalo OAuth
       * POST /auth/zalo-login
       */
      zaloLogin: async (data: ZaloLoginDto) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.post('/auth/zalo-login', data);

          if (response.success && response.data) {
            const { user, tokens } = response.data;

            set({
              user,
              tokens,
              isAuthenticated: true,
              error: null,
              metadata: {
                authMethod: 'zalo_oauth',
                authTimestamp: Date.now(),
              },
            });
          } else {
            throw new Error(response.error?.message || 'Login failed');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Đăng nhập thất bại';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Enhanced Zalo 3-step verification
       * POST /auth/zalo-three-step-verify
       */
      zaloThreeStepVerify: async (data: ZaloThreeStepDto) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.post('/auth/zalo-three-step-verify', data);

          if (response.success && response.data) {
            const { user, tokens } = response.data;

            set({
              user,
              tokens,
              isAuthenticated: true,
              error: null,
              metadata: {
                authMethod: 'zalo_three_step',
                authTimestamp: Date.now(),
                silentAuthInProgress: false,
              },
            });
          } else {
            throw new Error(response.error?.message || 'Verification failed');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Xác thực thất bại';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Refresh access token using refresh token
       * POST /auth/refresh
       */
      refreshTokens: async (): Promise<boolean> => {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
          return false;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await api.post('/auth/refresh', {
            refreshToken: tokens.refreshToken,
          });

          if (response.success && response.data) {
            const { user, tokens: newTokens } = response.data;

            set({
              user,
              tokens: newTokens,
              error: null,
            });

            return true;
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error: any) {
          console.error('Token refresh error:', error);
          // Clear auth on refresh failure
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            metadata: {},
          });
          set({ error: error.message || 'Session expired. Please login again.' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Check authentication status and fetch profile
       * GET /auth/profile
       */
      checkAuth: async () => {
        const { tokens } = get();

        if (!tokens?.accessToken) {
          get().logout();
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await api.get('/auth/profile');

          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              error: null,
            });
          } else {
            throw new Error('Invalid user session');
          }
        } catch (error: any) {
          console.error('Auth check error:', error);

          // Try to refresh tokens first
          const refreshed = await get().refreshTokens();
          if (refreshed) {
            // If refresh succeeded, try again
            try {
              const response = await api.get('/auth/profile');
              if (response.success && response.data) {
                set({
                  user: response.data,
                  isAuthenticated: true,
                  error: null,
                });
              }
            } catch (retryError) {
              console.error('Retry auth check failed:', retryError);
              get().logout();
            }
          } else {
            get().logout();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get current user profile
       * GET /auth/profile
       */
      getProfile: async (): Promise<User> => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get('/auth/profile');

          if (response.success && response.data) {
            set({ user: response.data, error: null });
            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to fetch profile');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể tải thông tin';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update user profile
       * PUT /auth/profile
       */
      updateProfile: async (data: UpdateProfileDto): Promise<User> => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.put('/auth/profile', data);

          if (response.success && response.data) {
            set({ user: response.data, error: null });
            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to update profile');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể cập nhật thông tin';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        metadata: state.metadata,
      }),
    }
  )
);

// Selectors for commonly used state combinations
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    metadata: store.metadata,
  };
};

export const useUser = () => useAuthStore((state) => state.user);

export const useTokens = () => useAuthStore((state) => state.tokens);

export const useAuthMetadata = () => useAuthStore((state) => state.metadata);

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,
    refreshTokens: store.refreshTokens,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    setMetadata: store.setMetadata,
    // API methods
    zaloLogin: store.zaloLogin,
    zaloThreeStepVerify: store.zaloThreeStepVerify,
    getProfile: store.getProfile,
    updateProfile: store.updateProfile,
  };
};

// Helper hooks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

export const useUserId = () => useAuthStore((state) => state.user?.id);

export const useUserName = () => useAuthStore((state) => state.user?.name);

export const useUserAvatar = () => useAuthStore((state) => state.user?.avatar);

export const useAuthMethod = () => useAuthStore((state) => state.metadata?.authMethod);

export const useAuthTimestamp = () => useAuthStore((state) => state.metadata?.authTimestamp);

/**
 * Get access token directly from store
 * Useful for API interceptors
 */
export const useAccessToken = (): string | null => {
  return useAuthStore((state) => state.tokens?.accessToken || null);
};

/**
 * Get refresh token directly from store
 */
export const useRefreshToken = (): string | null => {
  return useAuthStore((state) => state.tokens?.refreshToken || null);
};

/**
 * Check if silent auth is in progress
 */
export const useSilentAuthInProgress = (): boolean => {
  return useAuthStore((state) => state.metadata?.silentAuthInProgress || false);
};

/**
 * Helper to get tokens from store (non-reactive)
 * Use this in API client where you don't want reactivity
 */
export const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  const state = useAuthStore.getState();
  return {
    accessToken: state.tokens?.accessToken || null,
    refreshToken: state.tokens?.refreshToken || null,
  };
};

/**
 * Helper to update tokens in store (non-reactive)
 * Use this in API client for token refresh
 */
export const updateTokens = (tokens: AuthTokens, user?: User): void => {
  const state = useAuthStore.getState();
  if (user) {
    state.updateUser(user);
  }
  useAuthStore.setState({ tokens });
};

/**
 * Check if user is authenticated based on token presence and metadata
 */
export const hasValidAuth = (): boolean => {
  const state = useAuthStore.getState();
  const { tokens, metadata } = state;

  if (!tokens?.accessToken) {
    return false;
  }

  // Check if token is expired (1 hour for access tokens)
  if (metadata.authTimestamp) {
    const tokenAge = Date.now() - metadata.authTimestamp;
    const maxAge = 60 * 60 * 1000; // 1 hour
    if (tokenAge > maxAge) {
      return false;
    }
  }

  return true;
};

export default useAuthStore;