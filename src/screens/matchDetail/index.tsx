import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { CountdownTimer, MatchTimeline, PrimaryButton, SecondaryButton } from '../../components/ui'
import { BORDER_RADIUS, CARD, ICONS, ICON_SIZES, SPACING, SPACE_Y, TYPOGRAPHY } from '../../constants/design'
import { getMatchById } from '../../utils/mockData'
import type { Match } from '../../types'

const MatchDetailScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Fetch match data - sẽ thay bằng API call sau
  const match = getMatchById(id || '1') || {
    id: id || '1',
    status: 'CONFIRMED' as const,
    teamA: {
      id: 'team-a',
      name: 'Team A',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcwcdI3e-CKknuWPO4GQkxt-hsLiAlNXODo-f5GF5bT7OqFGWEVolX81RHoLwdCve-XipPJDS0EQg7f7_zDxTuFFGODi19CeG4LxhNO0EJoeF_oehFA1STwGF6Ar8vsRdvTGiAHiFmpEbXnyr1PW_R3rmF8UesFywW9KaO3NAxI061cZMXDH9KIIa-rVfyQaMIqfhyHTwarpq7CTO5w3jDuGOGOBUSGQuUibjB-aQHuqJ4zVPjDwxlPCSttsZqbCrvfNeRu33uaFA',
      level: '4',
      gender: 'Nam',
    },
    teamB: {
      id: 'team-b',
      name: 'Team B',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCydmJnArT9y4tywE7iNznR1Kaqj8wxMVMo-Vxox2V7JEcvFdjY2nUi_BR1KUA3xao5zQEWxblEZlGR7M8OSloUQfN1yzri9XUxtJzhO5Ju-F8A__ehBdoFOsecc-mXtJcq5e_dOeky00SFIbEJQ-fzl5nz-FENT_E5oImT10xJRuozXNjHFrC1U7VuwJtea3aN8Sem5Dsh8_1cetVRTTLtZTLbxXfLl5niS-6zkibl9aAN08WRI1XMkTBJju_WX3qmFeYmm2gcJnA',
      level: '4',
      gender: 'Nam',
    },
    date: 'Thứ Bảy, 28/09/2024',
    time: '19:00',
    location: 'Sân bóng đá An Lộc',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Match

  if (!match) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-dark">
        <p className="text-white">Match not found</p>
      </div>
    )
  }

  // Calculate target date for countdown (mock - sẽ tính từ match.date và match.time)
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 1)
  targetDate.setHours(19, 0, 0, 0)

  const timelineEvents = [
    { id: '1', title: 'Team A đã tạo kèo', timestamp: '14:30 - 24/09/2024' },
    { id: '2', title: 'Team B đã nhận kèo', timestamp: '15:00 - 24/09/2024' },
    { id: '3', title: 'Đã xác nhận trận đấu', timestamp: '15:01 - 24/09/2024' },
  ]

  // Determine what to show based on match status
  const showCountdown = ['CONFIRMED', 'UPCOMING'].includes(match.status)
  const showEditButton = ['CONFIRMED', 'UPCOMING'].includes(match.status)
  const showUpdateResultButton = match.status === 'UPCOMING' // Chỉ enable khi đã đến ngày đá
  const showMatchRoomButton = ['PENDING', 'CAPPING'].includes(match.status)
  const showConfirmButton = match.status === 'CONFIRMING'
  const showChatButton = ['CONFIRMED', 'UPCOMING'].includes(match.status)

  // Redirect to finished screen if status is FINISHED
  if (match.status === 'FINISHED') {
    navigate(`/match/${id}/finished`, { replace: true })
    return null
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-background-dark">
      <StandardHeader title="Chi tiết trận đấu" />

      <main className={`flex-grow px-4 pb-8 ${SPACE_Y.xl}`}>
        {/* Hero Section */}
        <div className={`bg-[#1a2431] ${BORDER_RADIUS.md} ${CARD.padding} flex items-center justify-around`}>
          <div className="flex flex-col items-center gap-2 w-2/5">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-20 h-20 border-2 border-primary/50"
              style={{ backgroundImage: `url(${match.teamA.logo})` }}
            />
            <p className={`text-white ${TYPOGRAPHY.body.base} font-bold text-center`}>{match.teamA.name}</p>
            <p className={`text-[#9aa9bc] ${TYPOGRAPHY.body.sm}`}>Chủ nhà</p>
          </div>
          <h2 className="text-white tracking-light text-4xl font-bold leading-tight text-center">VS</h2>
          <div className="flex flex-col items-center gap-2 w-2/5">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-20 h-20 border-2 border-primary/50"
              style={{ backgroundImage: `url(${match.teamB.logo})` }}
            />
            <p className={`text-white ${TYPOGRAPHY.body.base} font-bold text-center`}>{match.teamB.name}</p>
            <p className={`text-[#9aa9bc] ${TYPOGRAPHY.body.sm}`}>Khách</p>
          </div>
        </div>

        {/* Countdown Timer - chỉ hiển thị cho CONFIRMED và UPCOMING */}
        {showCountdown && <CountdownTimer targetDate={targetDate} />}

        {/* Information Card */}
        <div className={`bg-[#1a2431] ${BORDER_RADIUS.md} ${CARD.padding} ${SPACE_Y.lg}`}>
          <div className={`flex items-center ${SPACING.lg}`}>
            <span className={`material-symbols-outlined text-primary ${ICON_SIZES.lg}`}>{ICONS.calendar_month}</span>
            <p className={`text-white ${TYPOGRAPHY.body.base}`}>
              {match.date} - {match.time}
            </p>
          </div>
          <div className={`flex items-start ${SPACING.lg}`}>
            <span className={`material-symbols-outlined text-primary ${ICON_SIZES.lg} mt-0.5`}>{ICONS.stadium}</span>
            <div className="flex-grow">
              <p className={`text-white ${TYPOGRAPHY.body.base}`}>{match.location}</p>
              <a className={`text-primary ${TYPOGRAPHY.body.sm} font-medium`} href="#" onClick={(e) => {
                e.preventDefault()
                console.log('Open map')
              }}>
                Xem trên bản đồ
              </a>
            </div>
          </div>
          <div className={`flex items-start ${SPACING.lg}`}>
            <span className={`material-symbols-outlined text-primary ${ICON_SIZES.lg} mt-0.5`}>{ICONS.location_on}</span>
            <p className={`text-white ${TYPOGRAPHY.body.base}`}>123 Đường Nguyễn Văn Linh, P. Tân Phong, Quận 7, TP.HCM</p>
          </div>
        </div>

        {/* Action Buttons - khác nhau tùy status */}
        <div className={`${SPACE_Y.md} pt-2`}>
          {/* Chat Button - chỉ cho CONFIRMED và UPCOMING */}
          {showChatButton && (
            <PrimaryButton
              className={`w-full ${SPACING.sm}`}
              onClick={() => {
                console.log('Open Zalo Chat')
              }}
            >
              <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>{ICONS.chat}</span>
              Mở Zalo Chat
            </PrimaryButton>
          )}

          {/* Match Room Button - cho PENDING và CAPPING */}
          {showMatchRoomButton && (
            <PrimaryButton
              className={`w-full ${SPACING.sm}`}
              onClick={() => navigate(`/match-room/${id}`)}
            >
              <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>{ICONS.chat}</span>
              Vào Match Room
            </PrimaryButton>
          )}

          {/* Confirm Button - cho CONFIRMING */}
          {showConfirmButton && (
            <PrimaryButton
              className={`w-full ${SPACING.sm}`}
              onClick={() => navigate(`/match/${id}/confirm`)}
            >
              <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>{ICONS.check_circle}</span>
              Xác nhận kèo
            </PrimaryButton>
          )}

          {/* Edit and Update Result - cho CONFIRMED và UPCOMING */}
          {showEditButton && (
            <div className={`grid grid-cols-2 ${SPACING.md}`}>
              <SecondaryButton
                className={`w-full ${SPACING.sm}`}
                onClick={() => {
                  console.log('Edit match')
                }}
              >
                <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>{ICONS.edit}</span>
                Chỉnh sửa
              </SecondaryButton>
              <SecondaryButton
                className={`w-full ${SPACING.sm}`}
                onClick={() => navigate(`/match/${id}/result`)}
                disabled={!showUpdateResultButton}
              >
                <span className={`material-symbols-outlined ${ICON_SIZES.md}`}>{ICONS.scoreboard}</span>
                Cập nhật kết quả
              </SecondaryButton>
            </div>
          )}
        </div>

        {/* Player Roster Card - chỉ hiển thị cho CONFIRMED và UPCOMING */}
        {(showCountdown || showChatButton) && (
          <div className={`bg-[#1a2431] ${BORDER_RADIUS.md} ${CARD.padding}`}>
            <div className={`flex justify-between items-center mb-4`}>
              <h3 className={`text-white font-bold ${TYPOGRAPHY.heading['4']}`}>Danh sách tham gia</h3>
              <div className={`flex items-center ${SPACING.xs}`}>
                <span className="text-primary font-bold">14/14</span>
                <span className={`text-[#9aa9bc] ${TYPOGRAPHY.body.sm}`}>cầu thủ</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-[#1a2431]"
                    alt={`Player ${i}`}
                    src={`https://via.placeholder.com/40?text=P${i}`}
                  />
                ))}
                <div className="h-10 w-10 rounded-full ring-2 ring-[#1a2431] bg-[#272f3a] flex items-center justify-center">
                  <span className={`text-white ${TYPOGRAPHY.body.sm} font-bold`}>+10</span>
                </div>
              </div>
              <a className={`text-primary font-medium ${TYPOGRAPHY.body.sm} flex items-center ${SPACING.sm}`} href="#" onClick={(e) => {
                e.preventDefault()
                console.log('View all players')
              }}>
                Xem tất cả <span className={`material-symbols-outlined ${ICON_SIZES.base}`}>{ICONS.chevron_right}</span>
              </a>
            </div>
          </div>
        )}

        {/* Event Timeline */}
        <MatchTimeline events={timelineEvents} />
      </main>
    </div>
  )
}

export default MatchDetailScreen
