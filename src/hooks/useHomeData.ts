import { useEffect, useCallback, useRef } from 'react';
import { useHomeStore } from '@/stores/home.store';

export interface UseHomeDataReturn {
  // Data
  pendingInvitations: any[];
  nearbyTeams: any[]; // Keep for backward compatibility but always empty

  // Loading state
  isLoading: boolean;
  isRefreshing: boolean;

  // Error state
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
}

/**
 * Custom hook for home data
 *
 * Simplified - fetches data on every call, no caching
 */
export const useHomeData = (): UseHomeDataReturn => {
  // Subscribe to store state using selectors
  const pendingInvitations = useHomeStore((state) => state.pendingInvitations);
  const isLoading = useHomeStore((state) => state.isLoading);
  const error = useHomeStore((state) => state.error);

  // Get store methods
  const fetchHomeData = useHomeStore((state) => state.fetchHomeData);

  // Track if component is mounted
  const isMounted = useRef(true);

  // Fetch home data on mount
  useEffect(() => {
    if (!isMounted.current) return;

    const initializeHome = async () => {
      try {
        await fetchHomeData();
      } catch (err) {
        console.error('[useHomeData] Failed to fetch home data:', err);
      }
    };

    initializeHome();

    return () => {
      isMounted.current = false;
    };
  }, [fetchHomeData]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      await fetchHomeData();
    } catch (err) {
      console.error('[useHomeData] Failed to refresh home data:', err);
      throw err;
    }
  }, [fetchHomeData]);

  return {
    pendingInvitations,
    nearbyTeams: [], // Feature disabled
    isLoading,
    isRefreshing: false, // Not used anymore
    error,
    refresh,
  };
};
