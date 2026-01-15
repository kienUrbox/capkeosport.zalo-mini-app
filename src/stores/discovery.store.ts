import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiscoveredTeam, DiscoveryResponse, DiscoveryStats, Match } from '@/types/api.types';
import { DiscoveryFilterDto } from '@/types/api.types';
import { TEAM_LEVELS, TEAM_GENDER } from '@/constants/design';
import { api } from '@/services/api/index';

// Default location: Ho Chi Minh City center
const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

export interface DiscoveryFilters {
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  level?: string[];
  gender?: string[];
  minRating?: number;
  minPlayers?: number;
  maxPlayers?: number;
  activeOnly?: boolean;
  excludeIds?: string[];
  sortBy?: 'distance' | 'rating' | 'createdAt' | 'lastActive';
  sortOrder?: 'ASC' | 'DESC';
}

interface DiscoveryState {
  // Filters
  filters: DiscoveryFilters;

  // Teams data
  teams: DiscoveredTeam[];
  currentIndex: number;
  totalAvailable: number;

  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Match state
  matchedTeam: DiscoveredTeam | null;
  matchedMatch: Match | null;

  // Stats
  stats: DiscoveryStats | null;
  statsLoading: boolean;

  // Track fetched state
  _fetchedStats: boolean;

  // ========== State Management Actions ==========
  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  resetFilters: (teamLevel?: string, teamGender?: string) => void;
  setTeams: (teams: DiscoveredTeam[], total: number) => void;
  setCurrentIndex: (index: number) => void;
  nextCard: () => void;
  setMatchedTeam: (team: DiscoveredTeam | null) => void;
  setMatchedMatch: (match: Match | null) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setStats: (stats: DiscoveryStats) => void;

  // ========== API Methods ==========

  /**
   * Discover teams with filters
   * POST /discovery
   */
  discoverTeams: (filters?: DiscoveryFilterDto) => Promise<DiscoveredTeam[]>;

  /**
   * Get discovery statistics
   * GET /discovery/stats
   */
  getStats: (forceRefresh?: boolean) => Promise<DiscoveryStats>;

  /**
   * Get recommended search parameters
   * GET /discovery/recommendations
   */
  getRecommendations: () => Promise<DiscoveryFilterDto>;
}

// Helper to map gender enum to Vietnamese
const mapGenderToVietnamese = (gender?: string): string => {
  if (!gender) return TEAM_GENDER.MALE;
  const genderUpper = gender.toUpperCase();
  if (genderUpper === 'MALE') return TEAM_GENDER.MALE;
  if (genderUpper === 'FEMALE') return TEAM_GENDER.FEMALE;
  return TEAM_GENDER.MIXED;
};

// Get default filters based on team info
export const getDefaultFilters = (teamLevel?: string, teamGender?: string): DiscoveryFilters => {
  return {
    center: {
      lat: DEFAULT_LOCATION.lat,
      lng: DEFAULT_LOCATION.lng,
    },
    radius: 15,
    level: teamLevel ? [teamLevel] : TEAM_LEVELS.slice(0, 3), // Default: first 3 levels
    gender: teamGender ? [mapGenderToVietnamese(teamGender)] : Object.values(TEAM_GENDER),
    activeOnly: true,
    sortBy: 'distance',
    sortOrder: 'ASC',
  };
};

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: getDefaultFilters(),
      teams: [],
      currentIndex: 0,
      totalAvailable: 0,
      isLoading: false,
      isRefreshing: false,
      error: null,
      matchedTeam: null,
      matchedMatch: null,
      stats: null,
      statsLoading: false,
      _fetchedStats: false,

      // ========== State Management Actions ==========
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: (teamLevel, teamGender) =>
        set({
          filters: getDefaultFilters(teamLevel, teamGender),
        }),

      setTeams: (teams, total) =>
        set({
          teams,
          totalAvailable: total,
          currentIndex: 0,
        }),

      setCurrentIndex: (index) =>
        set({
          currentIndex: index,
        }),

      nextCard: () =>
        set((state) => ({
          currentIndex: state.currentIndex + 1,
        })),

      setMatchedTeam: (team) =>
        set({
          matchedTeam: team,
        }),

      setMatchedMatch: (match) =>
        set({
          matchedMatch: match,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setRefreshing: (refreshing) =>
        set({
          isRefreshing: refreshing,
        }),

      setError: (error) =>
        set({
          error,
        }),

      clearError: () =>
        set({
          error: null,
        }),

      setStats: (stats) => set({ stats }),

      // ========== API Methods ==========

      /**
       * Discover teams with filters
       * POST /discovery
       */
      discoverTeams: async (externalFilters) => {
        try {
          const currentState = get();

          // Use provided filters or store filters
          const filters = externalFilters || {
            center: currentState.filters.center,
            radius: currentState.filters.radius,
            level: currentState.filters.level,
            gender: currentState.filters.gender,
            minRating: currentState.filters.minRating,
            minPlayers: currentState.filters.minPlayers,
            maxPlayers: currentState.filters.maxPlayers,
            activeOnly: currentState.filters.activeOnly,
            excludeIds: currentState.filters.excludeIds,
            sortBy: currentState.filters.sortBy,
            sortOrder: currentState.filters.sortOrder,
          };

          set({ isLoading: true, error: null });

          const response = await api.post<DiscoveryResponse>('/discovery', filters);

          if (response.success && response.data) {
            set({
              teams: response.data.teams,
              totalAvailable: response.data.total,
              currentIndex: 0,
              error: null,
            });

            return response.data.teams;
          } else {
            throw new Error(response.error?.message || 'Failed to discover teams');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể tìm kiếm đội';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get discovery statistics
       * GET /discovery/stats
       */
      getStats: async (forceRefresh = false) => {
        try {
          const currentState = get();

          // Skip if already loading
          if (currentState.statsLoading) {
            return currentState.stats;
          }

          // Skip if already fetched UNLESS forceRefresh
          if (!forceRefresh && currentState._fetchedStats && currentState.stats) {
            return currentState.stats;
          }

          set({ statsLoading: true, error: null });

          const response = await api.get<DiscoveryStats>('/discovery/stats');

          if (response.success && response.data) {
            set({
              stats: response.data,
              _fetchedStats: true,
              error: null,
            });

            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to fetch stats');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể tải thống kê';
          set({ error: errorMessage, statsLoading: false });
          throw error;
        } finally {
          set({ statsLoading: false });
        }
      },

      /**
       * Get recommended search parameters
       * GET /discovery/recommendations
       */
      getRecommendations: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get<DiscoveryFilterDto>('/discovery/recommendations');

          if (response.success && response.data) {
            // Update filters with recommendations
            get().setFilters(response.data);

            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to get recommendations');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể lấy gợi ý';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'discovery-storage',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// Selectors
export const useDiscoveryFilters = () => useDiscoveryStore((state) => state.filters);

export const useDiscoveryTeams = () => useDiscoveryStore((state) => state.teams);

export const useCurrentCard = () =>
  useDiscoveryStore((state) => (state.teams[state.currentIndex] ? state.teams[state.currentIndex] : null));

export const useDiscoveryMatchedTeam = () => useDiscoveryStore((state) => state.matchedTeam);

export const useDiscoveryStats = () => useDiscoveryStore((state) => state.stats);

export const useDiscoveryActions = () => {
  const store = useDiscoveryStore();
  return {
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
    setTeams: store.setTeams,
    setCurrentIndex: store.setCurrentIndex,
    nextCard: store.nextCard,
    setMatchedTeam: store.setMatchedTeam,
    setLoading: store.setLoading,
    setRefreshing: store.setRefreshing,
    setError: store.setError,
    clearError: store.clearError,
    setStats: store.setStats,
    // API methods
    discoverTeams: store.discoverTeams,
    getStats: store.getStats,
    getRecommendations: store.getRecommendations,
  };
};

export default useDiscoveryStore;
