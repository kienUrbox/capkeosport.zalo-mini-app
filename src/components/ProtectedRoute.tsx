import { Navigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { zaloThreeStepAuthService } from '../services/zalo-three-step-auth'

export interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check both old auth and new 3-step auth
  const isOldAuthAuthenticated = authService.isAuthenticated()
  const isNewStepAuthenticated = zaloThreeStepAuthService.isAuthenticated()

  const isAuthenticated = isOldAuthAuthenticated || isNewStepAuthenticated

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}