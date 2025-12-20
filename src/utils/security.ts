// Security utilities for client-side protection

export class SecurityValidator {
  // Validate phone number format
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  // Rate limiting in localStorage
  static checkRateLimit(action: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const now = Date.now();
    const attempts = this.getAttempts(action);

    // Filter out old attempts
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }

    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(`${action}_attempts`, JSON.stringify(validAttempts));
    return true;
  }

  private static getAttempts(action: string): number[] {
    const stored = localStorage.getItem(`${action}_attempts`);
    return stored ? JSON.parse(stored) : [];
  }

  // Sanitize input data
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // Generate request signature (optional enhancement)
  static generateSignature(phone: string, timestamp: number): string {
    // Simple hash - in production, use HMAC with secret key
    return btoa(`${phone}:${timestamp}`);
  }
}

// API wrapper with security
export class SecureAPI {
  private static baseURL = import.meta.env.VITE_API_BASE_URL;

  static async secureRequest(endpoint: string, data: any): Promise<Response> {
    // Rate limiting check
    if (!SecurityValidator.checkRateLimit('auth_request', 3, 300000)) {
      throw new Error('Too many requests. Please try again later.');
    }

    // Validate input
    if (data.phoneNumber && !SecurityValidator.validatePhoneNumber(data.phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    // Add timestamp for replay protection
    const timestamp = Date.now();
    const signature = SecurityValidator.generateSignature(data.phoneNumber || '', timestamp);

    const requestData = {
      ...data,
      timestamp,
      signature,
      clientVersion: '1.0.0' // Version tracking
    };

    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': '1.0.0',
        'X-Request-Timestamp': timestamp.toString()
      },
      body: JSON.stringify(requestData)
    });
  }
}