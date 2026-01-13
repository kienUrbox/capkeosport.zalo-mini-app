import { api } from './index';
import {
  User,
  AuthTokens,
  LoginResponse,
  ZaloLoginDto,
  ZaloThreeStepDto,
  RefreshTokenDto,
  RefreshTokenResponse,
  UpdateProfileDto,
  ApiResponse,
} from '@/types/api.types';

/**
 * Auth Service
 *
 * NOTE: This service now only provides API methods.
 * All state management and token handling should be done through auth.store.ts
 *
 * For localStorage helpers (saveTokens, getAccessToken, etc.), use:
 * - useAuthStore() hooks for reactive access
 * - getTokens(), updateTokens() helpers for non-reactive access
 */
export class AuthService {
  /**
   * Login with Zalo OAuth
   * POST /auth/zalo-login
   */
  static async zaloLogin(
    data: ZaloLoginDto
  ): Promise<ApiResponse<LoginResponse>> {
    return api.post<LoginResponse>("/auth/zalo-login", data);
  }

  /**
   * Enhanced Zalo 3-step verification
   * POST /auth/zalo-three-step-verify
   */
  static async zaloThreeStepVerify(
    data: ZaloThreeStepDto
  ): Promise<ApiResponse<LoginResponse>> {
    return api.post<LoginResponse>("/auth/zalo-three-step-verify", data);
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   * Returns: { success: true, data: { user, tokens } }
   */
  static async refreshToken(
    data: RefreshTokenDto
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    return api.post<RefreshTokenResponse>("/auth/refresh", data);
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  static async logout(): Promise<ApiResponse<void>> {
    return api.post<void>("/auth/logout");
  }

  /**
   * Get current user profile
   * GET /auth/profile
   */
  static async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>("/auth/profile");
  }

  /**
   * Update user profile
   * PUT /auth/profile
   */
  static async updateProfile(
    data: UpdateProfileDto
  ): Promise<ApiResponse<User>> {
    return api.put<User>("/auth/profile", data);
  }

  /**
   * Health check for Zalo 3-step verification
   * GET /auth/zalo-three-step
   */
  static async healthCheck(): Promise<ApiResponse<any>> {
    return api.get<any>("/auth/zalo-three-step");
  }

  // ========== DEPRECATED: Use auth.store.ts instead ==========

  /**
   * @deprecated Use useAuthStore or getTokens() from auth.store.ts instead
   */
  static saveTokens(tokens: AuthTokens): void {
    console.warn('AuthService.saveTokens is deprecated. Use auth.store.ts instead.');
  }

  /**
   * @deprecated Use useAuthStore or getTokens() from auth.store.ts instead
   */
  static getAccessToken(): string | null {
    console.warn('AuthService.getAccessToken is deprecated. Use auth.store.ts instead.');
    // Fallback to zustand storage for compatibility
    try {
      const zustandStorage = localStorage.getItem('auth-storage');
      if (zustandStorage) {
        const parsed = JSON.parse(zustandStorage);
        return parsed?.state?.tokens?.accessToken || null;
      }
    } catch (e) {
      console.warn('Failed to read token from zustand storage:', e);
    }
    return null;
  }

  /**
   * @deprecated Use useAuthStore or getTokens() from auth.store.ts instead
   */
  static getRefreshToken(): string | null {
    console.warn('AuthService.getRefreshToken is deprecated. Use auth.store.ts instead.');
    // Fallback to zustand storage for compatibility
    try {
      const zustandStorage = localStorage.getItem('auth-storage');
      if (zustandStorage) {
        const parsed = JSON.parse(zustandStorage);
        return parsed?.state?.tokens?.refreshToken || null;
      }
    } catch (e) {
      console.warn('Failed to read refresh token from zustand storage:', e);
    }
    return null;
  }

  /**
   * @deprecated Use auth.store.ts logout action instead
   */
  static clearTokens(): void {
    console.warn('AuthService.clearTokens is deprecated. Use auth.store.ts instead.');
  }

  /**
   * @deprecated Use useUser() from auth.store.ts instead
   */
  static saveUser(user: User): void {
    console.warn('AuthService.saveUser is deprecated. Use auth.store.ts instead.');
  }

  /**
   * @deprecated Use useUser() from auth.store.ts instead
   */
  static getUser(): User | null {
    console.warn('AuthService.getUser is deprecated. Use auth.store.ts instead.');
    // Fallback to zustand storage for compatibility
    try {
      const zustandStorage = localStorage.getItem('auth-storage');
      if (zustandStorage) {
        const parsed = JSON.parse(zustandStorage);
        return parsed?.state?.user || null;
      }
    } catch (e) {
      console.warn('Failed to read user from zustand storage:', e);
    }
    return null;
  }

  /**
   * @deprecated Use auth.store.ts instead
   */
  static clearUser(): void {
    console.warn('AuthService.clearUser is deprecated. Use auth.store.ts instead.');
  }

  /**
   * @deprecated Use useIsAuthenticated() or hasValidAuth() from auth.store.ts instead
   */
  static isAuthenticated(): boolean {
    console.warn('AuthService.isAuthenticated is deprecated. Use auth.store.ts instead.');
    // Fallback to zustand storage for compatibility
    try {
      const zustandStorage = localStorage.getItem('auth-storage');
      if (zustandStorage) {
        const parsed = JSON.parse(zustandStorage);
        return !!parsed?.state?.tokens?.accessToken;
      }
    } catch (e) {
      console.warn('Failed to check auth from zustand storage:', e);
    }
    return false;
  }

  /**
   * @deprecated Use auth.store.ts refreshTokens action instead
   */
  static async autoRefreshToken(): Promise<boolean> {
    console.warn('AuthService.autoRefreshToken is deprecated. Use auth.store.ts instead.');
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await this.refreshToken({ refreshToken });
      return response.success;
    } catch (error) {
      console.error("Auto refresh token failed:", error);
      return false;
    }
  }
}

export default AuthService;
