import React from 'react'
import { MatchStatus } from '../../types'

interface MatchStatusBadgeProps {
  status: MatchStatus
  requiredAction?: string
  timeUntilAction?: string
  isUrgent?: boolean
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const MatchStatusBadge: React.FC<MatchStatusBadgeProps> = ({
  status,
  requiredAction,
  timeUntilAction,
  isUrgent = false,
  size = 'md',
  showIcon = true
}) => {
  const getStatusConfig = (status: MatchStatus) => {
    switch (status) {
      case 'MATCHED':
        return {
          label: 'Đã Match',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/20',
          icon: 'handshake',
          actionHint: 'Đề xuất kèo'
        }
      case 'PENDING':
        return {
          label: 'Chờ phản hồi',
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/20',
          icon: 'schedule',
          actionHint: 'Chờ đối thủ xác nhận'
        }
      case 'CAPPING':
        return {
          label: 'Đang cáp kèo',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/20',
          icon: 'settings',
          actionHint: 'Đang trao đổi chi tiết'
        }
      case 'CONFIRMING':
        return {
          label: 'Đang xác nhận',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20',
          icon: 'fact_check',
          actionHint: 'Chốt kèo ngay!'
        }
      case 'CONFIRMED':
        return {
          label: 'Đã chốt kèo',
          bgColor: 'bg-indigo-500/10',
          textColor: 'text-indigo-400',
          borderColor: 'border-indigo-500/20',
          icon: 'check_circle',
          actionHint: 'Sẵn sàng thi đấu'
        }
      case 'UPCOMING':
        return {
          label: 'Sắp diễn ra',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/20',
          icon: 'event_upcoming',
          actionHint: 'Chuẩn bị thi đấu'
        }
      case 'FINISHED':
        return {
          label: 'Đã kết thúc',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/20',
          icon: 'sports_score',
          actionHint: 'Xem kết quả'
        }
      default:
        return {
          label: 'Unknown',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/20',
          icon: 'help',
          actionHint: ''
        }
    }
  }

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs font-medium'
      case 'md':
        return 'px-3 py-1.5 text-sm font-medium'
      case 'lg':
        return 'px-4 py-2 text-base font-medium'
      default:
        return 'px-3 py-1.5 text-sm font-medium'
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = getSizeClasses(size)
  const urgentPulse = isUrgent ? 'animate-pulse' : ''

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses} ${urgentPulse}`}>
      {showIcon && (
        <span className="material-symbols-outlined text-current !text-base !leading-none">
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>

      {requiredAction && (
        <>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="font-medium">{requiredAction}</span>
        </>
      )}

      {timeUntilAction && (
        <>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="text-xs opacity-75">{timeUntilAction}</span>
        </>
      )}
    </div>
  )
}

export default MatchStatusBadge