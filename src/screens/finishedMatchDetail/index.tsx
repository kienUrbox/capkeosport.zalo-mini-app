import { useNavigate, useParams } from 'react-router-dom'

import { StandardHeader } from '../../components/common'
import { PrimaryButton } from '../../components/ui'
import type { Match } from '../../types'

const FinishedMatchDetailScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Mock data - sẽ thay bằng API call
  const match: Match = {
    id: id || '1',
    status: 'FINISHED',
    teamA: {
      id: 'team-a',
      name: 'Victory FC',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqyuxFwh8vWnrBadIpHtcuSJ9j_2IGvrGIcWwGvULkn1vCVjp4_aVkOVmSvp3vKH4bOnZnb8P1hdTQmGJUaGUOpLpFyEprCFYAKm4NYvGzHU0hIgoh0qLOmCbrkbirGUNTS5Kw-diNSpX0zA8fo8hNPLCogmq1DcJM9sjE2301F7EyC2Kjn6GeehAmWxf-1ux-Ahah8dr5nI0nesgW31CIVtC6UX0YKQGldFxFfX4oYID8BwNsm1EJA2Eu0YpgvaqRIXkx_ZriQGA',
      level: '4',
      gender: 'Nam',
    },
    teamB: {
      id: 'team-b',
      name: 'Spartans United',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1N6NjUx7D6hrwZx394uJrqjKrChMpQKOXhZvcPkj4MlvXFoPsoxElP5m8kBgAfdmtbW9ilYQ1UdUgFUk0quG9RNBhYwe4i05Pw66lEh8oLkE_UALld32SbahPZJLWFR5UxC3a31mHiPaWUFGJMyKufH3Sw3EKxvWK1F0nHURPCYLCusjuTANtuatbIxncmfUnzPpEkL3UPV3pCH3Bp7OrfL_svGJSlOEDrxJxRRs6hDL9UkLLjtQLKSeC8ilURt6QuTN7coPcM8I',
      level: '4',
      gender: 'Nam',
    },
    date: 'Sat, 23 Oct 2023',
    time: '19:00',
    location: 'Central Stadium',
    score: {
      teamA: 5,
      teamB: 3,
    },
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDta4RKk-W9z_gWwL9Wlbp9uG8LMIhoRet7QBwLl5w-Wp3O3Md8qwPFS9I-1W0Bv1PD3zE05sKJhbl4UCybAo-Fly4wJdEcLO_DVVKDs4hm6AVY2ePR2DOtRMm_t83GBTXYZ7JXkF25dTCPvgtlcmH6cssK_Njnf67xCDNWCPeLq_fKDfRAMp2jXm_D9DrYCK-K-zhOz0_i0XIvTp672TzdLMacYE4aBrE0abbPoFcIIaKy_RhbPWItinGexr0OKQ_eW_GCsCLPptA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Hu5_3QhRRVYSuvZoIqoAZu4WiStTqvvjDoKjZho80z1nqg8FMggKvPjRYyNJCwv5s_gk2PWPv82C1Hawvyg9SlSOvoV3hCGevRQxYdfbI0K3HowpVo8425mRYlRGv-ni6aWvJSMsDQfHHUwCpinWj21Irt8k4PRhX1fNr5AeRMqE-RHQL_eVlD5PmJZzRCWzV0Cas6pn-_4FIyVsWkzp1IBr_eQfWDnvQRYTnIckohWgbxlK7rAqKMx6mWiZy4vS-PWrlnNkvW0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdcTPqOL0qoOxXcLuaQcQ55RvMg2gkbHbWjI8A8L4Jjhf7jaPZSsgWywJt1qSrH6FliecBV4bCtTgJL0F6XGBodTMPqJxwmU3de7aT1CfT6sS_c9UM_syURRyM8HiiHPg62s2tCtLrT0qhZighdrZEkHeM65Djh7qURAU-VU7dbuMdp45mLf0SwqdiCPZQ6nb5Pazy42a_gaggnXl0dl3U34DKPjfNeE1oMRNkBJP03PpeJwmsgA2Fv99AEyolIa5gPzZUuLdgbiY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeooYG5QL0tPtaOEUyUZg8sDij2KBkS-HFM3k0Q8Of280hb50sPUxBA5LnEw-CpGSwX56ZayACjRc8YnwOqp_Mf77wtbsGSkpMpo_7TOawLy35mj0cz4cWZLZiGlyjE3XQeZpFByEW41kvg9DvQHDToyexvcE0hkqNf-kSPerm1iC3khbsL4S-B5dGQnWmmeoOPZ9A7NxP5LFnaA8-PSdTiLUw2vg4fCcgAoagtcUrn8hx6alX6KSyYdvwQEDaN9P35SRdxwuU4kE',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const isWinnerA = match.score && match.score.teamA > match.score.teamB

  const previousEncounters = [
    { date: '15 Sep 2023', score: { teamA: 2, teamB: 2 } },
    { date: '02 Jun 2023', score: { teamA: 1, teamB: 3 } },
  ]

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden">
      <StandardHeader title="Kết quả trận đấu" />

      {/* Team Banners & Score */}
      <div className="p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Team A */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <img
                className="w-full h-full object-cover rounded-full border-4 border-emerald-500"
                alt="Team A logo"
                src={match.teamA.logo}
              />
            </div>
            <p className="text-white text-base font-bold leading-tight text-center">{match.teamA.name}</p>
            {isWinnerA && <p className="text-emerald-400 text-sm font-medium">Winner</p>}
            {!isWinnerA && <p className="text-slate-500 text-sm font-medium">Loser</p>}
          </div>
          {/* Score */}
          {match.score && (
            <h1 className="text-white tracking-tight text-5xl font-bold leading-none px-2">
              {match.score.teamA} - {match.score.teamB}
            </h1>
          )}
          {/* Team B */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <img
                className="w-full h-full object-cover rounded-full border-4 border-slate-600"
                alt="Team B logo"
                src={match.teamB.logo}
              />
            </div>
            <p className="text-white text-base font-bold leading-tight text-center">{match.teamB.name}</p>
            {!isWinnerA && <p className="text-emerald-400 text-sm font-medium">Winner</p>}
            {isWinnerA && <p className="text-slate-500 text-sm font-medium">Loser</p>}
          </div>
        </div>
      </div>

      {/* Match Meta Info */}
      <p className="text-[#9aa9bc] text-sm font-normal leading-normal pb-6 pt-2 px-4 text-center">
        {match.date}, {match.time} - {match.location}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 px-4 pb-8">
        <PrimaryButton className="flex-1" onClick={() => navigate(`/match/${id}/rematch`)}>
          Request Rematch
        </PrimaryButton>
        <button className="flex-shrink-0 bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">{ICONS.ios_share}</span>
        </button>
      </div>

      {/* Section: Match Recap */}
      <div className="px-4 pb-6">
        <h3 className="text-white text-lg font-bold mb-3">Match Recap</h3>
        <p className="text-[#9aa9bc] text-sm font-normal leading-relaxed">
          A hard-fought match from both sides. {match.teamA.name} took an early lead with two quick goals.{' '}
          {match.teamB.name} battled back to level the score in the second half, but a late surge from{' '}
          {match.teamA.name}'s striker sealed the deal. Great sportsmanship shown by all players.
        </p>
      </div>

      {/* Section: Gallery */}
      {match.gallery && match.gallery.length > 0 && (
        <div className="flex flex-col gap-3 pb-6">
          <h3 className="text-white text-lg font-bold px-4">Match Gallery</h3>
          <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch px-4 gap-3">
              {match.gallery.map((image, index) => (
                <div key={index} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section: Previous Encounters */}
      <div className="px-4 pb-8">
        <h3 className="text-white text-lg font-bold mb-4">Previous Encounters</h3>
        <div className="flex flex-col gap-3">
          {previousEncounters.map((encounter, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
              <p className="text-[#9aa9bc] text-sm">{encounter.date}</p>
              <div className="flex items-center gap-3">
                <p className="text-white font-medium">{match.teamA.name}</p>
                <p className="text-white font-bold text-lg">
                  {encounter.score.teamA} - {encounter.score.teamB}
                </p>
                <p className="text-white font-medium">{match.teamB.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FinishedMatchDetailScreen
