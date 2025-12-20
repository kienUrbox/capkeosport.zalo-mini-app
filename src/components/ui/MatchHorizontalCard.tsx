import PrimaryButton from './PrimaryButton'

type MatchHorizontalCardProps = {
  team: string
  level: string
  time: string
  location: string
  onDetail?: () => void
}

const MatchHorizontalCard = ({
  team,
  level,
  time,
  location,
  onDetail,
}: MatchHorizontalCardProps) => {
  return (
    <div className="min-w-[18rem] rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-lg">
          🛡️
        </div>
        <div>
          <p className="font-semibold text-white">{team}</p>
          <p className="text-sm text-muted">{level}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-sm text-muted">
        <p>📅 {time}</p>
        <p>📍 {location}</p>
      </div>
      <PrimaryButton className="mt-4" fullWidth={true} onClick={onDetail}>
        Chi tiết
      </PrimaryButton>
    </div>
  )
}

export default MatchHorizontalCard

