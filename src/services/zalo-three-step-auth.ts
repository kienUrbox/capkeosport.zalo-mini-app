// Zalo 3-Step Authentication Service (Client-side)
// Flow: getAccessToken() + getUserID() + getPhoneNumber() → Backend → JWT tokens

import zmp from "zmp-sdk";
import { api } from "./api";
import { AuthService } from "./api/services";

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

  // Send all 3 pieces to backend
  private async sendToBackend(
    authData: ZaloThreeStepRequest
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
        authData.userAccessToken ? "PRESENT" : "MISSING"
      );
      console.log("- userId:", authData.userId);
      console.log(
        "- phoneNumberToken:",
        authData.phoneNumber
          ? "PRESENT (" + authData.phoneNumber.substring(0, 10) + "...)"
          : "MISSING"
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
            response.error?.message || response.message || "Authentication failed"
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

  // Main 3-step authentication flow
  async authenticateWithThreeSteps(): Promise<ZaloThreeStepResponse> {
    try {
      // DEV MODE: Bypass Zalo authentication
      if (BYPASS_ZALO_AUTH) {
        console.log("⚠️ BYPASS MODE: Using mock authentication data...");
        return this.mockAuthentication();
      }

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
      console.log("⬇️ Step 4: Sending to backend...");
      const authResult = await this.sendToBackend({
        userAccessToken,
        userId,
        phoneNumber,
        deviceInfo: this.generateDeviceFingerprint(),
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
      });
      console.log("✅ Backend response received:", authResult.success);

      // Step 5: Store tokens if successful
      if (authResult.success && authResult.tokens && authResult.user) {
        console.log("🔐 Storing authentication data:", {
          hasTokens: !!authResult.tokens,
          hasUser: !!authResult.user,
          verificationMethod: authResult.user.verificationMethod
        });

        // Create AuthTokens object with expected format
        const tokens = {
          accessToken: authResult.tokens.accessToken,
          refreshToken: authResult.tokens.refreshToken,
          expiresIn: "3600", // 1 hour in seconds
        };

        // Use AuthService to store tokens
        AuthService.saveTokens(tokens);

        // Transform user data to match expected format
        const userData = {
          id: authResult.user.id,
          zaloUserId: authResult.user.zaloId || authResult.user.id,
          name: authResult.user.name,
          phone: authResult.user.phone,
          avatar: authResult.user.avatar,
          verificationMethod: "THREE_STEP" as const, // API returns "THREE_STEP"
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        console.log("💾 Storing user data:", userData);
        AuthService.saveUser(userData);

        // Keep additional tracking data
        localStorage.setItem("auth_timestamp", Date.now().toString());
        localStorage.setItem("auth_method", "zalo_three_step"); // Use our internal identifier

        // Set authentication cache after successful authentication
        this.setAuthCache();

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
    const authMethod = localStorage.getItem("auth_method");
    const timestamp = localStorage.getItem("auth_timestamp");

    // User has granted permission if they used zalo_three_step before
    return authMethod === "zalo_three_step" && !!timestamp;
  }

  // Clear authentication cache
  private clearAuthCache(): void {
    localStorage.removeItem("auth_last_check");
    localStorage.removeItem("permission_granted");
  }

  // Set authentication cache after successful auth
  private setAuthCache(): void {
    localStorage.setItem("auth_last_check", Date.now().toString());
    localStorage.setItem("permission_granted", "true");
  }

  // Check if we have cached permission status
  private hasCachedPermission(): boolean {
    return localStorage.getItem("permission_granted") === "true";
  }

  // Attempt silent authentication without UI interaction
  async attemptSilentAuth(): Promise<ZaloThreeStepResponse> {
    try {
      console.log("🔐 Attempting silent authentication...");

      // Prevent multiple simultaneous auth attempts
      const inProgress = localStorage.getItem("silent_auth_in_progress");
      if (inProgress) {
        console.log("⏳ Silent authentication already in progress...");
        return {
          success: false,
          error: "Authentication in progress",
          message: "Đang xác thực, vui lòng đợi...",
        };
      }

      // Set flag to prevent multiple attempts
      localStorage.setItem("silent_auth_in_progress", "true");

      try {
        // Check if we have recent successful auth (within 5 minutes)
        const lastCheck = localStorage.getItem("auth_last_check");
        if (lastCheck) {
          const timeSinceLastCheck = Date.now() - parseInt(lastCheck);
          const fiveMinutes = 5 * 60 * 1000; // 5 minutes in ms

          if (timeSinceLastCheck < fiveMinutes) {
            console.log("✅ Using cached authentication result");
            const user = AuthService.getUser();
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
        }

        // Check if we need to refresh token
        const tokenValid = await this.checkAndRefreshToken();
        if (!tokenValid) {
          console.log("⚠️ Token validation failed, need full authentication");
          this.clearAuthCache();
          return {
            success: false,
            error: "Token expired",
            message: "Phiên đăng nhập đã hết hạn",
          };
        }

        // If we have valid tokens, user is authenticated
        if (AuthService.isAuthenticated()) {
          console.log("✅ Silent authentication successful");

          // Cache this successful check
          this.setAuthCache();

          const user = AuthService.getUser();
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
        if (this.hasCachedPermission()) {
          console.log("🔄 User has granted permission before, attempting 3-step auth...");
          const result = await this.authenticateWithThreeSteps();

          if (result.success) {
            this.setAuthCache();
          }

          return result;
        } else {
          console.log("❓ No cached permission, user needs to grant permission first");
          return {
            success: false,
            error: "Permission not granted",
            message: "Vui lòng cấp quyền truy cập số điện thoại",
          };
        }

      } finally {
        // Clear the in-progress flag
        localStorage.removeItem("silent_auth_in_progress");
      }

    } catch (error) {
      console.error("❌ Silent authentication failed:", error);
      localStorage.removeItem("silent_auth_in_progress");
      this.clearAuthCache();
      return {
        success: false,
        error: error instanceof Error ? error.message : "Silent authentication failed",
        message: "Không thể xác thực tự động",
      };
    }
  }

  // Check and refresh token if needed
  async checkAndRefreshToken(): Promise<boolean> {
    try {
      const timestamp = localStorage.getItem("auth_timestamp");
      if (!timestamp) {
        console.log("⚠️ No auth timestamp found");
        return false;
      }

      const tokenAge = Date.now() - parseInt(timestamp);
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
          // Use existing AuthService auto refresh mechanism
          const refreshed = await AuthService.autoRefreshToken();
          if (refreshed) {
            console.log("✅ Token refresh successful");
            // Update timestamp after successful refresh
            localStorage.setItem("auth_timestamp", Date.now().toString());
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

    // Mock data from API response
    const mockResponse = {
      success: true,
      user: {
        id: "181db26b-04d2-467b-a955-7d250ed0b25f",
        zaloId: "5614378971101698093",
        name: "Zalo User",
        phone: "84972809802",
        avatar: undefined,
        verified: true,
        verificationMethod: "zalo_three_step" as const,
      },
      tokens: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODFkYjI2Yi0wNGQyLTQ2N2ItYTk1NS03ZDI1MGVkMGIyNWYiLCJ6YWxvVXNlcklkIjoiNTYxNDM3ODk3MTEwMTY5ODA5MyIsIm5hbWUiOiJaYWxvIFVzZXIiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJUSFJFRV9TVEVQIiwicGhvbmVWZXJpZmllZCI6dHJ1ZSwibGFzdFZlcmlmaWNhdGlvbkF0IjoiMjAyNS0xMi0zMFQxNTowOToyOS4yMTZaIiwiaWF0IjoxNzY3MTA3MzY5LCJleHAiOjE3NjcxMDgyNjl9.Dwxh8IHEGNx4QNXu_MnnsJIcq3QVl_Sph6BizLz426c",
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODFkYjI2Yi0wNGQyLTQ2N2ItYTk1NS03ZDI1MGVkMGIyNWYiLCJ0eXBlIjoicmVmcmVzaCIsInphbG9Vc2VySWQiOiI1NjE0Mzc4OTcxMTAxNjk4MDkzIiwiaWF0IjoxNzY3MTA3MzY5LCJleHAiOjE3Njc3MTIxNjl9.HhcgFtjYEWb709dlFLzCp2n7OhOKBj8FvWl8d5bmANA",
      },
    };

    // Store tokens and user data (same logic as real auth)
    const tokens = {
      accessToken: mockResponse.tokens.accessToken,
      refreshToken: mockResponse.tokens.refreshToken,
      expiresIn: "3600",
    };

    AuthService.saveTokens(tokens);

    const userData = {
      id: mockResponse.user.id,
      zaloUserId: mockResponse.user.zaloId,
      name: mockResponse.user.name,
      phone: mockResponse.user.phone,
      avatar: mockResponse.user.avatar,
      verificationMethod: "THREE_STEP" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    AuthService.saveUser(userData);

    localStorage.setItem("auth_timestamp", Date.now().toString());
    localStorage.setItem("auth_method", "zalo_three_step");
    this.setAuthCache();

    console.log("✅ BYPASS: Mock authentication successful!");
    console.log("📱 User:", userData);
    console.log("🔑 Token:", tokens.accessToken.substring(0, 20) + "...");

    return mockResponse;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = AuthService.getAccessToken();
    const authMethod = localStorage.getItem("auth_method");

    if (!token || authMethod !== "zalo_three_step") {
      return false;
    }

    // Check token age (1 hour for 3-step auth)
    const timestamp = localStorage.getItem("auth_timestamp");
    if (!timestamp) return false;

    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 3600000; // 1 hour

    return tokenAge < maxAge;
  }

  // Get user info
  getUserInfo(): any {
    const user = AuthService.getUser();
    const authMethod = localStorage.getItem("auth_method");

    if (!user || authMethod !== "zalo_three_step") {
      return null;
    }

    return {
      ...user,
      authMethod: "zalo_three_step",
      lastAuth: localStorage.getItem("auth_timestamp"),
    };
  }

  // Logout
  logout(): void {
    // Use AuthService to clear tokens and user data
    AuthService.clearTokens();
    AuthService.clearUser();

    // Clear additional tracking data
    localStorage.removeItem("auth_timestamp");
    localStorage.removeItem("auth_method");

    // Clear authentication cache
    this.clearAuthCache();
  }

  // Get current access token
  getAccessToken(): string | null {
    return AuthService.getAccessToken();
  }

  // Utility methods
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
        byte.toString(16).padStart(2, "0")
      ).join("");
    }
    return (
      Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    );
  }
}

// Export service instance
export const zaloThreeStepAuthService = new ZaloThreeStepAuthService();
