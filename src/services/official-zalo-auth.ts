// Official Zalo Mini App Authentication Flow (Based on Official Docs)

export interface ZaloTokenResponse {
  success: boolean;
  data?: {
    phoneNumber: string;
    masked?: boolean;
  };
  error?: string;
  originalCode?: string;
}

export interface ZaloAuthResponse {
  success: boolean;
  user?: {
    id: string;
    zaloId: string;
    name: string;
    phone: string;
    maskedPhone: string;
    avatar?: string;
    verified: boolean;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  requiresVerification?: boolean;
  verificationMethod?: 'otp' | 'full_phone' | 'none';
}

class OfficialZaloAuthService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Main authentication using official Zalo flow
  async authenticateWithOfficialZalo(): Promise<ZaloAuthResponse> {
    try {
      console.log('🔐 Starting official Zalo authentication...');

      // Step 1: Get Zalo phone token from client
      const phoneToken = await this.getZaloPhoneToken();

      if (!phoneToken) {
        throw new Error('Failed to get Zalo phone token');
      }

      console.log('📱 Zalo phone token received');

      // Step 2: Get user info if available
      const userInfo = await this.getZaloUserInfo();

      console.log('👤 Zalo user info:', {
        hasUserInfo: !!userInfo,
        zaloId: userInfo?.userInfo?.id
      });

      // Step 3: Convert token to actual phone via backend
      const phoneResult = await this.convertZaloPhoneToken(phoneToken, userInfo);

      if (!phoneResult.success) {
        throw new Error(phoneResult.error || 'Failed to convert phone token');
      }

      console.log('✅ Phone token converted:', {
        maskedPhone: phoneResult.data?.phoneNumber,
        masked: phoneResult.data?.masked
      });

      // Step 4: Complete authentication
      return await this.completeAuthentication(phoneResult, userInfo);

    } catch (error) {
      console.error('❌ Official Zalo authentication failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  // Step 1: Get Zalo phone token (Official API)
  private async getZaloPhoneToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getPhoneNumber) {
        console.warn('⚠️ Zalo getPhoneNumber not available');
        resolve(null);
        return;
      }

      console.log('📱 Requesting Zalo phone token...');

      zmp.getPhoneNumber({
        success: (res) => {
          console.log('✅ Phone token received:', {
            hasCode: !!res.code,
            hasPhoneNumber: !!res.phoneNumber, // May be null initially
            errorCode: res.errCode
          });

          // Official API returns 'code' (dynamic token), not direct phone number
          if (res.code) {
            resolve(res.code);
          } else if (res.phoneNumber) {
            // In some cases, phone number is returned directly
            console.log('📱 Phone number returned directly:', res.phoneNumber);
            resolve(res.phoneNumber);
          } else {
            reject(new Error('No phone token or number received from Zalo'));
          }
        },
        fail: (err) => {
          console.error('❌ Failed to get Zalo phone token:', err);
          reject(new Error('User denied phone number access'));
        }
      });
    });
  }

  // Step 2: Get Zalo user info
  private async getZaloUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getUserInfo) {
        console.warn('⚠️ Zalo getUserInfo not available');
        resolve(null);
        return;
      }

      zmp.getUserInfo({
        success: (res) => {
          console.log('✅ Zalo user info received:', {
            hasUserInfo: !!res.userInfo,
            zaloId: res.userInfo?.id,
            name: res.userInfo?.name
          });
          resolve(res);
        },
        fail: (err) => {
          console.warn('⚠️ Failed to get Zalo user info:', err);
          resolve(null); // Don't fail auth if user info unavailable
        }
      });
    });
  }

  // Step 3: Convert Zalo token to actual phone number via backend
  private async convertZaloPhoneToken(
    phoneToken: string,
    userInfo: any
  ): Promise<ZaloTokenResponse> {
    try {
      const deviceFingerprint = this.generateDeviceFingerprint();
      const sessionId = this.generateSessionId();
      const timestamp = Date.now();

      console.log('🔄 Converting Zalo phone token via backend...');

      const response = await fetch(`${this.API_BASE_URL}/auth/zalo-token-conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
          'X-Platform': 'zalo_mini_app',
          'X-Request-ID': this.generateRequestId()
        },
        body: JSON.stringify({
          // Official Zalo flow data
          zaloPhoneToken: phoneToken,           // Dynamic token from getPhoneNumber
          zaloUserCode: userInfo?.userInfo?.id,  // User ID from getUserInfo

          // Security data
          deviceFingerprint: deviceFingerprint,
          sessionId: sessionId,
          timestamp: timestamp,

          // Additional user data
          userName: userInfo?.userInfo?.name,
          userAvatar: userInfo?.userInfo?.avatar,

          // Request metadata
          requestType: 'zalo_official_auth',
          userAgent: navigator.userAgent,
          platform: 'zalo_mini_app'
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Zalo token conversion failed: ${errorData.message || 'Invalid token'}`);
        } else if (response.status === 429) {
          throw new Error('Too many Zalo token requests. Please try again later.');
        } else {
          throw new Error(`Zalo token conversion failed: ${response.status}`);
        }
      }

      const result = await response.json();

      console.log('✅ Zalo token conversion successful:', {
        success: result.success,
        hasPhone: !!result.phoneNumber,
        masked: result.masked,
        requiresVerification: result.requiresVerification
      });

      return {
        success: result.success,
        data: result.phoneNumber ? {
          phoneNumber: result.phoneNumber,
          masked: result.masked || true
        } : undefined,
        originalCode: phoneToken,
        error: result.error
      };

    } catch (error) {
      console.error('❌ Zalo token conversion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token conversion failed',
        originalCode: phoneToken
      };
    }
  }

  // Step 4: Complete authentication process
  private async completeAuthentication(
    phoneResult: ZaloTokenResponse,
    userInfo: any
  ): Promise<ZaloAuthResponse> {
    try {
      if (!phoneResult.success || !phoneResult.data) {
        throw new Error('No valid phone data from Zalo token conversion');
      }

      console.log('🔐 Completing authentication with phone data...');

      // Additional verification if phone is masked
      if (phoneResult.data.masked) {
        console.log('🛡️ Phone number is masked, requesting additional verification...');

        const verificationResult = await this.requestAdditionalVerification(
          phoneResult.originalCode!,
          phoneResult.data.phoneNumber,
          userInfo
        );

        if (!verificationResult.success) {
          return {
            success: false,
            requiresVerification: true,
            verificationMethod: verificationResult.method,
            error: verificationResult.error
          };
        }

        // Use verified phone number
        phoneResult.data.phoneNumber = verificationResult.fullPhone!;
      }

      // Complete authentication with verified phone
      const authResponse = await fetch(`${this.API_BASE_URL}/auth/zalo-complete-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phoneResult.data.phoneNumber,
          maskedPhone: phoneResult.data.masked ? phoneResult.data.phoneNumber : undefined,
          zaloId: userInfo?.userInfo?.id,
          userName: userInfo?.userInfo?.name,
          userAvatar: userInfo?.userInfo?.avatar,
          verificationMethod: 'zalo_official_api',
          deviceFingerprint: this.generateDeviceFingerprint(),
          sessionId: this.generateSessionId(),
          timestamp: Date.now()
        })
      });

      if (!authResponse.ok) {
        throw new Error(`Authentication failed: ${authResponse.status}`);
      }

      const authResult = await authResponse.json();

      // Store authentication data
      if (authResult.success && authResult.tokens) {
        localStorage.setItem('access_token', authResult.tokens.accessToken);
        if (authResult.tokens.refreshToken) {
          localStorage.setItem('refresh_token', authResult.tokens.refreshToken);
        }
        localStorage.setItem('user_info', JSON.stringify(authResult.user));
        localStorage.setItem('auth_timestamp', Date.now().toString());
        localStorage.setItem('auth_method', 'zalo_official_api');
      }

      console.log('🎉 Official Zalo authentication completed:', {
        userId: authResult.user?.id,
        zaloId: authResult.user?.zaloId,
        phoneMasked: !!authResult.user?.maskedPhone
      });

      return {
        success: true,
        user: {
          ...authResult.user,
          maskedPhone: phoneResult.data.masked ? phoneResult.data.phoneNumber : undefined
        },
        tokens: authResult.tokens
      };

    } catch (error) {
      console.error('❌ Failed to complete authentication:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication completion failed'
      };
    }
  }

  // Additional verification for masked phone numbers
  private async requestAdditionalVerification(
    originalToken: string,
    maskedPhone: string,
    userInfo: any
  ): Promise<{
    success: boolean;
    fullPhone?: string;
    method?: 'otp' | 'full_phone';
    error?: string;
  }> {
    try {
      console.log('🔍 Requesting additional verification for masked phone...');

      const response = await fetch(`${this.API_BASE_URL}/auth/zalo-request-full-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalToken: originalToken,
          maskedPhone: maskedPhone,
          zaloId: userInfo?.userInfo?.id,
          verificationType: 'otp',
          sessionId: this.generateSessionId()
        })
      });

      if (!response.ok) {
        throw new Error(`Verification request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.requiresOTP) {
        console.log('📱 OTP verification required');

        // Show OTP input UI
        const otpCode = await this.showOTPInput(result.otpLength || 6);

        const verifyResponse = await fetch(`${this.API_BASE_URL}/auth/zalo-verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId: result.sessionId,
            otpCode: otpCode,
            originalToken: originalToken
          })
        });

        if (!verifyResponse.ok) {
          throw new Error('OTP verification failed');
        }

        const verifyResult = await verifyResponse.json();

        return {
          success: true,
          fullPhone: verifyResult.fullPhone,
          method: 'otp'
        };
      }

      throw new Error('Unsupported verification method');

    } catch (error) {
      console.error('❌ Additional verification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed',
        method: 'otp'
      };
    }
  }

  // UI: Show OTP input
  private async showOTPInput(length: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        ">
          <div style="
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 300px;
          ">
            <h3 style="margin: 0 0 15px 0;">Xác thực số điện thoại</h3>
            <p style="margin: 0 0 15px 0; color: #666;">
              Nhập mã ${length} số đã được gửi qua Zalo
            </p>
            <input
              type="text"
              id="otp-input"
              placeholder="Nhập mã OTP"
              maxlength="${length}"
              style="
                width: 100%;
                padding: 10px;
                font-size: 18px;
                text-align: center;
                border: 2px solid #ddd;
                border-radius: 5px;
                margin-bottom: 15px;
                box-sizing: border-box;
              "
            >
            <div style="display: flex; gap: 10px;">
              <button
                id="otp-submit"
                style="
                  flex: 1;
                  background: #0066ff;
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                "
              >
                Xác nhận
              </button>
              <button
                id="otp-cancel"
                style="
                  flex: 1;
                  background: #ccc;
                  color: black;
                  border: none;
                  padding: 12px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
                "
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const input = modal.querySelector('#otp-input') as HTMLInputElement;
      const submitBtn = modal.querySelector('#otp-submit') as HTMLButtonElement;
      const cancelBtn = modal.querySelector('#otp-cancel') as HTMLButtonElement;

      const handleSubmit = () => {
        const otp = input.value.trim();
        if (otp.length === length && /^\d+$/.test(otp)) {
          document.body.removeChild(modal);
          resolve(otp);
        } else {
          alert(`Vui lòng nhập đủ ${length} số`);
        }
      };

      const handleCancel = () => {
        document.body.removeChild(modal);
        reject(new Error('User cancelled OTP verification'));
      };

      submitBtn.addEventListener('click', handleSubmit);
      cancelBtn.addEventListener('click', handleCancel);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmit();
      });

      input.focus();

      // Auto-focus on input
      setTimeout(() => input.focus(), 100);
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

  // Public methods
  async loginWithOfficialZalo(): Promise<ZaloAuthResponse> {
    try {
      const result = await this.authenticateWithOfficialZalo();

      if (result.success) {
        console.log('🎉 Official Zalo login successful');
      }

      return result;

    } catch (error) {
      console.error('❌ Official Zalo login failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const authMethod = localStorage.getItem('auth_method');

    if (!token || authMethod !== 'zalo_official_api') {
      return false;
    }

    // Check token age (official Zalo tokens typically last 1 hour)
    const timestamp = localStorage.getItem('auth_timestamp');
    if (!timestamp) return false;

    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 3600000; // 1 hour

    return tokenAge < maxAge;
  }

  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info');
    const authMethod = localStorage.getItem('auth_method');

    if (!userInfo || authMethod !== 'zalo_official_api') {
      return null;
    }

    const user = JSON.parse(userInfo);
    return {
      ...user,
      authMethod: 'zalo_official_api',
      lastAuth: localStorage.getItem('auth_timestamp')
    };
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('auth_timestamp');
    localStorage.removeItem('auth_method');
  }
}

export const officialZaloAuthService = new OfficialZaloAuthService();