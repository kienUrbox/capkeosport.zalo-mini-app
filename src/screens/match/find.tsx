import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TeamAvatar, FindMatchSkeleton, FilterBottomSheet, MatchModal, Button } from '@/components/ui';
import type { LocationSource } from '@/components/ui/FilterBottomSheet';
import { appRoutes } from '@/utils/navigation';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useMyTeams, useSelectedTeam, useTeamStore } from '@/stores/team.store';
import { useDiscoveryStore } from '@/stores/discovery.store';
import { toast } from '@/utils/toast';
import { getLevelColor, LEVEL_ICON } from '@/constants/design';

/**
 * Flow States for Discovery
 */
type DiscoveryFlowState =
  | 'loading'           // Initial loading state
  | 'no-teams'          // User has no teams
  | 'select-team'       // User needs to select a team (has multiple teams)
  | 'select-filter'     // User needs to select filters
  | 'select-location'   // User needs to select location source
  | 'discovery'         // Main discovery swipe interface
  | 'no-more-matches'   // All cards swiped, no more matches
  | 'empty-results';    // No teams found

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
 *
 * New Flow:
 * 1. Check if user has teams
 * 2. If yes, check if user needs to select team (multiple admin teams)
 * 3. After team selection, show filter bottom sheet (required)
 * 4. After filter selection, show location modal (3 options)
 * 5. After location selection, start discovery API call
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
    closeMatchModal,
    pendingSwipeCount,
    canSwipe,
    fetchWithLocation,
    hasNoMore,
  } = useDiscovery();

  // Get filters and hasAppliedFilters from discovery store - use individual selectors to avoid cache issues
  const filters = useDiscoveryStore((state) => state.filters);
  const hasAppliedFilters = useDiscoveryStore((state) => state.hasAppliedFilters);
  const setHasAppliedFilters = useDiscoveryStore((state) => state.setHasAppliedFilters);

  // Team selection
  const myTeams = useMyTeams();
  const selectedTeam = useSelectedTeam();
  const { setSelectedTeam } = useTeamStore();
  const isTeamsLoading = useTeamStore((state) => state.isLoading);
  const teamDetailsCache = useTeamStore((state) => state.teamDetailsCache);
  const getTeamById = useTeamStore((state) => state.getTeamById);

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

  // Track if we've initialized the flow
  const flowInitializedRef = useRef(false);
  // Track if we've auto-fetched with saved filters (to prevent duplicate calls)
  const autoFetchedRef = useRef(false);

  /**
   * NEW FLOW STATE LOGIC
   *
   * Flow:
   * 1. loading → Check if teams loaded
   * 2. no-teams → User has no teams, show create team CTA
   * 3. select-team → User has multiple admin teams, show team selector
   * 4. select-filter → User hasn't applied filters yet, show filter sheet (required)
   * 5. discovery → Main swipe interface
   * 6. empty-results → No teams found
   */
  const flowState: DiscoveryFlowState = useMemo(() => {
    // Loading state - check if teams are still loading
    if (isTeamsLoading) {
      return 'loading';
    }

    // No teams
    if (myTeams.length === 0) {
      return 'no-teams';
    }

    // No admin teams
    if (adminTeams.length === 0) {
      return 'no-teams'; // Reuse no-teams state with different message
    }

    // Need to select team (multiple admin teams, none selected)
    if (adminTeams.length > 1 && !selectedTeam) {
      return 'select-team';
    }

    // Need to apply filters (team selected but filters not applied)
    if (selectedTeam && !hasAppliedFilters) {
      return 'select-filter';
    }

    // If we have teams but no current team in discovery, it means we haven't fetched yet
    // This is handled by loading state or empty results
    if (hasAppliedFilters && selectedTeam) {
      if (!isLoading && allTeams.length === 0 && !isRefreshing) {
        return 'empty-results';
      }
      // Check if user has swiped through all cards and no more available
      if (hasNoMore && !hasMoreCards && allTeams.length > 0) {
        return 'no-more-matches';
      }
      return 'discovery';
    }

    // Default to loading
    return 'loading';
  }, [isTeamsLoading, myTeams.length, adminTeams.length, selectedTeam, hasAppliedFilters, allTeams.length, isLoading, isRefreshing, hasNoMore, hasMoreCards]);

  // Initialize flow - auto-select team if single admin team
  useEffect(() => {
    if (flowInitializedRef.current) return;

    if (!isTeamsLoading && adminTeams.length === 1 && !selectedTeam) {
      console.log('[FindMatch] Auto-selecting single admin team');
      setSelectedTeam(adminTeams[0]);
      flowInitializedRef.current = true;
    } else if (!isTeamsLoading && adminTeams.length > 1 && !selectedTeam) {
      // Don't auto-select, let user choose
      flowInitializedRef.current = true;
    }
  }, [isTeamsLoading, adminTeams.length, selectedTeam, setSelectedTeam]);

  // Show filter sheet when flow state is select-filter (first time only)
  useEffect(() => {
    if (flowState === 'select-filter' && !showFilterSheet) {
      console.log('[FindMatch] Flow: Showing filter sheet (required first time)');
      setShowFilterSheet(true);
    }
  }, [flowState]);

  // Auto-fetch when filters are already applied from previous session
  useEffect(() => {
    if (hasAppliedFilters && selectedTeam && !isLoading && allTeams.length === 0 && !isRefreshing && !autoFetchedRef.current) {
      // Get saved location source from localStorage
      const savedLocationSource = localStorage.getItem('discovery-location-source') as LocationSource | null;
      const savedStadiumLocation = localStorage.getItem('discovery-stadium-location');

      let stadiumLocation;
      if (savedLocationSource === 'stadium' && savedStadiumLocation) {
        stadiumLocation = JSON.parse(savedStadiumLocation);
      }

      // Use saved location source or default to 'current'
      const locationSource = savedLocationSource || 'current';
      autoFetchedRef.current = true;
      fetchWithLocation(locationSource, stadiumLocation, selectedTeam?.id);
    }
  }, [hasAppliedFilters, selectedTeam, isLoading, allTeams.length, isRefreshing]);

  // Helper to get stadium location from selected team
  const getStadiumLocationFromTeam = async (team: { id: string } | null): Promise<{ lat: number; lng: number } | undefined> => {
    if (!team) return undefined;

    // Check cache first
    let teamDetail = teamDetailsCache[team.id];

    // If not in cache, fetch team detail
    if (!teamDetail) {
      try {
        teamDetail = await getTeamById(team.id);
      } catch (error) {
        console.error('[FindMatch] Failed to fetch team detail for stadium location:', error);
        return { lat: 10.7769, lng: 106.7009 }; // Fallback to default
      }
    }

    // Extract location from team detail
    if (teamDetail?.location) {
      return { lat: teamDetail.location.lat, lng: teamDetail.location.lng };
    }

    return { lat: 10.7769, lng: 106.7009 }; // Fallback to default
  };

  // Handle first-time filter apply - mark as applied and call API with location source
  const handleFilterApply = async (locationSource: LocationSource) => {
    setHasAppliedFilters(true);
    setShowFilterSheet(false);
    autoFetchedRef.current = true; // Mark as fetched to prevent duplicate calls

    // Save location source to localStorage for next time
    localStorage.setItem('discovery-location-source', locationSource);

    let stadiumLocation;
    if (locationSource === 'stadium') {
      stadiumLocation = await getStadiumLocationFromTeam(selectedTeam);
      localStorage.setItem('discovery-stadium-location', JSON.stringify(stadiumLocation));
    } else {
      localStorage.removeItem('discovery-stadium-location');
    }

    await fetchWithLocation(locationSource, stadiumLocation, selectedTeam?.id);
  };

  // Handle filter change (not first time) - apply with new location source
  const handleFilterChange = async (locationSource: LocationSource) => {
    setShowFilterSheet(false);
    autoFetchedRef.current = true; // Mark as fetched to prevent duplicate calls

    // Save location source to localStorage for next time
    localStorage.setItem('discovery-location-source', locationSource);

    let stadiumLocation;
    if (locationSource === 'stadium') {
      stadiumLocation = await getStadiumLocationFromTeam(selectedTeam);
      localStorage.setItem('discovery-stadium-location', JSON.stringify(stadiumLocation));
    } else {
      localStorage.removeItem('discovery-stadium-location');
    }

    // Fetch with new location source
    await fetchWithLocation(locationSource, stadiumLocation, selectedTeam?.id);
  };

  // Handle team change - select a different team
  const handleTeamChange = async (teamId: string) => {
    const newTeam = adminTeams.find(t => t.id === teamId);
    if (!newTeam) return;

    console.log('[FindMatch] handleTeamChange: Changing to team', newTeam.name, 'hasAppliedFilters:', hasAppliedFilters);

    // Close the team selector modal if open
    setShowTeamSelector(false);

    // Check if user already has filters applied from before
    if (hasAppliedFilters) {
      // Get saved location source from localStorage
      const savedLocationSource = localStorage.getItem('discovery-location-source') as LocationSource | null;
      const savedStadiumLocation = localStorage.getItem('discovery-stadium-location');

      let stadiumLocation: { lat: number; lng: number } | undefined;
      if (savedLocationSource === 'stadium' && savedStadiumLocation) {
        stadiumLocation = JSON.parse(savedStadiumLocation);
      }

      // Use saved location source or default to 'current'
      const locationSource = savedLocationSource || 'current';
      console.log('[FindMatch] handleTeamChange: Fetching with locationSource', locationSource);

      // Select the new team and defer fetch to next tick to avoid hook errors
      setSelectedTeam(newTeam);
      setTimeout(() => {
        fetchWithLocation(locationSource, stadiumLocation, teamId);
      }, 0);
    } else {
      // First time, show filter sheet
      console.log('[FindMatch] handleTeamChange: Showing filter sheet');
      // Select the new team
      setSelectedTeam(newTeam);
      setTimeout(() => {
        setShowFilterSheet(true);
      }, 0);
    }
  };

  // Swipe action handlers
  const removeCard = (direction: 'left' | 'right') => {
    // Block swipe if user is not admin OR if swipe limit reached
    if (!currentTeam || selectedTeam?.userRole !== 'admin' || !canSwipe) {
      // Show shake feedback for limit reached
      if (!canSwipe) {
        toast.error('Đang xử lý quá nhiều thao tác, vui lòng đợi trong giây lát');
      }
      // Shake animation feedback for non-admin
      return;
    }

    setSwipeDirection(direction);

    // Optimistic: handleSwipe will advance card immediately
    // Short delay for animation to start
    setTimeout(() => {
      handleSwipe(direction);
      setSwipeDirection(null);
      setDragDelta({ x: 0, y: 0 });
    }, 100);
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

  // ========== FLOW STATE RENDERING ==========

  // Loading state
  if (flowState === 'loading') {
    console.log('[FindMatch] Flow: Loading skeleton');
    return <FindMatchSkeleton />;
  }

  // Error state - show but allow retry
  if (error && !currentTeam && flowState === 'discovery') {
    return (
      <div className="flex flex-col h-dvh bg-background-light dark:bg-background-dark items-center justify-center p-6 text-center">
        <div className="size-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Icon name="error" className="text-4xl text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => {
            // Retry by showing filter sheet again
            setHasAppliedFilters(false);
            setShowFilterSheet(true);
          }}
          className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state - no teams at all
  if (flowState === 'no-teams') {
    // Check if user has teams but no admin teams
    const hasTeamsNoAdmin = myTeams.length > 0 && adminTeams.length === 0;

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
          {hasTeamsNoAdmin ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    );
  }

  // Team Selection State
  if (flowState === 'select-team') {
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
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Chọn đội</h1>
        </div>

        {/* Team Selection */}
        <div className="flex flex-col items-center flex-1 p-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Icon name="groups" className="text-primary text-4xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            Chọn đội để tìm kèo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
            Bạn là quản trị viên của {adminTeams.length} đội. Chọn đội bạn muốn dùng để tìm kèo.
          </p>

          <div className="w-full max-w-sm space-y-3">
            {adminTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamChange(team.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 hover:border-primary transition-all active:scale-[0.98]"
              >
                <TeamAvatar src={team.logo} />
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white">{team.name}</h3>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
                <Icon name="chevron_right" className="text-gray-400" />
              </button>
            ))}

            <button
              onClick={() => {
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
    );
  }

  // Empty results state - no teams found after search
  if (flowState === 'empty-results') {
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

        {/* Team Selector Modal */}
        {showTeamSelector && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowTeamSelector(false)}
            />
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

        {/* Filter Bottom Sheet */}
        <FilterBottomSheet
          isOpen={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          onApply={handleFilterApply}
          onChange={handleFilterChange}
          isChange={true}
          required={false}
        />
      </>
    );
  }

  // No more matches state - user has swiped through all available teams
  if (flowState === 'no-more-matches') {
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

        {/* Team Selector Modal */}
        {showTeamSelector && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setShowTeamSelector(false)}
            />
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

        {/* Filter Bottom Sheet */}
        <FilterBottomSheet
          isOpen={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          onApply={handleFilterApply}
          onChange={handleFilterChange}
          isChange={true}
          required={false}
        />
      </>
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

        {/* Pending swipe indicator */}
        {pendingSwipeCount > 0 && (
          <div className="fixed top-12 left-0 right-0 z-40 flex justify-center px-4 safe-area-top">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-white/10">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Đang lưu {pendingSwipeCount} swipe{pendingSwipeCount > 1 ? 's' : ''}...
              </span>
            </div>
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
        </div>

        {/* Filter FAB - Bottom Right (Fixed) */}
        <button
          onClick={() => setShowFilterSheet(true)}
          className="fixed bottom-24 right-4 z-50 size-14 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark active:scale-95 transition-all"
          aria-label="Bộ lọc"
        >
          <Icon name="tune" className="text-xl" />
        </button>

        {/* Card Stack Area */}
        <div className="flex-1 relative w-full flex flex-col items-center justify-center p-4 z-10 overflow-hidden">
          {/* Decorative Stack Layers (To give depth feel) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)] w-[82%] h-[calc(100dvh-220px)] sm:h-[calc(100dvh-200px)] max-h-[580px] sm:max-h-[640px] bg-surface-light/40 dark:bg-surface-dark/40 rounded-[2.5rem] border border-white/5 z-0 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] w-[82%] h-[calc(100dvh-220px)] sm:h-[calc(100dvh-200px)] max-h-[580px] sm:max-h-[640px] bg-surface-light/70 dark:bg-surface-dark/70 rounded-[2.5rem] border border-white/5 z-10 shadow-lg backdrop-blur-sm pointer-events-none"></div>

          {/* Refreshing skeleton overlay - show when refreshing OR when loading after filter/team change */}
          {isRefreshing || isLoading && (
            <div className="absolute w-full max-w-[360px] h-[calc(100dvh-220px)] sm:h-[calc(100dvh-200px)] max-h-[580px] sm:max-h-[640px] bg-surface-light/90 dark:bg-surface-dark/90 rounded-[2.5rem] z-50 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {isRefreshing ? 'Đang tìm kèo mới...' : 'Đang tìm kèo...'}
                </p>
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

                {/* Image - Banner priority over logo */}
                <div className="relative h-[160px] sm:h-[180px] w-full bg-surface-light overflow-hidden shrink-0">
                  {team.banner ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${team.banner}')` }}
                    />
                  ) : team.logo ? (
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

                  {/* Score Badges - Top Left: Compatibility Only */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                    {/* Compatibility Score - Điểm tương thích */}
                    {(() => {
                      const compatibilityScore = Math.round((team.compatibilityScore || 0) * 100);
                      const compatibilityColor = compatibilityScore >= 80 ? 'text-pink-500' : compatibilityScore >= 60 ? 'text-amber-500' : 'text-gray-500';
                      return (
                        <div className="px-3 py-1 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-lg flex items-center gap-1.5">
                          <Icon name="favorite" filled className={compatibilityColor} />
                          <span className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wide">
                            {compatibilityScore}% Hợp cạ
                          </span>
                        </div>
                      );
                    })()}
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
                      : `Tham gia CapKeoSport từ ${new Date((team as { createdAt?: string }).createdAt || '').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`}
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
        onClose={() => {
          // Only allow closing if not in required mode (select-filter flow)
          if (flowState !== 'select-filter') {
            setShowFilterSheet(false);
          }
        }}
        onApply={handleFilterApply}
        onChange={handleFilterChange}
        isChange={hasAppliedFilters}
        required={flowState === 'select-filter'}
        requiredText="Bắt buộc chọn bộ lọc để tiếp tục"
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
