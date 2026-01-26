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
  InviteMatchModal,
  MatchRequestModal,
  ActionBottomSheet,
  RematchBottomSheet,
  ConfirmMatchModal,
  AttendanceBottomSheet,
  UpdateScoreModal,
} from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useScheduleData } from '@/hooks/useScheduleData';
import { useMyTeams, useSelectedTeam, useTeamActions, useTeamStore, hasAdminPermission } from '@/stores/team.store';
import { useMatchActions, useMatchStore } from '@/stores/match.store';
import type { TabType } from '@/stores/match.store';
import { toast } from '@/utils/toast';
import { MatchService } from '@/services/api/match.service';

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
 *
 * Role-based permissions:
 * - Admin/Captain: Can perform all actions (send/accept/decline/confirm/finish/cancel)
 * - Member: Can only view matches, no actions
 */
const MatchScheduleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [inviteModalMatchId, setInviteModalMatchId] = useState<string | null>(null);
  const [requestModalMatchId, setRequestModalMatchId] = useState<string | null>(null);
  const [requestMode, setRequestMode] = useState<'send' | 'edit'>('send');
  const [updateScoreMatchId, setUpdateScoreMatchId] = useState<string | null>(null);

  // Action bottom sheet state
  const [actionSheet, setActionSheet] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'input';
    matchId: string | null;
    action: 'cancel_invite' | 'cancel_request' | 'report_busy';
    title: string;
    description: string;
    icon: string;
    iconColor?: string;
    primaryButtonText: string;
  }>({
    isOpen: false,
    type: 'input',
    matchId: null,
    action: 'cancel_request',
    title: '',
    description: '',
    icon: '',
    primaryButtonText: '',
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Rematch modal state
  const [rematchModalMatchId, setRematchModalMatchId] = useState<string | null>(null);

  // Confirm match modal state
  const [confirmModalMatchId, setConfirmModalMatchId] = useState<string | null>(null);

  // Attendance bottom sheet state
  const [attendanceSheet, setAttendanceSheet] = useState({
    isOpen: false,
    matchId: '',
  });

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

  const { setSelectedTeam } = useTeamActions();
  const matchActions = useMatchActions();

  // Subscribe to activeTab changes from store
  const activeTab = useMatchStore((state) => {
    if (!currentTeam?.id) return 'pending';
    return state._activeTabs[currentTeam?.id] || 'pending';
  });

  // Check if current team can edit the request (only team who sent can edit)
  const canEditRequest = (match: { requestedByTeam?: string }): boolean => {
    return match.requestedByTeam === currentTeam?.id;
  };

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

  const tabs = [
    { id: 'pending' as const, label: 'Chờ kèo' },
    { id: 'upcoming' as const, label: 'Lịch đấu' },
    { id: 'history' as const, label: 'Lịch sử' },
  ];

  // Handle tab change with lazy loading
  const handleTabChange = (tabId: TabType) => {
    matchActions.setActiveTab(currentTeam?.id, tabId);
    fetchTabOnDemand(tabId);
  };

  // Reset and load initial tab when team changes
  useEffect(() => {
    if (currentTeam?.id) {
      // resetAll();
      // Use the saved active tab from store, or 'pending' if first time
      const savedTab = matchActions.getActiveTab(currentTeam?.id);
      fetchTabOnDemand(savedTab);
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
      toast.success('Đã chấp nhận lời mời');
    } catch (err: any) {
      toast.error(err.message || 'Không thể chấp nhận lời mời');
    }
  };

  const handleDeclineMatch = async (matchId: string) => {
    try {
      await matchActions.declineMatch(matchId);
      await refreshTab('pending');
      toast.success('Đã từ chối lời mời');
    } catch (err: any) {
      toast.error(err.message || 'Không thể từ chối lời mời');
    }
  };

  const handleCancelMatch = (matchId: string, actionType: 'cancel_invite' | 'cancel_request' | 'report_busy') => {
    const config: Record<string, { title: string; description: string; icon: string; primaryButtonText: string; iconColor?: string }> = {
      cancel_invite: {
        title: 'Hủy lời mời?',
        description: 'Nhập lý do hủy (tùy chọn)',
        icon: 'undo',
        primaryButtonText: 'Hủy lời mời',
      },
      cancel_request: {
        title: 'Hủy yêu cầu?',
        description: 'Nhập lý do hủy (tùy chọn)',
        icon: 'close',
        primaryButtonText: 'Hủy yêu cầu',
      },
      report_busy: {
        title: 'Báo bận',
        description: 'Nhập lý do báo bận của bạn',
        icon: 'event_busy',
        primaryButtonText: 'Báo bận',
        iconColor: 'text-orange-500',
      },
    };

    const configData = config[actionType];
    setActionSheet({
      isOpen: true,
      type: 'input',
      matchId,
      action: actionType,
      title: configData.title,
      description: configData.description,
      icon: configData.icon,
      iconColor: configData.iconColor,
      primaryButtonText: configData.primaryButtonText,
    });
  };

  const handleConfirmAction = async (inputValue?: string) => {
    if (!actionSheet.matchId) return;

    setIsActionLoading(true);
    try {
      const reason = inputValue?.trim() || '';

      switch (actionSheet.action) {
        case 'cancel_invite':
          await matchActions.cancelMatch(actionSheet.matchId, { reason });
          await refreshTab('pending');
          toast.success('Đã hủy lời mời');
          break;
        case 'cancel_request':
          await matchActions.declineMatch(actionSheet.matchId);
          await refreshTab('pending');
          toast.success('Đã hủy yêu cầu');
          break;
        case 'report_busy':
          // Use attendance API for reporting busy
          await MatchService.updateAttendance(actionSheet.matchId, { status: 'DECLINED', reason });
          await refreshTab('upcoming');
          toast.success('Đã báo bận');
          break;
        default:
          break;
      }

      setActionSheet(prev => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      toast.error(err.message || 'Không thể thực hiện thao tác');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmMatch = (matchId: string) => {
    setConfirmModalMatchId(matchId);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalMatchId(null);
  };

  const handleConfirmSuccess = async () => {
    setConfirmModalMatchId(null);
    await Promise.all([refreshTab('pending'), refreshTab('upcoming')]);
    toast.success('Đã chốt kèo thành công');
  };

  const handleSendRequest = (matchId: string) => {
    setRequestMode('send');
    setRequestModalMatchId(matchId);
  };

  const handleCloseInviteModal = () => {
    setInviteModalMatchId(null);
  };

  const handleInviteSuccess = async () => {
    setInviteModalMatchId(null);
    await Promise.all([refreshTab('pending'), refreshTab('upcoming')]);
    toast.success('Đã gửi lời mời');
  };

  const handleEditRequest = (matchId: string) => {
    setRequestMode('edit');
    setRequestModalMatchId(matchId);
  };

  const handleCloseRequestModal = () => {
    setRequestModalMatchId(null);
  };

  const handleRequestSuccess = async () => {
    setRequestModalMatchId(null);
    await refreshTab('pending');
    toast.success(requestMode === 'send' ? 'Đã gửi lời mời' : 'Đã cập nhật lời mời');
  };

  const handleFinishMatch = async (matchId: string) => {
    try {
      navigate(appRoutes.matchUpdateScore(matchId));
    } catch (err: any) {
      toast.error(err.message || 'Không thể kết thúc trận đấu');
    }
  };

  const handleUpdateScore = async (matchId: string) => {
    try {
      navigate(appRoutes.matchUpdateScore(matchId));
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật tỉ số');
    }
  };

  const handleRematch = (matchId: string) => {
    // Mở rematch bottom sheet thay vì navigate
    setRematchModalMatchId(matchId);
  };

  const handleCloseRematchModal = () => {
    setRematchModalMatchId(null);
  };

  const handleRematchSuccess = async () => {
    setRematchModalMatchId(null);
    await Promise.all([refreshTab('pending'), refreshTab('history')]);
    toast.success('Đã gửi lời mời tái đấu');
  };

  const handleViewDetail = async (matchId: string) => {
    navigate(appRoutes.matchDetail(matchId));
  };

  // Attendance handlers
  const handleConfirmAttendance = async (matchId: string) => {
    try {
      const response = await MatchService.updateAttendance(matchId, { status: 'CONFIRMED' });
      if (response.success) {
        toast.success('Đã xác nhận tham gia!');
        // Refresh attendance data if bottom sheet is open for this match
        if (attendanceSheet.isOpen && attendanceSheet.matchId === matchId) {
          // Re-fetch will happen automatically when bottom sheet re-opens
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật điểm danh');
    }
  };

  const handleAttendanceView = (matchId: string) => {
    setAttendanceSheet({ isOpen: true, matchId });
  };

  const handleAttendanceUpdate = async () => {
    // Refresh upcoming matches to update UI
    await refreshTab('upcoming');
  };

  const handleCloseAttendanceSheet = () => {
    setAttendanceSheet({ isOpen: false, matchId: '' });
  };

  // Match Result Handlers
  const handleSubmitResult = (matchId: string) => {
    setUpdateScoreMatchId(matchId);
  };

  const handleCloseUpdateScoreModal = () => {
    setUpdateScoreMatchId(null);
  };

  const handleUpdateScoreSuccess = async () => {
    setUpdateScoreMatchId(null);
    await refreshTab('upcoming');
    toast.success('Đã cập nhật kết quả');
  };

  const handleConfirmResult = async (matchId: string) => {
    try {
      await matchActions.confirmMatchResult(matchId);

      // Check if match moved to history
      const match = upcomingMatches.find((m) => m.id === matchId);
      if (!match) {
        // Match was moved to history
        await refreshTab('history');
      }

      toast.success('Đã xác nhận kết quả');
    } catch (err: any) {
      toast.error(err.message || 'Không thể xác nhận kết quả');
    }
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
                  isAdmin={hasAdminPermission(currentTeam?.userRole)}
                  canEditRequest={canEditRequest(match)}
                  onAccept={handleAcceptMatch}
                  onDecline={handleDeclineMatch}
                  onCancel={(id) => handleCancelMatch(id, 'cancel_request')}
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
                  isAdmin={hasAdminPermission(currentTeam?.userRole)}
                  onFinish={handleFinishMatch}
                  onUpdateScore={handleUpdateScore}
                  onCancel={(id) => handleCancelMatch(id, 'report_busy')}
                  onConfirmAttendance={handleConfirmAttendance}
                  onAttendanceView={handleAttendanceView}
                  onSubmitResult={handleSubmitResult}
                  onConfirmResult={handleConfirmResult}
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
                  isAdmin={hasAdminPermission(currentTeam?.userRole)}
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
                    resetAll()
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
                      {team.userRole === 'admin' ? 'Quản trị viên' : 'Thành viên'}
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

      {/* Invite Match Modal */}
      {inviteModalMatchId && (
        <InviteMatchModal
          isOpen={!!inviteModalMatchId}
          matchId={inviteModalMatchId}
          myTeam={currentTeam || { id: '', name: '', logo: '' }}
          onClose={handleCloseInviteModal}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Match Request Modal */}
      {requestModalMatchId && (() => {
        const match = pendingMatches.find(m => m.id === requestModalMatchId);
        return match ? (
          <MatchRequestModal
            isOpen={!!requestModalMatchId}
            mode={requestMode}
            matchId={requestModalMatchId}
            myTeam={currentTeam || { id: '', name: '', logo: '' }}
            opponentTeam={match.teamB || { id: '', name: '' }}
            initialData={requestMode === 'edit' ? {
              proposedDate: match.date,
              proposedTime: match.time,
              proposedPitch: match.location,
              notes: match.notes,
            } : undefined}
            onClose={handleCloseRequestModal}
            onSuccess={handleRequestSuccess}
          />
        ) : null;
      })()}

      {/* Action Bottom Sheet */}
      <ActionBottomSheet
        isOpen={actionSheet.isOpen}
        onClose={() => setActionSheet(prev => ({ ...prev, isOpen: false }))}
        type={actionSheet.type}
        title={actionSheet.title}
        description={actionSheet.description}
        icon={actionSheet.icon}
        iconColor={actionSheet.iconColor}
        inputPlaceholder="Nhập lý do (tùy chọn)..."
        inputMaxLength={200}
        primaryButtonText={actionSheet.primaryButtonText}
        secondaryButtonText="Hủy"
        onPrimaryAction={handleConfirmAction}
        isLoading={isActionLoading}
      />

      {/* Rematch Bottom Sheet */}
      {rematchModalMatchId && (() => {
        const match = historyMatches.find(m => m.id === rematchModalMatchId);
        return match ? (
          <RematchBottomSheet
            isOpen={!!rematchModalMatchId}
            matchId={rematchModalMatchId}
            myTeam={currentTeam || { id: '', name: '', logo: '' }}
            opponentTeam={match.teamB || { id: '', name: '', logo: '' }}
            onClose={handleCloseRematchModal}
            onSuccess={handleRematchSuccess}
          />
        ) : null;
      })()}

      {/* Confirm Match Modal */}
      {(() => {
        if (!confirmModalMatchId) return null;
        const match = pendingMatches.find(m => m.id === confirmModalMatchId);
        if (!match) return null;
        return (
          <ConfirmMatchModal
            isOpen={!!confirmModalMatchId}
            matchId={confirmModalMatchId}
            myTeam={currentTeam || { id: '', name: '', logo: '' }}
            opponentTeam={match.teamB || { id: '', name: '', logo: '' }}
            onClose={handleCloseConfirmModal}
            onSuccess={handleConfirmSuccess}
          />
        );
      })()}

      {/* Attendance Bottom Sheet */}
      <AttendanceBottomSheet
        isOpen={attendanceSheet.isOpen}
        onClose={handleCloseAttendanceSheet}
        matchId={attendanceSheet.matchId}
        onAttendanceUpdate={handleAttendanceUpdate}
      />

      {/* Update Score Modal */}
      {updateScoreMatchId && (() => {
        const match = upcomingMatches.find((m) => m.id === updateScoreMatchId);
        return match ? (
          <UpdateScoreModal
            isOpen={!!updateScoreMatchId}
            matchId={updateScoreMatchId}
            myTeam={currentTeam || { id: '', name: '', logo: '' }}
            opponentTeam={match.teamB || { id: '', name: '', logo: '' }}
            initialData={match.result ? {
              teamAScore: match.result.teamAScore,
              teamBScore: match.result.teamBScore,
              notes: match.result.notes,
              fileIds: match.result.fileIds,
            } : undefined}
            onClose={handleCloseUpdateScoreModal}
            onSuccess={handleUpdateScoreSuccess}
          />
        ) : null;
      })()}
    </div>
  );
};

export default MatchScheduleScreen;
