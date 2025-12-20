import { ReactNode } from 'react'

import PrimaryButton from '../ui/PrimaryButton'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      {icon && <div className="mb-6">{icon}</div>}
      <div className="flex max-w-[480px] flex-col items-center gap-2">
        <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{title}</p>
        {description && (
          <p className="text-[#A0A0A0] text-sm font-normal leading-normal max-w-[480px]">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
          <PrimaryButton onClick={onAction} fullWidth>
            {actionLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}

export default EmptyState

