import Avatar from '../common/Avatar'
import Tag from './Tag'
import Typography from '../common/Typography'

type TeamCardProps = {
  name: string
  sport: string
  record: string
  members?: string[]
  status?: string
}

const TeamCard = ({
  name,
  sport,
  record,
  members = [],
  status = 'Đang rảnh',
}: TeamCardProps) => {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="subtitle" className="text-white">
            {name}
          </Typography>
          <Typography variant="body-sm">{sport}</Typography>
        </div>
        <Tag label={status} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        {members.slice(0, 3).map((initials) => (
          <Avatar key={initials} size="sm" initials={initials} />
        ))}
        <Typography variant="body-sm" className="text-muted">
          {record}
        </Typography>
      </div>
    </div>
  )
}

export default TeamCard

