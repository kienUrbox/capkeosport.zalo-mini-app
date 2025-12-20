import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { ICONS } from '../../constants/design'
import type { Match } from '../../types'

type MatchedTabProps = {
  matches: Match[]
}

const MatchedTab = ({ matches }: MatchedTabProps) => {
  const navigate = useNavigate()

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<span className={`material-symbols-outlined text-[64px] text-[#A0A0A0]`}>{ICONS.favorite}</span>}
        title="Chưa có kèo nào đã match"
        description="Swipe để tìm đội phù hợp và match với họ nhé!"
        actionLabel="Đi cáp kèo"
        onAction={() => navigate('/swipe')}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {matches.map((match) => {
        const isReceived = match.isReceived === true

        return (
          <div key={match.id} className="flex flex-col gap-4 rounded-lg bg-[#1E1E1E] p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${match.teamB.logo})` }} />
              <div className="flex-1">
                <p className="text-white text-base font-medium leading-normal">{match.teamB.name}</p>
                <p className="text-[#A0A0A0] text-sm font-normal leading-normal">Level {match.teamB.level}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                isReceived 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {isReceived ? 'Đã gửi kèo đến' : 'Đã match'}
              </span>
            </div>
            {/* Hiển thị thông tin kèo nếu đối thủ đã gửi */}
            {isReceived && match.date && match.time && (
              <div className="border-t border-[#2A2A2A] pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg text-[#A0A0A0]`}>{ICONS.calendar_today}</span>
                    <p className="text-sm font-normal text-[#E0E0E0]">{match.date} - {match.time}</p>
                  </div>
                  {match.location && (
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-lg text-[#A0A0A0]`}>{ICONS.location_on}</span>
                      <p className="text-sm font-normal text-[#A0A0A0]">{match.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <SecondaryButton
                className="flex-1"
                onClick={() => navigate(`/team/${match.teamB.id}`)}
              >
                Xem chi tiết
              </SecondaryButton>
              {isReceived ? (
                <PrimaryButton
                  className="flex-1"
                  onClick={() => navigate(`/match/${match.id}/accept`)}
                >
                  Nhận kèo
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  className="flex-1"
                  onClick={() => navigate(`/request-match/${match.teamB.id}?matchId=${match.id}`)}
                >
                  Gửi lời mời
                </PrimaryButton>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MatchedTab

