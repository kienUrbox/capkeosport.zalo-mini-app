import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MatchService,
  type Match as ApiMatch,
  MatchStatus as ApiMatchStatus,
  type ConfirmMatchDto,
  type FinishMatchDto,
  type CancelMatchDto,
  type RematchDto,
  type SendMatchRequestDto,
  type UpdateMatchRequestDto,
} from '@/services/api/match.service';

// Simplified match types for UI
export type MatchStatus = 'pending' | 'upcoming' | 'live' | 'finished';

// Pagination state for each tab
export type TabType = 'pending' | 'upcoming' | 'history';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface Match {
  id: string;
  teamA: {
    id: string;
    name: string;
    logo?: string;
    level?: string;
  };
  teamB: {
    id: string;
    name: string;
    logo?: string;
    level?: string;
  };
  scoreA?: number;
  scoreB?: number;
  time: string;
  date: string;
  location: string;
  status: MatchStatus;
  type?: 'matched' | 'received' | 'sent' | 'accepted';
  requestedByTeam?: string;
  acceptedByTeam?: string;
}

// Map API match status to UI status
const mapApiStatusToUiStatus = (apiStatus: ApiMatchStatus): MatchStatus => {
  switch (apiStatus) {
    case 'MATCHED':
    case 'REQUESTED':
    case 'ACCEPTED':
      return 'pending';    // Chờ kèo
    case 'CONFIRMED':
      return 'upcoming';   // Lịch đấu
    case 'FINISHED':
    case 'CANCELLED':
      return 'finished';   // Lịch sử
    default:
      return 'pending';
  }
};

// Check if match needs confirmation (accepted but not confirmed)
const needsConfirmation = (apiMatch: ApiMatch): boolean => {
  return apiMatch.status === 'ACCEPTED';
};

/**
 * Get match stage based on date/time
 * @param date - Match date in format DD/MM/YYYY or ISO string
 * @param time - Match time in format HH:mm
 * @returns 'upcoming' | 'live' | 'finished'
 */
const getMatchStage = (date: string, time: string): 'upcoming' | 'live' | 'finished' => {
  try {
    // Parse date and time
    // Handle both DD/MM/YYYY and ISO formats
    let dateTimeStr = date;
    if (date.includes('/')) {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = date.split('/');
      dateTimeStr = `${year}-${month}-${day}`;
    }
    const dateTime = new Date(`${dateTimeStr}T${time}`);

    const now = new Date();
    const matchTime = dateTime.getTime();
    const currentTime = now.getTime();

    // Match duration: 2 hours (assume standard match duration)
    const matchDuration = 2 * 60 * 60 * 1000; // 2 hours in ms
    const matchEndTime = matchTime + matchDuration;

    if (currentTime < matchTime) {
      return 'upcoming'; // Match hasn't started
    } else if (currentTime >= matchTime && currentTime < matchEndTime) {
      return 'live'; // Match is in progress
    } else {
      return 'finished'; // Match has ended
    }
  } catch (error) {
    console.error('[getMatchStage] Error parsing date/time:', error);
    return 'upcoming'; // Default to upcoming if parsing fails
  }
};

// Transform API match to UI match
const transformApiMatch = (
  apiMatch: ApiMatch,
  currentTeamId?: string
): Match => {
  // Determine match type based on status and who requested
  let type: Match['type'];

  switch (apiMatch.status) {
    case 'MATCHED':
      // MATCHED status - system matched teams, waiting for someone to send request
      type = 'matched';
      break;
    case 'REQUESTED':
      // Check if current team sent or received the request
      if (apiMatch.requestedByTeam === currentTeamId) {
        type = 'sent';
      } else {
        type = 'received';
      }
      break;
    case 'ACCEPTED':
      // Match accepted but not confirmed yet - still needs confirmation
      type = 'accepted';
      break;
    case 'CONFIRMED':
    case 'FINISHED':
    case 'CANCELLED':
      // These statuses don't use 'type' - they use 'status' instead
      type = undefined;
      break;
    default:
      type = undefined;
  }

  // Get match date/time from API response
  const matchDate = apiMatch.date || apiMatch.proposedDate || '';
  const matchTime = apiMatch.time || apiMatch.proposedTime || '';

  // Determine UI status based on API status
  let uiStatus = mapApiStatusToUiStatus(apiMatch.status);

  // For CONFIRMED matches, check if they should be 'live' or 'finished'
  if (apiMatch.status === 'CONFIRMED') {
    const stage = getMatchStage(matchDate, matchTime);
    if (stage === 'live') {
      uiStatus = 'live';
    } else if (stage === 'finished') {
      uiStatus = 'finished';
    }
  }

  return {
    id: apiMatch.id,
    teamA: {
      id: apiMatch.teamA?.id || apiMatch.teamAId || '',
      name: apiMatch.teamA?.name || 'Team A',
      logo: apiMatch.teamA?.logo,
      level: apiMatch.teamA?.level,
    },
    teamB: {
      id: apiMatch.teamB?.id || apiMatch.teamBId || '',
      name: apiMatch.teamB?.name || 'Team B',
      logo: apiMatch.teamB?.logo,
      level: apiMatch.teamB?.level,
    },
    scoreA: apiMatch.score?.teamA,
    scoreB: apiMatch.score?.teamB,
    time: matchTime || 'TBD',
    date: matchDate || 'TBD',
    location: apiMatch.location?.address || apiMatch.proposedPitch || 'TBD',
    status: uiStatus,
    type,
    requestedByTeam: apiMatch.requestedByTeam,
    acceptedByTeam: apiMatch.acceptedByTeam,
  };
};

interface MatchState {
  // State
  pendingMatches: Match[];
  upcomingMatches: Match[];
  liveMatches: Match[];
  historyMatches: Match[];
  selectedMatch: Match | null;
  isLoading: boolean;
  error: string | null;

  // NEW: Pagination state per tab
  pagination: {
    pending: PaginationState;
    upcoming: PaginationState;
    history: PaginationState;
  };

  // NEW: Loading more state per tab
  isLoadingMore: {
    pending: boolean;
    upcoming: boolean;
    history: boolean;
  };

  // Track which tabs have been fetched per team
  _fetchedTabs: {
    [teamId: string]: {
      pending?: boolean;
      upcoming?: boolean;
      history?: boolean;
    };
  };

  // Actions
  setPendingMatches: (matches: Match[]) => void;
  setUpcomingMatches: (matches: Match[]) => void;
  setLiveMatches: (matches: Match[]) => void;
  setHistoryMatches: (matches: Match[]) => void;
  setSelectedMatch: (match: Match | null) => void;
  addMatch: (type: keyof Pick<MatchState, 'pendingMatches' | 'upcomingMatches' | 'liveMatches' | 'historyMatches'>, match: Match) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  removeMatch: (matchId: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;

  // NEW: Clear all data (for team change)
  clearAllData: () => void;

  // NEW: Update pagination state
  updatePagination: (tab: TabType, pagination: Partial<PaginationState>) => void;

  // API Actions with pagination support
  fetchUpcomingMatches: (teamId?: string, page?: number, forceRefresh?: boolean) => Promise<void>;
  fetchPendingMatches: (teamId?: string, page?: number, forceRefresh?: boolean) => Promise<void>;
  fetchHistoryMatches: (teamId?: string, page?: number, forceRefresh?: boolean) => Promise<void>;

  // Match Action Methods
  acceptMatch: (matchId: string) => Promise<void>;
  declineMatch: (matchId: string) => Promise<void>;
  sendMatchRequest: (matchId: string, data: SendMatchRequestDto) => Promise<void>;
  updateMatchRequest: (matchId: string, data: UpdateMatchRequestDto) => Promise<void>;
  confirmMatch: (matchId: string, data: ConfirmMatchDto) => Promise<void>;
  finishMatch: (matchId: string, data: FinishMatchDto) => Promise<void>;
  cancelMatch: (matchId: string, data: CancelMatchDto) => Promise<void>;
  rematch: (matchId: string, data: RematchDto) => Promise<void>;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      // Initial state
      pendingMatches: [],
      upcomingMatches: [],
      liveMatches: [],
      historyMatches: [],
      selectedMatch: null,
      isLoading: false,
      error: null,
      pagination: {
        pending: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
        upcoming: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
        history: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
      },
      isLoadingMore: {
        pending: false,
        upcoming: false,
        history: false,
      },
      _fetchedTabs: {},

      // Actions
      setPendingMatches: (matches) => set({ pendingMatches: matches }),

      setUpcomingMatches: (matches) => set({ upcomingMatches: matches }),

      setLiveMatches: (matches) => set({ liveMatches: matches }),

      setHistoryMatches: (matches) => set({ historyMatches: matches }),

      setSelectedMatch: (match) => set({ selectedMatch: match }),

      clearAllData: () => set({
        pendingMatches: [],
        upcomingMatches: [],
        historyMatches: [],
        _fetchedTabs: {},
        pagination: {
          pending: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
          upcoming: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
          history: { page: 1, limit: 20, total: 0, totalPages: 0, hasMore: true },
        },
      }),

      updatePagination: (tab, paginationData) => set((state) => ({
        pagination: {
          ...state.pagination,
          [tab]: { ...state.pagination[tab], ...paginationData },
        },
      })),

      addMatch: (type, match) =>
        set((state) => ({
          [type]: [...state[type], match],
        })),

      updateMatch: (matchId, updates) =>
        set((state) => ({
          pendingMatches: state.pendingMatches.map((m) =>
            m.id === matchId ? { ...m, ...updates } : m
          ),
          upcomingMatches: state.upcomingMatches.map((m) =>
            m.id === matchId ? { ...m, ...updates } : m
          ),
          liveMatches: state.liveMatches.map((m) =>
            m.id === matchId ? { ...m, ...updates } : m
          ),
          historyMatches: state.historyMatches.map((m) =>
            m.id === matchId ? { ...m, ...updates } : m
          ),
          selectedMatch:
            state.selectedMatch?.id === matchId
              ? { ...state.selectedMatch, ...updates }
              : state.selectedMatch,
        })),

      removeMatch: (matchId) =>
        set((state) => ({
          pendingMatches: state.pendingMatches.filter((m) => m.id !== matchId),
          upcomingMatches: state.upcomingMatches.filter((m) => m.id !== matchId),
          liveMatches: state.liveMatches.filter((m) => m.id !== matchId),
          historyMatches: state.historyMatches.filter((m) => m.id !== matchId),
          selectedMatch:
            state.selectedMatch?.id === matchId ? null : state.selectedMatch,
        })),

      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // API Actions with pagination support
      fetchUpcomingMatches: async (teamId?: string, page: number = 1, forceRefresh: boolean = false) => {
        try {
          const currentState = get();

          // Guard: Skip if already loading (for pagination)
          if (page === 1 && currentState.isLoading) {
            console.log('[MatchStore] Skipping fetchUpcomingMatches - already loading');
            return;
          }

          // Guard: Skip if already loading more (for pagination)
          if (page > 1 && currentState.isLoadingMore.upcoming) {
            console.log('[MatchStore] Skipping fetchUpcomingMatches - already loading more');
            return;
          }

          // Guard: Skip if we already have data for this teamId (only for page 1, not forceRefresh)
          if (!forceRefresh && page === 1) {
            const fetchedState = currentState._fetchedTabs[teamId || '']?.upcoming;
            if (fetchedState && currentState.upcomingMatches.length > 0) {
              console.log('[MatchStore] Skipping fetchUpcomingMatches - already has data for team:', teamId);
              return;
            }
          }

          // Set loading state
          if (page === 1) {
            set({ isLoading: true, error: null });
          } else {
            set((state) => ({ isLoadingMore: { ...state.isLoadingMore, upcoming: true } }));
          }

          const response = await MatchService.getMatches({
            statuses: ['CONFIRMED'], // Lịch đấu (includes upcoming, live, and finished based on date/time)
            teamId,
            page,
            limit: 20
          });

          if (response.success && response.data) {
            const matches = Array.isArray(response.data.matches) ? response.data.matches : [];
            const transformedMatches = matches.map((m) => transformApiMatch(m, teamId));

            // Separate matches into upcoming (upcoming + live) and live
            // Note: We keep live matches in upcomingMatches for the "Lịch đấu" tab
            // The card component will display them differently based on status
            set((state) => ({
              upcomingMatches: page === 1 || forceRefresh
                ? transformedMatches
                : [...state.upcomingMatches, ...transformedMatches],
              liveMatches: transformedMatches.filter(m => m.status === 'live'),
              _fetchedTabs: teamId
                ? {
                    ...state._fetchedTabs,
                    [teamId]: { ...state._fetchedTabs[teamId || ''], upcoming: true },
                  }
                : state._fetchedTabs,
              pagination: {
                ...state.pagination,
                upcoming: {
                  page: response.data!.pagination?.page || page,
                  limit: response.data!.pagination?.limit || 20,
                  total: response.data!.pagination?.total || 0,
                  totalPages: response.data!.pagination?.totalPages || 1,
                  hasMore: (response.data!.pagination?.page || page) < (response.data!.pagination?.totalPages || 1),
                },
              },
              error: null,
            }));

            console.log('[MatchStore] Successfully fetched upcoming matches (page', page, '):', transformedMatches.length);
          }
        } catch (error: any) {
          console.error('[MatchStore] Fetch upcoming matches error:', error);
          set({ error: error.message || 'Không thể tải trận đấu sắp tới' });
        } finally {
          if (page === 1) {
            set({ isLoading: false });
          } else {
            set((state) => ({ isLoadingMore: { ...state.isLoadingMore, upcoming: false } }));
          }
        }
      },

      fetchPendingMatches: async (teamId?: string, page: number = 1, forceRefresh: boolean = false) => {
        try {
          const currentState = get();

          // Guard: Skip if already loading (for pagination)
          if (page === 1 && currentState.isLoading) {
            console.log('[MatchStore] Skipping fetchPendingMatches - already loading');
            return;
          }

          // Guard: Skip if already loading more (for pagination)
          if (page > 1 && currentState.isLoadingMore.pending) {
            console.log('[MatchStore] Skipping fetchPendingMatches - already loading more');
            return;
          }

          // Guard: Skip if we already have data for this teamId (only for page 1, not forceRefresh)
          if (!forceRefresh && page === 1) {
            const fetchedState = currentState._fetchedTabs[teamId || '']?.pending;
            if (fetchedState && currentState.pendingMatches.length > 0) {
              console.log('[MatchStore] Skipping fetchPendingMatches - already has data for team:', teamId);
              return;
            }
          }

          // Set loading state
          if (page === 1) {
            set({ isLoading: true, error: null });
          } else {
            set((state) => ({ isLoadingMore: { ...state.isLoadingMore, pending: true } }));
          }

          const response = await MatchService.getMatches({
            statuses: ['MATCHED', 'REQUESTED', 'ACCEPTED'], // Chờ kèo
            teamId,
            page,
            limit: 20
          });

          if (response.success && response.data) {
            const matches = Array.isArray(response.data.matches) ? response.data.matches : [];
            const transformedMatches = matches.map((m) => transformApiMatch(m, teamId));

            // Update state
            set((state) => ({
              pendingMatches: page === 1 || forceRefresh
                ? transformedMatches
                : [...state.pendingMatches, ...transformedMatches],
              _fetchedTabs: teamId
                ? {
                    ...state._fetchedTabs,
                    [teamId]: { ...state._fetchedTabs[teamId || ''], pending: true },
                  }
                : state._fetchedTabs,
              pagination: {
                ...state.pagination,
                pending: {
                  page: response.data!.pagination?.page || page,
                  limit: response.data!.pagination?.limit || 20,
                  total: response.data!.pagination?.total || 0,
                  totalPages: response.data!.pagination?.totalPages || 1,
                  hasMore: (response.data!.pagination?.page || page) < (response.data!.pagination?.totalPages || 1),
                },
              },
              error: null,
            }));

            console.log('[MatchStore] Successfully fetched pending matches (page', page, '):', transformedMatches.length);
          }
        } catch (error: any) {
          console.error('[MatchStore] Fetch pending matches error:', error);
          set({ error: error.message || 'Không thể tải lời mời trận đấu' });
        } finally {
          if (page === 1) {
            set({ isLoading: false });
          } else {
            set((state) => ({ isLoadingMore: { ...state.isLoadingMore, pending: false } }));
          }
        }
      },

      fetchHistoryMatches: async (teamId?: string, page: number = 1, forceRefresh: boolean = false) => {
        try {
          const currentState = get();

          // Guard: Skip if already loading (for pagination)
          if (page === 1 && currentState.isLoading) {
            console.log('[MatchStore] Skipping fetchHistoryMatches - already loading');
            return;
          }

          // Guard: Skip if already loading more (for pagination)
          if (page > 1 && currentState.isLoadingMore.history) {
            console.log('[MatchStore] Skipping fetchHistoryMatches - already loading more');
            return;
          }

          // Guard: Skip if we already have data for this teamId (only for page 1, not forceRefresh)
          if (!forceRefresh && page === 1) {
            const fetchedState = currentState._fetchedTabs[teamId || '']?.history;
            if (fetchedState && currentState.historyMatches.length > 0) {
              console.log('[MatchStore] Skipping fetchHistoryMatches - already has data for team:', teamId);
              return;
            }
          }

          // Set loading state
          if (page === 1) {
            set({ isLoading: true, error: null });
          } else {
            set((state) => ({ isLoadingMore: { ...state.isLoadingMore, history: true } }));
          }

          const response = await MatchService.getMatches({
            statuses: ['FINISHED', 'CANCELLED'], // BOTH statuses
            teamId,
            page,
            limit: 20
          });

          if (response.success && response.data) {
            const matches = Array.isArray(response.data.matches) ? response.data.matches : [];
            const transformedMatches = matches.map((m) => transformApiMatch(m, teamId));

            // Update state
            set((state) => ({
              historyMatches: page === 1 || forceRefresh
                ? transformedMatches
                : [...state.historyMatches, ...transformedMatches],
              _fetchedTabs: teamId
                ? {
                    ...state._fetchedTabs,
                    [teamId]: { ...state._fetchedTabs[teamId || ''], history: true },
                  }
                : state._fetchedTabs,
              pagination: {
                ...state.pagination,
                history: {
                  page: response.data!.pagination?.page || page,
                  limit: response.data!.pagination?.limit || 20,
                  total: response.data!.pagination?.total || 0,
                  totalPages: response.data!.pagination?.totalPages || 1,
                  hasMore: (response.data!.pagination?.page || page) < (response.data!.pagination?.totalPages || 1),
                },
              },
              error: null,
            }));

            console.log('[MatchStore] Successfully fetched history matches (page', page, '):', transformedMatches.length);
          }
        } catch (error: any) {
          console.error('[MatchStore] Fetch history matches error:', error);
          set({ error: error.message || 'Không thể tải lịch sử trận đấu' });
        } finally {
          if (page === 1) {
            set({ isLoading: false });
          } else {
            set((state) => ({ isLoadingMore: { ...state.isLoadingMore, history: false } }));
          }
        }
      },

      // Match Action Methods
      acceptMatch: async (matchId: string) => {
        try {
          const response = await MatchService.acceptMatchRequest(matchId);
          if (response.success) {
            // Remove from pending, will be refetched
            set((state) => ({
              pendingMatches: state.pendingMatches.filter((m) => m.id !== matchId),
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },

      declineMatch: async (matchId: string) => {
        try {
          const response = await MatchService.declineMatchRequest(matchId);
          if (response.success) {
            set((state) => ({
              pendingMatches: state.pendingMatches.filter((m) => m.id !== matchId),
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },

      confirmMatch: async (matchId: string, data: ConfirmMatchDto) => {
        try {
          const response = await MatchService.confirmMatch(matchId, data);
          if (response.success) {
            // Match stays in upcoming but with CONFIRMED status
            // Will be updated on refresh
          }
        } catch (error: any) {
          throw error;
        }
      },

      sendMatchRequest: async (matchId: string, data: SendMatchRequestDto) => {
        try {
          const response = await MatchService.sendMatchRequest(matchId, data);
          if (response.success && response.data) {
            // Update match in pendingMatches
            const currentTeamId = get().currentTeamId;
            set((state) => ({
              pendingMatches: state.pendingMatches.map((m) =>
                m.id === matchId
                  ? transformApiMatch(response.data, currentTeamId)
                  : m
              ),
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },

      updateMatchRequest: async (matchId: string, data: UpdateMatchRequestDto) => {
        try {
          const response = await MatchService.updateMatchRequest(matchId, data);
          if (response.success && response.data) {
            // Update match in pendingMatches
            const currentTeamId = get().currentTeamId;
            set((state) => ({
              pendingMatches: state.pendingMatches.map((m) =>
                m.id === matchId
                  ? transformApiMatch(response.data, currentTeamId)
                  : m
              ),
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },

      finishMatch: async (matchId: string, data: FinishMatchDto) => {
        try {
          const response = await MatchService.finishMatch(matchId, data);
          if (response.success) {
            // Move from upcoming to history
            set((state) => ({
              upcomingMatches: state.upcomingMatches.filter((m) => m.id !== matchId),
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },

      cancelMatch: async (matchId: string, data: CancelMatchDto) => {
        try {
          const response = await MatchService.cancelMatch(matchId, data);
          if (response.success) {
            // Move to history tab
            set((state) => ({
              pendingMatches: state.pendingMatches.filter((m) => m.id !== matchId),
              upcomingMatches: state.upcomingMatches.filter((m) => m.id !== matchId),
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },

      rematch: async (matchId: string, data: RematchDto) => {
        try {
          const response = await MatchService.rematch(matchId, data);
          if (response.success && response.data) {
            // Add new match to pending
            const newMatch = transformApiMatch(response.data);
            set((state) => ({
              pendingMatches: [...state.pendingMatches, newMatch],
            }));
          }
        } catch (error: any) {
          throw error;
        }
      },
    }),
    {
      name: 'match-storage',
      partialize: (state) => ({
        // Don't persist large match arrays
        selectedMatch: state.selectedMatch,
      }),
    }
  )
);

// Selectors
export const usePendingMatches = () => useMatchStore((state) => state.pendingMatches);

export const useUpcomingMatches = () => useMatchStore((state) => state.upcomingMatches);

export const useLiveMatches = () => useMatchStore((state) => state.liveMatches);

export const useHistoryMatches = () => useMatchStore((state) => state.historyMatches);

export const useSelectedMatch = () => useMatchStore((state) => state.selectedMatch);

// NEW: Pagination selectors
export const usePagination = () => useMatchStore((state) => state.pagination);

export const useIsLoadingMore = () => useMatchStore((state) => state.isLoadingMore);

export const useMatchActions = () => {
  const store = useMatchStore();
  return {
    setPendingMatches: store.setPendingMatches,
    setUpcomingMatches: store.setUpcomingMatches,
    setLiveMatches: store.setLiveMatches,
    setHistoryMatches: store.setHistoryMatches,
    setSelectedMatch: store.setSelectedMatch,
    addMatch: store.addMatch,
    updateMatch: store.updateMatch,
    removeMatch: store.removeMatch,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    clearAllData: store.clearAllData,
    updatePagination: store.updatePagination,
    fetchUpcomingMatches: store.fetchUpcomingMatches,
    fetchPendingMatches: store.fetchPendingMatches,
    fetchHistoryMatches: store.fetchHistoryMatches,
    acceptMatch: store.acceptMatch,
    declineMatch: store.declineMatch,
    confirmMatch: store.confirmMatch,
    finishMatch: store.finishMatch,
    cancelMatch: store.cancelMatch,
    rematch: store.rematch,
  };
};

export default useMatchStore;
