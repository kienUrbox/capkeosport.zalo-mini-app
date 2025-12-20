import { ReactNode } from 'react'
import clsx from 'clsx'

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  // Match status variants
  | 'matched'
  | 'pending'
  | 'capping'
  | 'confirming'
  | 'confirmed'
  | 'upcoming'
  | 'finished'

type BadgeProps = {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-card text-muted',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-orange-500/20 text-orange-400',
  error: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
  matched: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-orange-500/20 text-orange-400',
  capping: 'bg-purple-500/20 text-purple-400',
  confirming: 'bg-cyan-500/20 text-cyan-400',
  confirmed: 'bg-green-500/20 text-green-400',
  upcoming: 'bg-primary/20 text-primary',
  finished: 'bg-gray-500/20 text-gray-400',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

const Badge = ({ label, variant = 'default', size = 'md', icon }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        variantStyles[variant],
        sizeStyles[size],
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label}
    </span>
  )
}

export default Badge

