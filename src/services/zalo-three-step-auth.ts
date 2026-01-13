// Zalo 3-Step Authentication Service (Client-side)
// Flow: getAccessToken() + getUserID() + getPhoneNumber() → Backend → JWT tokens

import zmp from "zmp-sdk";
import { useAuthStore, hasValidAuth } from "@/stores/auth.store";

// Suppress TypeScript errors for Zalo SDK callback parameters
declare global {
  interface Window {
    zmp: any;
  }
}

export interface ZaloThreeStepRequest {
  userAccessToken: string; // From zmp.getAccessToken()
  userId: string; // From zmp.getUserID()
  phoneNumber: string; // From zmp.getPhoneNumber()
  deviceInfo?: string; // Device fingerprint
  sessionId: string; // Unique session identifier
  timestamp: number; // Client timestamp
}

export interface ZaloThreeStepResponse {
  success: boolean;
  data?: {
    user?: {
      id: string;
      zaloId: string;
      name: string;
      phone: string;
      avatar?: string | null;
      verificationMethod: "THREE_STEP" | "OAUTH" | "PHONE";
    };
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
    tokenInfo?: {
      accessTokenExpiresAt: string;
      refreshTokenExpiresAt: string;
      expiresInDays: number;
    };
    isNewUser?: boolean;
  };
  // Legacy support for old API structure
  user?: {
    id: string;
    zaloId: string;
    name: string;
    phone: string;
    avatar?: string;
    verified: boolean;
    verificationMethod: "zalo_three_step";
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
  message?: string;
}

// DEV MODE: Set to true to bypass Zalo authentication
const BYPASS_ZALO_AUTH = true;

class ZaloThreeStepAuthService {
  // Constructor
  constructor() {
    console.log("🔐 Zalo 3-Step Authentication Service initialized");
    if (BYPASS_ZALO_AUTH) {
      console.log("⚠️ DEV MODE: Zalo authentication BYPASSED");
    }
  }

  // Step 1: Get Zalo access token
  private async getZaloAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === "undefined" || !zmp.getAccessToken) {
        console.warn("⚠️ Zalo getAccessToken not available");
        reject(new Error("Zalo access token not available"));
        return;
      }

      console.log("📱 Step 1: Getting Zalo access token...");

      zmp.getAccessToken({
        success: (res: any) => {
          console.log("✅ Zalo access token received:", {
            hasAccessToken: !!res,
            tokenLength: res?.length || 0,
          });

          // Handle different response formats
          const token = res?.access_token || res?.accessToken || res;
          if (token) {
            resolve(token);
          } else {
            reject(new Error("No access token in response"));
          }
        },
        fail: (err: any) => {
          console.error("❌ Failed to get Zalo access token:", err);
          reject(new Error("Failed to get Zalo access token"));
        },
      });
    });
  }

  // Step 2: Get Zalo user ID
  private async getZaloUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === "undefined" || !zmp.getUserID) {
        console.warn("⚠️ Zalo getUserID not available");
        reject(new Error("Zalo user ID not available"));
        return;
      }

      console.log("👤 Step 2: Getting Zalo user ID...");

      zmp.getUserID({
        success: (res: any) => {
          console.log("✅ Zalo user ID received:", {
            hasUserId: !!res,
            userId: res,
          });

          // Handle different response formats
          const userId = res?.userID || res?.userId || res;
          if (userId) {
            resolve(userId.toString());
          } else {
            reject(new Error("No user ID in response"));
          }
        },
        fail: (err: any) => {
          console.error("❌ Failed to get Zalo user ID:", err);
          reject(new Error("Failed to get Zalo user ID"));
        },
      });
    });
  }

  // Step 3: Get Zalo phone number
  private async getZaloPhoneNumber(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === "undefined" || !zmp.getPhoneNumber) {
        console.warn("⚠️ Zalo getPhoneNumber not available");
        reject(new Error("Zalo phone number not available"));
        return;
      }

      console.log("📱 Step 3: Getting Zalo phone number...");

      zmp.getPhoneNumber({
        success: (res: any) => {
          console.log("✅ Zalo phone number received:", {
            hasNumber: !!res?.number,
            hasCode: !!res?.code,
            hasToken: !!res?.token,
            response: res,
          });
          if (res?.token) {
            // If we have a code token, use that for backend verification
            resolve(res.token);
          } else {
            reject(new Error("No phone number, token, or code in response"));
          }
        },
        fail: (err: any) => {
          console.error("❌ Failed to get Zalo phone number:", err);
          reject(new Error("User denied phone number access"));
        },
      });
    });
  }

  // Main 3-step authentication flow
  async authenticateWithThreeSteps(): Promise<ZaloThreeStepResponse> {
    try {
      console.log("🔐 Starting Zalo 3-Step authentication...");
      console.log("📱 ZMP SDK available:", typeof zmp !== "undefined");

      // Mock authentication for development
      const authResult = this.mockAuthentication();
      console.log("✅ Backend response received:", authResult.success);

      // Step 5: Store tokens if successful
      // Note: New API structure has nested data wrapper
      const userData = authResult.data?.user || authResult.user;
      const tokensData = authResult.data?.tokens || authResult.tokens;

      if (authResult.success && tokensData && userData) {
        console.log("🔐 Storing authentication data:", {
          hasTokens: !!tokensData,
          hasUser: !!userData,
          verificationMethod: userData.verificationMethod,
        });

        // Create AuthTokens object with expected format
        const tokens = {
          accessToken: tokensData.accessToken,
          refreshToken: tokensData.refreshToken,
          expiresIn: "3600", // 1 hour in seconds
        };

        // Transform user data to match expected format
        const user = {
          id: userData.id,
          zaloUserId: userData.zaloId || userData.id,
          name: userData.name,
          phone: userData.phone,
          avatar: userData.avatar || undefined,
          verificationMethod: (userData.verificationMethod === 'THREE_STEP' ? 'THREE_STEP' : 'OAUTH') as 'THREE_STEP' | 'OAUTH' | 'PHONE',
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        // Use authStore to store tokens and user (single source of truth)
        // Auth metadata (authTimestamp, authMethod) is now managed by auth.store.ts
        const authStore = useAuthStore.getState();
        authStore.login(tokens, user);

        // Silent auth in progress is now managed by auth store
        authStore.setMetadata({ silentAuthInProgress: false });

        console.log("✅ Authentication data stored successfully!");
      }

      return authResult;
    } catch (error) {
      console.error("❌ 3-Step authentication failed:", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
        message: "Không thể xác thực tài khoản Zalo. Vui lòng thử lại.",
      };
    }
  }

  // Check if user has granted phone permission previously
  hasPhonePermission(): boolean {
    const authStore = useAuthStore.getState();
    const { metadata } = authStore;

    // User has granted permission if they used zalo_three_step before
    return metadata.authMethod === "zalo_three_step" && !!metadata.authTimestamp;
  }

  // Attempt silent authentication without UI interaction
  async attemptSilentAuth(): Promise<ZaloThreeStepResponse> {
    try {
      console.log("🔐 Attempting silent authentication...");

      const authStore = useAuthStore.getState();
      const { metadata } = authStore;

      // Prevent multiple simultaneous auth attempts
      if (metadata.silentAuthInProgress) {
        console.log("⏳ Silent authentication already in progress...");
        return {
          success: false,
          error: "Authentication in progress",
          message: "Đang xác thực, vui lòng đợi...",
        };
      }

      // Set flag to prevent multiple attempts
      authStore.setMetadata({ silentAuthInProgress: true });

      try {
        // Check if user is already authenticated with valid auth
        if (hasValidAuth() && metadata.authMethod === "zalo_three_step") {
          console.log("✅ Using valid authentication from store");
          const user = authStore.user;
          if (user) {
            return {
              success: true,
              user: {
                id: user.id,
                zaloId: user.zaloUserId || user.id,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
                verified: true,
                verificationMethod: "zalo_three_step",
              },
            };
          }
        }

        // Check if we need to refresh token
        const tokenValid = await this.checkAndRefreshToken();
        if (!tokenValid) {
          console.log("⚠️ Token validation failed, need full authentication");
          return {
            success: false,
            error: "Token expired",
            message: "Phiên đăng nhập đã hết hạn",
          };
        }

        // If we have valid tokens after refresh, user is authenticated
        if (hasValidAuth()) {
          console.log("✅ Silent authentication successful");

          const user = authStore.user;
          if (user) {
            return {
              success: true,
              user: {
                id: user.id,
                zaloId: user.zaloUserId || user.id,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
                verified: true,
                verificationMethod: "zalo_three_step",
              },
            };
          }
        }

        // Only attempt full 3-step authentication if user has previously granted permission
        if (this.hasPhonePermission()) {
          console.log(
            "🔄 User has granted permission before, attempting 3-step auth..."
          );
          const result = await this.authenticateWithThreeSteps();
          return result;
        } else {
          console.log(
            "❓ No cached permission, user needs to grant permission first"
          );
          return {
            success: false,
            error: "Permission not granted",
            message: "Vui lòng cấp quyền truy cập số điện thoại",
          };
        }
      } finally {
        // Clear the in-progress flag
        authStore.setMetadata({ silentAuthInProgress: false });
      }
    } catch (error) {
      console.error("❌ Silent authentication failed:", error);
      const authStore = useAuthStore.getState();
      authStore.setMetadata({ silentAuthInProgress: false });
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Silent authentication failed",
        message: "Không thể xác thực tự động",
      };
    }
  }

  // Check and refresh token if needed
  async checkAndRefreshToken(): Promise<boolean> {
    try {
      const authStore = useAuthStore.getState();
      const { metadata } = authStore;

      if (!metadata.authTimestamp) {
        console.log("⚠️ No auth timestamp found");
        return false;
      }

      const tokenAge = Date.now() - metadata.authTimestamp;
      const refreshThreshold = 55 * 60 * 1000; // 55 minutes
      const maxAge = 60 * 60 * 1000; // 60 minutes

      // If token is too old, it's invalid
      if (tokenAge > maxAge) {
        console.log("⚠️ Token is expired, clearing auth");
        this.logout();
        return false;
      }

      // If token is getting old, attempt refresh
      if (tokenAge > refreshThreshold) {
        console.log("🔄 Token is approaching expiry, attempting refresh...");

        try {
          // Use auth store refreshTokens method
          const refreshed = await authStore.refreshTokens();
          if (refreshed) {
            console.log("✅ Token refresh successful");
            return true;
          } else {
            console.log("⚠️ Token refresh failed");
            this.logout();
            return false;
          }
        } catch (refreshError) {
          console.error("❌ Token refresh error:", refreshError);
          this.logout();
          return false;
        }
      }

      // Token is still valid
      return true;
    } catch (error) {
      console.error("❌ Error checking token:", error);
      return false;
    }
  }

  // Mock authentication for development/testing
  private mockAuthentication(): ZaloThreeStepResponse {
    console.log("🔓 BYPASS: Mock authentication started...");

    // Mock data from API response - using real token structure with fresh tokens (100 days expiry)
    const mockResponse = {
      success: true,
      data: {
        user: {
          id: "181db26b-04d2-467b-a955-7d250ed0b25f",
          zaloId: "5614378971101698093",
          name: "Zalo User",
          phone: "84972809802",
          avatar: null,
          verificationMethod: "THREE_STEP" as const,
        },
        tokens: {
          accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODFkYjI2Yi0wNGQyLTQ2N2ItYTk1NS03ZDI1MGVkMGIyNWYiLCJ6YWxvVXNlcklkIjoiNTYxNDM3ODk3MTEwMTY5ODA5MyIsIm5hbWUiOiJaYWxvIFVzZXIiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJUSFJFRV9TVEVQIiwicGhvbmVWZXJpZmllZCI6dHJ1ZSwibGFzdFZlcmlmaWNhdGlvbkF0IjoiMjAyNi0wMS0wMlQxNjo0OTozNC41MjdaIiwiaWF0IjoxNzY3MzcyNTc0LCJleHAiOjE3NzYwMTI1NzR9.-Ut-6wfnv7XHGdyoowewq4mQVl158Jc13l1BuSTFA04",
          refreshToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODFkYjI2Yi0wNGQyLTQ2N2ItYTk1NS03ZDI1MGVkMGIyNWYiLCJ0eXBlIjoicmVmcmVzaCIsInphbG9Vc2VySWQiOiI1NjE0Mzc4OTcxMTAxNjk4MDkzIiwiaWF0IjoxNzY3MTA3MzY5LCJleHAiOjE3Njc3MTIxNjl9.HhcgFtjYEWb709dlFLzCp2n7OhOKBj8FvWl8d5bmANA",
        },
        tokenInfo: {
          accessTokenExpiresAt: "2026-04-12T16:49:34.000Z",
          refreshTokenExpiresAt: "2026-04-12T16:49:34.000Z",
          expiresInDays: 100,
        },
        isNewUser: false,
      },
    };

    console.log("✅ BYPASS: Mock authentication successful!");
    console.log("📱 User:", mockResponse.data.user);
    console.log(
      "🔑 Token:",
      mockResponse.data.tokens.accessToken.substring(0, 20) + "..."
    );
    console.log(
      "⏰ Token expires in:",
      mockResponse.data.tokenInfo.expiresInDays,
      "days"
    );

    return mockResponse;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const authStore = useAuthStore.getState();
    const { metadata, tokens } = authStore;

    if (!tokens?.accessToken || metadata.authMethod !== "zalo_three_step") {
      return false;
    }

    // Check token age using hasValidAuth helper
    return hasValidAuth();
  }

  // Get user info
  getUserInfo(): any {
    const authStore = useAuthStore.getState();
    const { user, metadata } = authStore;

    if (!user || metadata.authMethod !== "zalo_three_step") {
      return null;
    }

    return {
      ...user,
      authMethod: "zalo_three_step",
      lastAuth: metadata.authTimestamp,
    };
  }

  // Logout
  logout(): void {
    // Use auth store logout action
    const authStore = useAuthStore.getState();
    authStore.logout();
  }

  // Get current access token
  getAccessToken(): string | null {
    const authStore = useAuthStore.getState();
    return authStore.tokens?.accessToken || null;
  }
}

// Export service instance
export const zaloThreeStepAuthService = new ZaloThreeStepAuthService();
