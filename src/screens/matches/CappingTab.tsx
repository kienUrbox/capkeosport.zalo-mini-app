import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { ICONS, ICON_SIZES, SPACING } from '../../constants/design'
import type { Match } from '../../types'

// Mock: Lấy team hiện tại (sẽ thay bằng context/auth sau)
const CURRENT_TEAM_ID = 'team-a'

type CappingTabProps = {
  matches: Match[]
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ phản hồi', color: 'bg-orange-500/20 text-orange-400' }
    case 'CAPPING':
      return { label: 'Đang capping', color: 'bg-purple-500/20 text-purple-400' }
    case 'CONFIRMING':
      return { label: 'Đang xác nhận', color: 'bg-cyan-500/20 text-cyan-400' }
    default:
      return { label: 'Đang cáp kèo', color: 'bg-blue-500/20 text-blue-400' }
  }
}

const CappingTab = ({ matches }: CappingTabProps) => {
  const navigate = useNavigate()

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<span className={`material-symbols-outlined text-[64px] text-[#A0A0A0]`}>{ICONS.event_busy}</span>}
        title="Chưa có kèo nào đang cáp"
        description="Các kèo đang trong quá trình cáp kèo sẽ hiển thị ở đây"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {matches.map((match) => {
        const status = getStatusLabel(match.status)
        
        // Xác định team hiện tại là teamA hay teamB
        const isCurrentTeamA = match.teamA.id === CURRENT_TEAM_ID
        const currentTeam = isCurrentTeamA ? match.teamA : match.teamB
        const opponentTeam = isCurrentTeamA ? match.teamB : match.teamA
        
        // Kiểm tra gợi ý kèo
        const hasSuggestion = !!match.suggestion
        const suggestionByCurrentTeam = match.suggestion?.suggestedBy === (isCurrentTeamA ? 'teamA' : 'teamB')
        const suggestionByOpponent = match.suggestion && !suggestionByCurrentTeam
        
        // Hiển thị thông tin gợi ý nếu có
        const displayDate = match.suggestion?.date || match.date
        const displayTime = match.suggestion?.time || match.time
        const displayLocation = match.suggestion?.location || match.location
        
        return (
          <div key={match.id} className="flex flex-col gap-4 rounded-lg bg-[#1E1E1E] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${match.teamA.logo})` }} />
                </div>
                <span className="text-sm font-medium text-[#A0A0A0]">vs</span>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${match.teamB.logo})` }} />
                </div>
              </div>
              <div className={`rounded-md px-2 py-1 ${status.color}`}>
                <p className="text-xs font-bold">{status.label}</p>
              </div>
            </div>
            
            {/* Hiển thị thông tin gợi ý nếu có */}
            {hasSuggestion && (
              <div className="border-t border-[#2A2A2A] pt-4">
                <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 mb-2">
                  <p className="text-xs font-medium text-purple-400 mb-2">
                    {suggestionByCurrentTeam 
                      ? 'Gợi ý của bạn' 
                      : `${opponentTeam.name} đã gợi ý`}
                  </p>
                  {(displayDate || displayTime) && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-sm text-purple-400">{ICONS.calendar_month}</span>
                      <p className="text-sm font-normal text-[#E0E0E0]">
                        {displayDate} {displayTime ? `- ${displayTime}` : ''}
                      </p>
                    </div>
                  )}
                  {displayLocation && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-purple-400">{ICONS.location_on}</span>
                      <p className="text-sm font-normal text-[#A0A0A0]">{displayLocation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Hiển thị thông tin match nếu không có gợi ý nhưng có thông tin cũ */}
            {!hasSuggestion && (match.date || match.time || match.location) && (
              <div className="border-t border-[#2A2A2A] pt-4">
                <div className="flex flex-col gap-2">
                  {(match.date || match.time) && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#A0A0A0]">{ICONS.calendar_month}</span>
                      <p className="text-sm font-normal text-[#E0E0E0]">
                        {match.date} {match.time ? `- ${match.time}` : ''}
                      </p>
                    </div>
                  )}
                  {match.location && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#A0A0A0]">{ICONS.location_on}</span>
                      <p className="text-sm font-normal text-[#A0A0A0]">{match.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Row 1: Chat Zalo và Xem chi tiết */}
              <div className="flex items-center gap-2">
                <SecondaryButton 
                  className="flex-1 min-w-0" 
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  Xem chi tiết
                </SecondaryButton>
                <PrimaryButton
                  className="flex-1 min-w-0 flex items-center justify-center gap-2"
                  onClick={() => {
                    // Mở Zalo Chat với link hoặc tạo group chat
                    if (match.zaloChatLink) {
                      window.open(match.zaloChatLink, '_blank')
                    } else {
                      // TODO: Tạo Zalo chat link hoặc mở Zalo app
                      console.log('Open Zalo Chat for match:', match.id)
                      // Có thể tạo một message template với thông tin match
                      const message = `⚽️ Trao đổi về trận đấu giữa ${match.teamA.name} vs ${match.teamB.name}`
                      // window.location.href = `zalo://chat?message=${encodeURIComponent(message)}`
                    }
                  }}
                >
                  <img
                    alt="Zalo icon"
                    className="w-4 h-4 shrink-0"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkw2dEy8pexTSj0ZKiVweVPH1BMZcLJ_LgRFG7uPalHGuhBQU9pq7imwHrSd9TYArOG0Bg9244_m-N-TXr8DfYX7eL7NKEPjuDPfPZxDeTSwro8hcGIT_qRqyNRdrmtKRzzfdepsT05atqwSHqmKKYixz33kOnGzu9KiL4OQW1ckebMGwtBvta9kINstUXTwiW0YqjrZ1LJPuD_UwTkC4Dr9EJcwifaYvlfO0LzRuljYzz0sZzrKJ-EhDAJEUEnWHuyIiwmtOXt6E"
                  />
                  <span className="truncate">Chat Zalo</span>
                </PrimaryButton>
              </div>
              
              {/* Row 2: Gợi ý kèo / Edit gợi ý / Confirm kèo */}
              {(!hasSuggestion || suggestionByCurrentTeam || suggestionByOpponent) && (
                <div className="flex items-center gap-2">
                  {!hasSuggestion ? (
                    // Chưa có gợi ý nào - hiển thị nút "Gợi ý kèo"
                    <PrimaryButton
                      className="flex-1 min-w-0 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/match/${match.id}/suggest`)}
                    >
                      <span className={`material-symbols-outlined ${ICON_SIZES.base} shrink-0`}>{ICONS.edit}</span>
                      <span className="truncate">Gợi ý kèo</span>
                    </PrimaryButton>
                  ) : suggestionByCurrentTeam ? (
                    // Đã có gợi ý từ team hiện tại - hiển thị "Edit gợi ý"
                    <PrimaryButton
                      className="flex-1 min-w-0 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/match/${match.id}/suggest?edit=true`)}
                    >
                      <span className={`material-symbols-outlined ${ICON_SIZES.base} shrink-0`}>{ICONS.edit}</span>
                      <span className="truncate">Chỉnh sửa gợi ý</span>
                    </PrimaryButton>
                  ) : suggestionByOpponent ? (
                    // Đã có gợi ý từ đối thủ - hiển thị "Confirm kèo"
                    <PrimaryButton
                      className="flex-1 min-w-0 flex items-center justify-center gap-2"
                      onClick={() => navigate(`/match/${match.id}/confirm`)}
                    >
                      <span className={`material-symbols-outlined ${ICON_SIZES.base} shrink-0`}>{ICONS.check_circle}</span>
                      <span className="truncate">Xác nhận kèo</span>
                    </PrimaryButton>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CappingTab

