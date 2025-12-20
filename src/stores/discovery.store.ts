import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DiscoveredTeam, DiscoveryResponse, DiscoveryStats } from '../types/api.types';
import { DiscoveryService } from '../services/api/services';

interface DiscoveryState {
  // State
  discoveredTeams: DiscoveredTeam[];
  discoveryResponse: DiscoveryResponse | null;
  discoveryStats: DiscoveryStats | null;
  recommendedParams: any | null;
  trendingTeams: DiscoveredTeam[];
  newTeams: DiscoveredTeam[];
  recommendedTeams: DiscoveredTeam[];
  compatibleTeams: DiscoveredTeam[];
  similarLevelTeams: DiscoveredTeam[];
  popularAreas: any[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  lastSearchCenter: {
    lat: number;
    lng: number;
  } | null;
  searchHistory: Array<{
    timestamp: string;
    center: { lat: number; lng: number };
    radius: number;
    resultsCount: number;
  }>;
  filters: {
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
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    excludeIds?: string[];
    activeOnly?: boolean;
  };

  // Actions
  discoverTeams: (filter: any) => Promise<DiscoveryResponse | null>;
  getDiscoveryStats: () => Promise<void>;
  getRecommendedParams: () => Promise<void>;
  searchNearbyTeams: (lat: number, lng: number, radiusKm?: number, filters?: any) => Promise<DiscoveryResponse | null>;
  getTrendingTeams: (lat: number, lng: number, radiusKm?: number, limit?: number) => Promise<void>;
  getNewTeams: (lat: number, lng: number, radiusKm?: number, daysOld?: number) => Promise<void>;
  getRecommendedTeams: (teamId: string, limit?: number) => Promise<void>;
  getCompatibleTeams: (teamId: string, lat: number, lng: number, radiusKm?: number) => Promise<void>;
  getSimilarLevelTeams: (teamId: string, lat: number, lng: number, radiusKm?: number) => Promise<void>;
  advancedSearch: (criteria: any) => Promise<DiscoveryResponse | null>;
  saveDiscoveryPreferences: (preferences: any) => Promise<boolean>;
  getDiscoveryPreferences: () => Promise<void>;
  getPopularSearchAreas: () => Promise<void>;
  recordSearch: (searchData: any) => Promise<void>;
  setDiscoveredTeams: (teams: DiscoveredTeam[]) => void;
  addToSearchHistory: (search: any) => void;
  clearSearchHistory: () => void;
  setFilters: (filters: Partial<DiscoveryState['filters']>) => void;
  updateSearchLocation: (lat: number, lng: number) => void;
  clearError: () => void;
  reset: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  devtools(
    (set, get) => ({
      // Initial state
      discoveredTeams: [],
      discoveryResponse: null,
      discoveryStats: null,
      recommendedParams: null,
      trendingTeams: [],
      newTeams: [],
      recommendedTeams: [],
      compatibleTeams: [],
      similarLevelTeams: [],
      popularAreas: [],
      isLoading: false,
      isSearching: false,
      error: null,
      lastSearchCenter: null,
      searchHistory: [],
      filters: {
        center: {
          lat: 10.7769, // Default: Ho Chi Minh City center
          lng: 106.7009,
        },
        radius: 10,
        activeOnly: true,
        sortBy: 'distance',
        sortOrder: 'ASC',
      },

      // Actions
      discoverTeams: async (filter: any) => {
        try {
          set({ isSearching: true, error: null });

          const response = await DiscoveryService.discoverTeams(filter);

          if (response.success && response.data) {
            const discoveryData = response.data;

            set({
              discoveredTeams: discoveryData.teams,
              discoveryResponse: discoveryData,
              isSearching: false,
              lastSearchCenter: filter.center,
            });

            return discoveryData;
          }

          return null;
        } catch (error: any) {
          console.error('Discover teams error:', error);
          set({
            error: error.message || 'Failed to discover teams',
            isSearching: false,
          });
          return null;
        }
      },

      getDiscoveryStats: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getDiscoveryStats();

          if (response.success && response.data) {
            set({
              discoveryStats: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get discovery stats error:', error);
          set({
            error: error.message || 'Failed to fetch discovery statistics',
            isLoading: false,
          });
        }
      },

      getRecommendedParams: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getRecommendedParams();

          if (response.success && response.data) {
            set({
              recommendedParams: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get recommended params error:', error);
          set({
            error: error.message || 'Failed to get recommended parameters',
            isLoading: false,
          });
        }
      },

      searchNearbyTeams: async (lat: number, lng: number, radiusKm = 10, filters = {}) => {
        try {
          set({ isSearching: true, error: null });

          const response = await DiscoveryService.searchNearbyTeams(lat, lng, radiusKm, filters);

          if (response.success && response.data) {
            const discoveryData = response.data;

            set({
              discoveredTeams: discoveryData.teams,
              discoveryResponse: discoveryData,
              isSearching: false,
              lastSearchCenter: { lat, lng },
            });

            return discoveryData;
          }

          return null;
        } catch (error: any) {
          console.error('Search nearby teams error:', error);
          set({
            error: error.message || 'Failed to search nearby teams',
            isSearching: false,
          });
          return null;
        }
      },

      getTrendingTeams: async (lat: number, lng: number, radiusKm = 20, limit = 20) => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getTrendingTeams(lat, lng, radiusKm, limit);

          if (response.success && response.data) {
            set({
              trendingTeams: response.data.teams,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get trending teams error:', error);
          set({
            error: error.message || 'Failed to fetch trending teams',
            isLoading: false,
          });
        }
      },

      getNewTeams: async (lat: number, lng: number, radiusKm = 10, daysOld = 7) => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getNewTeams(lat, lng, radiusKm, daysOld);

          if (response.success && response.data) {
            set({
              newTeams: response.data.teams,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get new teams error:', error);
          set({
            error: error.message || 'Failed to fetch new teams',
            isLoading: false,
          });
        }
      },

      getRecommendedTeams: async (teamId: string, limit = 20) => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getRecommendedTeams(teamId, limit);

          if (response.success && response.data) {
            set({
              recommendedTeams: response.data.teams,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get recommended teams error:', error);
          set({
            error: error.message || 'Failed to fetch recommended teams',
            isLoading: false,
          });
        }
      },

      getCompatibleTeams: async (teamId: string, lat: number, lng: number, radiusKm = 10) => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getCompatibleTeams(teamId, lat, lng, radiusKm);

          if (response.success && response.data) {
            set({
              compatibleTeams: response.data.teams,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get compatible teams error:', error);
          set({
            error: error.message || 'Failed to fetch compatible teams',
            isLoading: false,
          });
        }
      },

      getSimilarLevelTeams: async (teamId: string, lat: number, lng: number, radiusKm = 10) => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getSimilarLevelTeams(teamId, lat, lng, radiusKm);

          if (response.success && response.data) {
            set({
              similarLevelTeams: response.data.teams,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get similar level teams error:', error);
          set({
            error: error.message || 'Failed to fetch similar level teams',
            isLoading: false,
          });
        }
      },

      advancedSearch: async (criteria: any) => {
        try {
          set({ isSearching: true, error: null });

          const response = await DiscoveryService.advancedSearch(criteria);

          if (response.success && response.data) {
            const discoveryData = response.data;

            set({
              discoveredTeams: discoveryData.teams,
              discoveryResponse: discoveryData,
              isSearching: false,
            });

            return discoveryData;
          }

          return null;
        } catch (error: any) {
          console.error('Advanced search error:', error);
          set({
            error: error.message || 'Failed to perform advanced search',
            isSearching: false,
          });
          return null;
        }
      },

      saveDiscoveryPreferences: async (preferences: any) => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.saveDiscoveryPreferences(preferences);

          set({ isLoading: false });
          return response.success;
        } catch (error: any) {
          console.error('Save discovery preferences error:', error);
          set({
            error: error.message || 'Failed to save discovery preferences',
            isLoading: false,
          });
          return false;
        }
      },

      getDiscoveryPreferences: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getDiscoveryPreferences();

          if (response.success && response.data) {
            const preferences = response.data;
            set({
              filters: {
                ...get().filters,
                center: preferences.defaultRadius ? get().filters.center : get().filters.center,
                radius: preferences.defaultRadius || get().filters.radius,
                level: preferences.preferredLevels || [],
                gender: preferences.preferredGenders || [],
                minRating: preferences.minRating,
                activeOnly: preferences.activeOnly !== false,
                sortBy: preferences.sortBy || get().filters.sortBy,
                sortOrder: preferences.sortOrder || get().filters.sortOrder,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get discovery preferences error:', error);
          set({
            error: error.message || 'Failed to fetch discovery preferences',
            isLoading: false,
          });
        }
      },

      getPopularSearchAreas: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await DiscoveryService.getPopularSearchAreas();

          if (response.success && response.data) {
            set({
              popularAreas: response.data.areas,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get popular search areas error:', error);
          set({
            error: error.message || 'Failed to fetch popular search areas',
            isLoading: false,
          });
        }
      },

      recordSearch: async (searchData: any) => {
        try {
          await DiscoveryService.recordSearch(searchData);

          const searchEntry = {
            timestamp: new Date().toISOString(),
            center: searchData.center,
            radius: searchData.radius,
            resultsCount: searchData.resultsCount,
          };

          const { searchHistory } = get();
          const updatedHistory = [searchEntry, ...searchHistory.slice(0, 49)]; // Keep last 50 searches

          set({ searchHistory: updatedHistory });
        } catch (error: any) {
          console.error('Record search error:', error);
        }
      },

      setDiscoveredTeams: (teams: DiscoveredTeam[]) => {
        set({ discoveredTeams: teams });
      },

      addToSearchHistory: (search: any) => {
        const { searchHistory } = get();
        const searchEntry = {
          ...search,
          timestamp: new Date().toISOString(),
        };

        const updatedHistory = [searchEntry, ...searchHistory.slice(0, 49)];
        set({ searchHistory: updatedHistory });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      setFilters: (filters: Partial<DiscoveryState['filters']>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...filters },
        });
      },

      updateSearchLocation: (lat: number, lng: number) => {
        const { filters } = get();
        set({
          filters: {
            ...filters,
            center: { lat, lng },
          },
          lastSearchCenter: { lat, lng },
        });
      },

      clearError: () => set({ error: null }),

      reset: () => set({
        discoveredTeams: [],
        discoveryResponse: null,
        discoveryStats: null,
        recommendedParams: null,
        trendingTeams: [],
        newTeams: [],
        recommendedTeams: [],
        compatibleTeams: [],
        similarLevelTeams: [],
        popularAreas: [],
        isLoading: false,
        isSearching: false,
        error: null,
        lastSearchCenter: null,
        searchHistory: [],
        filters: {
          center: {
            lat: 10.7769,
            lng: 106.7009,
          },
          radius: 10,
          activeOnly: true,
          sortBy: 'distance',
          sortOrder: 'ASC',
        },
      }),
    }),
    { name: 'discovery-store' }
  )
);

// Selectors
export const useDiscoveredTeams = () => useDiscoveryStore((state) => state.discoveredTeams);

export const useDiscoveryResponse = () => useDiscoveryStore((state) => state.discoveryResponse);

export const useDiscoveryStats = () => useDiscoveryStore((state) => state.discoveryStats);

export const useRecommendedParams = () => useDiscoveryStore((state) => state.recommendedParams);

export const useTrendingTeams = () => useDiscoveryStore((state) => state.trendingTeams);

export const useNewTeams = () => useDiscoveryStore((state) => state.newTeams);

export const useRecommendedTeamsList = () => useDiscoveryStore((state) => state.recommendedTeams);

export const useCompatibleTeams = () => useDiscoveryStore((state) => state.compatibleTeams);

export const useSimilarLevelTeams = () => useDiscoveryStore((state) => state.similarLevelTeams);

export const usePopularAreas = () => useDiscoveryStore((state) => state.popularAreas);

export const useDiscoveryLoading = () => useDiscoveryStore((state) => ({
  isLoading: state.isLoading,
  isSearching: state.isSearching,
}));

export const useDiscoveryError = () => useDiscoveryStore((state) => state.error);

export const useDiscoveryFilters = () => useDiscoveryStore((state) => state.filters);

export const useSearchHistory = () => useDiscoveryStore((state) => state.searchHistory);

export const useLastSearchCenter = () => useDiscoveryStore((state) => state.lastSearchCenter);

// Action selectors
export const useDiscoveryActions = () => useDiscoveryStore((state) => ({
  discoverTeams: state.discoverTeams,
  getDiscoveryStats: state.getDiscoveryStats,
  getRecommendedParams: state.getRecommendedParams,
  searchNearbyTeams: state.searchNearbyTeams,
  getTrendingTeams: state.getTrendingTeams,
  getNewTeams: state.getNewTeams,
  getRecommendedTeams: state.getRecommendedTeams,
  getCompatibleTeams: state.getCompatibleTeams,
  getSimilarLevelTeams: state.getSimilarLevelTeams,
  advancedSearch: state.advancedSearch,
  saveDiscoveryPreferences: state.saveDiscoveryPreferences,
  getDiscoveryPreferences: state.getDiscoveryPreferences,
  getPopularSearchAreas: state.getPopularSearchAreas,
  recordSearch: state.recordSearch,
  setDiscoveredTeams: state.setDiscoveredTeams,
  addToSearchHistory: state.addToSearchHistory,
  clearSearchHistory: state.clearSearchHistory,
  setFilters: state.setFilters,
  updateSearchLocation: state.updateSearchLocation,
  clearError: state.clearError,
  reset: state.reset,
}));

export default useDiscoveryStore;