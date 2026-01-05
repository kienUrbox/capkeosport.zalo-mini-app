import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens } from '@/types/api.types';
import { AuthService } from '@/services/api/services';

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshTokens: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
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

      // Actions
      login: (tokens: AuthTokens, user: User) => {
        set({
          tokens,
          user,
          isAuthenticated: true,
          error: null,
        });

        // Immediately save to localStorage for API interceptor
        // This ensures token is available right away without waiting for persist
        try {
          const currentState = {
            state: { tokens, user, isAuthenticated: true, error: null },
            version: 0,
          };
          localStorage.setItem('auth-storage', JSON.stringify(currentState));
          console.log('💾 Token saved to localStorage immediately');
        } catch (e) {
          console.error('Failed to save to localStorage:', e);
        }
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        });

        // Immediately remove from localStorage
        try {
          localStorage.removeItem('auth-storage');
          console.log('💾 Token removed from localStorage');
        } catch (e) {
          console.error('Failed to remove from localStorage:', e);
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      refreshTokens: async (): Promise<boolean> => {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
          return false;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await AuthService.refreshToken({
            refreshToken: tokens.refreshToken,
          });

          if (response.success && response.data) {
            // Response contains both user and tokens
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
          get().logout();
          set({ error: error.message || 'Session expired. Please login again.' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        const { tokens } = get();

        if (!tokens?.accessToken) {
          get().logout();
          return;
        }

        try {
          set({ isLoading: true, error: null });

          const response = await AuthService.getProfile();

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
              const response = await AuthService.getProfile();
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

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
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
  };
};

export const useUser = () => useAuthStore((state) => state.user);

export const useTokens = () => useAuthStore((state) => state.tokens);

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
  };
};

// Helper hooks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

export const useUserId = () => useAuthStore((state) => state.user?.id);

export const useUserName = () => useAuthStore((state) => state.user?.name);

export const useUserAvatar = () => useAuthStore((state) => state.user?.avatar);

export default useAuthStore;