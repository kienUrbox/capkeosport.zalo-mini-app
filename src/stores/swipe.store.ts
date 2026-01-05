import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SwipeService } from '@/services/api/swipe.service';
import type {
  SwipeHistoryItem,
  ReceivedSwipe,
  SwipeStats,
  SwipeAnalytics,
} from '@/types/api.types';

interface SwipeState {
  // Data
  swipeHistory: SwipeHistoryItem[];
  receivedSwipes: ReceivedSwipe[];
  swipeStats: (SwipeStats & SwipeAnalytics) | null;

  // Pagination
  historyPagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
  receivedPagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };

  // UI State
  isLoadingHistory: boolean;
  isLoadingReceived: boolean;
  isLoadingStats: boolean;
  isLoadingMoreHistory: boolean;
  isLoadingMoreReceived: boolean;
  error: string | null;
  historyFilter: 'all' | 'LIKE' | 'PASS';

  // Track fetched data per team
  _fetchedHistory: Record<string, boolean>;
  _fetchedReceived: Record<string, boolean>;
  _fetchedStats: Record<string, boolean>;

  // Actions
  setSwipeHistory: (swipes: SwipeHistoryItem[]) => void;
  setReceivedSwipes: (swipes: ReceivedSwipe[]) => void;
  setSwipeStats: (stats: SwipeStats & SwipeAnalytics) => void;
  setHistoryFilter: (filter: 'all' | 'LIKE' | 'PASS') => void;
  setError: (error: string | null) => void;
  clearAllData: () => void;

  // API Actions
  fetchSwipeHistory: (teamId: string, page?: number, forceRefresh?: boolean) => Promise<void>;
  fetchReceivedSwipes: (teamId: string, page?: number, forceRefresh?: boolean) => Promise<void>;
  fetchSwipeStats: (teamId: string, forceRefresh?: boolean) => Promise<void>;
  undoSwipe: (swipeId: string) => Promise<void>;
}

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set, get) => ({
      // Initial state
      swipeHistory: [],
      receivedSwipes: [],
      swipeStats: null,
      historyPagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
      receivedPagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
      isLoadingHistory: false,
      isLoadingReceived: false,
      isLoadingStats: false,
      isLoadingMoreHistory: false,
      isLoadingMoreReceived: false,
      error: null,
      historyFilter: 'all',
      _fetchedHistory: {},
      _fetchedReceived: {},
      _fetchedStats: {},

      // Actions
      setSwipeHistory: (swipes) => set({ swipeHistory: swipes }),
      setReceivedSwipes: (swipes) => set({ receivedSwipes: swipes }),
      setSwipeStats: (stats) => set({ swipeStats: stats }),
      setHistoryFilter: (filter) => set({ historyFilter: filter }),
      setError: (error) => set({ error }),
      clearAllData: () => set({
        swipeHistory: [],
        receivedSwipes: [],
        swipeStats: null,
        _fetchedHistory: {},
        _fetchedReceived: {},
        _fetchedStats: {},
        error: null,
      }),

      // API Actions (with guards and pagination)
      fetchSwipeHistory: async (teamId, page = 1, forceRefresh = false) => {
        const state = get();
        if (page === 1 && state.isLoadingHistory) return;
        if (page > 1 && state.isLoadingMoreHistory) return;
        if (!forceRefresh && page === 1 && state._fetchedHistory[teamId] && state.swipeHistory.length > 0) return;

        set(page === 1 ? { isLoadingHistory: true, error: null } : { isLoadingMoreHistory: true });

        try {
          const filter = state.historyFilter === 'all' ? undefined : state.historyFilter;
          const apiResponse = await SwipeService.getSwipeHistory(teamId, { page, limit: 20, action: filter });
          const response = apiResponse.data;

          if (!response) {
            throw new Error('No data received from API');
          }

          set((s) => ({
            swipeHistory: page === 1 || forceRefresh ? response.swipes : [...s.swipeHistory, ...response.swipes],
            historyPagination: {
              page: response.pagination.page,
              limit: response.pagination.limit,
              total: response.pagination.total,
              totalPages: response.pagination.totalPages,
              hasMore: response.pagination.page < response.pagination.totalPages,
            },
            _fetchedHistory: { ...s._fetchedHistory, [teamId]: true },
            error: null,
          }));
        } catch (error: any) {
          set({ error: error.message || 'Không thể tải lịch sử swipe' });
        } finally {
          set(page === 1 ? { isLoadingHistory: false } : { isLoadingMoreHistory: false });
        }
      },

      fetchReceivedSwipes: async (teamId, page = 1, forceRefresh = false) => {
        const state = get();
        if (page === 1 && state.isLoadingReceived) return;
        if (page > 1 && state.isLoadingMoreReceived) return;
        if (!forceRefresh && page === 1 && state._fetchedReceived[teamId] && state.receivedSwipes.length > 0) return;

        set(page === 1 ? { isLoadingReceived: true, error: null } : { isLoadingMoreReceived: true });

        try {
          const apiResponse = await SwipeService.getReceivedSwipes(teamId, { page, limit: 20 });
          const response = apiResponse.data;

          if (!response) {
            throw new Error('No data received from API');
          }

          set((s) => ({
            receivedSwipes: page === 1 || forceRefresh ? response.receivedSwipes : [...s.receivedSwipes, ...response.receivedSwipes],
            receivedPagination: {
              page: response.pagination?.page || page,
              limit: response.pagination?.limit || 20,
              total: response.total || 0,
              totalPages: response.pagination?.totalPages || Math.ceil((response.total || 0) / 20),
              hasMore: response.pagination
                ? response.pagination.page < response.pagination.totalPages
                : (response.receivedSwipes?.length || 0) >= 20,
            },
            _fetchedReceived: { ...s._fetchedReceived, [teamId]: true },
            error: null,
          }));
        } catch (error: any) {
          set({ error: error.message || 'Không thể tải danh sách thích' });
        } finally {
          set(page === 1 ? { isLoadingReceived: false } : { isLoadingMoreReceived: false });
        }
      },

      fetchSwipeStats: async (teamId, forceRefresh = false) => {
        const state = get();
        if (state.isLoadingStats) return;
        if (!forceRefresh && state._fetchedStats[teamId] && state.swipeStats) return;

        set({ isLoadingStats: true, error: null });

        try {
          const apiResponse = await SwipeService.getSwipeStats(teamId);
          const stats = apiResponse.data;

          if (!stats) {
            throw new Error('No data received from API');
          }

          set({
            swipeStats: stats,
            _fetchedStats: { ...state._fetchedStats, [teamId]: true },
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message || 'Không thể tải thống kê' });
        } finally {
          set({ isLoadingStats: false });
        }
      },

      undoSwipe: async (swipeId) => {
        try {
          await SwipeService.undoSwipe(swipeId);
          set((s) => ({ swipeHistory: s.swipeHistory.filter(s => s.id !== swipeId) }));
        } catch (error: any) {
          set({ error: error.message || 'Không thể hoàn tác' });
          throw error;
        }
      },
    }),
    {
      name: 'swipe-storage',
      partialize: (state) => ({ historyFilter: state.historyFilter }),
    }
  )
);

// Selectors
export const useSwipeHistory = () => useSwipeStore((s) => s.swipeHistory);
export const useReceivedSwipes = () => useSwipeStore((s) => s.receivedSwipes);
export const useSwipeStats = () => useSwipeStore((s) => s.swipeStats);
export const useSwipeHistoryPagination = () => useSwipeStore((s) => s.historyPagination);
export const useSwipeReceivedPagination = () => useSwipeStore((s) => s.receivedPagination);
export const useSwipeHistoryFilter = () => useSwipeStore((s) => s.historyFilter);

export const useSwipeActions = () => {
  const store = useSwipeStore();
  return {
    fetchSwipeHistory: store.fetchSwipeHistory,
    fetchReceivedSwipes: store.fetchReceivedSwipes,
    fetchSwipeStats: store.fetchSwipeStats,
    undoSwipe: store.undoSwipe,
    setHistoryFilter: store.setHistoryFilter,
    clearAllData: store.clearAllData,
  };
};

export default useSwipeStore;
