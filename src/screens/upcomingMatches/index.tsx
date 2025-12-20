import { ScreenWrapper, SectionHeader } from '../../components/common'
import { MatchCard } from '../../components/ui'

const UpcomingMatchesScreen = () => {
  const matches = [
    { opponent: 'Hẻm Team', time: 'Thứ 6 · 18:30', location: 'Sân Hoàng Hoa Thám' },
    { opponent: 'Sunday Ballers', time: 'Chủ nhật · 20:00', location: 'Sân Lý Thường Kiệt' },
  ]

  return (
    <ScreenWrapper title="Kèo sắp diễn ra" subtitle="Đảm bảo quân số">
      <SectionHeader title="Tuần này" />
      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard key={match.opponent} {...match} status="upcoming" />
        ))}
      </div>
    </ScreenWrapper>
  )
}

export default UpcomingMatchesScreen

