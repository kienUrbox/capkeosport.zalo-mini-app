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

export class AuthService {
  /**
   * Login with Zalo OAuth
   */
  static async zaloLogin(
    data: ZaloLoginDto
  ): Promise<ApiResponse<LoginResponse>> {
    return api.post<LoginResponse>("/auth/zalo-login", data);
  }

  /**
   * Enhanced Zalo 3-step verification
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
   */
  static async logout(): Promise<ApiResponse<void>> {
    return api.post<void>("/auth/logout");
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>("/auth/profile");
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    data: UpdateProfileDto
  ): Promise<ApiResponse<User>> {
    return api.put<User>("/auth/profile", data);
  }

  /**
   * Health check for Zalo 3-step verification
   */
  static async healthCheck(): Promise<ApiResponse<any>> {
    return api.get<any>("/auth/zalo-three-step");
  }

  // Local storage helpers
  static saveTokens(tokens: AuthTokens): void {
    localStorage.setItem("access_token", tokens.accessToken);
    localStorage.setItem("refresh_token", tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  static clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  static saveUser(user: User): void {
    localStorage.setItem("user_data", JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  static clearUser(): void {
    localStorage.removeItem("user_data");
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Auto refresh token before expiry
   * Returns: { success: true, data: { user, tokens } }
   */
  static async autoRefreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await this.refreshToken({ refreshToken });
      if (response.success && response.data) {
        // Response contains both user and tokens
        const { user, tokens } = response.data;
        this.saveTokens(tokens);
        this.saveUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auto refresh token failed:", error);
      this.clearTokens();
      this.clearUser();
      return false;
    }
  }
}

export default AuthService;
