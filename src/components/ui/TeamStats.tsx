import ProgressBar from './ProgressBar'

type Stat = {
  label: string
  value: number
  max?: number
}

type TeamStatsProps = {
  stats: Stat[]
}

const TeamStats = ({ stats }: TeamStatsProps) => {
  return (
    <div className="flex flex-col gap-4 rounded bg-surface-dark p-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-[#E0E0E0]">{stat.label}</p>
            <p className="text-sm font-bold text-primary">{stat.value}</p>
          </div>
          <ProgressBar value={(stat.value / (stat.max || 100)) * 100} />
        </div>
      ))}
    </div>
  )
}

export default TeamStats

