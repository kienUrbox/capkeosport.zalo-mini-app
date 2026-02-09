import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TeamAvatar, FindMatchSkeleton, FilterBottomSheet, MatchModal, Button } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useMyTeams, useSelectedTeam, useTeamActions, useTeamStore } from '@/stores/team.store';
import { useDiscoveryStore } from '@/stores/discovery.store';
import type { Team } from '@/types/api.types';
import { getLevelColor, LEVEL_ICON } from '@/constants/design';

/**
 * FindMatch Screen
 *
 * Tinder-style swipe interface for finding opponents.
 * Features:
 * - Real API integration for team discovery
 * - Swipe gestures (like/pass)
 * - Filter bottom sheet
 * - Team selector
 * - Match modal on successful match
 */
const FindMatchScreen: React.FC = () => {
  const navigate = useNavigate();

  // Discovery hook
  const {
    currentTeam,
    allTeams,
    currentIndex,
    hasMoreCards,
    matchedTeam,
    matchedMatch,
    isLoading,
    isRefreshing,
    error,
    handleSwipe,
    refresh,
    closeMatchModal,
  } = useDiscovery();

  // Get filters from discovery store
  const filters = useDiscoveryStore((state) => state.filters);

  // Team selection
  const myTeams = useMyTeams();
  const selectedTeam = useSelectedTeam();
  const { setSelectedTeam } = useTeamActions();


  // Filter teams where user is admin
  const adminTeams = myTeams.filter(team => team.userRole === 'admin');

  // UI states
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Swipe Logic
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Flow state tracking
  const flowState = useMemo(() => {
    // Case 1: No teams at all
    if (myTeams.length === 0) {
      return 'no-teams';
    }
    // Case 2: Has teams but no admin teams
    if (adminTeams.length === 0) {
      return 'has-teams-not-admin';
    }
    // Case 3: Has exactly 1 admin team
    if (adminTeams.length === 1) {
      return 'single-admin-team';
    }
    // Case 4: Has multiple admin teams
    return 'multiple-admin-teams';
  }, [myTeams.length, adminTeams.length]);

  // Show team selector for multiple admin teams - only when no team is selected yet
  useEffect(() => {
    // Only auto-show selector if user has multiple admin teams AND hasn't selected any team yet
    if (flowState === 'multiple-admin-teams' && !selectedTeam) {
      // Auto-select first admin team
      console.log('[FindMatch] Auto-selecting first admin team');
      setSelectedTeam(adminTeams[0]);
      // Don't show selector automatically - let user discover with auto-selected team first
      // User can still open selector by clicking header or "Chọn đội khác" button
    }
  }, [flowState, selectedTeam, adminTeams, setSelectedTeam]);

  // Handle team change
  const handleTeamChange = (teamId: string) => {
    const team = adminTeams.find((t) => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setShowTeamSelector(false);
      // Refresh with new team filters
      refresh();
    }
  };

  // Swipe action handlers
  const removeCard = async (direction: 'left' | 'right') => {
    // Block swipe if user is not admin
    if (!currentTeam || selectedTeam?.userRole !== 'admin') {
      // Shake animation feedback
      return;
    }

    setSwipeDirection(direction);

    // Wait for animation, then handle swipe
    setTimeout(async () => {
      await handleSwipe(direction);
      setSwipeDirection(null);
      setDragDelta({ x: 0, y: 0 });
    }, 300);
  };

  // Gesture handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragStart) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragDelta({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleTouchEnd = () => {
    if (!dragStart) return;
    setIsDragging(false);

    // Block swipe if user is not admin
    const isAdmin = selectedTeam?.userRole === 'admin';
    if (!isAdmin) {
      // Reset if not admin - don't allow swipe
      setDragDelta({ x: 0, y: 0 });
      setDragStart(null);
      return;
    }

    // Threshold to trigger swipe
    if (dragDelta.x > 120) {
      removeCard('right');
    } else if (dragDelta.x < -120) {
      removeCard('left');
    } else {
      // Reset if threshold not met
      setDragDelta({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  const handleClickCard = () => {
    // Only navigate if it was a click (not a drag)
    if (currentTeam && Math.abs(dragDelta.x) < 5 && Math.abs(dragDelta.y) < 5) {
      navigate(appRoutes.opponentDetail(currentTeam?.id), {
        state: {
          team: currentTeam,
          sortBy: filters.sortBy,
          compatibilityScore: Math.round((currentTeam.compatibilityScore || 0) * 100),
          qualityScore: Math.round((currentTeam.qualityScore || 0) * 100),
          activityScore: Math.round((currentTeam.activityScore || 0) * 100),
        }
      });
    }
  };

  // Calculate transform style based on drag
  const getCardStyle = (index: number) => {
    const actualIndex = currentIndex + index;
    if (actualIndex >= allTeams.length) {
      return { zIndex: 0, opacity: 0, transformOrigin: 'center center' };
    }

    if (index === 0) {
      const rotate = dragDelta.x * 0.05;
      const opacity = swipeDirection ? 0 : 1;
      const xPos = swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : dragDelta.x;

      return {
        transform: `translate(${xPos}px, ${dragDelta.y * 0.2}px) rotate(${rotate}deg)`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        opacity: opacity,
        zIndex: 30,
      };
    } else if (index === 1) {
      // Next card - static style, no calculation during drag
      return {
        transform: 'scale(0.95) translateY(10px)',
        transformOrigin: 'center center',
        zIndex: 20,
        opacity: 1,
      };
    }
    return { zIndex: 0, opacity: 0, transformOrigin: 'center center' };
  };

  // Overlay opacity for Like/Nope badges
  const likeOpacity = Math.max(0, Math.min(dragDelta.x / 100, 1));
  const nopeOpacity = Math.max(0, Math.min(-dragDelta.x / 100, 1));

  // Format distance
  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  // Get loading state from team store
  const { isLoading: isTeamsLoading } = useTeamStore();

  // Loading state - check team store first, then discovery
  if (isTeamsLoading) {
    console.log('[FindMatch] Loading skeleton: isTeamsLoading =', isTeamsLoading);
    return <FindMatchSkeleton />;
  }

  // Loading state - only show skeleton if discovery is loading AND we don't have current team yet
  // Don't show skeleton when refreshing (isRefreshing) - use overlay instead
  if (isLoading && !currentTeam && !isRefreshing) {
    console.log('[FindMatch] Loading skeleton: isLoading =', isLoading, ', currentTeam =', currentTeam, ', isRefreshing =', isRefreshing);
    return <FindMatchSkeleton />;
  }

  // Error state
  if (error && !currentTeam) {
    return (
      <div className="flex flex-col h-dvh bg-background-light dark:bg-background-dark items-center justify-center p-6 text-center">
        <div className="size-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Icon name="error" className="text-4xl text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={refresh}
          className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state - no more teams (only if we've fetched data with admin team and got no results)
  const hasFetchedWithAdminTeam = selectedTeam?.userRole === 'admin' && !isLoading && !isRefreshing;
  if (!hasMoreCards && hasFetchedWithAdminTeam && allTeams.length === 0) {
    return (
      <>
        <div className="flex flex-col h-dvh bg-background-light dark:bg-background-dark items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center text-center max-w-[280px] gap-4">
            <div className="w-20 h-20 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center mb-2">
              <Icon name="search_off" className="text-text-secondary text-4xl" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-xl font-bold">Hết kèo phù hợp</p>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                Hãy thử mở rộng bán kính tìm kiếm hoặc điều chỉnh bộ lọc trình độ.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => setShowTeamSelector(true)}
              className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold shadow-lg"
            >
              Chọn đội khác
            </button>
            <button
              onClick={() => setShowFilterSheet(true)}
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold"
            >
              Điều chỉnh bộ lọc
            </button>
            <button
              onClick={() => navigate(appRoutes.dashboard)}
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>

        {/* Filter Bottom Sheet - must be rendered outside overflow-hidden container */}
        <FilterBottomSheet
          isOpen={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          onApply={refresh}
        />

        {/* Team Selector - for switching teams when no more matches */}
        {showTeamSelector && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowTeamSelector(false)}
            />

            {/* Sheet */}
            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Chọn đội đi "cáp kèo"</h3>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                {adminTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamChange(team.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all active:scale-[0.98] ${selectedTeam?.id === team.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                  >
                    <TeamAvatar src={team.logo} />
                    <div className="flex-1 text-left">
                      <h4 className={`font-bold ${selectedTeam?.id === team.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                        {team.name}
                      </h4>
                      <p className="text-xs text-gray-500">Quản trị viên</p>
                    </div>
                    {selectedTeam?.id === team.id && (
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

        {/* Match Modal - must be rendered outside overflow-hidden container */}
        <MatchModal
          isOpen={!!matchedTeam}
          matchedTeam={matchedTeam}
          myTeamLogo={selectedTeam?.logo}
          myTeamName={selectedTeam?.name}
          myTeamId={selectedTeam?.id}
          matchId={matchedMatch?.id}
          onKeepSwiping={closeMatchModal}
        />
      </>
    );
  }

  // Empty state - no teams at all
  if (flowState === 'no-teams') {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
        {/* Header */}
        <div className="safe-area-top px-4 pb-2 flex items-center">
          <button
            onClick={() => navigate(appRoutes.dashboard)}
            className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors mr-4"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tìm kèo</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Icon name="groups" className="text-primary text-5xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Chưa có đội bóng
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
            Bạn cần tạo đội để tìm kèo đấu. Hãy tạo đội mới của bạn và bắt đầu kết nối với các đội bóng khác.
          </p>
          <Button
            icon="add"
            onClick={() => navigate(appRoutes.teamsCreate)}
          >
            Tạo đội ngay
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - has teams but not admin of any
  if (flowState === 'has-teams-not-admin') {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
        {/* Header */}
        <div className="safe-area-top px-4 pb-2 flex items-center">
          <button
            onClick={() => navigate(appRoutes.dashboard)}
            className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors mr-4"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tìm kèo</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
            <Icon name="admin_panel_settings" className="text-amber-500 text-5xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Cần quyền quản trị viên
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
            Bạn đang tham gia {myTeams.length} đội nhưng chưa là quản trị viên của đội nào. Hãy tạo đội mới hoặc liên hệ quản trị viên để được cấp quyền tìm kèo.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              icon="add"
              onClick={() => navigate(appRoutes.teamsCreate)}
            >
              Tạo đội mới
            </Button>
            <button
              onClick={() => navigate(appRoutes.teams)}
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold"
            >
              Xem đội của tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-dvh bg-background-light dark:bg-background-dark relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />

        {/* Refreshing indicator */}
        {isRefreshing && (
          <div className="fixed top-4 left-0 right-0 z-50 bg-primary/10 py-2 text-center text-xs text-primary font-medium safe-area-top">
            Đang làm mới...
          </div>
        )}

        {/* Header */}
        <div className="relative z-50 safe-area-top px-4 pb-2 flex justify-center shrink-0">
          {/* Team Selector Trigger - Always show */}
          <div
            onClick={() => setShowTeamSelector(true)}
            className="flex items-center gap-2 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md pl-4 pr-5 py-2 rounded-full shadow-lg border border-white/5 cursor-pointer hover:bg-surface-light hover:dark:bg-surface-dark transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Icon name="groups" className="text-primary text-[16px]" />
            </div>
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">
              {selectedTeam ? (
                <>
                  Đội của bạn: <span className="text-primary font-bold">{selectedTeam.name}</span>
                </>
              ) : (
                <span className="text-primary font-bold">Chọn đội để tìm kèo</span>
              )}
            </p>
            <Icon name="expand_more" className="text-text-secondary text-[16px] ml-1" />
          </div>

          {/* Back Button - Absolute positioned left */}
          <button
            onClick={() => navigate(appRoutes.dashboard)}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>

          {/* Filter Button - Absolute positioned right */}
          <button
            onClick={() => {
              setShowFilterSheet(true);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <Icon name="tune" />
          </button>
        </div>

        {/* Card Stack Area */}
        <div className="flex-1 relative w-full flex flex-col items-center justify-center p-4 z-10 overflow-hidden">
          {/* Decorative Stack Layers (To give depth feel) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)] w-[82%] h-[calc(100%-24px)] bg-surface-light/40 dark:bg-surface-dark/40 rounded-[2.5rem] border border-white/5 z-0 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] w-[82%] h-[calc(100%-24px)] bg-surface-light/70 dark:bg-surface-dark/70 rounded-[2.5rem] border border-white/5 z-10 shadow-lg backdrop-blur-sm pointer-events-none"></div>

          {/* Refreshing skeleton overlay */}
          {isRefreshing && currentTeam && (
            <div className="absolute w-full max-w-[360px] h-[72vh] max-h-[660px] bg-surface-light/90 dark:bg-surface-dark/90 rounded-[2.5rem] z-50 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Đang tìm kèo mới...</p>
                <p className="text-xs text-gray-500">Đang áp dụng bộ lọc</p>
              </div>
            </div>
          )}

          {Array.from({ length: Math.min(2, allTeams.length - currentIndex) }).map((_, index) => {
            const team = allTeams[currentIndex + index];
            if (!team) return null;

            return (
              <div
                key={team.id}
                ref={index === 0 ? cardRef : null}
                style={getCardStyle(index)}
                className="absolute left-0 right-0 mx-auto w-full max-w-[360px] h-[calc(100dvh-220px)] sm:h-[calc(100dvh-200px)] max-h-[580px] sm:max-h-[640px] bg-surface-light dark:bg-surface-dark rounded-[2.5rem] shadow-card flex flex-col overflow-hidden border border-gray-200 dark:border-white/10 group cursor-grab active:cursor-grabbing select-none will-change-transform"
                onTouchStart={index === 0 ? handleTouchStart : undefined}
                onTouchMove={index === 0 ? handleTouchMove : undefined}
                onTouchEnd={index === 0 ? handleTouchEnd : undefined}
                onMouseDown={index === 0 ? handleTouchStart : undefined}
                onMouseMove={index === 0 ? handleTouchMove : undefined}
                onMouseUp={index === 0 ? handleTouchEnd : undefined}
                onMouseLeave={index === 0 ? handleTouchEnd : undefined}
              >
                {/* Swipe Overlay Indicators */}
                {index === 0 && (
                  <>
                    <div
                      className="absolute top-8 left-8 z-30 border-4 border-green-500 rounded-[2.5rem] px-6 py-3 transform -rotate-12 pointer-events-none transition-opacity bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md shadow-lg"
                      style={{ opacity: likeOpacity }}
                    >
                      <span className="text-4xl font-black text-green-500 uppercase tracking-widest">LIKE</span>
                    </div>
                    <div
                      className="absolute top-8 right-8 z-30 border-4 border-red-500 rounded-[2.5rem] px-6 py-3 transform rotate-12 pointer-events-none transition-opacity bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md shadow-lg"
                      style={{ opacity: nopeOpacity }}
                    >
                      <span className="text-4xl font-black text-red-500 uppercase tracking-widest">NOPE</span>
                    </div>
                  </>
                )}

                {/* Image */}
                <div className="relative h-[160px] sm:h-[180px] w-full bg-surface-light overflow-hidden shrink-0">
                  {team.logo ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${team.logo}')` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
                      <span className="text-white text-6xl font-bold">{team.name?.charAt(0) || 'T'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-surface-light/60 dark:bg-surface-dark/60 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-light dark:from-surface-dark via-transparent to-transparent" />

                  {/* Compatibility Badge - Top Left - Using qualityScore */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
                    <div className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-lg flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wide">
                        {Math.round((team.qualityScore || 0) * 100)}% Hợp cạ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Circular Team Logo - Positioned at boundary between image and content */}
                <div className="absolute top-[140px] sm:top-[160px] left-1/2 -translate-x-1/2 z-20">
                  <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full p-1.5 bg-surface-light dark:bg-surface-dark shadow-2xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-surface-light border border-gray-200 dark:border-white/10 relative">
                      {team.logo ? (
                        <img src={team.logo} className="w-full h-full object-cover" alt="logo" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                          {team.name?.charAt(0) || 'T'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-4 sm:px-6 pt-14 pb-24 items-center text-center bg-surface-light dark:bg-surface-dark w-full" onClick={handleClickCard}>
                  {/* Team name + verified badge - CENTER */}
                  <div className="flex flex-col items-center gap-1 mb-2">
                    <h2 className="text-slate-900 dark:text-white text-2xl font-display font-bold tracking-tight flex items-center gap-2">
                      {team.name}
                      {(team.qualityScore || 0) >= 0.8 && (
                        <Icon name="verified" className="text-primary text-[22px]" />
                      )}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      {/* Online status - green dot for active within 1 hour */}
                      {team.lastActive && (() => {
                        const now = Date.now();
                        const lastActiveTime = new Date(team.lastActive).getTime();
                        const hoursDiff = (now - lastActiveTime) / (1000 * 60 * 60);
                        const isToday = new Date(team.lastActive).toDateString() === new Date().toDateString();

                        if (hoursDiff < 1) {
                          return (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                              <span className="text-emerald-400 text-xs font-medium">Đang hoạt động</span>
                            </div>
                          );
                        } else if (isToday) {
                          return (
                            <span className="text-text-secondary text-xs font-medium">
                              Hoạt động {new Date(team.lastActive).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <span className="text-text-secondary text-sm font-medium">
                      {team.location?.address || '...'}
                    </span>
                  </div>

                  {/* Badges: Level + Members */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    {(() => {
                      const levelColor = getLevelColor(team.level);
                      return (
                        <div className={`px-3 py-1 rounded-lg ${levelColor.bg} border ${levelColor.border} flex items-center gap-1.5`}>
                          <Icon name={LEVEL_ICON} className={`${levelColor.main} text-[16px]`} />
                          <span className={`${levelColor.main} text-xs font-bold uppercase tracking-wide`}>{team.level || '-'}</span>
                        </div>
                      );
                    })()}
                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
                      <Icon name="groups" className="text-text-secondary text-[16px]" />
                      <span className="text-text-secondary text-xs font-bold">{team.membersCount || 0} Thành viên</span>
                    </div>
                  </div>

                  {/* Description - max 2 lines, or show joined date if empty */}
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 px-2 mb-6">
                    {team.description
                      ? team.description
                      : `Tham gia CapKeoSport từ ${new Date((team as unknown as Team).createdAt || '').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`}
                  </p>

                  {/* Stats Grid với Progress Bars - 3 cols */}
                  <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mb-auto">
                    {team.stats?.attack && (
                      <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-1 border border-gray-200 dark:border-white/5 shadow-inner-light">
                        <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Tấn công</span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{team.stats.attack}</span>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: `${team.stats.attack}%` }}></div>
                        </div>
                      </div>
                    )}
                    {team.stats?.defense && (
                      <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-1 border border-gray-200 dark:border-white/5 shadow-inner-light">
                        <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Phòng thủ</span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{team.stats.defense}</span>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${team.stats.defense}%` }}></div>
                        </div>
                      </div>
                    )}
                    {team.stats?.technique && (
                      <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-1 border border-gray-200 dark:border-white/5 shadow-inner-light">
                        <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Kỹ thuật</span>
                        <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{team.stats.technique}</span>
                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${team.stats.technique}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Grid - 2 cols: Sân bóng, Cách xa */}
                  <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <div className="flex items-center justify-center gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5">
                      <Icon name="sports_soccer" className="text-primary text-[18px] sm:text-[20px]" />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-text-secondary uppercase font-bold">Sân bóng</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{team.pitch?.join(' & ') || 'Sân 5 & 7'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5">
                      <Icon name="near_me" className="text-primary text-[18px] sm:text-[20px]" />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-text-secondary uppercase font-bold">Cách xa</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{formatDistance(team.distance)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Swipe Actions */}
        <div className="relative z-20 w-full flex items-center justify-center gap-10 pb-12 pt-4 px-6 shrink-0">
          {/* Close button */}
          <button
            onClick={() => removeCard('left')}
            disabled={!currentTeam || selectedTeam?.userRole !== 'admin'}
            className="group flex items-center justify-center w-[72px] h-[72px] rounded-full bg-surface-light dark:bg-surface-dark text-text-secondary shadow-lg border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-surface-light hover:text-slate-900 dark:hover:text-white transition-all duration-300 active:scale-90 disabled:opacity-50"
          >
            <Icon name="close" className="text-[32px] group-hover:rotate-12 transition-transform duration-300" />
          </button>

          {/* Favorite button */}
          <button
            onClick={() => removeCard('right')}
            disabled={!currentTeam || selectedTeam?.userRole !== 'admin'}
            className="group flex items-center justify-center w-[84px] h-[84px] rounded-full bg-primary text-background-dark shadow-glow shadow-primary/40 hover:shadow-primary/60 hover:scale-105 transition-all duration-300 active:scale-95 border-4 border-background-light dark:border-background-dark disabled:opacity-50"
          >
            <Icon name="favorite" className="text-[40px] filled group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Admin-only blocker for non-admin users */}
        {selectedTeam && selectedTeam.userRole !== 'admin' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 mx-6 max-w-sm shadow-2xl text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="admin_panel_settings" className="text-amber-500 text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Cần quyền quản trị viên
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Bạn không phải là quản trị viên của đội <span className="font-semibold text-slate-900 dark:text-white">{selectedTeam.name}</span>. Chỉ quản trị viên mới có thể tìm kèo đấu.
              </p>
              <Button
                icon="groups"
                onClick={() => setShowTeamSelector(true)}
                className="w-full"
              >
                Chọn đội khác
              </Button>
            </div>
          </div>
        )}

        {/* Team Selector Bottom Sheet */}
        {showTeamSelector && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowTeamSelector(false)}
            />

            {/* Sheet */}
            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Chọn đội đi "cáp kèo"</h3>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                {adminTeams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <Icon name="admin_panel_settings" className="text-4xl text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 mb-1">Bạn chưa là quản trị viên của đội nào</p>
                    <p className="text-xs text-gray-400">Hãy tạo đội mới hoặc liên hệ quản trị viên để cấp quyền</p>
                  </div>
                ) : (
                  adminTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeamChange(team.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all active:scale-[0.98] ${selectedTeam?.id === team.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                    >
                      <TeamAvatar src={team.logo} />
                      <div className="flex-1 text-left">
                        <h4 className={`font-bold ${selectedTeam?.id === team.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                          {team.name}
                        </h4>
                        <p className="text-xs text-gray-500">Quản trị viên</p>
                      </div>
                      {selectedTeam?.id === team.id && (
                        <div className="size-6 bg-primary rounded-full flex items-center justify-center text-black">
                          <Icon name="check" className="text-sm" />
                        </div>
                      )}
                    </button>
                  ))
                )}

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

      {/* Filter Bottom Sheet - outside overflow-hidden container */}
      <FilterBottomSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApply={refresh}
      />

      {/* Match Modal - outside overflow-hidden container */}
      <MatchModal
        isOpen={!!matchedTeam}
        matchedTeam={matchedTeam}
        myTeamLogo={selectedTeam?.logo}
        myTeamName={selectedTeam?.name}
        myTeamId={selectedTeam?.id}
        matchId={matchedMatch?.id}
        onKeepSwiping={closeMatchModal}
      />
    </>
  );
};

export default FindMatchScreen;
