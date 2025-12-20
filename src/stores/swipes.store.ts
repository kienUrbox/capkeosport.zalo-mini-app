import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Swipe, SwipeResponse, SwipeStats, SwipeAction } from '../types/api.types';
import { SwipesService } from '../services/api/services';

interface SwipesState {
  // State
  swipes: Swipe[];
  receivedSwipes: Swipe[];
  mutualLikes: Swipe[];
  currentSwipeResponse: SwipeResponse | null;
  swipeStats: SwipeStats | null;
  isLoading: boolean;
  isSwiping: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    action?: SwipeAction;
    teamId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  };

  // Actions
  fetchSwipes: (params?: any) => Promise<void>;
  fetchReceivedSwipes: (teamId: string, params?: any) => Promise<void>;
  fetchSwipeStats: (teamId: string) => Promise<void>;
  likeTeam: (swiperTeamId: string, targetTeamId: string, metadata?: any) => Promise<SwipeResponse | null>;
  passTeam: (swiperTeamId: string, targetTeamId: string, metadata?: any) => Promise<SwipeResponse | null>;
  undoSwipe: (swipeId: string) => Promise<boolean>;
  checkSwipeEligibility: (swiperTeamId: string, targetTeamId: string) => Promise<boolean>;
  fetchTeamSwipes: (teamId: string, params?: any) => Promise<void>;
  fetchTeamLikes: (teamId: string, params?: any) => Promise<void>;
  fetchTeamPasses: (teamId: string, params?: any) => Promise<void>;
  fetchMutualLikes: (teamId: string, params?: any) => Promise<void>;
  getSwipeTrends: (teamId: string) => Promise<void>;
  getSwipeRecommendations: (teamId: string, limit?: number) => Promise<void>;
  batchSwipes: (swiperTeamId: string, actions: any[]) => Promise<SwipeResponse[] | null>;
  setCurrentSwipeResponse: (response: SwipeResponse | null) => void;
  updateSwipeInList: (updatedSwipe: Swipe) => void;
  removeSwipeFromList: (id: string) => void;
  setFilters: (filters: Partial<SwipesState['filters']>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useSwipesStore = create<SwipesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      swipes: [],
      receivedSwipes: [],
      mutualLikes: [],
      currentSwipeResponse: null,
      swipeStats: null,
      isLoading: false,
      isSwiping: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      filters: {
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      },

      // Actions
      fetchSwipes: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const currentFilters = get().filters;
          const queryParams = {
            page: 1,
            limit: 20,
            ...currentFilters,
            ...params,
          };

          const response = await SwipesService.getTeamSwipes(queryParams.teamId || '', queryParams);

          if (response.success && response.data) {
            set({
              swipes: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch swipes error:', error);
          set({
            error: error.message || 'Failed to fetch swipes',
            isLoading: false,
          });
        }
      },

      fetchReceivedSwipes: async (teamId: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getReceivedSwipes(teamId, params);

          if (response.success && response.data) {
            set({
              receivedSwipes: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch received swipes error:', error);
          set({
            error: error.message || 'Failed to fetch received swipes',
            isLoading: false,
          });
        }
      },

      fetchSwipeStats: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getTeamSwipeStats(teamId);

          if (response.success && response.data) {
            set({
              swipeStats: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch swipe stats error:', error);
          set({
            error: error.message || 'Failed to fetch swipe statistics',
            isLoading: false,
          });
        }
      },

      likeTeam: async (swiperTeamId: string, targetTeamId: string, metadata?: any) => {
        try {
          set({ isSwiping: true, error: null });

          const response = await SwipesService.likeTeam(swiperTeamId, targetTeamId, metadata);

          if (response.success && response.data) {
            const swipeResponse = response.data;
            const { swipes } = get();

            set({
              currentSwipeResponse: swipeResponse,
              swipes: [swipeResponse.swipe, ...swipes],
              isSwiping: false,
            });

            return swipeResponse;
          }

          return null;
        } catch (error: any) {
          console.error('Like team error:', error);
          set({
            error: error.message || 'Failed to like team',
            isSwiping: false,
          });
          return null;
        }
      },

      passTeam: async (swiperTeamId: string, targetTeamId: string, metadata?: any) => {
        try {
          set({ isSwiping: true, error: null });

          const response = await SwipesService.passTeam(swiperTeamId, targetTeamId, metadata);

          if (response.success && response.data) {
            const swipeResponse = response.data;
            const { swipes } = get();

            set({
              currentSwipeResponse: swipeResponse,
              swipes: [swipeResponse.swipe, ...swipes],
              isSwiping: false,
            });

            return swipeResponse;
          }

          return null;
        } catch (error: any) {
          console.error('Pass team error:', error);
          set({
            error: error.message || 'Failed to pass team',
            isSwiping: false,
          });
          return null;
        }
      },

      undoSwipe: async (swipeId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.undoSwipe(swipeId);

          if (response.success && response.data) {
            const { swipes } = get();
            const updatedSwipes = swipes.filter(swipe => swipe.id !== swipeId);

            set({
              swipes: updatedSwipes,
              currentSwipeResponse: null,
              isLoading: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Undo swipe error:', error);
          set({
            error: error.message || 'Failed to undo swipe',
            isLoading: false,
          });
          return false;
        }
      },

      checkSwipeEligibility: async (swiperTeamId: string, targetTeamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.checkSwipeEligibility(swiperTeamId, targetTeamId);

          set({ isLoading: false });
          return response.success ? response.data?.canSwipe || false : false;
        } catch (error: any) {
          console.error('Check swipe eligibility error:', error);
          set({
            error: error.message || 'Failed to check swipe eligibility',
            isLoading: false,
          });
          return false;
        }
      },

      fetchTeamSwipes: async (teamId: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getTeamSwipes(teamId, params);

          if (response.success && response.data) {
            set({
              swipes: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch team swipes error:', error);
          set({
            error: error.message || 'Failed to fetch team swipes',
            isLoading: false,
          });
        }
      },

      fetchTeamLikes: async (teamId: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getTeamLikes(teamId, params);

          if (response.success && response.data) {
            set({
              swipes: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch team likes error:', error);
          set({
            error: error.message || 'Failed to fetch team likes',
            isLoading: false,
          });
        }
      },

      fetchTeamPasses: async (teamId: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getTeamPasses(teamId, params);

          if (response.success && response.data) {
            set({
              swipes: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch team passes error:', error);
          set({
            error: error.message || 'Failed to fetch team passes',
            isLoading: false,
          });
        }
      },

      fetchMutualLikes: async (teamId: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getMutualLikes(teamId, params);

          if (response.success && response.data) {
            set({
              mutualLikes: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch mutual likes error:', error);
          set({
            error: error.message || 'Failed to fetch mutual likes',
            isLoading: false,
          });
        }
      },

      getSwipeTrends: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getSwipeTrends(teamId);

          set({ isLoading: false });
          return response;
        } catch (error: any) {
          console.error('Get swipe trends error:', error);
          set({
            error: error.message || 'Failed to get swipe trends',
            isLoading: false,
          });
          return null;
        }
      },

      getSwipeRecommendations: async (teamId: string, limit = 20) => {
        try {
          set({ isLoading: true, error: null });

          const response = await SwipesService.getSwipeRecommendations(teamId, limit);

          set({ isLoading: false });
          return response;
        } catch (error: any) {
          console.error('Get swipe recommendations error:', error);
          set({
            error: error.message || 'Failed to get swipe recommendations',
            isLoading: false,
          });
          return null;
        }
      },

      batchSwipes: async (swiperTeamId: string, actions: any[]) => {
        try {
          set({ isSwiping: true, error: null });

          const response = await SwipesService.batchSwipes(swiperTeamId, actions);

          if (response.success && response.data) {
            const { swipes } = get();

            set({
              swipes: [...response.data, ...swipes],
              isSwiping: false,
            });

            return response.data;
          }

          return null;
        } catch (error: any) {
          console.error('Batch swipes error:', error);
          set({
            error: error.message || 'Failed to perform batch swipes',
            isSwiping: false,
          });
          return null;
        }
      },

      setCurrentSwipeResponse: (response: SwipeResponse | null) => {
        set({ currentSwipeResponse: response });
      },

      updateSwipeInList: (updatedSwipe: Swipe) => {
        const { swipes, receivedSwipes, mutualLikes } = get();

        set({
          swipes: swipes.map(swipe => (swipe.id === updatedSwipe.id ? updatedSwipe : swipe)),
          receivedSwipes: receivedSwipes.map(swipe => (swipe.id === updatedSwipe.id ? updatedSwipe : swipe)),
          mutualLikes: mutualLikes.map(swipe => (swipe.id === updatedSwipe.id ? updatedSwipe : swipe)),
        });
      },

      removeSwipeFromList: (id: string) => {
        const { swipes, receivedSwipes, mutualLikes } = get();

        const filterArray = (array: Swipe[]) => array.filter(swipe => swipe.id !== id);

        set({
          swipes: filterArray(swipes),
          receivedSwipes: filterArray(receivedSwipes),
          mutualLikes: filterArray(mutualLikes),
        });
      },

      setFilters: (filters: Partial<SwipesState['filters']>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...filters },
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        });
      },

      clearError: () => set({ error: null }),

      reset: () => set({
        swipes: [],
        receivedSwipes: [],
        mutualLikes: [],
        currentSwipeResponse: null,
        swipeStats: null,
        isLoading: false,
        isSwiping: false,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        filters: {
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        },
      }),
    }),
    { name: 'swipes-store' }
  )
);

// Selectors
export const useSwipes = () => useSwipesStore((state) => state.swipes);

export const useReceivedSwipes = () => useSwipesStore((state) => state.receivedSwipes);

export const useMutualLikes = () => useSwipesStore((state) => state.mutualLikes);

export const useCurrentSwipeResponse = () => useSwipesStore((state) => state.currentSwipeResponse);

export const useSwipeStats = () => useSwipesStore((state) => state.swipeStats);

export const useSwipesLoading = () => useSwipesStore((state) => ({
  isLoading: state.isLoading,
  isSwiping: state.isSwiping,
}));

export const useSwipesError = () => useSwipesStore((state) => state.error);

export const useSwipesPagination = () => useSwipesStore((state) => state.pagination);

export const useSwipesFilters = () => useSwipesStore((state) => state.filters);

// Action selectors
export const useSwipesActions = () => useSwipesStore((state) => ({
  fetchSwipes: state.fetchSwipes,
  fetchReceivedSwipes: state.fetchReceivedSwipes,
  fetchSwipeStats: state.fetchSwipeStats,
  likeTeam: state.likeTeam,
  passTeam: state.passTeam,
  undoSwipe: state.undoSwipe,
  checkSwipeEligibility: state.checkSwipeEligibility,
  fetchTeamSwipes: state.fetchTeamSwipes,
  fetchTeamLikes: state.fetchTeamLikes,
  fetchTeamPasses: state.fetchTeamPasses,
  fetchMutualLikes: state.fetchMutualLikes,
  getSwipeTrends: state.getSwipeTrends,
  getSwipeRecommendations: state.getSwipeRecommendations,
  batchSwipes: state.batchSwipes,
  setCurrentSwipeResponse: state.setCurrentSwipeResponse,
  updateSwipeInList: state.updateSwipeInList,
  removeSwipeFromList: state.removeSwipeFromList,
  setFilters: state.setFilters,
  clearError: state.clearError,
  reset: state.reset,
}));

export default useSwipesStore;