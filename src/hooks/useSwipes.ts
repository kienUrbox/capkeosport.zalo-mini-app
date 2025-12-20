import { useCallback, useEffect } from 'react';
import { SwipeAction, SwipeQueryParams } from '../types/api.types';
import {
  useSwipesStore,
  useSwipes,
  useReceivedSwipes,
  useMutualLikes,
  useCurrentSwipeResponse,
  useSwipeStats,
  useSwipesLoading,
  useSwipesError,
  useSwipesPagination,
  useSwipesFilters,
  useSwipesActions
} from '../stores';

// Main swipes hook that provides both state and actions
export const useSwipes = () => {
  const swipesStore = useSwipesStore();

  return {
    ...swipesStore,
  };
};

// Swipe deck hook for the main discovery/swiping interface
export const useSwipeDeck = (teamId?: string) => {
  const swipes = useSwipes();
  const currentSwipeResponse = useCurrentSwipeResponse();
  const { isSwiping } = useSwipesLoading();
  const { error } = useSwipesError();
  const { likeTeam, passTeam, undoSwipe, checkSwipeEligibility } = useSwipesActions();

  // Like a team
  const handleLikeTeam = useCallback(async (targetTeamId: string, metadata?: any) => {
    if (!teamId) return null;
    return await likeTeam(teamId, targetTeamId, metadata);
  }, [teamId, likeTeam]);

  // Pass on a team
  const handlePassTeam = useCallback(async (targetTeamId: string, metadata?: any) => {
    if (!teamId) return null;
    return await passTeam(teamId, targetTeamId, metadata);
  }, [teamId, passTeam]);

  // Check if can swipe on team
  const canSwipeOnTeam = useCallback(async (targetTeamId: string) => {
    if (!teamId) return false;
    return await checkSwipeEligibility(teamId, targetTeamId);
  }, [teamId, checkSwipeEligibility]);

  // Get recent swipe results
  const getSwipeResult = useCallback(() => {
    return currentSwipeResponse;
  }, [currentSwipeResponse]);

  return {
    swipes,
    currentSwipeResponse,
    isSwiping,
    error,
    likeTeam: handleLikeTeam,
    passTeam: handlePassTeam,
    canSwipeOnTeam,
    getSwipeResult,
    hasNewMatch: currentSwipeResponse?.isMatch || false,
    newMatch: currentSwipeResponse?.newMatch || null,
  };
};

// Team swipes history hook
export const useTeamSwipes = (teamId?: string, params?: SwipeQueryParams) => {
  const swipes = useSwipes();
  const { isLoading } = useSwipesLoading();
  const { error } = useSwipesError();
  const pagination = useSwipesPagination();
  const { fetchTeamSwipes, fetchTeamLikes, fetchTeamPasses, setFilters, undoSwipe } = useSwipesActions();

  // Load team swipes
  const loadTeamSwipes = useCallback(async (teamId: string, params?: SwipeQueryParams) => {
    await fetchTeamSwipes(teamId, params);
  }, [fetchTeamSwipes]);

  // Load team likes
  const loadTeamLikes = useCallback(async (teamId: string, params?: SwipeQueryParams) => {
    await fetchTeamLikes(teamId, params);
  }, [fetchTeamLikes]);

  // Load team passes
  const loadTeamPasses = useCallback(async (teamId: string, params?: SwipeQueryParams) => {
    await fetchTeamPasses(teamId, params);
  }, [fetchTeamPasses]);

  // Undo a swipe
  const handleUndoSwipe = useCallback(async (swipeId: string) => {
    return await undoSwipe(swipeId);
  }, [undoSwipe]);

  // Load more swipes (pagination)
  const loadMoreSwipes = useCallback(async () => {
    if (!teamId) return;
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      await fetchTeamSwipes(teamId, { ...params, page: nextPage });
    }
  }, [teamId, pagination, params, fetchTeamSwipes]);

  // Auto-load swipes when teamId or params change
  useEffect(() => {
    if (teamId) {
      loadTeamSwipes(teamId, params);
    }
  }, [teamId, params, loadTeamSwipes]);

  return {
    swipes,
    isLoading,
    error,
    pagination,
    loadTeamSwipes,
    loadTeamLikes,
    loadTeamPasses,
    undoSwipe: handleUndoSwipe,
    loadMoreSwipes,
    hasMore: pagination.page < pagination.totalPages,
  };
};

// Received swipes hook (teams that liked your team)
export const useReceivedSwipes = (teamId?: string, params?: SwipeQueryParams) => {
  const receivedSwipes = useReceivedSwipes();
  const { isLoading } = useSwipesLoading();
  const { error } = useSwipesError();
  const pagination = useSwipesPagination();
  const { fetchReceivedSwipes } = useSwipesActions();

  // Load received swipes
  const loadReceivedSwipes = useCallback(async (teamId: string, params?: SwipeQueryParams) => {
    await fetchReceivedSwipes(teamId, params);
  }, [fetchReceivedSwipes]);

  // Load more received swipes
  const loadMoreReceivedSwipes = useCallback(async () => {
    if (!teamId) return;
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      await fetchReceivedSwipes(teamId, { ...params, page: nextPage });
    }
  }, [teamId, pagination, params, fetchReceivedSwipes]);

  // Auto-load received swipes when teamId or params change
  useEffect(() => {
    if (teamId) {
      loadReceivedSwipes(teamId, params);
    }
  }, [teamId, params, loadReceivedSwipes]);

  return {
    receivedSwipes,
    isLoading,
    error,
    pagination,
    loadReceivedSwipes,
    loadMoreReceivedSwipes,
    hasMore: pagination.page < pagination.totalPages,
    unreadCount: receivedSwipes.length,
  };
};

// Mutual likes hook (matches)
export const useMutualLikes = (teamId?: string, params?: SwipeQueryParams) => {
  const mutualLikes = useMutualLikes();
  const { isLoading } = useSwipesLoading();
  const { error } = useSwipesError();
  const pagination = useSwipesPagination();
  const { fetchMutualLikes } = useSwipesActions();

  // Load mutual likes
  const loadMutualLikes = useCallback(async (teamId: string, params?: SwipeQueryParams) => {
    await fetchMutualLikes(teamId, params);
  }, [fetchMutualLikes]);

  // Load more mutual likes
  const loadMoreMutualLikes = useCallback(async () => {
    if (!teamId) return;
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      await fetchMutualLikes(teamId, { ...params, page: nextPage });
    }
  }, [teamId, pagination, params, fetchMutualLikes]);

  // Auto-load mutual likes when teamId or params change
  useEffect(() => {
    if (teamId) {
      loadMutualLikes(teamId, params);
    }
  }, [teamId, params, loadMutualLikes]);

  return {
    mutualLikes,
    isLoading,
    error,
    pagination,
    loadMutualLikes,
    loadMoreMutualLikes,
    hasMore: pagination.page < pagination.totalPages,
    matchesCount: mutualLikes.length,
  };
};

// Swipe statistics hook
export const useSwipeStats = (teamId?: string) => {
  const swipeStats = useSwipeStats();
  const { isLoading } = useSwipesLoading();
  const { fetchSwipeStats } = useSwipesActions();

  // Load swipe statistics
  const loadSwipeStats = useCallback(async (teamId: string) => {
    await fetchSwipeStats(teamId);
  }, [fetchSwipeStats]);

  // Auto-load swipe stats when teamId changes
  useEffect(() => {
    if (teamId) {
      loadSwipeStats(teamId);
    }
  }, [teamId, loadSwipeStats]);

  return {
    stats: swipeStats,
    isLoading,
    loadSwipeStats,
  };
};

// Swipe trends hook
export const useSwipeTrends = (teamId?: string) => {
  const { isLoading } = useSwipesLoading();
  const { error } = useSwipesError();
  const { getSwipeTrends } = useSwipesActions();

  // Get swipe trends
  const fetchTrends = useCallback(async (teamId: string) => {
    return await getSwipeTrends(teamId);
  }, [getSwipeTrends]);

  return {
    isLoading,
    error,
    fetchTrends,
  };
};

// Swipe recommendations hook
export const useSwipeRecommendations = (teamId?: string, limit = 20) => {
  const { isLoading } = useSwipesLoading();
  const { error } = useSwipesError();
  const { getSwipeRecommendations } = useSwipesActions();

  // Get swipe recommendations
  const fetchRecommendations = useCallback(async (teamId: string, recLimit = limit) => {
    return await getSwipeRecommendations(teamId, recLimit);
  }, [getSwipeRecommendations, limit]);

  return {
    isLoading,
    error,
    fetchRecommendations,
  };
};

// Batch swipes hook
export const useBatchSwipes = () => {
  const { isSwiping } = useSwipesLoading();
  const { error } = useSwipesError();
  const { batchSwipes } = useSwipesActions();

  // Perform batch swipes
  const performBatchSwipes = useCallback(async (swiperTeamId: string, actions: any[]) => {
    return await batchSwipes(swiperTeamId, actions);
  }, [batchSwipes]);

  return {
    isSwiping,
    error,
    performBatchSwipes,
  };
};

// Swipe analytics hook
export const useSwipeAnalytics = (teamId?: string) => {
  const swipeStats = useSwipeStats();
  const { isLoading } = useSwipesLoading();

  // Calculate engagement rate
  const getEngagementRate = useCallback(() => {
    if (!swipeStats) return 0;
    const { totalSwipes, matches } = swipeStats;
    return totalSwipes > 0 ? Math.round((matches / totalSwipes) * 100) : 0;
  }, [swipeStats]);

  // Calculate like rate
  const getLikeRate = useCallback(() => {
    if (!swipeStats) return 0;
    return swipeStats.likeRate || 0;
  }, [swipeStats]);

  // Calculate match rate
  const getMatchRate = useCallback(() => {
    if (!swipeStats) return 0;
    return swipeStats.matchRate || 0;
  }, [swipeStats]);

  // Get performance level
  const getPerformanceLevel = useCallback(() => {
    if (!swipeStats) return 'No Data';
    const { matchRate } = swipeStats;
    if (matchRate >= 50) return 'Excellent';
    if (matchRate >= 30) return 'Good';
    if (matchRate >= 20) return 'Average';
    if (matchRate >= 10) return 'Below Average';
    return 'Poor';
  }, [swipeStats]);

  // Get trend direction
  const getTrendDirection = useCallback((current: number, previous: number) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }, []);

  return {
    stats: swipeStats,
    isLoading,
    getEngagementRate,
    getLikeRate,
    getMatchRate,
    getPerformanceLevel,
    getTrendDirection,
  };
};

// Swipe filters hook
export const useSwipeFilters = () => {
  const filters = useSwipesFilters();
  const { setFilters } = useSwipesActions();

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SwipeQueryParams>) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Filter by action
  const filterByAction = useCallback((action: SwipeAction) => {
    updateFilters({ action });
  }, [updateFilters]);

  // Filter by date range
  const filterByDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    updateFilters({ dateFrom, dateTo });
  }, [updateFilters]);

  // Clear filters
  const clearFilters = useCallback(() => {
    updateFilters({
      action: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });
  }, [updateFilters]);

  return {
    filters,
    updateFilters,
    filterByAction,
    filterByDateRange,
    clearFilters,
  };
};

export default useSwipes;