// Zalo 3-Step Authentication Service (Client-side)
// Flow: getAccessToken() + getUserID() + getPhoneNumber() → Backend → JWT tokens

import zmp from "zmp-sdk";

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

class ZaloThreeStepAuthService {
  // Constructor
  constructor() {
    console.log("🔐 Zalo 3-Step Authentication Service initialized");
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

      const baseURL =
        import.meta.env.VITE_API_BASE_URL ||
        "https://capkeosportnestjs-production.up.railway.app/api/v1";
      const requestURL = `${baseURL}/auth/zalo-three-step-verify`;

      console.log("🌐 API Request:", requestURL);

      const response = await fetch(requestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.clone().text();
        console.error("❌ Backend error response:", errorText);

        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              "Invalid Zalo authentication data"
          );
        } else if (response.status === 429) {
          throw new Error(
            "Too many authentication attempts. Please try again later."
          );
        } else {
          throw new Error(
            `Zalo authentication failed: ${response.status} - ${response.statusText}`
          );
        }
      }

      const result = await response.json();

      console.log("✅ Backend authentication successful:", {
        success: result.success,
        userId: result.user?.id,
        hasTokens: !!result.tokens,
        user: result.user,
      });

      // Transform the response to match our interface
      return {
        success: result.success || false,
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
      console.log("🔐 Starting Zalo 3-Step authentication...");

      // Step 1: Get access token
      const userAccessToken = await this.getZaloAccessToken();

      // Step 2: Get user ID
      const userId = await this.getZaloUserId();

      // Step 3: Get phone number
      const phoneNumber = await this.getZaloPhoneNumber();

      console.log("📱 All Zalo data collected:", {
        hasAccessToken: !!userAccessToken,
        hasUserId: !!userId,
        hasPhoneNumber: !!phoneNumber,
      });

      // Step 4: Send all 3 pieces to backend
      const authResult = await this.sendToBackend({
        userAccessToken,
        userId,
        phoneNumber,
        deviceInfo: this.generateDeviceFingerprint(),
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
      });

      // Step 5: Store tokens if successful
      if (authResult.success && authResult.tokens) {
        localStorage.setItem("access_token", authResult.tokens.accessToken);
        if (authResult.tokens.refreshToken) {
          localStorage.setItem("refresh_token", authResult.tokens.refreshToken);
        }
        localStorage.setItem("user_info", JSON.stringify(authResult.user));
        localStorage.setItem("auth_timestamp", Date.now().toString());
        localStorage.setItem("auth_method", "zalo_three_step");
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
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
    const userInfo = localStorage.getItem("user_info");
    const authMethod = localStorage.getItem("auth_method");

    if (!userInfo || authMethod !== "zalo_three_step") {
      return null;
    }

    const user = JSON.parse(userInfo);
    return {
      ...user,
      authMethod: "zalo_three_step",
      lastAuth: localStorage.getItem("auth_timestamp"),
    };
  }

  // Logout
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("auth_timestamp");
    localStorage.removeItem("auth_method");
  }

  // Get current access token
  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
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
