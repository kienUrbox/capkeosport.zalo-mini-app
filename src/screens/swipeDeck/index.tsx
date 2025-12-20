import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { PrimaryButton } from '../../components/ui'
import { ICONS } from '../../constants/design'
import SwipeMatchedScreen from '../swipeMatched'
import type { Team } from '../../types'

// Mock teams data - sẽ thay bằng API call
const userTeams = [
  {
    id: 'slayers',
    name: 'Slayers FC',
    role: 'Quản lý',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5WDMGPECPbmOgT0LA1SoGrWwWYhX6qmQE6oqcCX-J1Rk40ZbUESv8piyvf0Qq8RNUFQM2DNXhIGMkmhiW4-sip5bevcLKe3qgH_Et6bpCZVdaoGJ1l-FcDQpc4iGPMl9k3bYEIwI8ezIvNobZG3sOXJgiKue6bwX929pwv-vS96Qj-wSCBspuyD_VdTZj69ck7Qr-GH6oEkAIlW14e5NolI2nP1SPih0mdUEvuMPffTx9O0JPu9r9IUkQwMoU0QkFOIIcksrjQ5M',
  },
  {
    id: 'wolves',
    name: 'The Wolves',
    role: 'Đội trưởng',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDou4yV--QpYu7A-1zPqyxh5MzUxZFykXr9s4Uh1D8qMg2fMnrRwH8H0HlfhxHAQBilwqi9VbybApxKYzZcd4ijdxLyNY91H_K6kJh5zVJ-Bzy8NEFkmiNbG7ncMf4AUj-jYx4msw9Y8Cxe8jilon7GtOLctAhemuvUBHPaQpfLTnpnAdVAGyhIA1X1yizNcFBYGriQPvxkHqw63Lm1Dvg_ltexId8fUpfVHtK3Df5hGOOkSZ_Mj4lWK3OWRBtonrmV0eZ7MRcsgJ0',
  },
  {
    id: 'gryff',
    name: 'Gryffindor',
    role: 'Thành viên',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxH6B1o6N74rps_1b1IKUW9FTHgwiub9KfVtOoFuVi9MMZfAZCB8J5tt5gKujoUmKoFq2xVsI-1DJR-nxY93-o6OgzKf7AM7s2s3Nn5WfoHMvTwb9o3VltAY3M4WxZc8y2bKY1RE41waDpthIRgwYIkeXtKxotLFnxiP23CWPbrt6zoZFF2CIO3PqNUZ7VszjNHEvMG-eo5oWKiF_mpp6d9-dqw-lYpN3oHxEJ04NoB9vVT6t8lCZMh2JxPIK-F1NGKh-0F1XRkL8',
  },
]

const SwipeDeckScreen = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(searchParams.get('team'))
  const [showTeamSelector, setShowTeamSelector] = useState(!selectedTeamId)
  const [showMatched, setShowMatched] = useState(false)

  // Lấy team đã chọn
  const selectedTeam = userTeams.find((t) => t.id === selectedTeamId) || userTeams[0]
  const yourTeam: Team = {
    id: selectedTeam.id,
    name: selectedTeam.name,
    logo: selectedTeam.logo,
    level: '4',
    gender: 'Nam',
  }

  // Mock data - sẽ thay bằng API call
  const currentTeam: Team = {
    id: 'team-1',
    name: 'Dragon Fire FC',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rYRwHku5jgTQl3n1J4g0jGgAHJy7dus7Ln2V06_MTeSBEFdI1N2H37GY2FvRHByWqegqHDA_LxMKGPoihYRIcvDL9bimIYucHHNuR_t3KU3H3g8xGIZYlH3SdL8NBBwsulXw3kVNPa8nFdldgHoWmzUJo9ij9Kjan_YI7outh0Z4zE1JMleZRJR2YK0BEuFCQqnuzA03zUZ5ZNl_v1UppCO_r3cJKgSdJum46BAUaMBfB8p9-NVmwphmiATSWenNafDr_PAC22o',
    level: 'Intermediate',
    gender: 'Mixed',
    stats: {
      attack: 80,
      defense: 65,
      technique: 75,
    },
    location: 'Quận 1, TP.HCM',
    pitch: ['Sân 7'],
    members: 12,
  }

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId)
    setShowTeamSelector(false)
    // Update URL without navigation
    navigate(`/swipe?team=${teamId}`, { replace: true })
  }

  const handleLike = () => {
    // TODO: API call to like team
    console.log('Liked team:', currentTeam.id)
    // Show matched modal
    setShowMatched(true)
  }

  const handleReject = () => {
    // TODO: API call to reject team
    console.log('Rejected team:', currentTeam.id)
    // Load next team
  }

  // Nếu chưa chọn team, hiển thị team selector
  if (showTeamSelector || !selectedTeamId) {
    return (
      <div className="relative flex h-[100dvh] w-full max-w-[375px] mx-auto flex-col bg-background-dark overflow-hidden">
        {/* Background Screen Content */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDn-o2vjcYNXyqzYdkzMbFRfml45DDFkLOUiAI_bV7G7NgmWWSQNmhZahwVtjtX2gSNTDyHL9Y_7tx1RGFq7pc8wCVENZ5yDF9VdhjwIu9mMcyoxEGwvirHarRwinGPDXoAZO4mX2tJOWZgBWBjSV6h5QacIkkTXqmeZUdFoLq4GHyOKZMB4kCooejuWVFrOUSUPDwr_7WJE70056z-s-Z2jWKo5jLXK4a_PxZONLS443_Eb9FVBxadRU_x4ivdi0MqwMYZOAQ9pdM')",
          }}
        >
          <div className="absolute inset-0 bg-background-dark/50"></div>
        </div>
        {/* Modal Overlay */}
        <div className="absolute inset-0 flex h-full w-full flex-col justify-end bg-black/60">
          <div className="flex flex-col w-full bg-background-dark rounded-t-xl">
            {/* BottomSheetHandle */}
            <div className="flex h-5 w-full items-center justify-center pt-3 shrink-0">
              <div className="h-1 w-9 rounded-full bg-[#394556]"></div>
            </div>
            {/* HeadlineText */}
            <div className="flex items-center justify-between px-4 pt-5 pb-2">
              <h3 className="text-white tracking-light text-2xl font-bold leading-tight text-left">
                Bạn muốn cáp kèo cho đội nào?
              </h3>
              <button className="text-[#9aa9bc] font-medium text-base" onClick={() => navigate(-1)}>
                Hủy
              </button>
            </div>
            {/* Scrollable Team List */}
            <div className="flex flex-col gap-2 px-4 py-4 overflow-y-auto max-h-[60vh]">
              {userTeams.map((team) => {
                const selected = team.id === selectedTeamId
                return (
                  <button
                    key={team.id}
                    className={`flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between rounded-xl ${
                      selected
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-[#1a2533] border border-transparent'
                    }`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                        style={{ backgroundImage: `url(${team.logo})` }}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-white text-base font-medium leading-normal line-clamp-1">{team.name}</p>
                        <p className="text-[#9aa9bc] text-sm font-normal leading-normal line-clamp-2">{team.role}</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary">
                      {selected && (
                        <span className={`material-symbols-outlined text-white text-lg`}>{ICONS.done}</span>
                      )}
                      {!selected && <div className="h-7 w-7 rounded-full border-2 border-[#394556]" />}
                    </div>
                  </button>
                )
              })}
            </div>
            {/* CTA Section */}
            <div className="px-4 pt-4 pb-6 mt-auto">
              <PrimaryButton
                className="w-full py-3.5 rounded-xl text-base font-semibold leading-snug"
                onClick={() => {
                  if (selectedTeamId) {
                    handleTeamSelect(selectedTeamId)
                  } else {
                    // Chọn team đầu tiên nếu chưa chọn
                    handleTeamSelect(userTeams[0].id)
                  }
                }}
              >
                Chọn đội này
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#121212]">
      {/* Top App Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pb-2 bg-transparent">
        <div className="flex size-12 shrink-0 items-center justify-center">
          <span className={`material-symbols-outlined text-white text-3xl`}>{ICONS.sports_soccer}</span>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1">CapKeoSport</h2>
        <div className="flex w-12 items-center justify-end">
          <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
            onClick={() => navigate('/incoming-requests')}
          >
            <span className={`material-symbols-outlined text-white text-2xl`}>{ICONS.chat_bubble}</span>
          </button>
        </div>
      </header>

      {/* Swipe Deck Area */}
      <main className="relative flex-grow flex items-center justify-center p-4 pt-20 pb-32">
        {/* Card Stack */}
        <div className="w-full h-full relative">
          {/* Background Card 2 */}
          <div className="absolute inset-0 top-4 scale-95 rounded-lg bg-[#1E1E1E] shadow-2xl shadow-black/30"></div>
          {/* Top Card */}
          <div className="absolute inset-0 flex flex-col rounded-lg bg-[#1E1E1E] overflow-hidden shadow-2xl shadow-black/40">
            {/* Banner Image */}
            <div className="relative h-[40%] w-full bg-cover bg-center" style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4a56zoPkUIJj9tXU1cgQDSm4W7xvLFBlcx3-ERh5A87InUzHhmuRJkuNoz3zw2E0R60LB1-waQKYmkCVggEuEQNjbbg5LtZm19vRuvnXIQBOt92wisknvBkLiaiXGvyNOm-alXyxSYCuvFitc94ALpib78xi6xECRkoGcaoMr_TvIkoHSw1bTKXnvjL3tnm5dfBiFH6Y0VtwjfsYPfs-Duanr0jRcAbaKehs9URHCeFc_HbZPNAbusteF6kGkWImMhMRJoyubWU4")',
            }}>
              {/* Overlay Header */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="overflow-visible w-16 h-16 flex-shrink-0">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover border-2 border-white/50 bg-[#272f3a] text-[#9aa9bc] rounded-full flex items-center justify-center size-16"
                    style={{ backgroundImage: `url(${currentTeam.logo})` }}
                  />
            </div>
                <p className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">{currentTeam.name}</p>
              </div>
            </div>
            {/* Info Section */}
            <div className="flex flex-col gap-4 p-4 flex-grow">
              {/* Badges/Chips */}
              <div className="flex gap-2">
                <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#272f3a] px-3">
                  <p className="text-[#E0E0E0] text-xs font-medium leading-normal">{currentTeam.gender}</p>
                </div>
                <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/30 px-3">
                  <p className="text-primary text-xs font-medium leading-normal">{currentTeam.level}</p>
            </div>
                {currentTeam.pitch && currentTeam.pitch.length > 0 && (
                  <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#272f3a] px-3">
                    <p className="text-[#E0E0E0] text-xs font-medium leading-normal">Pitch {currentTeam.pitch[0]}</p>
                  </div>
                )}
              </div>
              {/* Location & Stats */}
              <div className="flex items-center gap-3 justify-between border-b border-white/10 pb-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[#9E9E9E] text-sm font-normal leading-normal">
                    5km away • {currentTeam.location}
                  </p>
                  <p className="text-[#9E9E9E] text-sm font-normal leading-normal">
                    {currentTeam.members} members • Active 2h ago
                  </p>
                </div>
              </div>
              {/* Attribute Bars */}
              {currentTeam.stats && (
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Attack', value: currentTeam.stats.attack },
                    { label: 'Defense', value: currentTeam.stats.defense },
                    { label: 'Technique', value: currentTeam.stats.technique },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1.5">
                      <div className="flex gap-6 justify-between items-center">
                        <p className="text-[#E0E0E0] text-sm font-medium leading-normal">{stat.label}</p>
                        <p className="text-white text-sm font-bold leading-normal">{stat.value / 10}</p>
                      </div>
                      <div className="rounded-full bg-[#394556] h-1.5">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${stat.value}%` }}></div>
                      </div>
                </div>
              ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-6 p-6">
        <button
          className="flex size-16 items-center justify-center rounded-full bg-[#272f3a] text-[#E53935] shadow-lg"
          onClick={handleReject}
        >
          <span className={`material-symbols-outlined text-4xl`}>{ICONS.close}</span>
        </button>
        <button
          className="flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30"
          onClick={handleLike}
        >
          <span className={`material-symbols-outlined text-5xl`}>{ICONS.favorite}</span>
        </button>
      </footer>

      {/* Match Animation Modal */}
      {showMatched && (
        <SwipeMatchedScreen
          yourTeam={yourTeam}
          matchedTeam={currentTeam}
          onSendMessage={() => {
            setShowMatched(false)
            navigate(`/team/${currentTeam.id}`)
          }}
          onKeepSwiping={() => {
            setShowMatched(false)
          }}
        />
      )}
    </div>
  )
}

export default SwipeDeckScreen

