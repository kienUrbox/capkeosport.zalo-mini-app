import clsx from 'clsx'

type TagVariant = 'default' | 'success' | 'warning' | 'danger'

type TagProps = {
  label: string
  variant?: TagVariant
}

const variantMap: Record<TagVariant, string> = {
  default: 'bg-white/5 text-slate-100',
  success: 'bg-green-500/15 text-green-300',
  warning: 'bg-yellow-500/15 text-yellow-200',
  danger: 'bg-red-500/15 text-red-300',
}

const Tag = ({ label, variant = 'default' }: TagProps) => {
  return (
    <span
      className={clsx(
        'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        variantMap[variant],
      )}
    >
      {label}
    </span>
  )
}

export default Tag

