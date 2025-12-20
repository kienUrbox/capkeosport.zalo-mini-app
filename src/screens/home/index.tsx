import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SectionHeader } from '../../components/common'
import {
  MatchHorizontalCard,
  NearbyTeamCard,
  PrimaryButton,
  QuickActionCard,
} from '../../components/ui'
import { ICONS } from '../../constants/design'
import TeamSelectBottomSheet from './TeamSelectBottomSheet'
import TeamCreationWizard from '../team-create'

const heroBackground =
  "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwWYL437-AK5yOluzRDTckum_YBigB4xWzcvDdOuHq2ZKiiCFVFQI6uMprCv0O8-aAE98O4dhoFRSEmeVHdVhy6apxDuBO6Ov3vvLDjsUsYuRSeI_DZkcsYC6InxAo1TKFMKC33soOFrRRgD5zdlhFAb-elv4f2xdiBL2YaVfwmHY5jqpilsJvh_p990lZA2TZCkOL3X640lWAReazHhIt320N9N02YZ0N2aMPMH0FKHFq9yWCkKxW5C-vXlmxYsCSn3_6Z4KD8Ac')";

type QuickAction = {
  label: string
  icon: string
  to?: string
  action?: 'open-team-picker' | 'open-team-creation'
}

const quickActions: QuickAction[] = [
  { label: 'Tạo đội', icon: ICONS.group_add, action: 'open-team-creation' },
  { label: 'Cáp kèo', icon: ICONS.swords, action: 'open-team-picker' },
  { label: 'Trận tới', icon: ICONS.event_upcoming, to: '/matches' },
]

const nearbyTeams = [
  { name: 'Red Fireballs', level: 'Level 5', distance: '2.1 km', badge: '🔥', gender: 'Nam' },
  { name: 'Blue Lions', level: 'Level 4', distance: '3.5 km', badge: '🦁', gender: 'Nam' },
  { name: 'Green Eagles', level: 'Level 5', distance: '4.0 km', badge: '🦅', gender: 'Nữ' },
  { name: 'Golden Tigers', level: 'Level 3', distance: '5.2 km', badge: '🐯', gender: 'Nam' },
]

const openMatches = [
  {
    team: 'Saigon United',
    level: 'Level 4-5',
    time: 'Thứ Bảy, 20:00 · 28/10',
    location: 'Sân Tao Đàn, Quận 1',
  },
  {
    team: 'Hanoi Warriors',
    level: 'Level 3-4',
    time: 'Chủ nhật, 18:00 · 29/10',
    location: 'Sân Mỹ Đình 2, Từ Liêm',
  },
]

const HomeScreen = () => {
  const navigate = useNavigate()
  const [isTeamSheetOpen, setTeamSheetOpen] = useState(false)
  const [isTeamCreationOpen, setIsTeamCreationOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <div className="flex-1 pb-24">
        <header className="px-5 pt-6">
          <p className="text-muted text-sm">Xin chào,</p>
          <h1 className="text-3xl font-semibold leading-tight">User!</h1>
        </header>

        <div className="px-4 pt-4">
          <div
            className="rounded-3xl bg-cover bg-center p-4 pt-40 shadow-card"
            style={{ backgroundImage: heroBackground }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-bold">Cáp kèo ngay hôm nay</p>
                <p className="text-white/80 text-base">Tìm đối thủ và sân bóng phù hợp</p>
              </div>
              <PrimaryButton className="w-auto px-6" onClick={() => setTeamSheetOpen(true)}>
                Tạo kèo
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 py-5">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.label}
              icon={action.icon}
              label={action.label}
              onClick={() => {
                if (action.action === 'open-team-picker') {
                  setTeamSheetOpen(true)
                } else if (action.action === 'open-team-creation') {
                  setIsTeamCreationOpen(true)
                } else if (action.to) {
                  navigate(action.to)
                }
              }}
            />
          ))}
        </div>

        <div className="pt-2">
          <SectionHeader
            title="Đội gần bạn"
            actionText="Xem tất cả"
            onAction={() => navigate('/teams')}
          />
          <div className="flex gap-4 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nearbyTeams.map((team) => (
              <NearbyTeamCard key={team.name} {...team} />
            ))}
          </div>
        </div>

        <div className="pt-4">
          <SectionHeader
            title="Kèo đang mở"
            actionText="Xem tất cả"
            onAction={() => navigate('/matches')}
          />
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {openMatches.map((match) => (
              <MatchHorizontalCard
                key={match.team}
                {...match}
                onDetail={() => navigate('/match/123')}
              />
            ))}
          </div>
        </div>
      </div>

      <TeamSelectBottomSheet
        isOpen={isTeamSheetOpen}
        onClose={() => setTeamSheetOpen(false)}
        onSelect={(teamId) => {
          setTeamSheetOpen(false)
          navigate(`/swipe?team=${teamId}`)
        }}
      />

      {/* Team Creation Modal */}
      {isTeamCreationOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-white/10 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Tạo Đội Mới</h2>
              <button
                onClick={() => setIsTeamCreationOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <TeamCreationWizard
              onComplete={(team) => {
                console.log('Team created:', team)
                setIsTeamCreationOpen(false)
                // Navigate to team detail or show success message
                navigate('/team')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeScreen

