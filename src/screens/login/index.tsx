import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ScreenWrapper, Typography } from '../../components/common'
import { PrimaryButton, LoadingSpinner } from '../../components/ui'
import { zaloThreeStepAuthService } from '../../services/zalo-three-step-auth'

const LoginScreen = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Starting Zalo 3-Step authentication...')

      // Call Zalo 3-Step authentication
      const authResult = await zaloThreeStepAuthService.authenticateWithThreeSteps()

      if (authResult.success) {
        console.log('Login successful!', authResult.user)
        // Navigate to login success screen or directly to home
        navigate('/login/success')
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
    <ScreenWrapper title="Đăng nhập" subtitle="Kết nối với tài khoản Zalo của bạn">
      <div className="flex flex-1 flex-col justify-between gap-8 py-4">
        <div className="space-y-6">
          <div className="rounded-3xl bg-card p-6 text-center">
            <Typography variant="heading" className="mb-4">
              Chào mừng đến với Capkeo Sport!
            </Typography>
            <Typography variant="body" className="text-muted">
              Để bắt đầu tìm trận đấu và kết nối với các đội bóng khác,
              vui lòng cho phép truy cập thông tin Zalo của bạn.
            </Typography>
          </div>

          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
            <Typography variant="body" className="text-blue-800 text-sm">
              🔒 Bảo mật: Chúng tôi sử dụng phương pháp xác thực 3 bước an toàn
              của Zalo và không chia sẻ thông tin của bạn với bên thứ ba.
            </Typography>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
              <Typography variant="body" className="text-red-800 text-sm">
                ⚠️ {error}
              </Typography>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <PrimaryButton
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              'Đăng nhập với Zalo'
            )}
          </PrimaryButton>

          {!isLoading && (
            <Typography variant="body" className="text-center text-muted text-xs">
              Bằng việc nhấn nút trên, bạn đồng ý với Điều khoản sử dụng
              và Chính sách bảo mật của chúng tôi.
            </Typography>
          )}
        </div>
      </div>
    </ScreenWrapper>
  )
}

export default LoginScreen