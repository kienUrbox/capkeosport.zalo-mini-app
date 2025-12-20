import { useCallback, useEffect } from 'react';
import { MatchStatus, MatchQueryParams } from '../types/api.types';
import {
  useMatchesStore,
  useCurrentMatch,
  useUpcomingMatches,
  usePastMatches,
  useActiveMatches,
  useMatchSuggestions,
  useMatchesLoading,
  useMatchesError,
  useMatchesPagination,
  useMatchesFilters,
  useMatchesActions
} from '../stores';

// Main matches hook that provides both state and actions
export const useMatches = () => {
  const matchesStore = useMatchesStore();

  return {
    ...matchesStore,
  };
};

// Match details hook
export const useMatchDetails = (matchId?: string) => {
  const currentMatch = useCurrentMatch();
  const matchSuggestions = useMatchSuggestions();
  const { isLoading } = useMatchesLoading();
  const { error } = useMatchesError();
  const { fetchMatchById, updateMatchStatus, addMatchSuggestion, respondToSuggestion } = useMatchesActions();

  // Load match details
  const loadMatchDetails = useCallback(async (id: string) => {
    await fetchMatchById(id);
  }, [fetchMatchById]);

  // Update match status
  const handleUpdateStatus = useCallback(async (status: MatchStatus) => {
    if (!matchId) return false;
    return await updateMatchStatus(matchId, status);
  }, [matchId, updateMatchStatus]);

  // Add suggestion
  const handleAddSuggestion = useCallback(async (suggestion: { type: string; content: string }) => {
    if (!matchId) return null;
    return await addMatchSuggestion(matchId, suggestion);
  }, [matchId, addMatchSuggestion]);

  // Respond to suggestion
  const handleRespondToSuggestion = useCallback(async (suggestionId: string, response: 'ACCEPT' | 'REJECT') => {
    if (!matchId) return false;
    return await respondToSuggestion(matchId, suggestionId, response);
  }, [matchId, respondToSuggestion]);

  // Auto-load match when matchId changes
  useEffect(() => {
    if (matchId) {
      loadMatchDetails(matchId);
    }
  }, [matchId, loadMatchDetails]);

  return {
    match: currentMatch,
    suggestions: matchSuggestions,
    isLoading,
    error,
    loadMatchDetails,
    updateStatus: handleUpdateStatus,
    addSuggestion: handleAddSuggestion,
    respondToSuggestion: handleRespondToSuggestion,
  };
};

// Upcoming matches hook
export const useUpcomingMatches = (teamId?: string) => {
  const upcomingMatches = useUpcomingMatches();
  const { isLoading } = useMatchesLoading();
  const { error } = useMatchesError();
  const { fetchUpcomingMatches, updateMatchStatus, cancelMatch, rescheduleMatch } = useMatchesActions();

  // Load upcoming matches
  const loadUpcomingMatches = useCallback(async (teamId: string) => {
    await fetchUpcomingMatches(teamId);
  }, [fetchUpcomingMatches]);

  // Cancel match
  const handleCancelMatch = useCallback(async (matchId: string, reason?: string) => {
    return await cancelMatch(matchId, reason);
  }, [cancelMatch]);

  // Reschedule match
  const handleRescheduleMatch = useCallback(async (matchId: string, newDate: string, newTime: string) => {
    return await rescheduleMatch(matchId, newDate, newTime);
  }, [rescheduleMatch]);

  // Auto-load upcoming matches when teamId changes
  useEffect(() => {
    if (teamId) {
      loadUpcomingMatches(teamId);
    }
  }, [teamId, loadUpcomingMatches]);

  return {
    matches: upcomingMatches,
    isLoading,
    error,
    loadUpcomingMatches,
    cancelMatch: handleCancelMatch,
    rescheduleMatch: handleRescheduleMatch,
  };
};

// Past matches hook
export const usePastMatches = (teamId?: string) => {
  const pastMatches = usePastMatches();
  const { isLoading } = useMatchesLoading();
  const { error } = useMatchesError();
  const { fetchPastMatches, submitMatchResult } = useMatchesActions();

  // Load past matches
  const loadPastMatches = useCallback(async (teamId: string) => {
    await fetchPastMatches(teamId);
  }, [fetchPastMatches]);

  // Submit match result
  const handleSubmitResult = useCallback(async (matchId: string, result: any) => {
    return await submitMatchResult(matchId, result);
  }, [submitMatchResult]);

  // Auto-load past matches when teamId changes
  useEffect(() => {
    if (teamId) {
      loadPastMatches(teamId);
    }
  }, [teamId, loadPastMatches]);

  return {
    matches: pastMatches,
    isLoading,
    error,
    loadPastMatches,
    submitResult: handleSubmitResult,
  };
};

// Active matches hook
export const useActiveMatches = (teamId?: string) => {
  const activeMatches = useActiveMatches();
  const { isLoading } = useMatchesLoading();
  const { error } = useMatchesError();
  const { fetchActiveMatches, updateMatchStatus } = useMatchesActions();

  // Load active matches
  const loadActiveMatches = useCallback(async (teamId: string) => {
    await fetchActiveMatches(teamId);
  }, [fetchActiveMatches]);

  // Auto-load active matches when teamId changes
  useEffect(() => {
    if (teamId) {
      loadActiveMatches(teamId);
    }
  }, [teamId, loadActiveMatches]);

  return {
    matches: activeMatches,
    isLoading,
    error,
    loadActiveMatches,
  };
};

// Match management hook
export const useMatchManagement = (matchId?: string) => {
  const currentMatch = useCurrentMatch();
  const { isLoading } = useMatchesLoading();
  const { updateMatchStatus, cancelMatch, rescheduleMatch, submitMatchResult, updateMatchLocation } = useMatchesActions();

  // Confirm match
  const confirmMatch = useCallback(async () => {
    if (!matchId) return false;
    return await updateMatchStatus(matchId, MatchStatus.CONFIRMED);
  }, [matchId, updateMatchStatus]);

  // Cancel match
  const cancelMatchWithReason = useCallback(async (reason?: string) => {
    if (!matchId) return false;
    return await cancelMatch(matchId, reason);
  }, [matchId, cancelMatch]);

  // Reschedule match
  const rescheduleMatchWithDateTime = useCallback(async (newDate: string, newTime: string) => {
    if (!matchId) return false;
    return await rescheduleMatch(matchId, newDate, newTime);
  }, [matchId, rescheduleMatch]);

  // Submit match result
  const submitResult = useCallback(async (result: any) => {
    if (!matchId) return false;
    return await submitMatchResult(matchId, result);
  }, [matchId, submitMatchResult]);

  // Update match location
  const updateLocation = useCallback(async (location: any) => {
    if (!matchId) return false;
    return await updateMatchLocation(matchId, location);
  }, [matchId, updateMatchLocation]);

  // Get match status color
  const getStatusColor = useCallback((status: MatchStatus) => {
    switch (status) {
      case MatchStatus.MATCHED:
        return 'bg-blue-100 text-blue-800';
      case MatchStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case MatchStatus.CAPPING:
        return 'bg-purple-100 text-purple-800';
      case MatchStatus.CONFIRMING:
        return 'bg-orange-100 text-orange-800';
      case MatchStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case MatchStatus.UPCOMING:
        return 'bg-teal-100 text-teal-800';
      case MatchStatus.FINISHED:
        return 'bg-gray-100 text-gray-800';
      case MatchStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Get match status label
  const getStatusLabel = useCallback((status: MatchStatus) => {
    switch (status) {
      case MatchStatus.MATCHED:
        return 'Matched';
      case MatchStatus.PENDING:
        return 'Pending';
      case MatchStatus.CAPPING:
        'Capping'
      case MatchStatus.CONFIRMING:
        return 'Confirming';
      case MatchStatus.CONFIRMED:
        return 'Confirmed';
      case MatchStatus.UPCOMING:
        return 'Upcoming';
      case MatchStatus.FINISHED:
        return 'Finished';
      case MatchStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }, []);

  // Check if match can be cancelled
  const canCancelMatch = useCallback(() => {
    if (!currentMatch) return false;
    return [MatchStatus.MATCHED, MatchStatus.PENDING, MatchStatus.CONFIRMING].includes(currentMatch.status);
  }, [currentMatch]);

  // Check if match can be confirmed
  const canConfirmMatch = useCallback(() => {
    if (!currentMatch) return false;
    return [MatchStatus.MATCHED, MatchStatus.CONFIRMING].includes(currentMatch.status);
  }, [currentMatch]);

  // Check if match can be rescheduled
  const canRescheduleMatch = useCallback(() => {
    if (!currentMatch) return false;
    return [MatchStatus.CONFIRMED, MatchStatus.UPCOMING].includes(currentMatch.status);
  }, [currentMatch]);

  // Check if result can be submitted
  const canSubmitResult = useCallback(() => {
    if (!currentMatch) return false;
    return currentMatch.status === MatchStatus.FINISHED;
  }, [currentMatch]);

  return {
    match: currentMatch,
    isLoading,
    confirmMatch,
    cancelMatch: cancelMatchWithReason,
    rescheduleMatch: rescheduleMatchWithDateTime,
    submitResult,
    updateLocation,
    getStatusColor,
    getStatusLabel,
    canCancelMatch,
    canConfirmMatch,
    canRescheduleMatch,
    canSubmitResult,
  };
};

// Matches search hook
export const useMatchesSearch = () => {
  const matches = useMatches();
  const { isLoading } = useMatchesLoading();
  const { error } = useMatchesError();
  const pagination = useMatchesPagination();
  const filters = useMatchesFilters();
  const { fetchMatches, setFilters } = useMatchesActions();

  // Search matches
  const searchMatches = useCallback(async (params: MatchQueryParams) => {
    await fetchMatches(params);
  }, [fetchMatches]);

  // Filter matches
  const filterMatches = useCallback((newFilters: Partial<MatchQueryParams>) => {
    setFilters(newFilters);
    searchMatches({ ...filters, ...newFilters });
  }, [filters, setFilters, searchMatches]);

  // Search matches by team
  const searchMatchesByTeam = useCallback(async (teamId: string, additionalFilters?: Partial<MatchQueryParams>) => {
    const searchParams = {
      teamId,
      ...additionalFilters,
    };
    await fetchMatches(searchParams);
  }, [fetchMatches]);

  // Search matches by status
  const searchMatchesByStatus = useCallback(async (status: MatchStatus, additionalFilters?: Partial<MatchQueryParams>) => {
    const searchParams = {
      status,
      ...additionalFilters,
    };
    await fetchMatches(searchParams);
  }, [fetchMatches]);

  // Load more matches (pagination)
  const loadMoreMatches = useCallback(async () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      await fetchMatches({ ...filters, page: nextPage });
    }
  }, [pagination, filters, fetchMatches]);

  // Refresh matches
  const refreshMatches = useCallback(() => {
    return fetchMatches(filters);
  }, [filters, fetchMatches]);

  return {
    matches: matches,
    isLoading,
    error,
    pagination,
    filters,
    searchMatches,
    filterMatches,
    searchMatchesByTeam,
    searchMatchesByStatus,
    loadMoreMatches,
    refreshMatches,
    hasMore: pagination.page < pagination.totalPages,
  };
};

export default useMatches;