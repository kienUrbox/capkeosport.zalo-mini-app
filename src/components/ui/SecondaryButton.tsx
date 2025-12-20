import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
}

const SecondaryButton = ({
  className,
  fullWidth = true,
  children,
  ...props
}: SecondaryButtonProps) => {
  return (
    <button
      className={clsx(
        'rounded-2xl border border-border px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default SecondaryButton

