import React from 'react'
import Badge from '../ui/Badge'

type BottomNavItem = {
  id: string
  label: string
  icon?: string
  active?: boolean
  badgeCount?: number
  hasUnread?: boolean
  urgency?: 'high' | 'medium' | 'low'
  onClick?: () => void
}

type BottomNavProps = {
  items: BottomNavItem[]
}

const BottomNav = ({ items }: BottomNavProps) => {
  return (
    <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-border bg-surface/95 px-3 py-3 backdrop-blur safe-area-bottom">
      {items.map((item) => {
        const activeClass = item.active ? 'text-primary' : 'text-muted'

        const getUrgentColor = (urgency?: 'high' | 'medium' | 'low') => {
          switch (urgency) {
            case 'high':
              return 'bg-red-500 text-white border-red-600'
            case 'medium':
              return 'bg-orange-500 text-white border-orange-600'
            case 'low':
              return 'bg-blue-500 text-white border-blue-600'
            default:
              return 'bg-primary text-white'
          }
        }

        return (
          <button
            key={item.id}
            className={`relative flex flex-col items-center gap-1 text-xs font-semibold transition-colors min-h-[44px] min-w-[44px] ${activeClass}`}
            onClick={item.onClick}
            aria-label={item.label}
          >
            <span className={`material-symbols-outlined text-2xl leading-none ${activeClass}`}>
              {item.icon ?? 'radio_button_unchecked'}
            </span>

            {/* Badge for unread notifications */}
            {(item.badgeCount && item.badgeCount > 0) && (
              <Badge
                count={item.badgeCount}
                variant={item.urgency === 'high' ? 'error' : item.urgency === 'medium' ? 'warning' : 'default'}
                className="absolute -top-1 -right-1"
                size="sm"
              />
            )}

            {/* Unread indicator dot */}
            {item.hasUnread && (!item.badgeCount || item.badgeCount === 0) && (
              <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full"></span>
            )}

            {/* Urgency indicator ring */}
            {item.urgency && item.urgency !== 'low' && (
              <span className={`absolute inset-0 rounded-lg ${getUrgentColor(item.urgency)} opacity-20 animate-pulse`}></span>
            )}

            <span className="max-w-[4rem] truncate">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav

