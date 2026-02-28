import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { zaloThreeStepAuthService } from '@/services/zalo-three-step-auth'
import { launchingService } from '@/services/launching.service'
import { FONT_SIZES } from '@/constants/design'

const LoginScreen = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load fonts on mount to ensure Material Icons are ready
  useEffect(() => {
    launchingService.loadFonts().catch((err) => {
      console.warn('Font loading failed:', err)
    })
  }, [])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Starting Zalo 3-Step authentication...')

      const authResult = await zaloThreeStepAuthService.authenticateWithThreeSteps()

      if (authResult.success) {
        // Navigate directly to dashboard with replace to avoid back button loop
        navigate('/', { replace: true })
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
    <div className="relative min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {/* Subtle gradient accent at top */}
      <div
        className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 0.5px, transparent 0)`,
          backgroundSize: '24px 24px',
          color: 'rgba(59, 130, 246, 0.1)'
        }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          {/* Logo with glow */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-primary rounded-2xl shadow-xl animate-pulse-slow"
            aria-hidden="true"
          >
            <span className="material-icons text-white text-4xl animate-icon-bounce">
              sports_soccer
            </span>
          </div>

          {/* App Name - h1 for SEO */}
          <h1 className={`${FONT_SIZES['3xl']} font-extrabold text-slate-900 dark:text-white mb-2`}>
            Cáp Kèo Sport
          </h1>

          {/* Subtitle */}
          <p className={`${FONT_SIZES.base} text-gray-600 dark:text-gray-400`}>
            Kết nối đam mê thể thao
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[380px] bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-6 animate-slide-up">
          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className={`${FONT_SIZES.xl} font-bold text-slate-900 dark:text-white mb-2`}>
              <span aria-hidden="true">⚽</span>
              <span className="sr-only">Bóng đá</span>
              Chào mừng!
            </h2>
            <p className={`${FONT_SIZES.base} text-gray-600 dark:text-gray-400`}>
              Tham gia cộng đồng đá bóng
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center" role="list" aria-label="Tính năng chính">
            {[
              { icon: 'flash_on', label: 'Tìm kèo cực nhanh' },
              { icon: 'groups', label: 'Quản lý đội bóng' },
              { icon: 'emoji_events', label: 'Lưu giữ kỷ niệm' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full"
                role="listitem"
              >
                <span className="material-icons text-primary text-sm" aria-hidden="true">
                  {feature.icon}
                </span>
                <span className={`${FONT_SIZES.caption} font-medium text-gray-700 dark:text-gray-300`}>
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* Error Message - with aria-live */}
          {error && (
            <div
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-bounce-in"
              role="alert"
              aria-live="polite"
            >
              <p className={`${FONT_SIZES.small} text-red-600 dark:text-red-400 text-center`}>
                <span aria-hidden="true">⚠️</span>
                <span className="sr-only">Lỗi:</span>
                {error}
              </p>
            </div>
          )}

          {/* Zalo Login Button - with accessibility */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            aria-describedby="login-info"
            aria-busy={isLoading}
            className="group relative w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-[#0068FF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#004599] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              aria-hidden="true"
            />

            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                <span className={`${FONT_SIZES.base} font-semibold`}>
                  Đang đăng nhập...
                  <span className="sr-only">vui lòng chờ</span>
                </span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2.59-11.41L12 10l-2.59 1.41L8 11l2.59-1.41L12 8l1.41 1.59L16 11l-2.59 1.41L12 14l-1.41-1.59L8 13l2.59-1.41L12 10z"/>
                </svg>
                <span className={`${FONT_SIZES.base} font-semibold`}>
                  Đăng nhập bằng Zalo
                </span>
              </>
            )}
          </button>

          {/* Info Box - with id for aria-describedby */}
          <div
            id="login-info"
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl"
          >
            <p className={`${FONT_SIZES.caption} text-blue-600 dark:text-blue-400 text-center leading-relaxed`}>
              <span aria-hidden="true">📱</span>
              Dùng Zalo để đăng nhập, tạo đội, tìm kèo và liên lạc với đối thủ
            </p>
          </div>

          {/* Terms - with proper links */}
          <p className={`${FONT_SIZES.caption} text-gray-400 text-center mt-4`}>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <a
              href="#"
              className="text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 rounded"
              aria-label="Xem điều khoản sử dụng"
            >
              Điều khoản
            </a>{' '}
            &{' '}
            <a
              href="#"
              className="text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 rounded"
              aria-label="Xem chính sách bảo mật"
            >
              Chính sách bảo mật
            </a>
          </p>
        </div>

        {/* Feature Cards - Below */}
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-[380px] w-full" role="list" aria-label="Tính năng nổi bật">
          {[
            { icon: 'flash_on', title: 'Tìm kèo cực nhanh', desc: 'Ghép đối thủ trong vài giây' },
            { icon: 'groups', title: 'Quản lý đội bóng', desc: 'Điểm danh, thu quỹ dễ dàng' },
            { icon: 'emoji_events', title: 'Lưu giữ kỷ niệm', desc: 'Xây dựng profile thành tích' },
          ].map((feature) => (
            <article
              key={feature.title}
              className="text-center p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700"
              role="listitem"
            >
              <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
                <span className="material-icons text-primary">
                  {feature.icon}
                </span>
              </div>
              <p className={`${FONT_SIZES.caption} text-slate-900 dark:text-white font-medium mb-0.5`}>
                {feature.title}
              </p>
              <p className={`${FONT_SIZES.caption} text-gray-500 dark:text-gray-400 leading-tight`}>
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default LoginScreen
