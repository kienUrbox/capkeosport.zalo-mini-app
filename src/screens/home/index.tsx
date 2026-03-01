import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, MatchCardSkeleton, NoMatches, DashboardError } from '@/components/ui';
import { InvitationSection } from '@/components/home';
import { appRoutes } from '@/utils/navigation';
import { useUser } from '@/stores/auth.store';
import { useUpcomingMatches } from '@/stores/match.store';
import { usePendingInvitations, useHomeLoading, useHomeError, useHomeActions } from '@/stores/home.store';
import { useInvitationActions } from '@/hooks/useInvitationActions';
import { useNotificationStore } from '@/stores/notification.store';
import { NotificationType } from '@/types/api.types';

/**
 * Dashboard Screen (Home)
 *
 * Main hub showing pending invitations, quick actions, my matches, and nearby teams.
 */
const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const upcomingMatches = useUpcomingMatches();

  // Use store selectors directly for data and state
  const pendingInvitations = usePendingInvitations();
  const isLoading = useHomeLoading();
  const error = useHomeError();
  const { fetchHomeData, setPendingInvitations } = useHomeActions();

  // Initialize data fetch on first mount
  useEffect(() => {
    console.log('[Dashboard] 📥 Fetching home data...');
    fetchHomeData();
  }, [fetchHomeData]);

  // Refresh function for pull-to-refresh
  const refresh = useCallback(async () => {
    console.log('[Dashboard] 🔄 Manual refresh triggered');
    await fetchHomeData(true);
  }, [fetchHomeData]);

  // Refresh invitations only (after accept/decline)
  const refreshInvitations = useCallback(async () => {
    console.log('[Dashboard] 🔄 Refreshing invitations...');
    const notificationState = useNotificationStore.getState();
    const invitations = await notificationState.fetchNotifications({
      type: NotificationType.TEAM_INVITATION,
      unreadOnly: true,
    });
    // Update home store with new invitations
    setPendingInvitations(invitations);
  }, [setPendingInvitations]);

  // Use invitation actions hook (must be called before early return)
  const { acceptInvite, declineInvite, isProcessing } = useInvitationActions({
    onRefresh: refreshInvitations,
    onSuccess: refresh,
  });

  // Pull-to-refresh state
  const [pullState, setPullState] = useState({
    isPulling: false,
    pullDistance: 0,
    shouldRefresh: false,
  });

  // Refs for pull-to-refresh
  const touchStartY = useRef(0);
  const currentScrollTop = useRef(0);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    currentScrollTop.current = e.currentTarget.scrollTop;
    console.log('[Dashboard] Touch start:', { startY: touchStartY.current, scrollTop: currentScrollTop.current });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only allow pull when at the top
    if (currentScrollTop.current > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    // Only respond to downward pull
    if (diff > 0) {
      console.log('[Dashboard] Touch move:', { currentY, diff, shouldRefresh: diff > 100 });
      setPullState({
        isPulling: true,
        pullDistance: Math.min(diff * 0.5, 120), // Damping effect
        shouldRefresh: diff > 100,
      });
    }
  };

  const handleTouchEnd = async () => {
    console.log('[Dashboard] Touch end:', { shouldRefresh: pullState.shouldRefresh });
    if (pullState.shouldRefresh) {
      await refresh();
    }

    setPullState({
      isPulling: false,
      pullDistance: 0,
      shouldRefresh: false,
    });
  };

  // Handle error state
  if (error && !user) {
    return <DashboardError error={error} onRetry={refresh} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Pull-to-refresh indicator */}
      {pullState.isPulling && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-primary/10 pointer-events-none transition-all"
          style={{ height: `${pullState.pullDistance}px` }}
        >
          <div className="transform -translate-y-1/2">
            <Icon
              name="refresh"
              className={`text-2xl text-primary ${pullState.shouldRefresh ? 'animate-spin' : ''}`}
            />
          </div>
        </div>
      )}

      {/* Pull to refresh indicator */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/10 py-2 text-center text-xs text-primary font-medium">
          Đang làm mới...
        </div>
      )}

      <div
        className="flex flex-col gap-6 pb-safe-with-nav overflow-y-auto h-screen-dvh"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <header className="px-5 flex items-start justify-between bg-gradient-to-b from-slate-800/50 to-transparent safe-area-top">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-1">
              Trang quản lý
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Xin chào, {user?.name || 'Bạn'} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-sm font-normal text-gray-500 dark:text-text-secondary mt-1">
              Sẵn sàng tìm kèo hôm nay?
            </p>
          </div>
          <button
            className="relative group"
            onClick={() => navigate(appRoutes.profile)}
          >
            <div className="h-11 w-11 rounded-full border-2 border-white dark:border-border-dark overflow-hidden shadow-lg">
              {user?.avatar ? (
                <img
                  alt="User"
                  className="h-full w-full object-cover"
                  src={user.avatar}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-white dark:border-background-dark"></div>
          </button>
        </header>

        {/* --- PENDING INVITATIONS SECTION --- */}
        <InvitationSection
          invitations={pendingInvitations}
          isLoading={isLoading}
          isProcessing={isProcessing}
          onAccept={acceptInvite}
          onDecline={declineInvite}
          onViewTeam={(teamId) => navigate(appRoutes.teamDetail(teamId))}
          onViewAll={() => navigate(appRoutes.myInvites)}
        />

        {/* Main Actions */}
        <section className="px-5 flex flex-col gap-4">
          <button
            onClick={() => navigate(appRoutes.matchFind, { state: { openTeamSelector: true } })}
            className="relative w-full group overflow-hidden rounded-2xl bg-primary text-[#102219] shadow-[0_8px_20px_rgba(17,212,115,0.25)] transition-all hover:shadow-[0_12px_24px_rgba(17,212,115,0.35)] active:scale-[0.98] text-left"
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110">
              <Icon name="sports_soccer" className="text-[140px] leading-none" />
            </div>
            <div className="relative z-10 flex items-center justify-between p-5">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Icon name="bolt" filled className="text-2xl" />
                  <h2 className="text-xl font-bold leading-tight">Cáp kèo ngay</h2>
                </div>
                <p className="text-sm font-medium opacity-80">
                  Tìm đối thủ phù hợp gần bạn
                </p>
              </div>
              <div className="h-10 w-10 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon name="arrow_forward" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate(appRoutes.teamsCreate)}
            className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                  Tạo đội bóng
                </span>
              </div>
              <p className="text-gray-500 dark:text-text-secondary text-sm font-normal">
                Lập đội mới & quản lý thành viên
              </p>
            </div>
            <div className="h-10 w-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-primary">
              <Icon name="add" />
            </div>
          </button>
        </section>

        {/* My Matches */}
        <section className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Kèo của tôi
            </h3>
            <button
              onClick={() => navigate(appRoutes.matchHistory)}
              className="text-xs font-semibold text-primary py-1 px-3 rounded-full hover:bg-primary/10 transition-colors"
            >
              Xem tất cả
            </button>
          </div>

          {isLoading ? (
            <MatchCardSkeleton />
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            upcomingMatches.slice(0, 1).map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(appRoutes.matchDetail(match.id))}
                className="group relative rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-5 shadow-lg overflow-hidden cursor-pointer active:scale-[0.99] transition-transform mb-3"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                      Sắp diễn ra
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-lg">
                    <Icon
                      name="notifications_active"
                      className="text-gray-500 dark:text-text-secondary text-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-start mb-5">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 border dark:border-white/5">
                    {match.teamA?.logo ? (
                      <img
                        alt="Team Logo"
                        className="w-full h-full object-cover"
                        src={match.teamA.logo}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {match.teamA?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-slate-900 dark:text-white font-bold text-xl leading-tight mb-1">
                      {match.teamA?.name || 'Đội nhà'} vs {match.teamB?.name || 'Đội khách'}
                    </h4>
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <Icon name="schedule" className="text-lg" />
                      <span className="text-base font-bold">{match.time} • {match.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-text-secondary">
                      <Icon name="location_on" className="text-sm" />
                      <span className="text-xs font-normal truncate max-w-[180px]">
                        {match.location || 'Địa điểm chưa xác định'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                  <Button className="flex-1 h-10" variant="primary">
                    Điểm danh
                  </Button>
                  <Button className="flex-1 h-10" variant="secondary">
                    Chi tiết
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <NoMatches onFindMatch={() => navigate(appRoutes.matchFind, { state: { openTeamSelector: true } })} />
          )}
        </section>

        {/* Nearby Teams - Hidden */}
        {/* <section className="pl-5 pb-4">
          <div className="flex items-center justify-between mb-3 pr-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Đội gần bạn
            </h3>
            <Icon name="tune" className="text-gray-500" />
          </div>

          {isLoadingTeams ? (
            <div className="flex overflow-x-auto gap-3 pb-4 pr-5 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <TeamCardSkeleton key={i} />
              ))}
            </div>
          ) : nearbyTeams && nearbyTeams.length > 0 ? (
            <div className="flex overflow-x-auto gap-3 pb-4 pr-5 no-scrollbar">
              {nearbyTeams.slice(0, 5).map((team) => (
                <div
                  key={team.id}
                  className="min-w-[140px] flex flex-col items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 active:scale-95 transition-transform"
                  onClick={() => navigate(appRoutes.teamDetail(team.id))}
                >
                  {team.logo ? (
                    <TeamAvatar
                      src={team.logo}
                      className="mb-3"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mb-3 border-2 border-white dark:border-white/10">
                      {team.name?.charAt(0).toUpperCase() || 'T'}
                    </div>
                  )}
                  <span className="text-slate-900 dark:text-white text-sm font-semibold truncate w-full text-center">
                    {team.name}
                  </span>
                  {team.distance !== undefined && (
                    <span className="text-gray-500 text-[11px] mt-1 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                      Cách {formatDistance(team.distance)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="pr-5">
              <NoNearbyTeams onRefresh={refresh} />
            </div>
          )}
        </section> */}
      </div>
    </div>
  );
};

export default DashboardScreen;
