import { useEffect, useCallback } from 'react';
import { useTeamStore } from '@/stores/team.store';

export interface UseTeamDetailReturn {
  team: any; // ApiTeam from store
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for team detail with caching
 *
 * Caching behavior:
 * - Caches data when navigating to DIFFERENT team
 * - Clears cache when navigating back to SAME team (forces fresh fetch)
 * - Supports manual refresh via pull-to-refresh
 *
 * @param teamId - Team ID to fetch
 * @param isOpponent - If true, fetches with includeRecentMatches (for opponent detail page)
 */
export const useTeamDetail = (
  teamId: string | undefined,
  isOpponent: boolean = false
): UseTeamDetailReturn => {
  // Subscribe to store state
  const store = useTeamStore();

  const currentDetail = isOpponent
    ? store.currentOpponentDetail
    : store.currentTeamDetail;

  const currentId = isOpponent
    ? store.currentOpponentId
    : store.currentTeamId;

  const isLoading = isOpponent
    ? store.isOpponentDetailLoading
    : store.isTeamDetailLoading;

  const isRefreshing = isOpponent
    ? store.isOpponentDetailRefreshing
    : store.isTeamDetailRefreshing;

  const error = isOpponent
    ? store.opponentDetailError
    : store.teamDetailError;

  // Fetch team detail on mount or teamId change
  useEffect(() => {
    if (!teamId) {
      console.warn('[useTeamDetail] No teamId provided, skipping fetch');
      return;
    }

    const fetchDetail = async () => {
      try {
        if (isOpponent) {
          await store.fetchOpponentDetail(teamId);
        } else {
          await store.fetchTeamDetail(teamId);
        }
      } catch (err) {
        console.error('[useTeamDetail] Failed to fetch team detail:', err);
      }
    };

    fetchDetail();
  // Note: store is stable reference from Zustand, don't include in deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, isOpponent]);

  // Manual refresh function (for pull-to-refresh)
  const refresh = useCallback(async () => {
    if (!teamId) {
      console.warn('[useTeamDetail] No teamId provided, skipping refresh');
      return;
    }

    try {
      if (isOpponent) {
        await store.fetchOpponentDetail(teamId, true); // forceRefresh = true
      } else {
        await store.fetchTeamDetail(teamId, true); // forceRefresh = true
      }
    } catch (err) {
      console.error('[useTeamDetail] Failed to refresh team detail:', err);
    }
  }, [teamId, isOpponent, store]);

  return {
    team: currentDetail,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
};
