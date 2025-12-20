import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import Typography from '../common/Typography'

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onIconClick?: () => void
}

const FormInput = ({ label, hint, icon, iconPosition = 'right', onIconClick, className, ...props }: FormInputProps) => {
  const hasIcon = !!icon

  return (
    <label className="flex flex-col gap-1">
      {label ? (
        <Typography variant="body-sm" className="text-muted">
          {label}
        </Typography>
      ) : null}
      <div className="relative flex items-stretch">
        <input
          className={clsx(
            'w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
            hasIcon && iconPosition === 'right' && 'pr-12',
            hasIcon && iconPosition === 'left' && 'pl-12',
            className,
          )}
          {...props}
        />
        {icon && (
          <div
            className={clsx(
              'absolute inset-y-0 flex items-center',
              iconPosition === 'right' ? 'right-0 pr-3' : 'left-0 pl-3',
              onIconClick && 'cursor-pointer',
            )}
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
      </div>
      {hint ? (
        <Typography variant="caption" className="text-muted">
          {hint}
        </Typography>
      ) : null}
    </label>
  )
}

export default FormInput

