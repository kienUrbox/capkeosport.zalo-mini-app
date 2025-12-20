import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'muted'
  className?: string
}

interface SkeletonCardProps {
  showAvatar?: boolean
  showTitle?: boolean
  showSubtitle?: boolean
  lines?: number
  height?: string
  className?: string
}

interface SkeletonMatchProps {
  showStatus?: boolean
  showTeams?: boolean
  showInfo?: boolean
  showActions?: boolean
}

interface SkeletonTeamProps {
  showStats?: boolean
  showMembers?: boolean
  horizontal?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    muted: 'border-gray-400 border-t-transparent'
  }

  return (
    <div
      className={`
        animate-spin rounded-full border-2
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading..."
    />
  )
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  showTitle = true,
  showSubtitle = false,
  lines = 1,
  height = 'h-20',
  className = ''
}) => {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${height} ${className}`}>
      {showAvatar && (
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      )}

      {showTitle && (
        <div className="mb-3">
          <div className="h-5 bg-gray-600 rounded w-3/4 animate-pulse"></div>
        </div>
      )}

      {showSubtitle && (
        <div className="mb-3">
          <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3 bg-gray-600 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          ></div>
        ))}
      </div>
    </div>
  )
}

const SkeletonMatch: React.FC<SkeletonMatchProps> = ({
  showStatus = true,
  showTeams = true,
  showInfo = true,
  showActions = true
}) => {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      {/* Header with status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-600 rounded w-3/4 animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2 animate-pulse"></div>
        </div>
        {showStatus && (
          <div className="h-6 bg-gray-600 rounded-full w-20 animate-pulse"></div>
        )}
      </div>

      {/* Match info */}
      {showInfo && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-600 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-10 bg-gray-600 rounded-lg animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

const SkeletonTeam: React.FC<SkeletonTeamProps> = ({
  showStats = true,
  showMembers = false,
  horizontal = false
}) => {
  if (horizontal) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface">
        <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-600 rounded w-1/2 animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/3 animate-pulse"></div>
        </div>
        {showStats && (
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="text-center">
                <div className="h-4 bg-gray-600 rounded w-6 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-600 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-16 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-600 rounded w-3/4 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-5 bg-gray-600 rounded w-8 animate-pulse mb-1 mx-auto"></div>
              <div className="h-3 bg-gray-600 rounded w-12 animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
      )}

      {showMembers && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gray-600 rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SkeletonList: React.FC<{ items?: number; type?: 'card' | 'match' | 'team' }> = ({
  items = 3,
  type = 'card'
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index}>
          {type === 'match' && <SkeletonMatch />}
          {type === 'team' && <SkeletonTeam />}
          {type === 'card' && <SkeletonCard />}
        </div>
      ))}
    </div>
  )
}

const LoadingState: React.FC<{
  type?: 'spinner' | 'skeleton' | 'empty'
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}> = ({ type = 'spinner', size = 'md', message, className = '' }) => {
  if (type === 'skeleton') {
    return <SkeletonCard className={className} />
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size={size} />
      {message && (
        <p className="mt-4 text-sm text-muted text-center">{message}</p>
      )}
    </div>
  )
}

export {
  LoadingSpinner,
  SkeletonCard,
  SkeletonMatch,
  SkeletonTeam,
  SkeletonList,
  LoadingState
}

export default LoadingSpinner