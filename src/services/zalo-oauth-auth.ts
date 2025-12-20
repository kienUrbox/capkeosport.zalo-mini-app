// Zalo OAuth Server-to-Server Authentication (PRODUCTION READY)

export interface ZaloOAuthResponse {
  success: boolean;
  user?: {
    id: string;
    zaloId: string;
    name: string;
    phone: string;
    avatar?: string;
    verified: boolean;
    verificationMethod: 'zalo_oauth' | 'zalo_otp' | 'zalo_deep_link';
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  requiresAction?: {
    type: 'otp' | 'deep_link' | 'biometric';
    data?: any;
  };
  error?: string;
}

class ZaloOAuthAuthService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Main authentication using Zalo OAuth (MOST SECURE)
  async authenticateWithZaloOAuth(): Promise<ZaloOAuthResponse> {
    try {
      console.log('🔐 Starting Zalo OAuth authentication...');

      // Step 1: Get Zalo authorization code from user
      const authCode = await this.getZaloAuthorizationCode();

      if (!authCode) {
        throw new Error('Failed to get Zalo authorization code');
      }

      console.log('📱 Zalo authorization code received');

      // Step 2: Exchange code for verified user data
      const authResult = await this.exchangeAuthorizationCode(authCode);

      console.log('✅ Zalo OAuth verification successful:', {
        userId: authResult.user?.id,
        verified: authResult.user?.verified,
        method: authResult.user?.verificationMethod
      });

      return authResult;

    } catch (error) {
      console.error('❌ Zalo OAuth authentication failed:', error);

      // Fallback to other methods if OAuth fails
      return await this.fallbackToOtherMethods();
    }
  }

  // Get Zalo authorization code (Mini App only)
  private async getZaloAuthorizationCode(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // Check if Zalo OAuth is available
      if (typeof zmp === 'undefined' || !zmp.requestAccessToken) {
        console.warn('⚠️ Zalo OAuth not available, falling back...');
        resolve(null);
        return;
      }

      console.log('🔑 Requesting Zalo authorization code...');

      zmp.requestAccessToken({
        scope: 'phone_number user_info',  // Required permissions
        success: (response) => {
          console.log('✅ Authorization code received');
          resolve(response.code);  // This is the authorization code!
        },
        fail: (error) => {
          console.error('❌ Failed to get authorization code:', error);
          reject(new Error('User denied Zalo OAuth authorization'));
        }
      });
    });
  }

  // Exchange authorization code for verified user data (Backend API)
  private async exchangeAuthorizationCode(code: string): Promise<ZaloOAuthResponse> {
    try {
      const deviceId = this.generateDeviceFingerprint();
      const timestamp = Date.now();

      console.log('🔄 Exchanging authorization code for user data...');

      const response = await fetch(`${this.API_BASE_URL}/auth/zalo-oauth-exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
          'X-Platform': 'zalo_mini_app',
          'X-Request-ID': this.generateRequestId()
        },
        body: JSON.stringify({
          code: code,                    // Zalo authorization code
          deviceId: deviceId,              // Device fingerprint
          timestamp: timestamp,           // Request timestamp
          userAgent: navigator.userAgent,   // Browser info
          platform: 'zalo_mini_app'       // Platform identifier
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          // Invalid or expired authorization code
          throw new Error('Authorization code expired or invalid');
        } else if (response.status === 429) {
          throw new Error('Too many authorization attempts');
        } else {
          throw new Error(`OAuth exchange failed: ${response.status}`);
        }
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'OAuth verification failed');
      }

      // Store authentication data
      if (result.tokens?.accessToken) {
        localStorage.setItem('access_token', result.tokens.accessToken);
        if (result.tokens.refreshToken) {
          localStorage.setItem('refresh_token', result.tokens.refreshToken);
        }
        localStorage.setItem('user_info', JSON.stringify(result.user));
        localStorage.setItem('auth_timestamp', timestamp.toString());
        localStorage.setItem('auth_method', result.user?.verificationMethod || 'zalo_oauth');
      }

      return result;

    } catch (error) {
      console.error('❌ OAuth exchange failed:', error);
      throw error;
    }
  }

  // Fallback methods when OAuth is not available
  private async fallbackToOtherMethods(): Promise<ZaloOAuthResponse> {
    try {
      console.log('🔄 Attempting fallback authentication methods...');

      // Try OTP verification via Zalo Business API
      const otpResult = await this.attemptOTPVerification();

      if (otpResult.success) {
        return otpResult;
      }

      // Try deep link verification
      const deepLinkResult = await this.attemptDeepLinkVerification();

      if (deepLinkResult.success) {
        return deepLinkResult;
      }

      // Last resort: Basic phone verification (less secure)
      return await this.attemptBasicVerification();

    } catch (error) {
      console.error('❌ All authentication methods failed:', error);
      return {
        success: false,
        error: 'All authentication methods failed'
      };
    }
  }

  // OTP verification via Zalo Business API
  private async attemptOTPVerification(): Promise<ZaloOAuthResponse> {
    try {
      console.log('📱 Attempting OTP verification...');

      // First, get phone number via Zalo SDK
      const phoneNumber = await this.getPhoneNumber();

      if (!phoneNumber) {
        throw new Error('Cannot get phone number for OTP');
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/zalo-otp-send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          sessionId: this.generateSessionId(),
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      const otpData = await response.json();

      // Show OTP input UI
      const otpCode = await this.showOTPInput();

      // Verify OTP
      const verifyResponse = await fetch(`${this.API_BASE_URL}/auth/zalo-otp-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: otpData.sessionId,
          otpCode: otpCode,
          phoneNumber: phoneNumber
        })
      });

      if (!verifyResponse.ok) {
        throw new Error('OTP verification failed');
      }

      const verifyResult = await verifyResponse.json();

      return {
        success: true,
        user: {
          ...verifyResult.user,
          verificationMethod: 'zalo_otp'
        },
        tokens: verifyResult.tokens
      };

    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw error;
    }
  }

  // Deep link verification
  private async attemptDeepLinkVerification(): Promise<ZaloOAuthResponse> {
    try {
      console.log('🔗 Attempting deep link verification...');

      const phoneNumber = await this.getPhoneNumber();

      if (!phoneNumber) {
        throw new Error('Cannot get phone number for deep link');
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/zalo-deep-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          returnUrl: window.location.href,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create deep link');
      }

      const deepLinkData = await response.json();

      // Show deep link options
      const userChoice = await this.showDeepLinkOptions(deepLinkData);

      if (userChoice === 'deep_link') {
        // Open Zalo deep link
        window.location.href = deepLinkData.deepLinkUrl;

        // Return pending result
        return {
          success: false,
          requiresAction: {
            type: 'deep_link',
            data: { deepLinkUrl: deepLinkData.deepLinkUrl }
          }
        };
      } else {
        throw new Error('User declined deep link verification');
      }

    } catch (error) {
      console.error('❌ Deep link verification failed:', error);
      throw error;
    }
  }

  // Basic phone verification (least secure)
  private async attemptBasicVerification(): Promise<ZaloOAuthResponse> {
    try {
      console.log('📱 Attempting basic phone verification...');

      const phoneNumber = await this.getPhoneNumber();

      if (!phoneNumber) {
        throw new Error('Cannot get phone number');
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/basic-phone-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          deviceFingerprint: this.generateDeviceFingerprint(),
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Basic verification failed');
      }

      const result = await response.json();

      return {
        success: true,
        user: {
          ...result.user,
          verificationMethod: 'basic_phone'
        },
        tokens: result.tokens
      };

    } catch (error) {
      console.error('❌ Basic verification failed:', error);
      throw error;
    }
  }

  // UI Helper methods
  private async getPhoneNumber(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined') {
        resolve(null);
        return;
      }

      zmp.getPhoneNumber({
        success: (res) => resolve(res.phoneNumber),
        fail: (err) => {
          console.error('Failed to get phone number:', err);
          resolve(null);
        }
      });
    });
  }

  private async showOTPInput(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create custom OTP input UI
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 10000;
        ">
          <h3>Nhập mã OTP</h3>
          <p>Mã đã được gửi qua Zalo</p>
          <input type="text" id="otp-input" placeholder="Nhập 6 số" maxlength="6" style="
            width: 200px;
            padding: 10px;
            font-size: 18px;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 5px;
            margin: 10px 0;
          ">
          <button id="otp-submit" style="
            background: #0066ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
          ">Xác nhận</button>
          <button id="otp-cancel" style="
            background: #ccc;
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          ">Hủy</button>
        </div>
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
        "></div>
      `;

      document.body.appendChild(modal);

      const input = modal.querySelector('#otp-input') as HTMLInputElement;
      const submitBtn = modal.querySelector('#otp-submit') as HTMLButtonElement;
      const cancelBtn = modal.querySelector('#otp-cancel') as HTMLButtonElement;

      const handleSubmit = () => {
        const otp = input.value.trim();
        if (otp.length === 6 && /^\d{6}$/.test(otp)) {
          document.body.removeChild(modal);
          resolve(otp);
        } else {
          alert('Vui lòng nhập đủ 6 số');
        }
      };

      const handleCancel = () => {
        document.body.removeChild(modal);
        reject(new Error('User cancelled OTP input'));
      };

      submitBtn.addEventListener('click', handleSubmit);
      cancelBtn.addEventListener('click', handleCancel);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmit();
      });

      input.focus();
    });
  }

  private async showDeepLinkOptions(deepLinkData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 10000;
          max-width: 350px;
        ">
          <h3>Xác thực tài khoản Zalo</h3>
          <p>Vui lòng mở Zalo để xác thực số điện thoại của bạn</p>
          <button id="deep-link-btn" style="
            background: #0066ff;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 0;
            width: 100%;
          ">Mở Zalo xác thực</button>
          <button id="cancel-btn" style="
            background: #f5f5f5;
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
          ">Hủy</button>
        </div>
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
        "></div>
      `;

      document.body.appendChild(modal);

      const deepLinkBtn = modal.querySelector('#deep-link-btn') as HTMLButtonElement;
      const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;

      deepLinkBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve('deep_link');
      });

      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        reject(new Error('User cancelled deep link verification'));
      });
    });
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
      timestamp: Date.now()
    };

    return btoa(JSON.stringify(fingerprint)).substring(0, 64);
  }

  private generateSessionId(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Main public method
  async loginWithZaloOAuth(): Promise<ZaloOAuthResponse> {
    try {
      const result = await this.authenticateWithZaloOAuth();

      if (result.success) {
        console.log('🎉 Zalo authentication successful:', {
          userId: result.user?.id,
          method: result.user?.verificationMethod
        });
      }

      return result;

    } catch (error) {
      console.error('❌ Zalo authentication failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const timestamp = localStorage.getItem('auth_timestamp');

    if (!token || !timestamp) {
      return false;
    }

    // Check if token is still valid (1 hour for OAuth, 30 minutes for OTP)
    const tokenAge = Date.now() - parseInt(timestamp);
    const authMethod = localStorage.getItem('auth_method') || 'basic_phone';
    const maxAge = authMethod === 'zalo_oauth' ? 3600000 : 1800000;

    return tokenAge < maxAge;
  }

  // Get current user info
  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info');
    const authMethod = localStorage.getItem('auth_method');

    if (!userInfo) return null;

    const user = JSON.parse(userInfo);
    return {
      ...user,
      authMethod: authMethod || 'unknown',
      lastAuth: localStorage.getItem('auth_timestamp')
    };
  }

  // Logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_timestamp');
    localStorage.removeItem('auth_method');
  }
}

export const zaloOAuthAuthService = new ZaloOAuthAuthService();