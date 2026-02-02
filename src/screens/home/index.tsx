import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, TeamAvatar, InvitationSkeleton, MatchCardSkeleton, NoMatches, DashboardError } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useHomeData } from '@/hooks/useHomeData';
import { useUser } from '@/stores/auth.store';
import { useUpcomingMatches, useIsLoadingMatches } from '@/stores/match.store';
import { usePhoneInviteActions } from '@/stores/phone-invite.store';
import { PhoneInvite } from '@/types/api.types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Dashboard Screen (Home)
 *
 * Main hub showing pending invitations, quick actions, my matches, and nearby teams.
 */
const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const upcomingMatches = useUpcomingMatches();
  const isLoadingMatchesFromStore = useIsLoadingMatches();

  // Use custom hook for home data fetching with individual loading states
  const {
    pendingInvitations,
    isLoadingInvitations,
    isRefreshing,
    error,
    refresh,
  } = useHomeData();

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

  // Use phone invite actions from store
  const phoneInviteActions = usePhoneInviteActions();

  const handleRejectInvite = async (id: string) => {
    try {
      await phoneInviteActions.respondInvite(id, 'decline');
      // Refresh data after responding
      refresh();
    } catch (err) {
      console.error('Reject invitation error:', err);
    }
  };

  const handleAcceptInvite = async (id: string) => {
    try {
      await phoneInviteActions.respondInvite(id, 'accept');
      // Note: PhoneInviteStore's respondInvite updates the invite status
      // We need to check if the response contains team info for navigation
      // For now, just refresh and let user navigate manually
      refresh();
    } catch (err) {
      console.error('Accept invitation error:', err);
    }
  };

  // Format time ago for invitations
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: vi });
    } catch {
      return 'vừa xong';
    }
  };

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
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/10 py-2 text-center text-xs text-primary font-medium">
          Đang làm mới...
        </div>
      )}

      <div
        className="flex flex-col gap-6 pb-safe-with-nav overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <header className="px-5 flex items-start justify-between bg-gradient-to-b from-green-900/20 to-transparent safe-area-top">
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
                <div className="h-full w-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-white dark:border-background-dark"></div>
          </button>
        </header>

        {/* --- PENDING INVITATIONS SECTION --- */}
        {(isLoadingInvitations || pendingInvitations.length > 0) && (
          <section className="px-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Lời mời tham gia
                </h3>
              </div>
              <button
                onClick={() => navigate(appRoutes.myInvites)}
                className="text-xs font-semibold text-primary py-1 px-3 rounded-full hover:bg-primary/10 transition-colors"
              >
                Xem tất cả
              </button>
            </div>

            {isLoadingInvitations ? (
              <InvitationSkeleton />
            ) : (
              pendingInvitations.map((invite) => {
                // Handle both PhoneInvite and legacy Notification types
                const isPhoneInvite = 'teamName' in invite && 'inviterName' in invite;
                const teamLogo = isPhoneInvite ? (invite as unknown as PhoneInvite).teamLogo : (invite as { data?: { teamLogo?: string } }).data?.teamLogo;
                const teamName = isPhoneInvite ? (invite as unknown as PhoneInvite).teamName : (invite as { data?: { teamName?: string } }).data?.teamName;
                const inviterName = isPhoneInvite ? (invite as unknown as PhoneInvite).inviterName : (invite as { data?: { inviterName?: string } }).data?.inviterName;
                const teamId = isPhoneInvite ? (invite as unknown as PhoneInvite).teamId : (invite as { data?: { teamId?: string } }).data?.teamId;
                const createdAt = isPhoneInvite ? (invite as unknown as PhoneInvite).createdAt : (invite as { createdAt?: string }).createdAt;

                return (
                  <div
                    key={invite.id}
                    className="bg-white dark:bg-surface-dark border-l-4 border-primary rounded-r-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden mb-3"
                  >
                    <div className="flex items-center gap-3">
                      {teamLogo ? (
                        <TeamAvatar
                          src={teamLogo}
                          size="md"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-white/10">
                          {teamName?.charAt(0).toUpperCase() || 'T'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {inviterName || 'Người dùng'}
                          </span>{' '}
                          đã mời bạn vào:
                        </p>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                          {teamName || 'Đội bóng'}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {createdAt && formatTimeAgo(createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                      <Button
                        className="h-9 flex-1 text-xs"
                        onClick={() => handleAcceptInvite(invite.id)}
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-9 flex-1 text-xs bg-gray-50 dark:bg-white/5"
                        onClick={() => handleRejectInvite(invite.id)}
                      >
                        Từ chối
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-full"
                        onClick={() => navigate(appRoutes.teamDetail(teamId || ''))}
                      >
                        <Icon name="visibility" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

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

          {isLoadingMatchesFromStore ? (
            <MatchCardSkeleton />
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            upcomingMatches.slice(0, 1).map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(appRoutes.matchDetail(match.id))}
                className="group relative rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-5 shadow-lg overflow-hidden cursor-pointer active:scale-[0.99] transition-transform mb-3"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
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
                      <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-xl">
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
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-lg mb-3 border-2 border-white dark:border-white/10">
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
