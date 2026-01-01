import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zaloThreeStepAuthService } from '../../services/zalo-three-step-auth'
import { AuthService } from '../../services/api/services'

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
        console.log('✅ Login successful!', authResult.user)
        console.log('🔍 Checking AuthService after login...')
        console.log('- isAuthenticated:', AuthService.isAuthenticated())
        console.log('- getUser:', AuthService.getUser())
        console.log('- getAccessToken:', AuthService.getAccessToken() ? 'EXISTS' : 'MISSING')

        // Redirect to home directly (no login success screen)
        navigate('/home')
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

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '30px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px',
      color: '#333',
    },
    subtitle: {
      fontSize: '14px',
      textAlign: 'center',
      color: '#666',
      marginBottom: '25px',
    },
    infoBox: {
      backgroundColor: '#f0f7ff',
      border: '1px solid #d0e1ff',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '20px',
    },
    infoText: {
      fontSize: '13px',
      color: '#0066cc',
      lineHeight: '1.5',
      textAlign: 'center',
    },
    errorBox: {
      backgroundColor: '#fff0f0',
      border: '1px solid #ffd0d0',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '20px',
    },
    errorText: {
      fontSize: '13px',
      color: '#cc0000',
      textAlign: 'center',
    },
    button: {
      width: '100%',
      backgroundColor: isLoading ? '#999' : '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '15px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
    },
    footerText: {
      fontSize: '11px',
      textAlign: 'center',
      color: '#999',
      marginTop: '15px',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Chào mừng!</h1>
        <p style={styles.subtitle}>Kết nối với tài khoản Zalo của bạn</p>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Để bắt đầu sử dụng SportHub, vui lòng cho phép truy cập thông tin Zalo của bạn.
          </p>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            🔒 Bảo mật: Chúng tôi sử dụng phương thức xác thực 3 bước an toàn của Zalo.
          </p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>⚠️ {error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Zalo'}
        </button>

        <p style={styles.footerText}>
          Bằng việc nhấn nút trên, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.
        </p>
      </div>
    </div>
  )
}

export default LoginScreen
