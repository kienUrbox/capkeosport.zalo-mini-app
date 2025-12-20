import Typography from '../common/Typography'

type TeamCardCompactProps = {
  name: string
  members?: number
  isActive?: boolean
}

const TeamCardCompact = ({
  name,
  members = 0,
  isActive = false,
}: TeamCardCompactProps) => {
  return (
    <div
      className={`rounded-2xl border px-3 py-2 ${
        isActive
          ? 'border-primary bg-primary/10 text-white'
          : 'border-border bg-surface text-muted'
      }`}
    >
      <Typography variant="body-sm" className="font-semibold">
        {name}
      </Typography>
      <Typography variant="caption">{members} thành viên</Typography>
    </div>
  )
}

export default TeamCardCompact

