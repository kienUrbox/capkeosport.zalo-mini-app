import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string
  ariaLabel?: string
  variant?: 'solid' | 'ghost'
}

const IconButton = ({
  icon,
  ariaLabel,
  variant = 'solid',
  className,
  children,
  ...props
}: IconButtonProps) => {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx(
        'h-10 w-10 rounded-2xl text-base font-semibold text-white transition-colors',
        variant === 'solid'
          ? 'bg-card hover:bg-primary/60'
          : 'bg-transparent hover:bg-white/5',
        className,
      )}
      {...props}
    >
      {children ?? icon}
    </button>
  )
}

export default IconButton

