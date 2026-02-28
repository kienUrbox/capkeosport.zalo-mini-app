import { useEffect, useState, useCallback, useRef } from 'react';
import { useMatchStore, type TabType } from '@/stores/match.store';

type PendingFilterType = 'all' | 'matched' | 'requested';

export const useScheduleData = (teamId?: string) => {
  // Subscribe to store changes - this ensures component re-renders when data changes
  const pendingMatches = useMatchStore((state) => state.pendingMatches);
  const upcomingMatches = useMatchStore((state) => state.upcomingMatches);
  const historyMatches = useMatchStore((state) => state.historyMatches);
  const isLoadingMore = useMatchStore((state) => state.isLoadingMore);
  const pagination = useMatchStore((state) => state.pagination);
  const store = useMatchStore();

  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const pendingFilter = useRef<PendingFilterType | undefined>(undefined);

  // Set pending filter
  const setPendingFilter = useCallback((filter: PendingFilterType | undefined) => {
    pendingFilter.current = filter;
  }, []);

  // Fetch tab data with pagination support
  const fetchTabData = useCallback(
    async (tab: TabType, page: number = 1, forceRefresh: boolean = false) => {
      if (!teamId) {
        console.warn('[useScheduleData] No team selected, skipping fetch');
        return;
      }

      console.log(`[useScheduleData] Fetching ${tab} matches (page ${page}) for teamId: ${teamId}, forceRefresh: ${forceRefresh}`);

      const setLoading = (loading: boolean) => {
        if (tab === 'pending') setIsLoadingPending(loading);
        if (tab === 'upcoming') setIsLoadingUpcoming(loading);
        if (tab === 'history') setIsLoadingHistory(loading);
      };

      // Set loading state
      if (page === 1) {
        if (forceRefresh) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }
      }
      // For page > 1, loading state is managed by the store (isLoadingMore)
      setError(null);

      try {
        if (tab === 'pending') {
          await store.fetchPendingMatches(teamId, page, forceRefresh, pendingFilter.current);
        } else if (tab === 'upcoming') {
          await store.fetchUpcomingMatches(teamId, page, forceRefresh);
        } else if (tab === 'history') {
          await store.fetchHistoryMatches(teamId, page, forceRefresh);
        }
        console.log(`[useScheduleData] Successfully fetched ${tab} matches`);
      } catch (err: any) {
        console.error(`[useScheduleData] Error fetching ${tab} matches:`, err);
        const errorMessage =
          err?.response?.data?.error?.message ||
          err?.message ||
          'Có lỗi xảy ra';
        setError(errorMessage);
      } finally {
        if (isMounted.current) {
          if (page === 1) {
            setLoading(false);
            setIsRefreshing(false);
          }
        }
      }
    },
    [teamId, store]
  );

  // Lazy load tab on demand (only load when tab is activated)
  const fetchTabOnDemand = useCallback(
    async (tab: TabType, forceRefresh: boolean = false) => {
      if (!teamId) return;

      // Check if already fetched and not forcing refresh
      if (!forceRefresh) {
        const fetchedState = store._fetchedTabs[teamId]?.[tab];
        if (fetchedState) {
          console.log(`[useScheduleData] Skipping fetchTabOnDemand for ${tab} - already has data`);
          return;
        }
      }

      await fetchTabData(tab, 1, forceRefresh);
    },
    [teamId, fetchTabData]
  );

  // Load more (infinite scroll)
  const loadMore = useCallback(
    async (tab: TabType) => {
      const tabPagination = pagination[tab];
      if (!tabPagination.hasMore || isLoadingMore[tab]) {
        console.log(`[useScheduleData] Skipping loadMore for ${tab} - hasMore: ${tabPagination.hasMore}, isLoadingMore: ${isLoadingMore[tab]}`);
        return;
      }

      const nextPage = tabPagination.page + 1;
      console.log(`[useScheduleData] Loading more for ${tab}, page: ${nextPage}`);
      await fetchTabData(tab, nextPage, false);
    },
    [pagination, isLoadingMore, fetchTabData]
  );

  // Refresh single tab
  const refreshTab = useCallback(
    async (tab: TabType) => {
      console.log(`[useScheduleData] Refreshing ${tab} tab`);
      await fetchTabData(tab, 1, true);
    },
    [fetchTabData]
  );

  // Refresh all tabs
  const refreshAll = useCallback(async () => {
    if (!teamId) return;

    setIsRefreshing(true);
    setError(null);

    try {
      await Promise.all([
        fetchTabData('pending', 1, true),
        fetchTabData('upcoming', 1, true),
        fetchTabData('history', 1, true),
      ]);
    } catch (err: any) {
      console.error('Refresh all error:', err);
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
      }
    }
  }, [teamId, fetchTabData]);

  // Reset all data (for team change)
  const resetAll = useCallback(() => {
    console.log('[useScheduleData] Resetting all data');
    store.clearAllData();
  }, [store]);

  // Check if tab has more pages
  const hasMore = useCallback(
    (tab: TabType): boolean => {
      return pagination[tab].hasMore;
    },
    [pagination]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    // Data
    pendingMatches,
    upcomingMatches,
    historyMatches,

    // Loading states
    isLoadingPending,
    isLoadingUpcoming,
    isLoadingHistory,
    isRefreshing,
    isLoadingMore,

    // Pagination state
    pagination,

    // Error
    error,

    // Actions
    fetchTabOnDemand,
    loadMore,
    refreshTab,
    refreshAll,
    resetAll,
    hasMore,
    setPendingFilter,
  };
};
