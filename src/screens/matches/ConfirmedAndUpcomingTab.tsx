import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { BORDER_RADIUS, CARD, ICONS, ICON_SIZES, PADDING, SPACING, TYPOGRAPHY } from '../../constants/design'
import type { Match } from '../../types'

type ConfirmedAndUpcomingTabProps = {
  matches: Match[]
}

const ConfirmedAndUpcomingTab = ({ matches }: ConfirmedAndUpcomingTabProps) => {
  const navigate = useNavigate()

  // Filter matches: CONFIRMED và UPCOMING
  const confirmedAndUpcomingMatches = matches.filter((m) => ['CONFIRMED', 'UPCOMING'].includes(m.status))

  if (confirmedAndUpcomingMatches.length === 0) {
    return (
      <EmptyState
        icon={<span className={`material-symbols-outlined text-[64px] text-[#A0A0A0]`}>event_available</span>}
        title="Chưa có kèo nào đã chốt"
        description="Các kèo đã được chốt và sắp diễn ra sẽ hiển thị ở đây"
        actionLabel="Tạo kèo ngay"
        onAction={() => navigate('/swipe')}
      />
    )
  }

  return (
    <div className={`flex flex-col ${SPACING.lg} ${PADDING.md}`}>
      {confirmedAndUpcomingMatches.map((match) => {
        const isUpcoming = match.status === 'UPCOMING'
        return (
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
              <div className={`${BORDER_RADIUS.md} px-2 py-1 ${
                isUpcoming 
                  ? 'bg-blue-500/20' 
                  : 'bg-green-500/20'
              }`}>
                <p className={`${TYPOGRAPHY.caption} font-bold ${
                  isUpcoming 
                    ? 'text-blue-400' 
                    : 'text-green-400'
                }`}>
                  {isUpcoming ? 'Sắp diễn ra' : 'Đã chốt'}
                </p>
              </div>
            </div>
            {match.date && match.time && (
              <div className={`border-t border-[#2A2A2A] pt-4`}>
                <div className={`flex flex-col ${SPACING.sm}`}>
                  <div className={`flex items-center ${SPACING.sm}`}>
                    <span className={`material-symbols-outlined ${ICON_SIZES.lg} text-[#A0A0A0]`}>
                      {ICONS.calendar_month}
                    </span>
                    <p className={`${TYPOGRAPHY.body.sm} font-normal text-[#E0E0E0]`}>
                      {match.date} - {match.time}
                    </p>
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
              <SecondaryButton className="flex-1" onClick={() => navigate(`/match/${match.id}`)}>
                Xem chi tiết
              </SecondaryButton>
              <PrimaryButton
                className={`flex-1 ${SPACING.sm}`}
                onClick={() => console.log('Open Zalo Chat')}
              >
                <img
                  alt="Zalo icon"
                  className="w-4 h-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkw2dEy8pexTSj0ZKiVweVPH1BMZcLJ_LgRFG7uPalHGuhBQU9pq7imwHrSd9TYArOG0Bg9244_m-N-TXr8DfYX7eL7NKEPjuDPfPZxDeTSwro8hcGIT_qRqyNRdrmtKRzzfdepsT05atqwSHqmKKYixz33kOnGzu9KiL4OQW1ckebMGwtBvta9kINstUXTwiW0YqjrZ1LJPuD_UwTkC4Dr9EJcwifaYvlfO0LzRuljYzz0sZzrKJ-EhDAJEUEnWHuyIiwmtOXt6E"
                />
                Chat Zalo
              </PrimaryButton>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConfirmedAndUpcomingTab

