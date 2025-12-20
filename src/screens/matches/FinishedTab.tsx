import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { BORDER_RADIUS, CARD, ICONS, ICON_SIZES, PADDING, SPACING, TYPOGRAPHY } from '../../constants/design'
import type { Match } from '../../types'

type FinishedTabProps = {
  matches: Match[]
}

const FinishedTab = ({ matches }: FinishedTabProps) => {
  const navigate = useNavigate()

  const finishedMatches = matches.filter((m) => m.status === 'FINISHED')

  if (finishedMatches.length === 0) {
    return (
      <EmptyState
        icon={<span className={`material-symbols-outlined text-[64px] text-[#A0A0A0]`}>history</span>}
        title="Chưa có trận đấu đã kết thúc"
        description="Các trận đấu đã hoàn thành sẽ hiển thị ở đây."
      />
    )
  }

  return (
    <div className={`flex flex-col ${SPACING.lg} ${PADDING.md}`}>
      {finishedMatches.map((match) => (
        <div key={match.id} className={`flex flex-col ${SPACING.lg} ${BORDER_RADIUS.md} bg-[#1E1E1E] ${CARD.padding}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${SPACING.sm}`}>
              <div className="relative">
                <div
                  className={`h-10 w-10 ${BORDER_RADIUS.full} bg-cover bg-center`}
                  style={{ backgroundImage: `url(${match.teamA.logo})` }}
                />
              </div>
              <span className={`${TYPOGRAPHY.body.sm} font-medium text-[#A0A0A0]`}>vs</span>
              <div className="relative">
                <div
                  className={`h-10 w-10 ${BORDER_RADIUS.full} bg-cover bg-center`}
                  style={{ backgroundImage: `url(${match.teamB.logo})` }}
                />
              </div>
            </div>
            {match.score && (
              <div className={`text-white ${TYPOGRAPHY.heading['4']} font-bold`}>
                {match.score.teamA} - {match.score.teamB}
              </div>
            )}
          </div>
          {match.date && (
            <div className={`border-t border-[#2A2A2A] pt-4`}>
              <div className={`flex flex-col ${SPACING.sm}`}>
                <div className={`flex items-center ${SPACING.sm}`}>
                  <span className={`material-symbols-outlined ${ICON_SIZES.lg} text-[#A0A0A0]`}>
                    {ICONS.calendar_month}
                  </span>
                  <p className={`${TYPOGRAPHY.body.sm} font-normal text-[#E0E0E0]`}>{match.date}</p>
                </div>
                {match.location && (
                  <div className={`flex items-center ${SPACING.sm}`}>
                    <span className={`material-symbols-outlined ${ICON_SIZES.lg} text-[#A0A0A0]`}>
                      {ICONS.location_on}
                    </span>
                    <p className={`${TYPOGRAPHY.body.sm} font-normal text-[#A0A0A0]`}>{match.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={`flex items-center ${SPACING.md} pt-2`}>
            <SecondaryButton
              className="flex-1"
              onClick={() => navigate(`/match/${match.id}/finished`)}
            >
              Xem chi tiết
            </SecondaryButton>
            <PrimaryButton
              className="flex-1"
              onClick={() => navigate(`/match/${match.id}/rematch`)}
            >
              Request Rematch
            </PrimaryButton>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FinishedTab

