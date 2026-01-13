import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { zaloThreeStepAuthService } from '@/services/zalo-three-step-auth'
import { useAuthStore, hasValidAuth } from '@/stores/auth.store'

export interface ProtectedRouteProps {
  children: React.ReactNode
}

type AuthState = 'checking' | 'authenticated' | 'need_login'

const LoadingSpinner = () => (
  <div style={{
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  }} />
)

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  textCenter: {
    textAlign: 'center',
  },
  loadingText: {
    marginTop: '16px',
    color: '#666',
    fontSize: '14px',
  },
}

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-spinner]')) {
  styleSheet.setAttribute('data-spinner', 'true');
  document.head.appendChild(styleSheet);
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [authState, setAuthState] = useState<AuthState>('checking')

  useEffect(() => {
    checkAndAttemptAuth()
  }, [])

  const checkAndAttemptAuth = async () => {
    console.log('🔒 ProtectedRoute: Checking authentication state...')

    try {
      // Use auth store to check auth method and status
      const authStore = useAuthStore.getState()
      const authMethod = authStore.metadata.authMethod
      console.log('- Auth method:', authMethod)

      let isAuthenticated = false

      if (authMethod === 'zalo_three_step') {
        isAuthenticated = zaloThreeStepAuthService.isAuthenticated()
        console.log('- Current auth valid:', isAuthenticated)

        if (!isAuthenticated) {
          console.log('- Attempting silent authentication...')
          const silentAuthResult = await zaloThreeStepAuthService.attemptSilentAuth()

          if (silentAuthResult.success) {
            console.log('✅ Silent authentication successful')
            isAuthenticated = true
          } else {
            console.log('❌ Silent authentication failed:', silentAuthResult.message)
          }
        }
      } else {
        // Use hasValidAuth helper for general auth check
        isAuthenticated = hasValidAuth()
        console.log('- General auth valid:', isAuthenticated)
      }

      if (isAuthenticated) {
        console.log('✅ User is authenticated')
        setAuthState('authenticated')
      } else {
        console.log('❌ User not authenticated, redirecting to login')
        setAuthState('need_login')
      }
    } catch (error) {
      console.error('❌ Error in authentication check:', error)
      setAuthState('need_login')
    }
  }

  if (authState === 'checking') {
    return (
      <div style={styles.container}>
        <div style={styles.textCenter}>
          <LoadingSpinner />
          <p style={styles.loadingText}>Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  if (authState === 'need_login') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
