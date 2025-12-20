import { ScreenWrapper, SectionHeader } from '../../components/common'
import { MatchCard } from '../../components/ui'

const MatchHistoryScreen = () => {
  return (
    <ScreenWrapper title="Lịch sử kèo" subtitle="12 trận gần nhất">
      <SectionHeader title="2025" />
      <div className="space-y-3">
        <MatchCard
          opponent="Hẻm Team"
          time="12/11 · 5-3"
          location="Sân Hoàng Hoa Thám"
          status="finished"
        />
        <MatchCard
          opponent="Sunday Ballers"
          time="05/11 · 4-4"
          location="Sân Quận 3"
          status="finished"
        />
      </div>
    </ScreenWrapper>
  )
}

export default MatchHistoryScreen

