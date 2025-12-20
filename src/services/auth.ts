import zmp from 'zmp-sdk'
import { SecurityValidator } from '../utils/security'

export interface AuthResponse {
  success: boolean
  data?: {
    user: {
      id: string
      name: string
      phone: string
      avatar?: string
      level?: string
    }
    token: string
    refreshToken?: string
  }
  message?: string
}

export interface LoginRequest {
  phoneNumber: string
  zaloId?: string
}

class AuthService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://capkeosportnestjs-production.up.railway.app/api/v1'

  constructor() {
    // Constructor
  }

  // Request phone number permission from Zalo
  async requestPhoneNumber(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getPhoneNumber) {
        console.warn('⚠️ Zalo getPhoneNumber not available');
        reject(new Error('Zalo phone number not available'));
        return;
      }

      zmp.getPhoneNumber({
        success: (res) => {
          if (res.number) {
            console.log('Phone number retrieved:', res.number)
            resolve(res.number)
          } else {
            reject(new Error('Phone number not available in response'));
          }
        },
        fail: (err) => {
          console.error('Error getting phone number:', err)
          reject(new Error('User denied phone number access'))
        }
      })
    })
  }

  // Get Zalo user info (optional, for additional data)
  async getZaloUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getUserInfo) {
        console.warn('⚠️ Zalo getUserInfo not available');
        resolve(null); // Optional - don't fail if user info unavailable
        return;
      }

      zmp.getUserInfo({
        success: (res) => {
          console.log('Zalo user info:', res)
          resolve(res)
        },
        fail: (err) => {
          console.error('Error getting Zalo user info:', err)
          resolve(null) // Optional - don't fail if user info unavailable
        }
      })
    })
  }

  // Authenticate with backend using phone number (secure version)
  async authenticateWithPhone(phoneNumber: string): Promise<AuthResponse> {
    try {
      // Sanitize and validate phone number
      const sanitizedPhone = SecurityValidator.sanitizeInput(phoneNumber);
      if (!SecurityValidator.validatePhoneNumber(sanitizedPhone)) {
        throw new Error('Invalid phone number format');
      }

      // Get Zalo user info for additional context
      let zaloInfo
      try {
        zaloInfo = await this.getZaloUserInfo()
      } catch (error) {
        console.log('Could not get Zalo user info, proceeding with phone only')
      }

      const loginData: LoginRequest = {
        phoneNumber: sanitizedPhone,
        zaloId: zaloInfo?.id
      }

      // Simple API call without signature
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: sanitizedPhone,
          zaloId: zaloInfo?.id,
          action: 'user_login'
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        }
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Complete login flow
  async loginWithZaloPhone(): Promise<AuthResponse> {
    try {
      // Step 1: Request phone number permission
      const phoneNumber = await this.requestPhoneNumber()

      // Step 2: Authenticate with backend
      const authResult = await this.authenticateWithPhone(phoneNumber)

      // Step 3: Store tokens locally
      if (authResult.success && authResult.data?.token) {
        localStorage.setItem('access_token', authResult.data.token)
        if (authResult.data.refreshToken) {
          localStorage.setItem('refresh_token', authResult.data.refreshToken)
        }
        localStorage.setItem('user_info', JSON.stringify(authResult.data.user))
      }

      return authResult
    } catch (error) {
      console.error('Login flow error:', error)
      throw error
    }
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token')
    return !!token
  }

  // Get stored user info
  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  }

  // Logout
  logout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
  }

  // Get current access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }
}

export const authService = new AuthService()