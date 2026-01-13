import { Component, ErrorInfo, ReactNode } from 'react'
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

const MiniApp = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="flex min-h-screen justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
          <div className="flex w-full flex-col bg-surface-light dark:bg-surface-dark">
            <RouterProvider router={router} />
          </div>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default MiniApp
