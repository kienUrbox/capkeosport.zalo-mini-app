import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { Badge, PrimaryButton } from '../../components/ui'
import type { Match } from '../../types'

const MatchRoomScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Mock data - sẽ thay bằng API call
  const match: Match = {
    id: id || '1',
    status: 'CAPPING',
    teamA: {
      id: 'team-a',
      name: 'FC Cà Phê',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA115YPGdtYw7D9cINH62MWeTP6ul-m5wUFD00fXeHgAgK1YKkmVsfrHKGkF4DI_YleogiRL9ajRg-D1QOUjWeUqn9II4N2yLShGwXxAjgSSpEcnwXzKRmWqzuo9TAyL-IPr9G0TXUY2aE3C8XOcH3QLFvlKLwnlUjweo80l99ttyKtLftPZP76StyWEavNRIZ9nFNVur64VGbN2InKMbZnmqqL7knJsjn3tuJYtlowFh1HVbMSeWm_zfXPK_s1NZ7U2qNlhvfOTHk',
      level: '4',
      gender: 'Nam',
    },
    teamB: {
      id: 'team-b',
      name: 'Anh Em United',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEPAMp1f2tt3q_zNauZvC6rGbrwnTqMa6KsplF-MXuHD2jOcqkL1PY18c90Kml4M7Sf5xNpbWmFr-tsiagCrJ04HMVnM-q6GifrOck4Z6wZrS0-SLPD5UCtkWJWtbksduaCHgOLjHsLpjs744uBYWyUNaEB8tcNHr8_rtEBzJO_MF9878W2ZEvihKJbuGtXBlza4rGQpiw8npbn2Y4NN8taVPpasa5KevHrWANryZ5KwQUjsStTypZoI5JNheai6zu9VbyAz28rCI',
      level: '4',
      gender: 'Nam',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const timelineEvents = [
    { id: '1', title: 'Đã chấp nhận lời mời', timestamp: '10:30 AM, 24/07/2024', icon: 'check_circle', color: 'text-green-500' },
    { id: '2', title: 'Đã gửi lời mời', timestamp: '10:25 AM, 24/07/2024', icon: 'send', color: 'text-primary' },
  ]

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-white group/design-root overflow-x-hidden">
      <StandardHeader title="Phòng chờ trận đấu" />

      {/* ProfileHeader and Matchup */}
      <div className="flex flex-col items-center p-4">
        <div className="flex w-full flex-row items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16"
              style={{ backgroundImage: `url(${match.teamA.logo})` }}
            />
            <p className="text-white text-base font-bold leading-tight tracking-[-0.015em] text-center">
              {match.teamA.name}
            </p>
          </div>
          <div className="flex flex-col items-center px-2">
            <p className="text-[#B0B3B8] text-lg font-bold leading-normal">VS</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16"
              style={{ backgroundImage: `url(${match.teamB.logo})` }}
            />
            <p className="text-white text-base font-bold leading-tight tracking-[-0.015em] text-center">
              {match.teamB.name}
            </p>
          </div>
        </div>
      </div>

      {/* Chips/Status Badge */}
      <div className="flex gap-3 p-4 justify-center">
        <Badge label="Đã nhận kèo – Đang capping" variant="capping" />
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4 py-2">
        {timelineEvents.map((event, index) => (
          <>
            <div key={`icon-${event.id}`} className="flex flex-col items-center gap-1">
              {index > 0 && <div className="w-[2px] bg-[#3A3B3C] h-full grow"></div>}
              <div className="flex size-8 items-center justify-center">
                <span className={`material-symbols-outlined ${event.color}`} style={{ fontSize: '24px' }}>
                  {event.icon}
                </span>
              </div>
              {index < timelineEvents.length - 1 && <div className="w-[2px] bg-[#3A3B3C] h-full grow"></div>}
            </div>
            <div key={`content-${event.id}`} className={`flex flex-1 flex-col ${index === 0 ? 'pb-6' : 'pt-6'}`}>
              <p className="text-white text-base font-medium leading-normal">{event.title}</p>
              <p className="text-[#B0B3B8] text-sm font-normal leading-normal">{event.timestamp}</p>
            </div>
          </>
        ))}
      </div>

      {/* Card/Chat Preview */}
      <div className="p-4">
        <div className="flex flex-col items-stretch justify-start rounded-lg bg-[#3A3B3C] p-4">
          <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
            <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Trao đổi trước trận</p>
            <p className="text-[#B0B3B8] text-base font-normal leading-normal">
              Mở Zalo Chat để trao đổi chi tiết về trận đấu.
            </p>
          </div>
        </div>
      </div>

      {/* Spacer to push buttons to the bottom */}
      <div className="flex-grow"></div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 z-10 w-full bg-background-dark p-4">
        <div className="flex flex-col gap-3">
          <PrimaryButton
            className="h-12 w-full"
            onClick={() => navigate(`/match/${id}/confirm`)}
          >
            Chốt kèo
          </PrimaryButton>
          <button
            className="flex h-12 w-full items-center justify-center gap-x-2 rounded-lg bg-[#3A3B3C] px-6 text-base font-bold text-white"
            onClick={() => {
              console.log('Open Zalo Chat')
            }}
          >
            Mở Zalo Chat
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-x-2 rounded-lg bg-transparent px-6 text-base font-medium text-red-500"
            onClick={() => {
              console.log('Cancel invitation')
              navigate(-1)
            }}
          >
            Hủy lời mời
          </button>
        </div>
      </div>
    </div>
  )
}

export default MatchRoomScreen
