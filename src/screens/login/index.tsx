import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zaloThreeStepAuthService } from '@/services/zalo-three-step-auth'
import { PADDING, FONT_SIZES, SPACE_Y, BORDER_RADIUS } from '@/constants/design'

const LoginScreen = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Starting Zalo 3-Step authentication...')

      const authResult = await zaloThreeStepAuthService.authenticateWithThreeSteps()

      if (authResult.success) {
        // Redirect to dashboard directly (bypass onboarding)
        navigate('/dashboard')
      } else {
        throw new Error(authResult.error || authResult.message || 'Authentication failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Không thể đăng nhập. Vui lòng thử lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-background-light dark:bg-background-dark">
      <div className={`bg-white dark:bg-surface-dark ${BORDER_RADIUS.lg} ${PADDING.lg} w-full max-w-[400px] shadow-lg ${SPACE_Y.lg}`}>
        <h1 className={`font-bold text-center mb-2.5 text-slate-900 dark:text-white ${FONT_SIZES.xl}`}>
          Chào mừng!
        </h1>
        <p className={`text-center text-gray-600 dark:text-gray-400 ${FONT_SIZES.small}`}>
          Kết nối với tài khoản Zalo của bạn
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className={`text-blue-600 dark:text-blue-400 leading-relaxed text-center ${FONT_SIZES.caption}`}>
            Để bắt đầu sử dụng SportHub, vui lòng cho phép truy cập thông tin Zalo của bạn.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className={`text-blue-600 dark:text-blue-400 leading-relaxed text-center ${FONT_SIZES.caption}`}>
            🔒 Bảo mật: Chúng tôi sử dụng phương thức xác thực 3 bước an toàn của Zalo.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className={`text-red-600 dark:text-red-400 text-center ${FONT_SIZES.caption}`}>
              ⚠️ {error}
            </p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full ${BORDER_RADIUS.md} py-4 ${FONT_SIZES.base} font-semibold text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#0066cc]'
          }`}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Zalo'}
        </button>

        <p className={`text-center text-gray-500 dark:text-gray-400 ${FONT_SIZES.caption}`}>
          Bằng việc nhấn nút trên, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.
        </p>
      </div>
    </div>
  )
}

export default LoginScreen
