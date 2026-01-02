import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './contexts/ThemeContext'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-2">Đã có lỗi xảy ra</h1>
          <p className="text-gray-400 mb-4">
            {this.state.error?.message || 'Unexpected application error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Tải lại trang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * FontLoader - Waits for Material Icons font to load before rendering children
 */
const FontLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // Check if document.fonts API is available
    if ('fonts' in document) {
      const loadFonts = async () => {
        try {
          await document.fonts.load('24px Material Icons')
          await document.fonts.load('24px Material Symbols Outlined')
          setFontsLoaded(true)
          document.body.classList.add('material-icons-loaded')
        } catch (err) {
          console.warn('Font loading failed:', err)
          setFontsLoaded(true)
          document.body.classList.add('material-icons-loaded')
        }
      }
      loadFonts()
    } else {
      // Fallback for browsers without Font Face API
      setTimeout(() => {
        setFontsLoaded(true)
        document.body.classList.add('material-icons-loaded')
      }, 500)
    }
  }, [])

  if (!fontsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          {/* Simple loading spinner */}
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-text-secondary">Đang tải...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

const MiniApp = () => {
  return (
    <ErrorBoundary>
      <FontLoader>
        <ThemeProvider>
          <div className="flex min-h-screen justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <div className="flex w-full flex-col bg-surface-light dark:bg-surface-dark">
              <RouterProvider router={router} />
            </div>
          </div>
        </ThemeProvider>
      </FontLoader>
    </ErrorBoundary>
  )
}

export default MiniApp
