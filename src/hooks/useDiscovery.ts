import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscoveryService, type DiscoveryFilterDto, type DiscoveredTeam } from '@/services/api/discovery.service';
import { SwipeService } from '@/services/api/swipe.service';
import { useDiscoveryStore, getDefaultFilters } from '@/stores/discovery.store';
import { useSelectedTeam, useMyTeams } from '@/stores/team.store';
import { useUIStore } from '@/stores/ui.store';
import { appRoutes } from '@/utils/navigation';
import type { Match } from '@/types/api.types';

interface UseDiscoveryReturn {
  // Data
  currentTeam: DiscoveredTeam | null;
  allTeams: DiscoveredTeam[];
  currentIndex: number;
  hasMoreCards: boolean;
  matchedTeam: DiscoveredTeam | null;
  matchedMatch: Match | null;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Actions
  fetchTeams: (isRefresh?: boolean) => Promise<void>;
  handleSwipe: (direction: 'left' | 'right') => Promise<void>;
  nextCard: () => void;
  openFilters: () => void;
  closeMatchModal: () => void;
  goToMatchDetail: (matchId: string) => void;
  refresh: () => Promise<void>;
}

const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

/**
 * Custom hook for discovery/swipe functionality
 *
 * Handles:
 * - Fetching discovered teams based on filters
 * - Swipe actions (like/pass)
 * - Match detection and modal
 * - Filter defaults from selected team
 */
export const useDiscovery = (): UseDiscoveryReturn => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const selectedTeam = useSelectedTeam();
  const myTeams = useMyTeams();

  // Store state
  const {
    filters,
    teams,
    currentIndex,
    totalAvailable,
    isLoading,
    isRefreshing,
    error,
    matchedTeam,
    matchedMatch,
    setFilters,
    resetFilters,
    setTeams,
    setCurrentIndex,
    nextCard,
    setMatchedTeam,
    setMatchedMatch,
    setLoading,
    setRefreshing,
    setError,
    clearError,
  } = useDiscoveryStore();

  // Track if component is mounted
  const isMounted = useRef(true);
  // Track if initial fetch has completed
  const hasFetched = useRef(false);
  // Track card view start time for swipe metadata
  const cardViewStartTime = useRef<number>(Date.now());

  // Update card view time when current index changes
  useEffect(() => {
    cardViewStartTime.current = Date.now();
  }, [currentIndex]);

  // Get user's location
  const getUserLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using default location');
        resolve(DEFAULT_LOCATION);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error, using default location:', error.message);
          resolve(DEFAULT_LOCATION);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }, []);

  // Initialize filters from selected team on first load
  useEffect(() => {
    if (!hasFetched.current && selectedTeam) {
      const defaults = getDefaultFilters(selectedTeam.level, selectedTeam.gender);
      // Only update if filters haven't been set by user (check if filters are still default)
      const currentFilters = useDiscoveryStore.getState().filters;
      const isDefaultFilter =
        (currentFilters.center?.lat ?? DEFAULT_LOCATION.lat) === defaults.center.lat &&
        (currentFilters.center?.lng ?? DEFAULT_LOCATION.lng) === defaults.center.lng &&
        currentFilters.radius === defaults.radius;

      if (isDefaultFilter) {
        resetFilters(selectedTeam.level, selectedTeam.gender);
      }
    }
  }, [selectedTeam, resetFilters]);

  // Fetch discovered teams
  const fetchTeams = useCallback(
    async (isRefresh = false) => {
      // Skip if already loading
      if (isLoading && !isRefresh) {
        return;
      }

      setLoading(true);
      if (isRefresh) {
        setRefreshing(true);
      }
      setError(null);

      try {
        // Get user location
        const location = await getUserLocation();

        // Update filters with current location
        setFilters({ center: { lat: location.lat, lng: location.lng } });

        // Build API params - exclude current team from results
        const params: DiscoveryFilterDto = {
          lat: location.lat,
          lng: location.lng,
          radius: filters.radius,
          level: filters.level,
          gender: filters.gender,
          sortBy: filters.sortBy === 'rating' ? 'quality' : filters.sortBy === 'createdAt' ? 'activity' : filters.sortBy === 'lastActive' ? 'activity' : filters.sortBy,
          sortOrder: filters.sortOrder,
          limit: 50,
        };

        // Add teamId to exclude current team
        if (selectedTeam?.id) {
          params.teamId = selectedTeam.id;
        }

        const response = await DiscoveryService.discoverTeams(params);

        if (response.success && response.data) {
          const fetchedTeams = response.data.teams || [];
          // Convert from service DiscoveredTeam to store DiscoveredTeam
          const convertedTeams = fetchedTeams.map((team) => ({
            ...team,
            logo: team.logo || '',
            isActive: true,
            isArchived: false,
            createdBy: '',
            createdAt: team.lastActive || new Date().toISOString(),
          }));
          setTeams(convertedTeams as any, response.data.total || 0);
          hasFetched.current = true;
        } else {
          setError('Không thể tải danh sách đội');
        }
      } catch (err: any) {
        console.error('Discovery fetch error:', err);
        const errorMessage = err?.message || 'Không thể tải danh sách đội. Vui lòng thử lại.';
        setError(errorMessage);
        if (isRefresh) {
          showToast(errorMessage, 'error');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [
      filters,
      selectedTeam,
      isLoading,
      getUserLocation,
      setFilters,
      setTeams,
      setLoading,
      setRefreshing,
      setError,
      showToast,
    ]
  );

  // Handle swipe action (like/pass)
  const handleSwipe = useCallback(
    async (direction: 'left' | 'right') => {
      const currentCard = teams[currentIndex];
      if (!currentCard || !selectedTeam) {
        return;
      }

      const action: 'like' | 'pass' = direction === 'right' ? 'like' : 'pass';

      // Call SwipeService with metadata
      try {
        const apiResponse = await SwipeService.createSwipe({
          swiperTeamId: selectedTeam.id,
          targetTeamId: currentCard.id,
          action,
          swipeMetadata: {
            timeSpentViewing: Date.now() - cardViewStartTime.current,
            locationPreferenceMatch: currentCard.distance <= 15,
            levelPreferenceMatch: selectedTeam.level === currentCard.level,
            genderPreferenceMatch: selectedTeam.gender === currentCard.gender,
          },
        });

        if (apiResponse.success && apiResponse.data?.isMatch) {
          // Show match modal with both team and match info
          setMatchedTeam(currentCard);
          if (apiResponse.data.newMatch) {
            setMatchedMatch(apiResponse.data.newMatch);
          }
        }

        nextCard();
      } catch (err: any) {
        console.error('Swipe error:', err);
        const errorMessage = err?.message || 'Không thể thực hiện hành động. Vui lòng thử lại.';
        showToast(errorMessage, 'error');
      }
    },
    [teams, currentIndex, selectedTeam, nextCard, setMatchedTeam, showToast]
  );

  // Open filters (navigate to filter bottom sheet - will be handled by screen)
  const openFilters = useCallback(() => {
    // This will be handled by the screen component
    // The screen will set a local state to show the FilterBottomSheet
  }, []);

  // Close match modal
  const closeMatchModal = useCallback(() => {
    setMatchedTeam(null);
    setMatchedMatch(null);
  }, [setMatchedTeam, setMatchedMatch]);

  // Go to match detail
  const goToMatchDetail = useCallback(
    (matchId: string) => {
      closeMatchModal();
      if (matchId) {
        navigate(appRoutes.matchDetail(matchId));
      }
    },
    [closeMatchModal, navigate]
  );

  // Refresh function
  const refresh = useCallback(async () => {
    await fetchTeams(true);
  }, [fetchTeams]);

  // Initial fetch on mount
  useEffect(() => {
    fetchTeams(false);

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Current team card
  const currentTeam = teams[currentIndex] || null;
  const hasMoreCards = currentIndex < teams.length;

  return {
    // Data
    currentTeam,
    allTeams: teams,
    currentIndex,
    hasMoreCards,
    matchedTeam,
    matchedMatch,

    // Loading states
    isLoading,
    isRefreshing,
    error,

    // Actions
    fetchTeams,
    handleSwipe,
    nextCard,
    openFilters,
    closeMatchModal,
    goToMatchDetail,
    refresh,
  };
};

export default useDiscovery;
