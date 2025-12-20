import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppHeader, Tabs } from '../../components/common'
import { ICONS } from '../../constants/design'
import { mockMatches } from '../../utils/mockData'
import type { Match } from '../../types'
import CappingTab from './CappingTab'
import ConfirmedAndUpcomingTab from './ConfirmedAndUpcomingTab'
import MatchedTab from './MatchedTab'
import FinishedTab from './FinishedTab'

const tabs = [
  { id: 'matched', label: 'Đã Match' },
  { id: 'capping', label: 'Đang Cáp Kèo' },
  { id: 'confirmed', label: 'Đã Chốt & Sắp Tới' },
  { id: 'finished', label: 'Đã Kết Thúc' },
]

const MatchesScreen = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('matched')

  // Filter matches by status
  const matchedMatches = mockMatches.filter((m) => m.status === 'MATCHED')
  const cappingMatches = mockMatches.filter((m) => ['PENDING', 'CAPPING', 'CONFIRMING'].includes(m.status))
  // Gom CONFIRMED và UPCOMING thành 1 tab
  const confirmedAndUpcomingMatches = mockMatches.filter((m) => ['CONFIRMED', 'UPCOMING'].includes(m.status))
  const finishedMatches = mockMatches.filter((m) => m.status === 'FINISHED')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'matched':
        return <MatchedTab matches={matchedMatches} />
      case 'capping':
        return <CappingTab matches={cappingMatches} />
      case 'confirmed':
        return <ConfirmedAndUpcomingTab matches={confirmedAndUpcomingMatches} />
      case 'finished':
        return <FinishedTab matches={finishedMatches} />
      default:
        return <MatchedTab matches={matchedMatches} />
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark p-4 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start"></div>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Kèo</h1>
        <div className="flex w-12 items-center justify-end">
          <button
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-[#1E1E1E] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
            onClick={() => navigate('/swipe')}
          >
            <span className={`material-symbols-outlined text-white text-[24px]`}>{ICONS.add}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </div>
  )
}

export default MatchesScreen
