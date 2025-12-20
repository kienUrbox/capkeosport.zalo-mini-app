// Advanced signature verification for API security

export class SignatureManager {
  private static readonly SECRET_KEY = import.meta.env.VITE_CLIENT_SECRET || 'default_secret';
  private static readonly ALGORITHM = 'HS256';

  // Generate secure signature using HMAC-SHA256
  static async generateSecureSignature(payload: {
    phoneNumber: string;
    timestamp: number;
    action: string;
    nonce?: string;
  }): Promise<string> {
    const stringPayload = JSON.stringify(payload);

    // In browser, we'll use Web Crypto API
    if (typeof window !== 'undefined' && window.crypto) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(this.SECRET_KEY);
      const messageData = encoder.encode(stringPayload);

      const key = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await window.crypto.subtle.sign(
        'HMAC',
        key,
        messageData
      );

      // Convert to base64
      return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }

    // Fallback for older browsers
    return this.generateFallbackSignature(payload);
  }

  // Fallback signature method
  private static generateFallbackSignature(payload: any): string {
    const stringPayload = JSON.stringify(payload);
    let hash = 0;

    for (let i = 0; i < stringPayload.length; i++) {
      const char = stringPayload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return btoa(`${hash}:${payload.timestamp}`);
  }

  // Generate request payload with signature
  static async signRequest(requestData: {
    phoneNumber: string;
    zaloId?: string;
    action?: string;
  }): Promise<{
    phoneNumber: string;
    zaloId?: string;
    timestamp: number;
    signature: string;
    nonce: string;
    action: string;
    clientVersion: string;
    deviceInfo: string;
  }> {
    const timestamp = Date.now();
    const nonce = this.generateNonce();
    const action = requestData.action || 'auth_login';

    console.log('🔑 [SignatureManager] Creating signature for request:', {
      phoneNumber: requestData.phoneNumber,
      zaloId: requestData.zaloId,
      action,
      timestamp,
      nonce
    });

    const payload = {
      phoneNumber: requestData.phoneNumber,
      timestamp,
      action,
      nonce
    };

    console.log('📦 [SignatureManager] Payload for signature:', payload);

    const signature = await this.generateSecureSignature(payload);

    console.log('🔐 [SignatureManager] Generated signature:', {
      signatureLength: signature.length,
      signaturePrefix: signature.substring(0, 10) + '...'
    });

    const signedRequest = {
      phoneNumber: requestData.phoneNumber,
      zaloId: requestData.zaloId,
      timestamp,
      signature,
      nonce,
      action,
      clientVersion: '1.0.0',
      deviceInfo: this.getDeviceInfo()
    };

    console.log('📋 [SignatureManager] Complete signed request created:', {
      phoneNumber: signedRequest.phoneNumber,
      zaloId: signedRequest.zaloId,
      timestamp: signedRequest.timestamp,
      hasSignature: !!signedRequest.signature,
      nonce: signedRequest.nonce,
      action: signedRequest.action,
      clientVersion: signedRequest.clientVersion
    });

    return signedRequest;
  }

  // Verify signature response from server
  static async verifyServerSignature(response: {
    data: any;
    signature: string;
    timestamp: number;
  }): Promise<boolean> {
    const expectedPayload = {
      data: response.data,
      timestamp: response.timestamp
    };

    const expectedSignature = await this.generateSecureSignature(expectedPayload);
    return response.signature === expectedSignature;
  }

  // Generate cryptographically secure nonce
  private static generateNonce(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Fallback
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  // Get device fingerprinting info
  private static getDeviceInfo(): string {
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

  // Rate limiting with signature tracking
  static trackSignatureRequest(phoneNumber: string): boolean {
    const key = `signature_${phoneNumber}`;
    const now = Date.now();
    const windowMs = 300000; // 5 minutes
    const maxRequests = 3;

    console.log('🚦 [SignatureManager] Checking rate limit for phone:', phoneNumber);

    const requests = this.getTrackedRequests(key);
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);

    console.log('📊 [SignatureManager] Rate limit status:', {
      phoneNumber,
      currentRequests: validRequests.length,
      maxRequests,
      windowMs: `${windowMs / 60000} minutes`,
      requestsInWindow: validRequests.map(ts => new Date(ts).toISOString())
    });

    if (validRequests.length >= maxRequests) {
      console.error('❌ [SignatureManager] Rate limit exceeded for phone:', phoneNumber);
      return false; // Rate limited
    }

    validRequests.push(now);
    localStorage.setItem(key, JSON.stringify(validRequests));
    console.log('✅ [SignatureManager] Request tracked successfully');
    return true;
  }

  private static getTrackedRequests(key: string): number[] {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // Clean up old tracking data
  static cleanupTracking(): void {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    const maxAge = 3600000; // 1 hour

    keys.forEach(key => {
      if (key.startsWith('signature_')) {
        const requests = this.getTrackedRequests(key);
        const validRequests = requests.filter(timestamp => now - timestamp < maxAge);

        if (validRequests.length === 0) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(validRequests));
        }
      }
    });
  }
}

// Enhanced API wrapper with signature verification
export class SecureSignatureAPI {
  private static baseURL = import.meta.env.VITE_API_BASE_URL || 'https://capkeosportnestjs-production.up.railway.app/api/v1';

  static async makeSecureRequest(endpoint: string, requestData: {
    phoneNumber: string;
    zaloId?: string;
    action?: string;
  }): Promise<Response> {
    // Log environment configuration
    console.log('🌍 [SecureSignatureAPI] Environment check:', {
      hasViteAPIBaseURL: !!import.meta.env.VITE_API_BASE_URL,
      baseURL: this.baseURL,
      endpoint,
      fullURL: this.baseURL ? `${this.baseURL}${endpoint}` : 'NO_BASE_URL_CONFIGURED'
    });

    if (!this.baseURL) {
      console.error('❌ [SecureSignatureAPI] VITE_API_BASE_URL is not configured!');
      throw new Error('API base URL not configured. Please check environment variables.');
    }

    try {
      console.log('🔐 [SecureSignatureAPI] Starting secure request...');
      console.log('📋 [SecureSignatureAPI] Request data:', {
        endpoint,
        phoneNumber: typeof requestData.phoneNumber === 'string' ? requestData.phoneNumber : '[Invalid Phone Type]',
        zaloId: requestData.zaloId,
        action: requestData.action,
        baseURL: this.baseURL
      });

      // Rate limiting check with signature tracking
      console.log('🚦 [SecureSignatureAPI] Checking rate limits...');
      const phoneNumber = typeof requestData.phoneNumber === 'string' ? requestData.phoneNumber : '[Invalid Phone Type]';
      if (!SignatureManager.trackSignatureRequest(phoneNumber)) {
        console.error('❌ [SecureSignatureAPI] Rate limit exceeded for phone:', phoneNumber);
        throw new Error('Too many authentication requests. Please try again later.');
      }
      console.log('✅ [SecureSignatureAPI] Rate limit check passed');

      // Generate signed request
      console.log('📝 [SecureSignatureAPI] Generating signature...');
      const signedRequest = await SignatureManager.signRequest(requestData);
      console.log('📜 [SecureSignatureAPI] Signed request created:', {
        hasSignature: !!signedRequest.signature,
        signatureLength: signedRequest.signature?.length,
        timestamp: signedRequest.timestamp,
        nonce: signedRequest.nonce,
        action: signedRequest.action
      });

      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log('🌐 [SecureSignatureAPI] Making request to:', fullUrl);
      console.log('📤 [SecureSignatureAPI] Request body preview:', {
        phoneNumber: signedRequest.phoneNumber,
        zaloId: signedRequest.zaloId,
        timestamp: signedRequest.timestamp,
        action: signedRequest.action,
        clientVersion: signedRequest.clientVersion,
        deviceInfoLength: signedRequest.deviceInfo?.length
      });

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signedRequest.signature,
          'X-Timestamp': signedRequest.timestamp.toString(),
          'X-Nonce': signedRequest.nonce,
          'X-Client-Version': signedRequest.clientVersion,
          'X-Device-Info': signedRequest.deviceInfo
        },
        body: JSON.stringify(signedRequest)
      });

      console.log('📡 [SecureSignatureAPI] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: {
          contentType: response.headers.get('content-type'),
          serverSignature: response.headers.get('X-Server-Signature') ? 'Present' : 'Not present',
          serverTimestamp: response.headers.get('X-Server-Timestamp')
        }
      });

      // Verify server response signature if present
      const serverSignature = response.headers.get('X-Server-Signature');
      const serverTimestamp = response.headers.get('X-Server-Timestamp');

      if (serverSignature && serverTimestamp) {
        console.log('🔒 [SecureSignatureAPI] Verifying server signature...');
        const responseData = await response.clone().json();
        const isValidSignature = await SignatureManager.verifyServerSignature({
          data: responseData,
          signature: serverSignature,
          timestamp: parseInt(serverTimestamp)
        });

        if (!isValidSignature) {
          console.warn('⚠️ [SecureSignatureAPI] Invalid server signature detected');
          // Continue but log warning
        } else {
          console.log('✅ [SecureSignatureAPI] Server signature verified successfully');
        }
      } else {
        console.log('ℹ️ [SecureSignatureAPI] No server signature to verify');
      }

      // Log response body for debugging
      if (!response.ok) {
        const errorText = await response.clone().text();
        console.error('❌ [SecureSignatureAPI] Error response body:', errorText);
      }

      return response;
    } catch (error) {
      console.error('💥 [SecureSignatureAPI] Secure request failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint,
        requestData
      });
      throw error;
    }
  }

  // Cleanup old tracking data periodically
  static initCleanup(): void {
    setInterval(() => {
      SignatureManager.cleanupTracking();
    }, 300000); // Every 5 minutes
  }
}