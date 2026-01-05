import React from 'react';
import { Icon } from './Icon';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  showIcon?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Có lỗi xảy ra',
  message,
  onRetry,
  retryLabel = 'Thử lại',
  className = '',
  showIcon = true,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {showIcon && (
        <div className="mb-4 text-red-500 dark:text-red-400">
          <Icon name="error_outline" className="text-5xl" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      <p className="text-sm text-gray-500 dark:text-text-secondary mb-6 max-w-xs">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="min-w-[120px]">
          <Icon name="refresh" className="mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

// Inline error state for smaller spaces (e.g., card sections)
export const InlineError: React.FC<{
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 py-8 px-4 bg-red-50 dark:bg-red-900/20 rounded-xl ${className}`}
    >
      <Icon name="error" className="text-red-500 text-xl" />
      <p className="text-sm text-red-600 dark:text-red-400 flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
          aria-label="Thử lại"
        >
          <Icon name="refresh" />
        </button>
      )}
    </div>
  );
};

// Full page error state for home screen
export const DashboardError: React.FC<{
  error?: string | null;
  onRetry?: () => void;
}> = ({ error = 'Không thể tải dữ liệu', onRetry }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex-1 flex items-center justify-center px-6">
        <ErrorState
          title="Không thể tải trang chủ"
          message={error || 'Không thể tải dữ liệu'}
          onRetry={onRetry}
          retryLabel="Tải lại trang"
        />
      </div>
    </div>
  );
};

export default ErrorState;
