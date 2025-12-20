import type { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'
import { ICONS } from '../../constants/design'
import Typography from '../common/Typography'

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  options?: Array<{ value: string; label: string }>
}

const FormSelect = ({ label, className, children, options, ...props }: FormSelectProps) => {
  return (
    <label className="flex flex-col gap-1">
      {label ? (
        <Typography variant="body-sm" className="text-muted">
          {label}
        </Typography>
      ) : null}
      <div className="relative">
        <select
          className={clsx(
            'appearance-none rounded-2xl border border-border bg-card px-4 py-3 text-white focus:border-primary focus:outline-none w-full',
            className,
          )}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted">
          <span className="material-symbols-outlined">{ICONS.unfold_more}</span>
        </div>
      </div>
    </label>
  )
}

export default FormSelect
