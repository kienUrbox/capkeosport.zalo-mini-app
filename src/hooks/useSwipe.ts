import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeStore, useSwipeActions } from '@/stores/swipe.store';
import { useSelectedTeam } from '@/stores/team.store';
import { useUIStore } from '@/stores/ui.store';
import { appRoutes } from '@/utils/navigation';

interface UseSwipeReturn {
  // Data
  swipeHistory: any[];
  receivedSwipes: any[];
  swipeStats: any;
  historyPagination: any;
  receivedPagination: any;

  // Loading states
  isLoadingHistory: boolean;
  isLoadingReceived: boolean;
  isLoadingStats: boolean;
  isLoadingMoreHistory: boolean;
  isLoadingMoreReceived: boolean;

  // Filters
  historyFilter: 'all' | 'LIKE' | 'PASS';

  // Error
  error: string | null;

  // Actions
  fetchHistory: (page?: number, refresh?: boolean) => Promise<void>;
  fetchReceived: (page?: number, refresh?: boolean) => Promise<void>;
  fetchStats: (refresh?: boolean) => Promise<void>;
  undoSwipe: (swipeId: string) => Promise<void>;
  setFilter: (filter: 'all' | 'LIKE' | 'PASS') => void;
  goToTeamDetail: (teamId: string) => void;
  goToMatchDetail: (matchId: string) => void;
  clearError: () => void;
}

/**
 * Custom hook for swipe functionality
 *
 * Provides:
 * - Swipe history management
 * - Received swipes (who liked my team)
 * - Swipe statistics
 * - Undo functionality
 * - Filter management
 */
export const useSwipe = (): UseSwipeReturn => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const selectedTeam = useSelectedTeam();

  // Store state
  const store = useSwipeStore();

  // Store actions
  const actions = useSwipeActions();

  // Fetch swipe history
  const fetchHistory = useCallback(
    async (page = 1, refresh = false) => {
      if (!selectedTeam?.id) return;
      await actions.fetchSwipeHistory(selectedTeam.id, page, refresh);
    },
    [selectedTeam?.id, actions]
  );

  // Fetch received swipes
  const fetchReceived = useCallback(
    async (page = 1, refresh = false) => {
      if (!selectedTeam?.id) return;
      await actions.fetchReceivedSwipes(selectedTeam.id, page, refresh);
    },
    [selectedTeam?.id, actions]
  );

  // Fetch swipe stats
  const fetchStats = useCallback(
    async (refresh = false) => {
      if (!selectedTeam?.id) return;
      await actions.fetchSwipeStats(selectedTeam.id, refresh);
    },
    [selectedTeam?.id, actions]
  );

  // Undo swipe with error handling
  const undoSwipe = useCallback(
    async (swipeId: string) => {
      try {
        await actions.undoSwipe(swipeId);
        showToast('Đã hoàn tác', 'success');
      } catch (error: any) {
        const message = error.message || 'Không thể hoàn tác';
        showToast(message, 'error');
        throw error;
      }
    },
    [actions, showToast]
  );

  // Set filter
  const setFilter = useCallback(
    (filter: 'all' | 'LIKE' | 'PASS') => {
      actions.setHistoryFilter(filter);
      fetchHistory(1, true);
    },
    [actions, fetchHistory]
  );

  // Navigation helpers
  const goToTeamDetail = useCallback(
    (teamId: string) => {
      navigate(appRoutes.teamDetail(teamId));
    },
    [navigate]
  );

  const goToMatchDetail = useCallback(
    (matchId: string) => {
      navigate(appRoutes.matchDetail(matchId));
    },
    [navigate]
  );

  return {
    ...store,
    fetchHistory,
    fetchReceived,
    fetchStats,
    undoSwipe,
    setFilter,
    goToTeamDetail,
    goToMatchDetail,
    clearError: () => store.setError(null),
  };
};

export default useSwipe;
