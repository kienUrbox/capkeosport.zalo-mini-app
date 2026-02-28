// Zalo 3-Step Authentication Service (Client-side)
// Flow: getAccessToken() + getUserID() + getPhoneNumber() → Backend → JWT tokens

import zmp from "zmp-sdk";
import { useAuthStore, hasValidAuth } from "@/stores/auth.store";
import { api } from "./api";

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

class ZaloThreeStepAuthService {
  // Constructor
  constructor() {}

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

  private async sendToBackend(
    authData: ZaloThreeStepRequest,
  ): Promise<ZaloThreeStepResponse> {
    try {
      console.log("📤 Step 4: Sending all Zalo data to backend...");

      // Use the dedicated Zalo 3-step verification endpoint
      const requestBody = {
        userAccessToken: authData.userAccessToken,
        userId: authData.userId,
        phoneNumberToken: authData.phoneNumber, // This is the token from Zalo
        deviceFingerprint:
          authData.deviceInfo || this.generateDeviceFingerprint(),
        sessionId: authData.sessionId,
        timestamp: authData.timestamp,
      };

      console.log("📤 Request Body Summary:");
      console.log(
        "- userAccessToken:",
        authData.userAccessToken ? "PRESENT" : "MISSING",
      );
      console.log("- userId:", authData.userId);
      console.log(
        "- phoneNumberToken:",
        authData.phoneNumber
          ? "PRESENT (" + authData.phoneNumber.substring(0, 10) + "...)"
          : "MISSING",
      );
      console.log("- sessionId:", authData.sessionId);
      console.log("- timestamp:", authData.timestamp);

      const requestURL = "/auth/zalo-three-step-verify";

      console.log("🌐 API Request:", requestURL);

      let response;
      try {
        response = await api.post(requestURL, requestBody);

        console.log("📡 Response received:", {
          success: response.success,
          hasData: !!response.data,
        });

        // API wrapper already handles errors, so if we get here, the request was successful
        if (!response.success) {
          throw new Error(
            response.error?.message ||
              response.message ||
              "Authentication failed",
          );
        }
      } catch (error: unknown) {
        console.error("❌ Backend error response:", error);
        throw error;
      }

      const result = response.data;

      console.log("✅ Backend authentication successful:", {
        success: response.success, // Use outer success
        userId: result.user?.id,
        hasTokens: !!result.tokens,
        user: result.user,
      });

      // Transform the response to match our interface
      return {
        success: response.success || false, // Use outer success field
        user: result.user
          ? {
              id: result.user.id,
              zaloId: result.user.zaloId || result.user.id,
              name: result.user.name,
              phone: result.user.phone,
              avatar: result.user.avatar,
              verified: result.user.verified || true,
              verificationMethod: "zalo_three_step" as const,
            }
          : undefined,
        tokens: result.tokens
          ? {
              accessToken: result.tokens.accessToken,
              refreshToken: result.tokens.refreshToken,
            }
          : undefined,
        error: result.error,
        message: result.message,
      };
    } catch (error) {
      console.log(error);

      console.error("❌ Backend authentication failed:", error);
      throw error;
    }
  }

  private generateDeviceFingerprint(): string {
    const navigator = window.navigator;
    const screen = window.screen;

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now(),
    };

    return btoa(JSON.stringify(fingerprint)).substring(0, 64);
  }

  private generateSessionId(): string {
    if (typeof window !== "undefined" && window.crypto) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
    }
    return (
      Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    );
  }

  // Main 3-step authentication flow
  async authenticateWithThreeSteps(): Promise<ZaloThreeStepResponse> {
    try {
      console.log("🔐 Starting Zalo 3-Step authentication...");
      console.log("📱 ZMP SDK available:", typeof zmp !== "undefined");
      // Step 1: Get access token
      console.log("⬇️ Step 1: Getting access token...");
      const userAccessToken = await this.getZaloAccessToken();
      console.log("✅ Access token received:", !!userAccessToken);

      // Step 2: Get user ID
      console.log("⬇️ Step 2: Getting user ID...");
      const userId = await this.getZaloUserId();
      console.log("✅ User ID received:", !!userId);

      // Step 3: Get phone number
      console.log("⬇️ Step 3: Getting phone number...");
      const phoneNumber = await this.getZaloPhoneNumber();
      console.log("✅ Phone number received:", !!phoneNumber);

      console.log("📱 All Zalo data collected:", {
        hasAccessToken: !!userAccessToken,
        hasUserId: !!userId,
        hasPhoneNumber: !!phoneNumber,
      });

      // Step 4: Send all 3 pieces to backend
      // console.log("⬇️ Step 4: Sending to backend...");
      const authResult = await this.sendToBackend({
        userAccessToken,
        userId,
        phoneNumber,
        deviceInfo: this.generateDeviceFingerprint(),
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
      });

      // // Mock authentication for development
      // const authResult = this.mockAuthentication();
      // console.log("✅ Backend response received:", authResult.success);

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
          verificationMethod: (userData.verificationMethod === "THREE_STEP"
            ? "THREE_STEP"
            : "OAUTH") as "THREE_STEP" | "OAUTH" | "PHONE",
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
    return (
      metadata.authMethod === "zalo_three_step" && !!metadata.authTimestamp
    );
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
            "🔄 User has granted permission before, attempting 3-step auth...",
          );
          const result = await this.authenticateWithThreeSteps();
          return result;
        } else {
          console.log(
            "❓ No cached permission, user needs to grant permission first",
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
  // Returns true if we have valid auth (either existing or refreshed), false if need to re-login
  async checkAndRefreshToken(): Promise<boolean> {
    try {
      const authStore = useAuthStore.getState();
      const { tokens, metadata } = authStore;

      // Must have a refresh token to continue
      if (!tokens?.refreshToken) {
        console.log("⚠️ No refresh token found");
        return false;
      }

      if (!metadata.authTimestamp) {
        console.log("⚠️ No auth timestamp found");
        return false;
      }

      const tokenAge = Date.now() - metadata.authTimestamp;

      // Access token expires in 1 hour - refresh if older than 50 minutes
      const accessRefreshThreshold = 50 * 60 * 1000; // 50 minutes

      // Refresh token expires in 30 days - if older than this, user must re-login
      const refreshMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

      // If refresh token is too old, user needs to re-login
      if (tokenAge > refreshMaxAge) {
        console.log("⚠️ Refresh token is expired, user must re-login");
        this.logout();
        return false;
      }

      // If access token is getting old, attempt refresh
      if (tokenAge > accessRefreshThreshold) {
        console.log("🔄 Access token is approaching expiry, attempting refresh...");

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
          id: "298cdecd-17a3-4f22-b7df-96a0873e4fe0",
          zaloId: "603906499241891494",
          name: "Zalo User",
          phone: "+84338048340",
          avatar: "https://graph.zalo.me/v2.0/picture/603906499241891494",
          phoneVerified: true,
          verificationMethod: "THREE_STEP",
          status: "active",
        },
        tokens: {
          accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOThjZGVjZC0xN2EzLTRmMjItYjdkZi05NmEwODczZTRmZTAiLCJ6YWxvVXNlcklkIjoiNjAzOTA2NDk5MjQxODkxNDk0IiwibmFtZSI6IlphbG8gVXNlciIsInZlcmlmaWNhdGlvbk1ldGhvZCI6IlRIUkVFX1NURVAiLCJwaG9uZVZlcmlmaWVkIjp0cnVlLCJsYXN0VmVyaWZpY2F0aW9uQXQiOiIyMDI2LTAyLTE2VDEwOjMwOjAwLjAwMFoiLCJpYXQiOjE3NzE1ODQyODAsImV4cCI6MTgwMzEyMDI4MH0.sgolPl3MQGLnppw0tyBhb_Si0kjqQT8oTS1CXwF8M4k",
          refreshToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOThjZGVjZC0xN2EzLTRmMjItYjdkZi05NmEwODczZTRmZTAiLCJ0eXBlIjoicmVmcmVzaCIsInphbG9Vc2VySWQiOiI2MDM5MDY0OTkyNDE4OTE0OTQiLCJpYXQiOjE3NzE1ODQyODAsImV4cCI6MTgwMzEyMDI4MH0.NCED_O7H9HGHiF7Gy_jeffWlBCunU2qHK6uLhAgba1s",
        },
      },
    };

    console.log("✅ BYPASS: Mock authentication successful!");
    console.log("📱 User:", mockResponse.data.user);
    console.log(
      "🔑 Token:",
      mockResponse.data.tokens.accessToken.substring(0, 20) + "...",
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
