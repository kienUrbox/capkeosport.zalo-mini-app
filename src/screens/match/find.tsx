import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TeamAvatar, MatchBadge, FindMatchSkeleton, FilterBottomSheet, MatchModal } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useMyTeams, useSelectedTeam, useTeamActions } from '@/stores/team.store';

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
    isLoading,
    isRefreshing,
    error,
    handleSwipe,
    refresh,
    closeMatchModal,
    goToMatchDetail,
  } = useDiscovery();

  // Team selection
  const myTeams = useMyTeams();
  const selectedTeam = useSelectedTeam();
  const { setSelectedTeam } = useTeamActions();

  // UI states
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Swipe Logic
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle team change
  const handleTeamChange = (teamId: string) => {
    const team = myTeams.find((t) => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setShowTeamSelector(false);
      // Refresh with new team filters
      refresh();
    }
  };

  // Swipe action handlers
  const removeCard = async (direction: 'left' | 'right') => {
    if (!currentTeam) return;

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
      navigate(appRoutes.opponentDetail(currentTeam.id));
    }
  };

  // Calculate transform style based on drag
  const getCardStyle = (index: number) => {
    const actualIndex = currentIndex + index;
    if (actualIndex >= allTeams.length) {
      return { zIndex: 0, opacity: 0 };
    }

    if (index === 0) {
      const rotate = dragDelta.x * 0.05;
      const opacity = swipeDirection ? 0 : 1;
      const xPos = swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : dragDelta.x;

      return {
        transform: `translate(${xPos}px, ${dragDelta.y * 0.2}px) rotate(${rotate}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        opacity: opacity,
        zIndex: 10,
      };
    } else if (index === 1) {
      // Next card animation
      const scale = 0.95 + (Math.min(Math.abs(dragDelta.x), 100) / 100) * 0.05;
      return {
        transform: `scale(${scale}) translateY(10px)`,
        zIndex: 9,
        opacity: 1,
        transition: 'transform 0.1s ease',
      };
    }
    return { zIndex: 0, opacity: 0 };
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

  // Loading state
  if (isLoading && !currentTeam) {
    return <FindMatchSkeleton />;
  }

  // Error state
  if (error && !currentTeam) {
    return (
      <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark items-center justify-center p-6 text-center">
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
  
  // Empty state - no more teams
  if (!hasMoreCards && !isLoading) {
    return (
      <>
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark items-center justify-center p-6 text-center">
          <div className="size-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 animate-bounce">
            <Icon name="sentiment_satisfied" className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hết đội rồi!</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Bạn đã xem hết các đội phù hợp. Thử điều chỉnh bộ lọc để tìm thêm đội nhé.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowFilterSheet(true)}
              className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold shadow-lg"
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

        {/* Match Modal - must be rendered outside overflow-hidden container */}
        <MatchModal
          isOpen={!!matchedTeam}
          matchedTeam={matchedTeam}
          myTeamLogo={selectedTeam?.logo}
          myTeamName={selectedTeam?.name}
          onViewMatch={goToMatchDetail}
          onKeepSwiping={closeMatchModal}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />

        {/* Refreshing indicator */}
        {isRefreshing && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-primary/10 py-2 text-center text-xs text-primary font-medium safe-area-top">
            Đang làm mới...
          </div>
        )}

      {/* Header */}
      <div className="relative z-50 pt-4 px-4 flex justify-between items-center safe-area-top">
        <button
          onClick={() => navigate(appRoutes.dashboard)}
          className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <Icon name="arrow_back" />
        </button>

        {/* Team Selector Trigger */}
        {selectedTeam && (
          <div
            onClick={() => setShowTeamSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 cursor-pointer hover:scale-105 transition-transform active:scale-95 mx-2"
          >
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </div>
            <p className="text-white text-xs font-bold truncate">
              <span className="text-primary">{selectedTeam.name}</span>
            </p>
            <Icon name="expand_more" className="text-sm text-gray-400 shrink-0" />
          </div>
        )}

        {/* Filter Button */}
        <button
          onClick={() => {
            setShowFilterSheet(true);
          }}
          className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <Icon name="tune" />
        </button>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 relative mt-4">
        {Array.from({ length: Math.min(2, allTeams.length - currentIndex) }).map((_, index) => {
          const team = allTeams[currentIndex + index];
          if (!team) return null;

          return (
            <div
              key={team.id}
              ref={index === 0 ? cardRef : null}
              style={getCardStyle(index)}
              className="absolute w-full max-w-sm aspect-[3/4] max-h-[65vh] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col group cursor-grab active:cursor-grabbing select-none"
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
                    className="absolute top-8 left-8 z-30 border-4 border-green-500 rounded-lg px-4 py-1 transform -rotate-12 pointer-events-none transition-opacity"
                    style={{ opacity: likeOpacity }}
                  >
                    <span className="text-4xl font-black text-green-500 uppercase tracking-widest">LIKE</span>
                  </div>
                  <div
                    className="absolute top-8 right-8 z-30 border-4 border-red-500 rounded-lg px-4 py-1 transform rotate-12 pointer-events-none transition-opacity"
                    style={{ opacity: nopeOpacity }}
                  >
                    <span className="text-4xl font-black text-red-500 uppercase tracking-widest">NOPE</span>
                  </div>
                </>
              )}

              {/* Image */}
              <div className="relative h-[55%] w-full pointer-events-none">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">{team.name?.charAt(0) || 'T'}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                  <MatchBadge type="match" value={Math.round((team.qualityScore || 0) * 100)} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-5 pb-5 flex flex-col items-center -mt-16 relative z-20" onClick={handleClickCard}>
                {/* Logo */}
                <div className="size-16 rounded-full border-4 border-white dark:border-surface-dark bg-surface-dark p-0.5 shadow-lg mb-1">
                  {team.logo ? (
                    <img src={team.logo} className="w-full h-full rounded-full object-cover" alt="logo" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-xl">
                      {team.name?.charAt(0) || 'T'}
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  {team.name}
                  <Icon name="info" className="text-gray-400 text-lg" />
                </h2>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Icon name="location_on" className="text-sm" /> {formatDistance(team.distance)}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">{team.level}</div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-center gap-4 mb-4 w-full text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 py-2 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Icon name="groups" className="text-gray-400" />
                    <span className="font-semibold">{team.membersCount || '-'} thành viên</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="flex flex-col items-center p-2 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                    <Icon name="flash_on" className="text-red-500 text-lg mb-1" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{team.stats?.attack || '-'}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <Icon name="shield" className="text-blue-500 text-lg mb-1" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{team.stats?.defense || '-'}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                    <Icon name="sports_soccer" className="text-green-500 text-lg mb-1" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{team.stats?.technique || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe Actions */}
      <div className="pb-8 pt-2 px-4 flex items-center justify-center gap-8 z-20">
        <button
          onClick={() => removeCard('left')}
          disabled={!currentTeam}
          className="size-16 rounded-full bg-surface-dark border border-white/10 shadow-lg flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="close" className="text-3xl" />
        </button>

        <button className="size-12 rounded-full bg-surface-dark border border-white/10 shadow-lg flex items-center justify-center text-blue-400 hover:scale-110 active:scale-95 transition-transform">
          <Icon name="star" className="text-2xl" />
        </button>

        <button
          onClick={() => removeCard('right')}
          disabled={!currentTeam}
          className="size-16 rounded-full bg-primary shadow-glow flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="favorite" className="text-4xl" filled />
        </button>
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
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Chọn đội đi "cáp kèo"</h3>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              {myTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleTeamChange(team.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all active:scale-[0.98] ${
                    selectedTeam?.id === team.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <TeamAvatar src={team.logo} />
                  <div className="flex-1 text-left">
                    <h4 className={`font-bold ${selectedTeam?.id === team.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                      {team.name}
                    </h4>
                    <p className="text-xs text-gray-500">{team.isCaptain ? 'Quản trị viên' : 'Thành viên'}</p>
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
        onViewMatch={goToMatchDetail}
        onKeepSwiping={closeMatchModal}
      />
    </>
  );
};

export default FindMatchScreen;
