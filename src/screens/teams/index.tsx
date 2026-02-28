import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Header, Icon, TeamAvatar, NoTeams, TeamsCardSkeleton } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useMyTeams, useTeamActions, useTeamStore, type Team } from '@/stores/team.store';

interface TeamWithMatchInfo extends Team {
  stats?: {
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
  };
  nextMatch?: {
    opponent: string;
    time: string;
    location: string;
  };
}

/**
 * MyTeams Screen
 *
 * List of user's teams with admin/member badges and next match info.
 * Features:
 * - Load teams from API via store
 * - Pull-to-refresh gesture to reload data
 * - Loading, empty, and error states
 */
const TeamsScreen: React.FC = () => {
  const navigate = useNavigate();

  // Store hooks
  const myTeams = useMyTeams();
  const teamStore = useTeamStore();
  const { fetchMyTeams } = useTeamActions();

  // Local state for UI
  const [error, setError] = useState<string | null>(null);

  // Pull-to-refresh state
  const [pullState, setPullState] = useState({
    isPulling: false,
    pullDistance: 0,
    shouldRefresh: false,
  });

  // Refs for pull-to-refresh
  const touchStartY = useRef(0);
  const currentScrollTop = useRef(0);
  const isMounted = useRef(true);

  // Fetch teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      if (!teamStore.isLoading) {
        try {
          setError(null);
          await fetchMyTeams();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Không thể tải danh sách đội';
          setError(message);
        }
      }
    };

    loadTeams();

    return () => {
      isMounted.current = false;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Force refresh from API
      await handleRefresh();
    }

    setPullState({
      isPulling: false,
      pullDistance: 0,
      shouldRefresh: false,
    });
  };

  // Refresh handler
  const handleRefresh = async () => {
    try {
      setError(null);
      await fetchMyTeams(true); // Force refresh = true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách đội';
      setError(message);
    }
  };

  // Show loading skeleton on initial load
  if (teamStore.isLoading && myTeams.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
        <Header title="Đội bóng của tôi" showBack={false} />

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4" />
            <p className="text-sm text-gray-500">Đang tải danh sách đội...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
      <Header title="Đội bóng của tôi" showBack={false} />

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
      {teamStore.isLoading && !pullState.isPulling && (
        <div className="flex items-center justify-center py-2">
          <Icon name="refresh" className="animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
        </div>
      )}

      {/* Error state */}
      {error && myTeams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <Icon name="error" className="text-4xl mb-2 text-red-500" />
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          <Button
            variant="ghost"
            onClick={handleRefresh}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!teamStore.isLoading && myTeams.length === 0 && !error && (
        <div className="flex-1 flex items-center justify-center px-4">
          <NoTeams onCreateTeam={() => navigate(appRoutes.teamsCreate)} />
        </div>
      )}

      {/* Teams List */}
      <div
        className="p-4 space-y-6 flex-1 overflow-y-auto no-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Show skeleton when refreshing */}
        {teamStore.isLoading && myTeams.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1">
              Danh sách đội
            </h3>
            <TeamsCardSkeleton />
            <TeamsCardSkeleton />
            <TeamsCardSkeleton />
          </div>
        ) : myTeams.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1">
              Danh sách đội ({myTeams.length})
            </h3>

            {myTeams.map((team) => {
              const teamWithInfo = team as TeamWithMatchInfo;
              return (
                <div
                  key={team.id}
                  onClick={() => navigate(appRoutes.teamDetail(team.id))}
                  className="group bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Role Badge */}
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider ${team.userRole === 'admin'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                    }`}>
                    {team.userRole === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <TeamAvatar src={team.logo} size="lg" className="shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{team.name}</h2>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-text-secondary text-sm">
                        <Icon name="groups" className="text-sm" />
                        <span>{team.memberCount} thành viên</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats or Next Match Info */}
                  {teamWithInfo.stats && (
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Thắng</span>
                        <span className="font-bold text-green-500">{teamWithInfo.stats.wins}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Hòa</span>
                        <span className="font-bold text-gray-500">{teamWithInfo.stats.draws}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Thua</span>
                        <span className="font-bold text-red-500">{teamWithInfo.stats.losses}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                        <span className="text-gray-500">Tỷ lệ thắng</span>
                        <span className="font-bold text-primary">{teamWithInfo.stats.winRate}%</span>
                      </div>
                    </div>
                  )}

                  {/* Next Match Info */}
                  {teamWithInfo.nextMatch && (
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-background-dark p-2 rounded-lg">
                        <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                          <Icon name="calendar_today" className="text-sm" filled />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-500 uppercase">Trận tiếp theo</p>
                          <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                            vs {teamWithInfo.nextMatch.opponent} • {teamWithInfo.nextMatch.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No match info */}
                  {!teamWithInfo.nextMatch && !teamWithInfo.stats && (
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 italic">Chưa có lịch thi đấu</p>
                        {team.userRole === 'admin' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(appRoutes.matchFind);
                            }}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Tìm kèo ngay
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Create New Team CTA */}
            <button
              onClick={() => navigate(appRoutes.teamsCreate)}
              className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="size-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon name="add" className="text-lg" />
              </div>
              <span className="font-semibold">Tạo đội bóng mới</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TeamsScreen;
