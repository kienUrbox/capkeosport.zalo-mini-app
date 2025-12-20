import React from 'react'
import Typography from '../common/Typography'
import Tag from './Tag'
import MatchStatusBadge from './MatchStatusBadge'
import CountdownTimer from './CountdownTimer'
import { Match, MatchStatus, MatchCardVariant } from '../../types'

interface MatchCardProps {
  match: Match
  variant?: MatchCardVariant
  showRequiredAction?: boolean
  showCountdown?: boolean
  priority?: 'high' | 'medium' | 'low'
  isCompact?: boolean
  onClick?: () => void
  onActionClick?: (action: string) => void
}

const getRequiredAction = (status: MatchStatus, isReceived?: boolean) => {
  switch (status) {
    case 'MATCHED':
      return isReceived ? 'Phản lời kèo' : 'Đề xuất kèo'
    case 'PENDING':
      return 'Chờ đối thủ xác nhận'
    case 'CAPPING':
      return 'Cáp kèo chi tiết'
    case 'CONFIRMING':
      return 'Xác nhận ngay'
    case 'CONFIRMED':
      return 'Sẵn sàng'
    case 'UPCOMING':
      return 'Chuẩn bị'
    case 'FINISHED':
      return 'Xem kết quả'
    default:
      return undefined
  }
}

const getActionButtons = (status: MatchStatus, onActionClick?: (action: string) => void) => {
  const buttons: Array<{ label: string; variant: 'primary' | 'secondary'; action: string }> = []

  switch (status) {
    case 'MATCHED':
      buttons.push({ label: 'Xác nhận', variant: 'primary', action: 'confirm' })
      buttons.push({ label: 'Từ chối', variant: 'secondary', action: 'reject' })
      break
    case 'CONFIRMING':
      buttons.push({ label: 'Chốt kèo', variant: 'primary', action: 'confirm_final' })
      buttons.push({ label: 'Hủy', variant: 'secondary', action: 'cancel' })
      break
    case 'CONFIRMED':
      buttons.push({ label: 'Chat', variant: 'secondary', action: 'chat' })
      break
    case 'FINISHED':
      buttons.push({ label: 'Đánh giá', variant: 'primary', action: 'rate' })
      buttons.push({ label: 'Tái đấu', variant: 'secondary', action: 'rematch' })
      break
  }

  return buttons
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  variant = 'matched',
  showRequiredAction = true,
  showCountdown = true,
  priority = 'medium',
  isCompact = false,
  onClick,
  onActionClick
}) => {
  const requiredAction = getRequiredAction(match.status, match.isReceived)
  const actionButtons = getActionButtons(match.status, onActionClick)
  const isUrgent = priority === 'high' || (match.status === 'PENDING' || match.status === 'CONFIRMING')

  // Time calculation for countdown
  const getTargetDate = () => {
    if (match.date && match.time) {
      const [day, month, year] = match.date.split('/').map(Number)
      const [hours, minutes] = match.time.split(':').map(Number)
      return new Date(year, month - 1, day, hours, minutes)
    }
    return undefined
  }

  const priorityBorder = {
    high: 'border-l-4 border-l-red-500',
    medium: 'border-l-4 border-l-orange-500',
    low: 'border-l-4 border-l-blue-500'
  }

  return (
    <div
      className={`
        rounded-lg border border-border bg-surface relative overflow-hidden
        transition-all duration-200 hover:shadow-lg hover:border-primary/50
        ${!isCompact ? 'p-4' : 'p-3'}
        ${priorityBorder[priority]}
      `}
    >
      {/* Priority Indicator for high priority matches */}
      {isUrgent && (
        <div className="absolute top-2 right-2">
          <span className="material-symbols-outlined text-red-500 animate-pulse text-sm">
            priority_high
          </span>
        </div>
      )}

      {/* Header with status and teams */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Typography variant="subtitle" className="text-white truncate">
            {match.teamA.name} vs {match.teamB.name}
          </Typography>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted">Mức {match.teamA.level}</span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-muted">{match.teamA.gender}</span>
          </div>
        </div>

        <MatchStatusBadge
          status={match.status}
          requiredAction={showRequiredAction ? requiredAction : undefined}
          size="sm"
          showIcon
        />
      </div>

      {/* Match Information */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-primary text-base">schedule</span>
          <span className="text-white">{match.date} • {match.time}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-primary text-base">location_on</span>
          <span className="text-white truncate">{match.location || 'Chưa xác định'}</span>
        </div>

        {match.pitch && match.pitch.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-primary text-base">sports_soccer</span>
            <span className="text-white">{match.pitch.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      {showCountdown && getTargetDate() && (
        <div className="mb-3">
          <CountdownTimer
            targetDate={getTargetDate()}
            isUrgent={isUrgent}
            size="sm"
            format="compact"
          />
        </div>
      )}

      {/* Action Buttons */}
      {actionButtons.length > 0 && !isCompact && (
        <div className="flex gap-2">
          {actionButtons.map((button) => (
            <button
              key={button.action}
              onClick={() => onActionClick?.(button.action)}
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${button.variant === 'primary'
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                }
              `}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}

      {/* Optional notes */}
      {match.notes && !isCompact && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-muted text-base">note</span>
            <p className="text-xs text-muted line-clamp-2">{match.notes}</p>
          </div>
        </div>
      )}

      {/* Click overlay for navigation */}
      {onClick && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={onClick}
          aria-label="Xem chi tiết trận đấu"
        />
      )}
    </div>
  )
}

export default MatchCard

