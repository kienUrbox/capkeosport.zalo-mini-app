type NearbyTeamCardProps = {
  name: string
  level: string
  distance: string
  gender?: string
  badge?: string
}

const genderColor: Record<string, string> = {
  Nam: 'text-cyan-300',
  Nữ: 'text-pink-300',
}

const NearbyTeamCard = ({
  name,
  level,
  distance,
  gender = 'Nam',
  badge = '⚽️',
}: NearbyTeamCardProps) => {
  return (
    <div className="flex min-w-[7.5rem] flex-col items-center gap-2 rounded-2xl p-2 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/60 text-4xl">
        {badge}
      </div>
      <div>
        <p className="text-base font-semibold text-white">{name}</p>
        <div className="text-sm text-muted">
          {level} · {distance}
        </div>
        <p className={`text-xs font-semibold ${genderColor[gender] ?? 'text-muted'}`}>
          {gender}
        </p>
      </div>
    </div>
  )
}

export default NearbyTeamCard

