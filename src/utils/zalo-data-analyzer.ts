// Zalo Mini App Data Analysis for Enhanced Verification
import zmp from 'zmp-sdk'

export interface ZaloUserInfo {
  id: string;           // Zalo user ID - unique identifier
  name: string;         // User display name
  avatar?: string;      // Avatar URL
  birthday?: string;    // Birth date
  gender: number;       // 0: unknown, 1: male, 2: female
}

export interface ZaloPhoneResponse {
  phoneNumber: string;  // User phone number
  errCode: number;      // 0: success, others: error codes
  errMsg: string;       // Error message description
}

export interface ZaloCombinedData {
  userInfo: ZaloUserInfo;
  phoneInfo: ZaloPhoneResponse;
  timestamp: number;
  deviceFingerprint: string;
  sessionId: string;
}

export class ZaloDataAnalyzer {
  // Generate unique session ID for verification
  static generateSessionId(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  // Extract verification data from Zalo responses
  static async extractZaloVerificationData(): Promise<ZaloCombinedData> {
    try {
      const sessionId = this.generateSessionId();
      const timestamp = Date.now();

      // Get user info
      const userInfo = await this.getUserInfoSecurely();

      // Get phone number
      const phoneInfo = await this.getPhoneNumberSecurely();

      // Generate device fingerprint
      const deviceFingerprint = this.generateDeviceFingerprint();

      return {
        userInfo,
        phoneInfo,
        timestamp,
        deviceFingerprint,
        sessionId
      };
    } catch (error) {
      console.error('Failed to extract Zalo verification data:', error);
      throw error;
    }
  }

  // Secure getUserInfo with validation
  private static async getUserInfoSecurely(): Promise<ZaloUserInfo> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getUserInfo) {
        console.warn('⚠️ Zalo getUserInfo not available');
        reject(new Error('Zalo user info not available'));
        return;
      }

      zmp.getUserInfo({
        success: (res: any) => {
          // Validate response structure
          if (!res.userInfo || !res.userInfo.id) {
            reject(new Error('Invalid user info response from Zalo'));
            return;
          }

          const userInfo: ZaloUserInfo = {
            id: res.userInfo.id,
            name: res.userInfo.name || '',
            avatar: res.userInfo.avatar,
            birthday: res.userInfo.birthday,
            gender: res.userInfo.gender || 0
          };

          // Validate data integrity
          if (!this.validateUserInfo(userInfo)) {
            reject(new Error('User info validation failed'));
            return;
          }

          resolve(userInfo);
        },
        fail: (err: any) => {
          reject(new Error(`Failed to get Zalo user info: ${err}`));
        }
      });
    });
  }

  // Secure getPhoneNumber with validation
  private static async getPhoneNumberSecurely(): Promise<ZaloPhoneResponse> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getPhoneNumber) {
        console.warn('⚠️ Zalo getPhoneNumber not available');
        reject(new Error('Zalo phone number not available'));
        return;
      }

      zmp.getPhoneNumber({
        success: (res: any) => {
          // Validate response structure
          if (res.errCode !== 0) {
            reject(new Error(`Zalo phone error: ${res.errMsg}`));
            return;
          }

          if (!res.phoneNumber || !this.validatePhoneNumber(res.phoneNumber)) {
            reject(new Error('Invalid phone number received from Zalo'));
            return;
          }

          resolve({
            phoneNumber: res.phoneNumber,
            errCode: res.errCode,
            errMsg: res.errMsg || 'success'
          });
        },
        fail: (err: any) => {
          reject(new Error(`User denied phone number access: ${err}`));
        }
      });
    });
  }

  // Generate device fingerprint for additional security
  private static generateDeviceFingerprint(): string {
    const navigator = window.navigator;
    const screen = window.screen;

    const fingerprintData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screen: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now()
    };

    // Create hash from fingerprint data
    const fingerprintString = JSON.stringify(fingerprintData);
    return btoa(fingerprintString).substring(0, 64); // Truncate for manageable size
  }

  // Validate user info structure and content
  private static validateUserInfo(userInfo: ZaloUserInfo): boolean {
    return !!(
      userInfo.id &&
      userInfo.id.length > 0 &&
      userInfo.name &&
      userInfo.name.length > 0 &&
      [0, 1, 2].includes(userInfo.gender)
    );
  }

  // Validate phone number format (Vietnamese numbers)
  private static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    return phoneRegex.test(phone);
  }

  // Generate verification hash from Zalo data
  static generateVerificationHash(data: ZaloCombinedData): string {
    const verificationString = JSON.stringify({
      zaloId: data.userInfo.id,
      phoneNumber: data.phoneInfo.phoneNumber,
      timestamp: data.timestamp,
      deviceFingerprint: data.deviceFingerprint
    });

    // Simple hash for demonstration - use proper HMAC in production
    let hash = 0;
    for (let i = 0; i < verificationString.length; i++) {
      const char = verificationString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16);
  }

  // Check if data is consistent (not tampered)
  static verifyDataConsistency(data: ZaloCombinedData): boolean {
    const now = Date.now();
    const timeDiff = Math.abs(now - data.timestamp);

    // Check timestamp (within 5 minutes)
    if (timeDiff > 300000) {
      return false;
    }

    // Validate phone number format
    if (!this.validatePhoneNumber(data.phoneInfo.phoneNumber)) {
      return false;
    }

    // Validate user info
    if (!this.validateUserInfo(data.userInfo)) {
      return false;
    }

    return true;
  }

  // Extract unique identifiers for backend verification
  static extractBackendPayload(data: ZaloCombinedData): {
    zaloId: string;
    phoneNumber: string;
    userName: string;
    verificationHash: string;
    deviceFingerprint: string;
    timestamp: number;
    sessionId: string;
    additionalData: {
      avatar?: string;
      birthday?: string;
      gender: number;
    };
  } {
    return {
      zaloId: data.userInfo.id,
      phoneNumber: data.phoneInfo.phoneNumber,
      userName: data.userInfo.name,
      verificationHash: this.generateVerificationHash(data),
      deviceFingerprint: data.deviceFingerprint,
      timestamp: data.timestamp,
      sessionId: data.sessionId,
      additionalData: {
        avatar: data.userInfo.avatar,
        birthday: data.userInfo.birthday,
        gender: data.userInfo.gender
      }
    };
  }

  // Analyze user data quality for fraud detection
  static analyzeDataQuality(data: ZaloCombinedData): {
    score: number;       // 0-100 quality score
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
  } {
    const factors: string[] = [];
    let score = 100;

    // Check completeness
    if (!data.userInfo.avatar) {
      score -= 10;
      factors.push('No avatar provided');
    }

    if (!data.userInfo.birthday) {
      score -= 5;
      factors.push('No birth date provided');
    }

    // Check data consistency
    if (data.userInfo.gender === 0) {
      score -= 5;
      factors.push('Gender not specified');
    }

    // Check timing
    const timeDiff = Date.now() - data.timestamp;
    if (timeDiff > 120000) { // 2 minutes
      score -= 15;
      factors.push('Request timing suspicious');
    }

    // Check phone number patterns
    const phone = data.phoneInfo.phoneNumber;
    if (phone.includes('000') || phone.includes('111') || phone.includes('999')) {
      score -= 25;
      factors.push('Suspicious phone number pattern');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (score < 70) riskLevel = 'high';
    else if (score < 85) riskLevel = 'medium';

    return { score, riskLevel, factors };
  }
}

// Enhanced authentication service using Zalo data analysis
export class EnhancedZaloAuthService {
  static async performSecureAuthentication(): Promise<{
    success: boolean;
    data?: any;
    riskLevel?: 'low' | 'medium' | 'high';
    errors?: string[];
  }> {
    const errors: string[] = [];

    try {
      // Extract Zalo verification data
      const zaloData = await ZaloDataAnalyzer.extractZaloVerificationData();

      // Verify data consistency
      if (!ZaloDataAnalyzer.verifyDataConsistency(zaloData)) {
        errors.push('Data consistency check failed');
        return { success: false, errors };
      }

      // Analyze data quality
      const qualityAnalysis = ZaloDataAnalyzer.analyzeDataQuality(zaloData);

      if (qualityAnalysis.riskLevel === 'high') {
        errors.push(...qualityAnalysis.factors);
        return { success: false, riskLevel: 'high', errors };
      }

      // Prepare backend payload
      const payload = ZaloDataAnalyzer.extractBackendPayload(zaloData);

      // Send to backend with enhanced security
      const response = await this.sendToBackend(payload, qualityAnalysis.riskLevel);

      return {
        success: true,
        data: response,
        riskLevel: qualityAnalysis.riskLevel
      };

    } catch (error) {
      errors.push(`Authentication failed: ${error}`);
      return { success: false, errors };
    }
  }

  private static async sendToBackend(payload: any, riskLevel: 'low' | 'medium' | 'high'): Promise<any> {
    // Implementation for secure backend communication
    // This would integrate with the SecureSignatureAPI we created earlier
    console.log('Sending to backend:', { payload, riskLevel });

    // Placeholder - integrate with actual backend call
    return {
      user: {
        id: payload.zaloId,
        name: payload.userName,
        phone: payload.phoneNumber,
        riskLevel
      },
      token: 'jwt_token_placeholder'
    };
  }
}