import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppHeader, Tabs, EmptyState, LoadingStates } from '../../components/common'
import { ICONS, SPACING } from '../../constants/design'
import type { Match } from '../../types'
import CappingTab from './CappingTab'
import ConfirmedAndUpcomingTab from './ConfirmedAndUpcomingTab'
import MatchedTab from './MatchedTab'
import FinishedTab from './FinishedTab'
import { useMatches } from '../../hooks'

const tabs = [
  { id: 'matched', label: 'Đã Match' },
  { id: 'capping', label: 'Đang Cấp Kèo' },
  { id: 'confirmed', label: 'Đã Chốt & Sắp Tới' },
  { id: 'finished', label: 'Đã Kết Thúc' },
]

const MatchesWithApiScreen = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('matched')

  // Use real API instead of mock data
  const {
    matches,
    isLoading,
    error,
    fetchMatches,
    pagination,
    refreshMatches,
    hasMore
  } = useMatches()

  // Load matches on component mount
  useEffect(() => {
    fetchMatches({
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    })
  }, [fetchMatches])

  // Filter matches by status
  const matchedMatches = matches.filter((m) => m.status === 'MATCHED')
  const cappingMatches = matches.filter((m) => ['PENDING', 'CAPPING', 'CONFIRMING'].includes(m.status))
  const confirmedAndUpcomingMatches = matches.filter((m) => ['CONFIRMED', 'UPCOMING'].includes(m.status))
  const finishedMatches = matches.filter((m) => m.status === 'FINISHED')

  // Load more function
  const loadMore = async () => {
    if (hasMore) {
      await fetchMatches({
        limit: 20,
        page: pagination.page + 1,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      })
    }
  }

  // Refresh function
  const handleRefresh = () => {
    refreshMatches()
  }

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

  // Loading state
  if (isLoading && matches.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <LoadingStates.Matches />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Lỗi tải dữ liệu"
            description={error || 'Không thể tải danh sách trận đấu. Vui lòng thử lại.'}
            actionText="Thử lại"
            onAction={handleRefresh}
          />
        </div>
      </div>
    )
  }

  // Empty state
  if (!isLoading && matches.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Chưa có trận đấu"
            description="Bạn chưa có trận đấu nào. Hãy swipe để tìm đối thủ phù hợp!"
            actionText="Tìm đội"
            onAction={() => navigate('/swipe-deck')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark p-4 justify-between">
        <StandardHeader
          title="Trận đấu"
          leftIcon={ICONS.back}
          onLeftPress={() => navigate(-1)}
          rightIcons={[
            ICONS.filter,
            ICONS.add
          ]}
        />
      </div>

      {/* Tabs */}
      <div className="w-full">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="px-4"
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading && matches.length > 0 && (
          <div className="text-center py-4">
            <LoadingStates.Small />
          </div>
        )}

        {!isLoading && !error && (
          <>
            {activeTab === 'matched' && <MatchedTab matches={matchedMatches} />}
            {activeTab === 'capping' && <CappingTab matches={cappingMatches} />}
            {activeTab === 'confirmed' && <ConfirmedAndUpcomingTab matches={confirmedAndUpcomingMatches} />}
            {activeTab === 'finished' && <FinishedTab matches={finishedMatches} />}
          </>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && !error && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-primary text-white rounded-lg disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : 'Xem thêm'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchesWithApiScreen