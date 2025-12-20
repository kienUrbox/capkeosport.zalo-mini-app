// Backend-only authentication - NO CLIENT-SIDE SECRETS!
import zmp from 'zmp-sdk'

export interface BackendAuthRequest {
  zaloId?: string;           // From Zalo getUserInfo
  phoneNumber: string;       // From Zalo getPhoneNumber
  userName?: string;         // From Zalo getUserInfo
  zaloProfile?: {            // Additional Zalo data
    avatar?: string;
    birthday?: string;
    gender?: number;
  };
  deviceFingerprint: string; // Device identifier
  clientTimestamp: number;   // Client timestamp for validation
  sessionId: string;         // Unique session
}

export interface BackendAuthResponse {
  success: boolean;
  user?: {
    id: string;
    zaloId: string;
    name: string;
    phone: string;
    avatar?: string;
    level?: string;
  };
  token?: string;
  refreshToken?: string;
  challengeRequired?: boolean; // For additional verification
  challengeType?: 'otp' | 'captcha' | 'biometric';
}

class BackendOnlyAuthService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Client only sends RAW Zalo data - NO SIGNATURES
  async authenticateWithBackendOnly(zaloData: {
    phoneNumber: string;
    zaloUserInfo?: any;
  }): Promise<BackendAuthResponse> {
    try {
      console.log('🔐 Starting backend-only authentication...')

      // Generate client-side identifiers only (no secrets)
      const clientData: BackendAuthRequest = {
        zaloId: zaloData.zaloUserInfo?.userInfo?.id,
        phoneNumber: zaloData.phoneNumber,
        userName: zaloData.zaloUserInfo?.userInfo?.name,
        zaloProfile: zaloData.zaloUserInfo?.userInfo ? {
          avatar: zaloData.zaloUserInfo.userInfo.avatar,
          birthday: zaloData.zaloUserInfo.userInfo.birthday,
          gender: zaloData.zaloUserInfo.userInfo.gender
        } : undefined,
        deviceFingerprint: this.generateDeviceFingerprint(),
        clientTimestamp: Date.now(),
        sessionId: this.generateSessionId()
      };

      console.log('📱 Sending raw Zalo data to backend:', {
        zaloId: clientData.zaloId,
        phone: clientData.phoneNumber,
        name: clientData.userName,
        hasZaloProfile: !!clientData.zaloProfile
      });

      // Send UN-SIGNED request - backend handles all security
      const response = await fetch(`${this.API_BASE_URL}/auth/zalo-secure-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
          'X-Platform': 'zalo_mini_app',
          'X-Request-ID': this.generateRequestId()
        },
        body: JSON.stringify(clientData)
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Authentication failed: ${response.status}`);
      }

      const result = await response.json();

      // Handle additional challenges
      if (result.challengeRequired) {
        return await this.handleAdditionalChallenge(result, clientData);
      }

      console.log('✅ Backend authentication successful:', {
        userId: result.user?.id,
        isNewUser: result.isNewUser,
        hasToken: !!result.token
      });

      return result;

    } catch (error) {
      console.error('❌ Backend-only authentication failed:', error);
      throw error;
    }
  }

  // Handle additional verification challenges
  private async handleAdditionalChallenge(
    challengeResult: any,
    originalData: BackendAuthRequest
  ): Promise<BackendAuthResponse> {
    console.log('🛡️ Additional challenge required:', challengeResult.challengeType);

    switch (challengeResult.challengeType) {
      case 'otp':
        return await this.handleOTPChallenge(challengeResult, originalData);

      case 'captcha':
        return await this.handleCaptchaChallenge(challengeResult, originalData);

      case 'biometric':
        return await this.handleBiometricChallenge(challengeResult, originalData);

      default:
        throw new Error('Unsupported challenge type');
    }
  }

  private async handleOTPChallenge(
    challengeResult: any,
    originalData: BackendAuthRequest
  ): Promise<BackendAuthResponse> {
    // Show OTP input UI
    const otp = await this.showOTPInput(challengeResult.otpLength || 6);

    const response = await fetch(`${this.API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': originalData.sessionId
      },
      body: JSON.stringify({
        sessionId: challengeResult.sessionId,
        otp: otp,
        clientTimestamp: Date.now()
      })
    });

    if (!response.ok) {
      throw new Error('OTP verification failed');
    }

    return await response.json();
  }

  private async handleCaptchaChallenge(
    challengeResult: any,
    originalData: BackendAuthRequest
  ): Promise<BackendAuthResponse> {
    // Show captcha UI
    const captchaSolution = await this.showCaptcha(challengeResult.captchaImage);

    const response = await fetch(`${this.API_BASE_URL}/auth/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': originalData.sessionId
      },
      body: JSON.stringify({
        sessionId: challengeResult.sessionId,
        captchaSolution: captchaSolution,
        clientTimestamp: Date.now()
      })
    });

    if (!response.ok) {
      throw new Error('Captcha verification failed');
    }

    return await response.json();
  }

  private async handleBiometricChallenge(
    challengeResult: any,
    originalData: BackendAuthRequest
  ): Promise<BackendAuthResponse> {
    // Biometric authentication not available in zmp-sdk
    throw new Error('Biometric authentication not supported');
  }

  // UI Methods for challenges
  private async showOTPInput(length: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Implementation for OTP input UI
      const otp = prompt(`Please enter ${length}-digit OTP code:`);
      if (otp && otp.length === length && /^\d+$/.test(otp)) {
        resolve(otp);
      } else {
        reject(new Error('Invalid OTP format'));
      }
    });
  }

  private async showCaptcha(imageData: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Implementation for captcha UI
      const solution = prompt('Please enter the captcha text:');
      if (solution && solution.length > 0) {
        resolve(solution);
      } else {
        reject(new Error('Invalid captcha solution'));
      }
    });
  }

  
  // Client-side utilities (NO SECRETS)
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

    return btoa(JSON.stringify(fingerprint));
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

  // Main login method
  async loginWithZaloBackendOnly(): Promise<BackendAuthResponse> {
    try {
      // Step 1: Get Zalo data (no client-side security)
      const phoneNumber = await this.getPhoneNumber();
      const zaloUserInfo = await this.getZaloUserInfo();

      // Step 2: Send raw data to backend
      const authResult = await this.authenticateWithBackendOnly({
        phoneNumber,
        zaloUserInfo
      });

      // Step 3: Store tokens if successful
      if (authResult.success && authResult.token) {
        localStorage.setItem('access_token', authResult.token);
        if (authResult.refreshToken) {
          localStorage.setItem('refresh_token', authResult.refreshToken);
        }
        localStorage.setItem('user_info', JSON.stringify(authResult.user));
        localStorage.setItem('auth_timestamp', Date.now().toString());
      }

      return authResult;

    } catch (error) {
      console.error('❌ Backend-only login failed:', error);
      throw error;
    }
  }

  // Zalo SDK methods
  private async getPhoneNumber(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getPhoneNumber) {
        console.warn('⚠️ Zalo getPhoneNumber not available');
        reject(new Error('Zalo phone number not available'));
        return;
      }

      zmp.getPhoneNumber({
        success: (res) => {
          if (res.number) {
            resolve(res.number);
          } else {
            reject(new Error('Phone number not available in response'));
          }
        },
        fail: (err) => reject(new Error('User denied phone number access'))
      });
    });
  }

  private async getZaloUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getUserInfo) {
        console.warn('⚠️ Zalo getUserInfo not available');
        resolve(null); // Optional - don't fail if user info unavailable
        return;
      }

      zmp.getUserInfo({
        success: (res) => resolve(res),
        fail: (err) => resolve(null) // Optional - don't fail if user info unavailable
      });
    });
  }
}

export const backendOnlyAuthService = new BackendOnlyAuthService();