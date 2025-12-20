import Typography from './Typography'

type SectionHeaderProps = {
  title: string
  actionText?: string
  onAction?: () => void
}

const SectionHeader = ({ title, actionText, onAction }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <Typography variant="subtitle" className="text-white">
        {title}
      </Typography>
      {actionText ? (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-semibold text-primary-soft"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  )
}

export default SectionHeader

