import Typography from '../common/Typography'
import Tag from './Tag'

type SwipeCardProps = {
  name: string
  location: string
  skillLevel: string
  distance: string
  onAccept?: () => void
  onReject?: () => void
}

const SwipeCard = ({
  name,
  location,
  skillLevel,
  distance,
  onAccept,
  onReject,
}: SwipeCardProps) => {
  return (
    <div className="rounded-3xl bg-card p-5 text-white shadow-card">
      <div className="flex items-center justify-between">
        <Typography variant="subtitle" className="text-white">
          {name}
        </Typography>
        <Tag label={skillLevel} />
      </div>
      <Typography variant="body-sm" className="mt-2 text-muted">
        {location} · {distance}
      </Typography>
      <div className="mt-4 flex justify-between gap-3">
        <button
          onClick={onReject}
          className="flex-1 rounded-2xl border border-border py-3 font-semibold text-white"
        >
          Bỏ qua
        </button>
        <button
          onClick={onAccept}
          className="flex-1 rounded-2xl bg-primary py-3 font-semibold text-white"
        >
          Cáp kèo
        </button>
      </div>
    </div>
  )
}

export default SwipeCard

