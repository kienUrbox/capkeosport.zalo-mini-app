import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Icon,
  TeamAvatar,
  Button,
  PendingMatchCard,
  UpcomingMatchCard,
  HistoryMatchCard,
  SchedulePendingSkeleton,
  ScheduleUpcomingSkeleton,
  ScheduleHistorySkeleton,
} from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useScheduleData } from '@/hooks/useScheduleData';
import { useMyTeams, useSelectedTeam, useTeamActions, useTeamStore } from '@/stores/team.store';
import { useMatchActions } from '@/stores/match.store';
import type { TabType } from '@/stores/match.store';

/**
 * MatchSchedule Screen
 *
 * 3-tab interface: Pending (Chờ kèo), Live (Lịch đấu), History (Lịch sử)
 * Each tab has completely different card layouts and actions.
 *
 * Features:
 * - Lazy loading: Only fetch data when tab is activated
 * - Infinite scroll: Load more pages when scrolling to bottom
 * - Pull-to-refresh: Pull down to refresh current tab
 */
const MatchScheduleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [showTeamSelector, setShowTeamSelector] = useState(false);

  // Pull-to-refresh state
  const [pullState, setPullState] = useState({
    isPulling: false,
    pullDistance: 0,
    shouldRefresh: false,
  });

  // Use real data from stores
  const myTeams = useMyTeams();
  const teamStore = useTeamStore();
  const currentTeam = useSelectedTeam();
  const { setSelectedTeam, fetchMyTeams } = useTeamActions();

  const {
    pendingMatches,
    upcomingMatches,
    historyMatches,
    isLoadingPending,
    isLoadingUpcoming,
    isLoadingHistory,
    isRefreshing,
    isLoadingMore,
    error,
    fetchTabOnDemand,
    loadMore,
    refreshTab,
    resetAll,
    hasMore,
  } = useScheduleData(currentTeam?.id);

  // Refs for infinite scroll and pull-to-refresh
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const touchStartY = useRef(0);
  const currentScrollTop = useRef(0);

  const matchActions = useMatchActions();

  // Simple toast helper
  const showToast = (message: string) => {
    // TODO: Implement proper toast
    alert(message);
  };

  const tabs = [
    { id: 'pending' as const, label: 'Chờ kèo' },
    { id: 'upcoming' as const, label: 'Lịch đấu' },
    { id: 'history' as const, label: 'Lịch sử' },
  ];

  // Handle tab change with lazy loading
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    fetchTabOnDemand(tabId);
  };

  // Reset and load initial tab when team changes
  useEffect(() => {
    if (currentTeam?.id) {
      resetAll();
      setActiveTab('pending');
      fetchTabOnDemand('pending');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam?.id]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    // Cleanup previous observer
    observerRef.current?.disconnect();

    // Only setup if tab has more data to load
    if (!hasMore(activeTab)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore(activeTab)) {
          loadMore(activeTab);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
      observerRef.current = observer;
    }

    return () => {
      observer.disconnect();
    };
  }, [activeTab, hasMore, loadMore]);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    currentScrollTop.current = e.currentTarget.scrollTop;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only allow pull when at the top
    if (currentScrollTop.current > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    // Only respond to downward pull
    if (diff > 0) {
      setPullState({
        isPulling: true,
        pullDistance: Math.min(diff * 0.5, 120), // Damping effect
        shouldRefresh: diff > 100,
      });
    }
  };

  const handleTouchEnd = async () => {
    if (pullState.shouldRefresh) {
      await refreshTab(activeTab);
    }

    setPullState({
      isPulling: false,
      pullDistance: 0,
      shouldRefresh: false,
    });
  };

  // Fetch teams if not loaded
  useEffect(() => {
    if (myTeams.length === 0 && !teamStore.isLoading) {
      fetchMyTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading state while fetching teams
  if (teamStore.isLoading && myTeams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
        <div className="pt-6 px-4 pb-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch thi đấu</h1>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-sm text-gray-500">Đang tải danh sách đội...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no teams exist
  if (myTeams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
        <div className="pt-6 px-4 pb-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch thi đấu</h1>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Icon name="sports_soccer" className="text-6xl text-gray-400 mb-4" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Chưa có đội bóng
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Bạn cần tạo đội bóng trước khi xem lịch thi đấu
          </p>
          <Button
            className="w-full max-w-xs"
            icon="add"
            onClick={() => navigate(appRoutes.teamsCreate)}
          >
            Tạo đội bóng ngay
          </Button>
        </div>
      </div>
    );
  }

  // Action handlers
  const handleAcceptMatch = async (matchId: string) => {
    try {
      await matchActions.acceptMatch(matchId);
      await Promise.all([
        refreshTab('pending'),
        refreshTab('upcoming'),
      ]);
      showToast('Đã chấp nhận lời mời');
    } catch (err: any) {
      showToast(err.message || 'Không thể chấp nhận lời mời');
    }
  };

  const handleDeclineMatch = async (matchId: string) => {
    try {
      await matchActions.declineMatch(matchId);
      await refreshTab('pending');
      showToast('Đã từ chối lời mời');
    } catch (err: any) {
      showToast(err.message || 'Không thể từ chối lời mời');
    }
  };

  const handleCancelMatch = async (matchId: string) => {
    try {
      const reason = prompt('Lý do hủy:');
      if (reason) {
        await matchActions.cancelMatch(matchId, { reason });
        await refreshTab('pending');
        showToast('Đã hủy lời mời');
      }
    } catch (err: any) {
      showToast(err.message || 'Không thể hủy lời mời');
    }
  };

  const handleConfirmMatch = async (matchId: string) => {
    try {
      // Navigate to confirm match screen with matchId
      navigate(appRoutes.matchInvite); // TODO: Change to proper confirm route with matchId
    } catch (err: any) {
      showToast(err.message || 'Không thể chốt kèo');
    }
  };

  const handleSendRequest = async (matchId: string) => {
    try {
      // TODO: Implement send request API call with matchId
      console.log('Sending request for match:', matchId);
      showToast('Đã gửi lời mời');
      await refreshTab('pending');
    } catch (err: any) {
      showToast(err.message || 'Không thể gửi lời mời');
    }
  };

  const handleEditRequest = async (matchId: string) => {
    try {
      // Navigate to edit request screen with matchId
      console.log('Editing request for match:', matchId);
      navigate(appRoutes.matchInvite); // TODO: Change to proper edit route with matchId
    } catch (err: any) {
      showToast(err.message || 'Không thể sửa lời mời');
    }
  };

  const handleFinishMatch = async (matchId: string) => {
    try {
      navigate(appRoutes.matchUpdateScore(matchId));
    } catch (err: any) {
      showToast(err.message || 'Không thể kết thúc trận đấu');
    }
  };

  const handleUpdateScore = async (matchId: string) => {
    try {
      navigate(appRoutes.matchUpdateScore(matchId));
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật tỉ số');
    }
  };

  const handleRematch = async (matchId: string) => {
    try {
      navigate(appRoutes.matchRematch(matchId));
    } catch (err: any) {
      showToast(err.message || 'Không thể mở màn hình tái đấu');
    }
  };

  const handleViewDetail = async (matchId: string) => {
    navigate(appRoutes.matchDetail(matchId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
      {/* Custom Header with Team Selector */}
      <div className="pt-6 px-4 pb-2 flex items-center justify-between bg-background-light dark:bg-background-dark sticky top-0 z-30 safe-area-top">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch thi đấu</h1>
        <div
          onClick={() => setShowTeamSelector(true)}
          className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          <TeamAvatar src={currentTeam?.logo || ''} size="sm" className="w-6 h-6" />
          <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[100px] truncate">
            {currentTeam?.name || 'Chọn đội'}
          </span>
          <Icon name="expand_more" className="text-gray-400 text-sm" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-background-dark text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pull-to-refresh indicator */}
      {pullState.isPulling && (
        <div
          className="flex items-center justify-center transition-all duration-150 overflow-hidden"
          style={{ height: pullState.pullDistance, opacity: pullState.pullDistance / 120 }}
        >
          <Icon
            name="refresh"
            className={`text-primary ${pullState.shouldRefresh ? 'animate-spin' : ''}`}
          />
        </div>
      )}

      {/* Refresh indicator */}
      {isRefreshing && !pullState.isPulling && (
        <div className="flex items-center justify-center py-2">
          <Icon name="refresh" className="animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
        </div>
      )}

      <div
        className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* PENDING TAB */}
        {activeTab === 'pending' && (
          <div className="space-y-4 animate-fade-in">
            {isLoadingPending ? (
              <>
                <SchedulePendingSkeleton />
                <SchedulePendingSkeleton />
                <SchedulePendingSkeleton />
              </>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Icon name="error" className="text-4xl mb-2 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => refreshTab('pending')}
                >
                  Thử lại
                </Button>
              </div>
            ) : pendingMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Icon name="inbox" className="text-4xl mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Không có lời mời nào</p>
                <Button
                  variant="ghost"
                  className="mt-2 text-primary"
                  onClick={() => navigate(appRoutes.matchFind)}
                >
                  Tìm kèo ngay
                </Button>
              </div>
            ) : (
              pendingMatches.map((match) => (
                <PendingMatchCard
                  key={match.id}
                  match={match}
                  onAccept={handleAcceptMatch}
                  onDecline={handleDeclineMatch}
                  onCancel={handleCancelMatch}
                  onConfirm={handleConfirmMatch}
                  onSendRequest={handleSendRequest}
                  onEditRequest={handleEditRequest}
                />
              ))
            )}

            {/* Infinite scroll sentinel */}
            {pendingMatches.length > 0 && (
              <div ref={sentinelRef} className="h-1" />
            )}

            {/* Loading more indicator */}
            {isLoadingMore.pending && (
              <div className="flex justify-center py-4">
                <Icon name="refresh" className="animate-spin text-primary" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore('pending') && pendingMatches.length > 0 && (
              <div className="text-center text-xs text-gray-400 py-4">
                Đã tải hết
              </div>
            )}
          </div>
        )}

        {/* UPCOMING TAB */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4 animate-fade-in">
            {isLoadingUpcoming ? (
              <>
                <ScheduleUpcomingSkeleton />
                <ScheduleUpcomingSkeleton />
                <ScheduleUpcomingSkeleton />
              </>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Icon name="error" className="text-4xl mb-2 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => refreshTab('upcoming')}
                >
                  Thử lại
                </Button>
              </div>
            ) : upcomingMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Icon name="event_busy" className="text-4xl mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Không có lịch thi đấu nào</p>
                <Button
                  variant="ghost"
                  className="mt-2 text-primary"
                  onClick={() => navigate(appRoutes.matchFind)}
                >
                  Tìm kèo ngay
                </Button>
              </div>
            ) : (
              upcomingMatches.map((match) => (
                <UpcomingMatchCard
                  key={match.id}
                  match={match}
                  myTeam={currentTeam || { id: '', name: '', logo: '' }}
                  onFinish={handleFinishMatch}
                  onUpdateScore={handleUpdateScore}
                  onCancel={handleCancelMatch}
                />
              ))
            )}

            {/* Infinite scroll sentinel */}
            {upcomingMatches.length > 0 && (
              <div ref={sentinelRef} className="h-1" />
            )}

            {/* Loading more indicator */}
            {isLoadingMore.upcoming && (
              <div className="flex justify-center py-4">
                <Icon name="refresh" className="animate-spin text-primary" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore('upcoming') && upcomingMatches.length > 0 && (
              <div className="text-center text-xs text-gray-400 py-4">
                Đã tải hết
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            {isLoadingHistory ? (
              <>
                <ScheduleHistorySkeleton />
                <ScheduleHistorySkeleton />
                <ScheduleHistorySkeleton />
              </>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Icon name="error" className="text-4xl mb-2 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => refreshTab('history')}
                >
                  Thử lại
                </Button>
              </div>
            ) : historyMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Icon name="history" className="text-4xl mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Chưa có lịch sử trận đấu</p>
              </div>
            ) : (
              historyMatches.map((match) => (
                <HistoryMatchCard
                  key={match.id}
                  match={match}
                  myTeam={currentTeam || { id: '', name: '', logo: '' }}
                  onViewDetail={handleViewDetail}
                  onRematch={handleRematch}
                />
              ))
            )}

            {/* Infinite scroll sentinel */}
            {historyMatches.length > 0 && (
              <div ref={sentinelRef} className="h-1" />
            )}

            {/* Loading more indicator */}
            {isLoadingMore.history && (
              <div className="flex justify-center py-4">
                <Icon name="refresh" className="animate-spin text-primary" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore('history') && historyMatches.length > 0 && (
              <div className="text-center text-xs text-gray-400 py-4">
                Đã tải hết
              </div>
            )}
          </div>
        )}
      </div>

      {/* Team Selector Bottom Sheet */}
      {showTeamSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowTeamSelector(false)}
          />

          {/* Sheet */}
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe-with-nav animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Xem lịch thi đấu của
            </h3>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              {myTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowTeamSelector(false);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all active:scale-[0.98] ${
                    currentTeam?.id === team.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <TeamAvatar src={team.logo} />
                  <div className="flex-1 text-left">
                    <h4
                      className={`font-bold ${
                        currentTeam?.id === team.id
                          ? 'text-primary'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {team.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {team.isCaptain ? 'Quản trị viên' : 'Thành viên'}
                    </p>
                  </div>
                  {currentTeam?.id === team.id && (
                    <div className="size-6 bg-primary rounded-full flex items-center justify-center text-black">
                      <Icon name="check" className="text-sm" />
                    </div>
                  )}
                </button>
              ))}

              {/* Add new team option */}
              <button
                onClick={() => {
                  setShowTeamSelector(false);
                  navigate(appRoutes.teamsCreate);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-primary hover:border-primary transition-colors"
              >
                <Icon name="add" />
                <span className="font-medium">Tạo đội mới</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScheduleScreen;
