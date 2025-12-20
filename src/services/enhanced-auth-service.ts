import zmp from 'zmp-sdk'
import { ZaloDataAnalyzer, EnhancedZaloAuthService } from '../utils/zalo-data-analyzer'
import { SecureSignatureAPI } from '../utils/signature'

export interface EnhancedAuthResponse {
  success: boolean
  data?: {
    user: {
      id: string
      zaloId: string
      name: string
      phone: string
      avatar?: string
      level?: string
      birthday?: string
      gender?: number
    }
    token: string
    refreshToken?: string
    riskLevel: 'low' | 'medium' | 'high'
  }
  message?: string
  riskLevel?: 'low' | 'medium' | 'high'
  warnings?: string[]
}

class EnhancedAuthService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://capkeosportnestjs-production.up.railway.app/api/v1'

  constructor() {
    SecureSignatureAPI.initCleanup()
  }

  // Enhanced authentication using Zalo's native verification data
  async performEnhancedZaloAuthentication(): Promise<EnhancedAuthResponse> {
    try {
      console.log('🔐 Starting enhanced Zalo authentication...')

      // Step 1: Extract comprehensive Zalo data
      const zaloVerificationData = await ZaloDataAnalyzer.extractZaloVerificationData()

      console.log('📱 Zalo data extracted:', {
        zaloId: zaloVerificationData.userInfo.id,
        phone: zaloVerificationData.phoneInfo.phoneNumber,
        hasAvatar: !!zaloVerificationData.userInfo.avatar,
        hasBirthday: !!zaloVerificationData.userInfo.birthday
      })

      // Step 2: Analyze data quality for fraud detection
      const qualityAnalysis = ZaloDataAnalyzer.analyzeDataQuality(zaloVerificationData)

      console.log('🛡️ Data quality analysis:', qualityAnalysis)

      if (qualityAnalysis.riskLevel === 'high') {
        const warnings = [
          'High-risk authentication detected',
          ...qualityAnalysis.factors
        ]

        return {
          success: false,
          message: 'Authentication risk too high',
          riskLevel: 'high',
          warnings
        }
      }

      // Step 3: Create verification payload with Zalo's native data
      const verificationPayload = ZaloDataAnalyzer.extractBackendPayload(zaloVerificationData)

      console.log('🔐 Creating verification payload with Zalo native data')

      // Step 4: Send to backend with Zalo verification
      const authResult = await this.authenticateWithZaloData(verificationPayload, qualityAnalysis.riskLevel)

      return {
        success: true,
        data: {
          user: {
            id: authResult.user.id,
            zaloId: verificationPayload.zaloId,
            name: authResult.user.name,
            phone: verificationPayload.phoneNumber,
            avatar: verificationPayload.additionalData.avatar,
            level: authResult.user.level,
            birthday: verificationPayload.additionalData.birthday,
            gender: verificationPayload.additionalData.gender
          },
          token: authResult.token,
          refreshToken: authResult.refreshToken,
          riskLevel: qualityAnalysis.riskLevel
        },
        riskLevel: qualityAnalysis.riskLevel,
        warnings: qualityAnalysis.riskLevel === 'medium' ? qualityAnalysis.factors : undefined
      }

    } catch (error) {
      console.error('❌ Enhanced authentication failed:', error)

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed',
        riskLevel: 'high',
        warnings: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  // Authentication using comprehensive Zalo data
  private async authenticateWithZaloData(
    zaloPayload: any,
    riskLevel: 'low' | 'medium' | 'high'
  ): Promise<any> {
    try {
      // Create enhanced request payload with Zalo's verification data
      const enhancedPayload = {
        // Core authentication data
        zaloId: zaloPayload.zaloId,              // Zalo's verified user ID
        phoneNumber: zaloPayload.phoneNumber,     // Zalo's verified phone
        userName: zaloPayload.userName,           // Zalo display name

        // Enhanced verification data
        verificationHash: zaloPayload.verificationHash,
        deviceFingerprint: zaloPayload.deviceFingerprint,
        sessionId: zaloPayload.sessionId,
        timestamp: zaloPayload.timestamp,

        // Additional user data from Zalo
        zaloProfile: {
          avatar: zaloPayload.additionalData.avatar,
          birthday: zaloPayload.additionalData.birthday,
          gender: zaloPayload.additionalData.gender
        },

        // Risk assessment
        clientRiskLevel: riskLevel,

        // Request metadata
        requestType: 'zalo_enhanced_auth',
        clientVersion: '1.0.0',
        platform: 'zalo_mini_app'
      }

      console.log('📤 Sending enhanced authentication to backend:', {
        zaloId: enhancedPayload.zaloId,
        phone: enhancedPayload.phoneNumber,
        riskLevel: enhancedPayload.clientRiskLevel,
        hasAvatar: !!enhancedPayload.zaloProfile.avatar
      })

      // Send to backend with signature verification
      const response = await SecureSignatureAPI.makeSecureRequest('/auth/zalo-enhanced-login', {
        ...enhancedPayload,
        action: 'zalo_native_verification'
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many authentication attempts. Please try again later.')
        }

        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Authentication failed: ${response.status}`)
      }

      const result = await response.json()

      console.log('✅ Backend authentication successful:', {
        userId: result.user?.id,
        isNewUser: result.isNewUser,
        riskLevel: result.riskLevel
      })

      return result

    } catch (error) {
      console.error('❌ Backend authentication failed:', error)
      throw error
    }
  }

  // Legacy authentication method (fallback)
  async loginWithZaloPhoneLegacy(): Promise<EnhancedAuthResponse> {
    try {
      console.log('🔄 Using legacy authentication method...')

      // Get phone number only
      const phoneNumber = await this.getPhoneNumberLegacy()

      // Get basic user info
      const zaloInfo = await this.getZaloUserInfoLegacy()

      const response = await SecureSignatureAPI.makeSecureRequest('/auth/login', {
        phoneNumber: phoneNumber,
        zaloId: zaloInfo?.userInfo?.id,
        action: 'legacy_login'
      })

      if (!response.ok) {
        throw new Error(`Legacy authentication failed: ${response.status}`)
      }

      const result = await response.json()

      return {
        success: true,
        data: {
          user: {
            id: result.user?.id,
            zaloId: zaloInfo?.userInfo?.id || '',
            name: result.user?.name || zaloInfo?.userInfo?.name || '',
            phone: phoneNumber,
            level: result.user?.level
          },
          token: result.token,
          refreshToken: result.refreshToken,
          riskLevel: 'medium' // Legacy methods are medium risk
        },
        riskLevel: 'medium',
        warnings: ['Using legacy authentication method']
      }

    } catch (error) {
      console.error('❌ Legacy authentication failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Legacy authentication failed',
        riskLevel: 'high'
      }
    }
  }

  // Legacy methods for backward compatibility
  private async getPhoneNumberLegacy(): Promise<string> {
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
      })
    })
  }

  private async getZaloUserInfoLegacy(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof zmp === 'undefined' || !zmp.getUserInfo) {
        console.warn('⚠️ Zalo getUserInfo not available');
        resolve(null); // Optional - don't fail if user info unavailable
        return;
      }

      zmp.getUserInfo({
        success: (res) => resolve(res),
        fail: (err) => resolve(null) // Optional - don't fail if user info unavailable
      })
    })
  }

  // Main login method that tries enhanced first, falls back to legacy
  async loginWithZaloPhone(): Promise<EnhancedAuthResponse> {
    try {
      console.log('🚀 Starting Zalo authentication process...')

      // Try enhanced authentication first
      const enhancedResult = await this.performEnhancedZaloAuthentication()

      if (enhancedResult.success) {
        console.log('✅ Enhanced authentication successful')

        // Store authentication data
        if (enhancedResult.data?.token) {
          localStorage.setItem('access_token', enhancedResult.data.token)
          if (enhancedResult.data.refreshToken) {
            localStorage.setItem('refresh_token', enhancedResult.data.refreshToken)
          }
          localStorage.setItem('user_info', JSON.stringify(enhancedResult.data.user))
          localStorage.setItem('auth_risk_level', enhancedResult.riskLevel || 'low')
        }

        return enhancedResult
      }

      // If enhanced fails due to API issues, try legacy
      if (enhancedResult.warnings?.some(w => w.includes('API') || w.includes('network'))) {
        console.log('⚠️ Enhanced auth failed, trying legacy method...')
        return await this.loginWithZaloPhoneLegacy()
      }

      // Enhanced failed for security reasons
      return enhancedResult

    } catch (error) {
      console.error('❌ All authentication methods failed:', error)

      // Last resort - try legacy
      try {
        return await this.loginWithZaloPhoneLegacy()
      } catch (legacyError) {
        return {
          success: false,
          message: 'All authentication methods failed',
          riskLevel: 'high',
          warnings: [
            error instanceof Error ? error.message : 'Enhanced auth failed',
            legacyError instanceof Error ? legacyError.message : 'Legacy auth failed'
          ]
        }
      }
    }
  }

  // Check authentication with risk level consideration
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token')
    const riskLevel = localStorage.getItem('auth_risk_level')

    // High risk sessions require additional verification
    if (riskLevel === 'high') {
      const sessionTime = localStorage.getItem('auth_timestamp')
      if (!sessionTime) return false

      const sessionAge = Date.now() - parseInt(sessionTime)
      const maxSessionTime = 30 * 60 * 1000 // 30 minutes for high risk

      if (sessionAge > maxSessionTime) {
        this.logout()
        return false
      }
    }

    return !!token
  }

  // Get user info with risk assessment
  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info')
    const riskLevel = localStorage.getItem('auth_risk_level')

    if (!userInfo) return null

    const user = JSON.parse(userInfo)
    return {
      ...user,
      authRiskLevel: riskLevel || 'unknown',
      lastAuth: localStorage.getItem('auth_timestamp')
    }
  }

  // Enhanced logout with cleanup
  logout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('auth_risk_level')
    localStorage.removeItem('auth_timestamp')

    // Clean up signature tracking
    SignatureManager.cleanupTracking()
  }

  // Get current access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }

  // Get authentication risk level
  getAuthRiskLevel(): 'low' | 'medium' | 'high' | 'unknown' {
    return (localStorage.getItem('auth_risk_level') as any) || 'unknown'
  }

  // Check if re-authentication is needed
  needsReauthentication(): boolean {
    const riskLevel = this.getAuthRiskLevel()
    const sessionTime = localStorage.getItem('auth_timestamp')

    if (!sessionTime) return true

    const sessionAge = Date.now() - parseInt(sessionTime)

    // Different timeout based on risk level
    const timeouts = {
      high: 30 * 60 * 1000,     // 30 minutes
      medium: 2 * 60 * 60 * 1000, // 2 hours
      low: 24 * 60 * 60 * 1000   // 24 hours
    }

    return sessionAge > (timeouts[riskLevel] || timeouts.medium)
  }
}

export const enhancedAuthService = new EnhancedAuthService()