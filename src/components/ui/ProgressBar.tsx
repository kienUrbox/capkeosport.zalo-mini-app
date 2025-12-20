type ProgressBarProps = {
  value: number
}

const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="h-2 w-full rounded-full bg-border">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export default ProgressBar

