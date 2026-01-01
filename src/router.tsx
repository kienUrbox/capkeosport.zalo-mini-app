import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'

// Screens
import LoginScreen from './screens/login'
import HomeScreen from './screens/home'

// Simple 404 component
const NotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
      404
    </h1>
    <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
      Trang không tồn tại
    </p>
    <Navigate to="/login" replace />
  </div>
)

export const router = createBrowserRouter([
  // Default redirect to login
  { path: '/', element: <Navigate to="/login" replace /> },

  // Public routes
  { path: '/login', element: <LoginScreen /> },

  // Protected routes (require authentication)
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomeScreen />
      </ProtectedRoute>
    ),
  },

  // 404 fallback
  { path: '*', element: <NotFound /> },
])
