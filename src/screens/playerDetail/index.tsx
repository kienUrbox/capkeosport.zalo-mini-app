import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { Badge, PrimaryButton, SecondaryButton } from '../../components/ui'
import {
  BORDER_RADIUS,
  ICONS,
  ICON_SIZES,
  PADDING,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/design'

type PlayerDetail = {
  id: string
  name: string
  avatar: string
  cover: string
  position: string
  preferredFoot: string
  age: number
  height: number
  location: string
  team: string
  description: string
  availability: string[]
  stats: {
    matches: number
    goals: number
    assists: number
    rating: number
  }
  skills: string[]
}

const mockPlayers: Record<string, PlayerDetail> = {
  'player-1': {
    id: 'player-1',
    name: 'Nguyễn Tiến',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8h7cGOxCU0MaMeYuJN5NrW8U39j1L_d5bvipSwprEvzTVuoXwHEUxXSzgu9p8TH6-yNZmk76pAoRyMO7cNVQgEsNftbY5KWoOvStDLBpzJ5hRc5p0D1HYEbDvnr2DFVUmiHwRPf1jXfGlVLxT3Fp0fG8hnIAj6wLP99ST7SDgwM7e_oQ_Qcbpt41IgR-eJcDDysauWWqI6kb86hnsPPsvwGWwBHiPaTNQLfUHpi095zjbcZcjV5m0rg_kLV1v_H45q_5vb05Rc0',
    cover:
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    position: 'Tiền đạo cánh phải',
    preferredFoot: 'Chân phải',
    age: 26,
    height: 175,
    location: 'Quận 7, TP.HCM',
    team: 'CapKeoSport FC',
    description:
      'Kỹ thuật tốt, tốc độ cao và khả năng xử lý bóng trong phạm vi hẹp. Thường xuyên hỗ trợ tấn công và pressing tuyến đầu.',
    availability: ['Thứ 3 tối', 'Thứ 5 tối', 'Cuối tuần'],
    stats: {
      matches: 42,
      goals: 18,
      assists: 12,
      rating: 4.8,
    },
    skills: ['Tốc độ', 'Dứt điểm', 'Pressing', 'Kết nối đồng đội'],
  },
}

const recentMatches = [
  { id: 'm-1', opponent: 'Sunday Ballers', result: '3 - 2', highlight: 'Ghi 1 bàn, 1 kiến tạo', date: '12/11' },
  { id: 'm-2', opponent: 'Hẻm Team', result: '4 - 1', highlight: 'MVP trận đấu', date: '05/11' },
  { id: 'm-3', opponent: 'Anh Em United', result: '2 - 2', highlight: 'Ghi bàn gỡ hòa phút 88', date: '28/10' },
]

const PlayerDetailScreen = () => {
  const navigate = useNavigate()
  const { playerId } = useParams<{ playerId: string }>()

  const player = useMemo(() => {
    if (!playerId) return mockPlayers['player-1']
    return mockPlayers[playerId] ?? mockPlayers['player-1']
  }, [playerId])

  return (
    <div className="relative flex min-h-screen flex-col bg-background-dark text-white">
      <StandardHeader title="Chi tiết cầu thủ" />

      {/* Cover + Avatar */}
      <section className="relative h-56 w-full">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${player.cover})` }}
        >
          <div className="h-full w-full bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <div
            className={`mb-3 h-28 w-28 border-4 border-background-dark bg-cover bg-center ${BORDER_RADIUS.full}`}
            style={{ backgroundImage: `url(${player.avatar})` }}
          />
          <h1 className={`${TYPOGRAPHY.heading['2']} text-center`}>{player.name}</h1>
          <p className={`${TYPOGRAPHY.body.sm} text-text-secondary-dark mt-1`}>{player.team}</p>
        </div>
      </section>

      <main className={`flex flex-1 flex-col gap-6 ${PADDING.md}`}>
        {/* Badges */}
        <section className="flex flex-wrap items-center justify-center gap-2">
          <Badge label={player.position} variant="default" />
          <Badge label={player.preferredFoot} variant="default" />
          <Badge label={`${player.age} tuổi`} variant="default" />
          <Badge label={`${player.height} cm`} variant="default" />
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3">
          {[
            { label: 'Kèo đã đá', value: player.stats.matches },
            { label: 'Bàn thắng', value: player.stats.goals },
            { label: 'Kiến tạo', value: player.stats.assists },
            { label: 'Đánh giá', value: `${player.stats.rating}/5` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-card/40 p-4 text-center"
            >
              <p className={`${TYPOGRAPHY.heading['3']} text-primary`}>{stat.value}</p>
              <p className={`${TYPOGRAPHY.caption} text-text-secondary-dark mt-1`}>{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Description */}
        <section className="space-y-2 rounded-2xl bg-card/50 p-4">
          <h3 className={`${TYPOGRAPHY.heading['4']}`}>Giới thiệu</h3>
          <p className={`${TYPOGRAPHY.body.sm} text-text-secondary-dark`}>{player.description}</p>
          <div className="flex items-center gap-2 pt-2 text-text-secondary-dark">
            <span className={`material-symbols-outlined ${ICON_SIZES.sm}`}>
              {ICONS.location_on}
            </span>
            <p className={`${TYPOGRAPHY.body.sm}`}>{player.location}</p>
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-2">
          <h3 className={`${TYPOGRAPHY.heading['4']}`}>Điểm mạnh</h3>
          <div className="flex flex-wrap gap-2">
            {player.skills.map((skill) => (
              <span
                key={skill}
                className={`rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section className="space-y-3 rounded-2xl border border-dashed border-white/15 p-4">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${ICON_SIZES.sm} text-emerald-400`}>
              {ICONS.schedule}
            </span>
            <h3 className={`${TYPOGRAPHY.heading['4']} text-emerald-400`}>Thời gian sẵn sàng</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {player.availability.map((slot) => (
              <span
                key={slot}
                className={`rounded-full bg-white/10 px-3 py-1 ${TYPOGRAPHY.caption} text-white`}
              >
                {slot}
              </span>
            ))}
          </div>
        </section>

        {/* Recent Matches */}
        <section className="space-y-3">
          <h3 className={`${TYPOGRAPHY.heading['4']}`}>Thành tích gần đây</h3>
          <div className={`flex flex-col ${SPACING.md}`}>
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
              >
                <div>
                  <p className={`${TYPOGRAPHY.body.base} font-semibold`}>{match.opponent}</p>
                  <p className={`${TYPOGRAPHY.caption} text-text-secondary-dark`}>
                    {match.highlight}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`${TYPOGRAPHY.heading['4']} text-primary`}>{match.result}</p>
                  <p className={`${TYPOGRAPHY.caption} text-text-secondary-dark`}>{match.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 bg-background-dark/90 px-4 py-4 backdrop-blur-lg">
        <div className="flex flex-col gap-3">
          <PrimaryButton
            className="h-12 w-full"
            onClick={() => console.log('Open Zalo chat with player')}
          >
            <span className="material-symbols-outlined text-base">{ICONS.chat}</span>
            Nhắn Zalo
          </PrimaryButton>
          <SecondaryButton
            className="h-12 w-full"
            onClick={() => console.log('Invite player to join')}
          >
            Đề nghị tham gia đội
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetailScreen


