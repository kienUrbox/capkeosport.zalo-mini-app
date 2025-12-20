import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
}

const PrimaryButton = ({
  className,
  fullWidth = true,
  children,
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      className={clsx(
        'rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-white shadow-card transition-colors hover:bg-primary-soft',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton

