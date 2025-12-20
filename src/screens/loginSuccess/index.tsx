import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { ScreenWrapper, Typography } from '../../components/common'
import { PrimaryButton } from '../../components/ui'
import { authService } from '../../services/auth'

const LoginSuccessScreen = () => {
  const navigate = useNavigate()
  const userInfo = authService.getUserInfo()

  useEffect(() => {
    // If no user info, redirect back to login
    if (!userInfo) {
      navigate('/login')
    }
  }, [userInfo, navigate])

  if (!userInfo) {
    return null
  }

  return (
    <ScreenWrapper title="Đăng nhập thành công" subtitle="Chào mừng đến với Capkeo Sport">
      <div className="flex flex-1 flex-col justify-between gap-8 py-4">
        <div className="rounded-3xl bg-card p-6 text-center">
          <Typography variant="heading">Xin chào, {userInfo.name}!</Typography>
          <Typography variant="body" className="mt-3 text-muted">
            Tài khoản của bạn đã được kết nối thành công.
            Cùng khám phá các trận đấu và kết nối với các đội bóng khác ngay thôi!
          </Typography>

          {userInfo.level && (
            <div className="mt-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              Level: {userInfo.level}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <PrimaryButton onClick={() => navigate('/home')}>
            Bắt đầu ngay
          </PrimaryButton>

          <div className="text-center">
            <button
              onClick={() => navigate('/team/create')}
              className="text-blue-600 text-sm hover:underline"
            >
              Hoặc tạo đội bóng mới
            </button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}

export default LoginSuccessScreen

