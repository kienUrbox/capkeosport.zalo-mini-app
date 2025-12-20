type StatItemProps = {
  label: string
  value: string
}

const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-center">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  )
}

export default StatItem

