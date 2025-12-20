import { useCallback } from 'react';
import { ZaloLoginDto, ZaloThreeStepDto, RefreshTokenDto, UpdateProfileDto } from '../types/api.types';
import { AuthService } from '../services/api/services';
import {
  useAuthStore,
  useAuth,
  useUser,
  useAuthActions,
  useIsAuthenticated
} from '../stores';

// Main auth hook that provides both state and actions
export const useAuth = () => {
  const authState = useAuth();
  const authActions = useAuthActions();

  return {
    ...authState,
    ...authActions,
  };
};

// User authentication hook
export const useUserAuth = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { login, logout, refreshTokens } = useAuthActions();

  // Zalo login
  const handleZaloLogin = useCallback(async (data: ZaloLoginDto) => {
    try {
      const response = await AuthService.zaloLogin(data);

      if (response.success && response.data) {
        login(response.data.tokens, response.data.user);
        return { success: true, data: response.data };
      }

      return { success: false, error: response.error?.message || 'Login failed' };
    } catch (error: any) {
      console.error('Zalo login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }, [login]);

  // Zalo 3-step verification
  const handleZaloThreeStepVerify = useCallback(async (data: ZaloThreeStepDto) => {
    try {
      const response = await AuthService.zaloThreeStepVerify(data);

      if (response.success && response.data) {
        login(response.data.tokens, response.data.user);
        return { success: true, data: response.data };
      }

      return { success: false, error: response.error?.message || 'Verification failed' };
    } catch (error: any) {
      console.error('Zalo 3-step verification error:', error);
      return { success: false, error: error.message || 'Verification failed' };
    }
  }, [login]);

  // Refresh token
  const handleRefreshToken = useCallback(async () => {
    const success = await refreshTokens();
    return success;
  }, [refreshTokens]);

  // Logout
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    user,
    isAuthenticated,
    zaloLogin: handleZaloLogin,
    zaloThreeStepVerify: handleZaloThreeStepVerify,
    refreshToken: handleRefreshToken,
    logout: handleLogout,
  };
};

// User profile management hook
export const useUserProfile = () => {
  const user = useUser();
  const { updateUser } = useAuthActions();

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileDto) => {
    try {
      const response = await AuthService.updateProfile(data);

      if (response.success && response.data) {
        updateUser(response.data);
        return { success: true, data: response.data };
      }

      return { success: false, error: response.error?.message || 'Profile update failed' };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message || 'Profile update failed' };
    }
  }, [updateUser]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    try {
      const response = await AuthService.getProfile();

      if (response.success && response.data) {
        updateUser(response.data);
        return { success: true, data: response.data };
      }

      return { success: false, error: response.error?.message || 'Failed to refresh profile' };
    } catch (error: any) {
      console.error('Refresh profile error:', error);
      return { success: false, error: error.message || 'Failed to refresh profile' };
    }
  }, [updateUser]);

  return {
    user,
    updateProfile,
    refreshProfile,
  };
};

// Authentication status hook
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkAuth } = useAuthActions();

  // Initialize auth on mount
  const initializeAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    initializeAuth,
  };
};

// Protected route hook
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    requiresAuth: !isAuthenticated && !isLoading,
  };
};

// User permissions hook (extend as needed)
export const useUserPermissions = () => {
  const user = useUser();

  // Check if user can create teams
  const canCreateTeam = useCallback(() => {
    // Implement your business logic here
    return true; // For now, all authenticated users can create teams
  }, []);

  // Check if user is team captain
  const isTeamCaptain = useCallback((teamId: string) => {
    // This would need to be implemented based on your team member data
    return false; // Placeholder
  }, []);

  // Check if user can manage team
  const canManageTeam = useCallback((teamId: string) => {
    // Implement your business logic here
    return isTeamCaptain(teamId);
  }, [isTeamCaptain]);

  return {
    canCreateTeam,
    isTeamCaptain,
    canManageTeam,
    isAdmin: user?.id ? false : true, // Example: implement admin check
  };
};

// Auto logout hook
export const useAutoLogout = () => {
  const { logout } = useAuthActions();

  // Setup auto logout on token expiry
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = AuthService.getAccessToken();
      if (token) {
        try {
          // Simple JWT decode (in production, use a proper JWT library)
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiryTime = payload.exp * 1000;
          const currentTime = Date.now();

          if (expiryTime <= currentTime) {
            logout();
          }
        } catch (error) {
          console.error('Token decode error:', error);
          logout();
        }
      }
    };

    // Check immediately and then every minute
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [logout]);
};

// Session management hook
export const useSessionManagement = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkAuth, logout } = useAuthActions();

  // Handle session timeout
  const handleSessionTimeout = useCallback(() => {
    logout();
  }, [logout]);

  // Extend session
  const extendSession = useCallback(async () => {
    const success = await AuthService.autoRefreshToken();
    if (!success) {
      handleSessionTimeout();
    }
    return success;
  }, [handleSessionTimeout]);

  // Setup session monitoring
  useEffect(() => {
    if (isAuthenticated) {
      // Setup activity monitoring
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      let timeoutId: NodeJS.Timeout;

      const resetTimeout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log('Session timeout - no activity for 30 minutes');
          handleSessionTimeout();
        }, 30 * 60 * 1000); // 30 minutes
      };

      const handleActivity = () => {
        resetTimeout();
      };

      // Setup event listeners
      activityEvents.forEach(event => {
        window.addEventListener(event, handleActivity);
      });

      // Initial timeout setup
      resetTimeout();

      // Cleanup
      return () => {
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
        clearTimeout(timeoutId);
      };
    }
  }, [isAuthenticated, handleSessionTimeout]);

  return {
    isAuthenticated,
    isLoading,
    extendSession,
    handleSessionTimeout,
  };
};

export default useAuth;