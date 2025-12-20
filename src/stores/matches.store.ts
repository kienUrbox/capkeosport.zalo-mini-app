import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Match, MatchSuggestion, MatchStatus, MatchResult } from '../types/api.types';
import { MatchesService } from '../services/api/services';

interface MatchesState {
  // State
  matches: Match[];
  currentMatch: Match | null;
  upcomingMatches: Match[];
  pastMatches: Match[];
  activeMatches: Match[];
  matchSuggestions: MatchSuggestion[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: MatchStatus;
    teamId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  };

  // Actions
  fetchMatches: (params?: any) => Promise<void>;
  fetchMatchById: (id: string) => Promise<void>;
  updateMatchStatus: (id: string, status: MatchStatus) => Promise<boolean>;
  addMatchSuggestion: (id: string, suggestion: { type: string; content: string }) => Promise<MatchSuggestion | null>;
  respondToSuggestion: (matchId: string, suggestionId: string, response: 'ACCEPT' | 'REJECT') => Promise<boolean>;
  fetchTeamMatches: (teamId: string, params?: any) => Promise<void>;
  fetchUpcomingMatches: (teamId: string) => Promise<void>;
  fetchPastMatches: (teamId: string) => Promise<void>;
  fetchActiveMatches: (teamId: string) => Promise<void>;
  submitMatchResult: (matchId: string, result: any) => Promise<boolean>;
  cancelMatch: (matchId: string, reason?: string) => Promise<boolean>;
  rescheduleMatch: (matchId: string, newDate: string, newTime: string) => Promise<boolean>;
  updateMatchLocation: (matchId: string, location: any) => Promise<boolean>;
  setCurrentMatch: (match: Match | null) => void;
  updateMatchInList: (updatedMatch: Match) => void;
  removeMatchFromList: (id: string) => void;
  setFilters: (filters: Partial<MatchesState['filters']>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useMatchesStore = create<MatchesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      matches: [],
      currentMatch: null,
      upcomingMatches: [],
      pastMatches: [],
      activeMatches: [],
      matchSuggestions: [],
      isLoading: false,
      isUpdating: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      filters: {
        sortBy: 'date',
        sortOrder: 'ASC',
      },

      // Actions
      fetchMatches: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const currentFilters = get().filters;
          const queryParams = {
            page: 1,
            limit: 20,
            ...currentFilters,
            ...params,
          };

          const response = await MatchesService.getMatches(queryParams);

          if (response.success && response.data) {
            set({
              matches: response.data.items,
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
          console.error('Fetch matches error:', error);
          set({
            error: error.message || 'Failed to fetch matches',
            isLoading: false,
          });
        }
      },

      fetchMatchById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await MatchesService.getMatchById(id);

          if (response.success && response.data) {
            set({
              currentMatch: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch match by ID error:', error);
          set({
            error: error.message || 'Failed to fetch match details',
            isLoading: false,
          });
        }
      },

      updateMatchStatus: async (id: string, status: MatchStatus) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await MatchesService.updateMatchStatus(id, status);

          if (response.success && response.data) {
            const updatedMatch = response.data;
            get().updateMatchInList(updatedMatch);

            if (get().currentMatch?.id === id) {
              set({ currentMatch: updatedMatch });
            }

            set({ isUpdating: false });
            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Update match status error:', error);
          set({
            error: error.message || 'Failed to update match status',
            isUpdating: false,
          });
          return false;
        }
      },

      addMatchSuggestion: async (id: string, suggestion: { type: string; content: string }) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await MatchesService.addMatchSuggestion(id, suggestion);

          if (response.success && response.data) {
            const newSuggestion = response.data;
            const { matchSuggestions } = get();

            set({
              matchSuggestions: [...matchSuggestions, newSuggestion],
              isUpdating: false,
            });

            return newSuggestion;
          }

          return null;
        } catch (error: any) {
          console.error('Add match suggestion error:', error);
          set({
            error: error.message || 'Failed to add match suggestion',
            isUpdating: false,
          });
          return null;
        }
      },

      respondToSuggestion: async (matchId: string, suggestionId: string, response: 'ACCEPT' | 'REJECT') => {
        try {
          set({ isUpdating: true, error: null });

          const res = await MatchesService.respondToSuggestion(matchId, suggestionId, response);

          if (res.success) {
            const { matchSuggestions } = get();
            const updatedSuggestions = matchSuggestions.map(suggestion =>
              suggestion.id === suggestionId ? { ...suggestion, status: response } : suggestion
            );

            set({
              matchSuggestions: updatedSuggestions,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Respond to suggestion error:', error);
          set({
            error: error.message || 'Failed to respond to suggestion',
            isUpdating: false,
          });
          return false;
        }
      },

      fetchTeamMatches: async (teamId: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await MatchesService.getTeamMatches(teamId, params);

          if (response.success && response.data) {
            set({
              matches: response.data.items,
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
          console.error('Fetch team matches error:', error);
          set({
            error: error.message || 'Failed to fetch team matches',
            isLoading: false,
          });
        }
      },

      fetchUpcomingMatches: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await MatchesService.getUpcomingMatches(teamId);

          if (response.success && response.data) {
            set({
              upcomingMatches: response.data.items,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch upcoming matches error:', error);
          set({
            error: error.message || 'Failed to fetch upcoming matches',
            isLoading: false,
          });
        }
      },

      fetchPastMatches: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await MatchesService.getPastMatches(teamId);

          if (response.success && response.data) {
            set({
              pastMatches: response.data.items,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch past matches error:', error);
          set({
            error: error.message || 'Failed to fetch past matches',
            isLoading: false,
          });
        }
      },

      fetchActiveMatches: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await MatchesService.getActiveMatches(teamId);

          if (response.success && response.data) {
            set({
              activeMatches: response.data.items,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch active matches error:', error);
          set({
            error: error.message || 'Failed to fetch active matches',
            isLoading: false,
          });
        }
      },

      submitMatchResult: async (matchId: string, result: any) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await MatchesService.submitMatchResult(matchId, result);

          if (response.success && response.data) {
            const updatedMatch = response.data;
            get().updateMatchInList(updatedMatch);

            if (get().currentMatch?.id === matchId) {
              set({ currentMatch: updatedMatch });
            }

            set({ isUpdating: false });
            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Submit match result error:', error);
          set({
            error: error.message || 'Failed to submit match result',
            isUpdating: false,
          });
          return false;
        }
      },

      cancelMatch: async (matchId: string, reason?: string) => {
        try {
          set({ isUpdating: true, error: null });

          const success = await MatchesService.cancelMatch(matchId, reason);

          if (success) {
            get().updateMatchInList({
              ...get().currentMatch!,
              status: MatchStatus.CANCELLED,
            });

            if (get().currentMatch?.id === matchId) {
              set({
                currentMatch: {
                  ...get().currentMatch,
                  status: MatchStatus.CANCELLED,
                },
              });
            }

            set({ isUpdating: false });
            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Cancel match error:', error);
          set({
            error: error.message || 'Failed to cancel match',
            isUpdating: false,
          });
          return false;
        }
      },

      rescheduleMatch: async (matchId: string, newDate: string, newTime: string) => {
        try {
          set({ isUpdating: true, error: null });

          const success = await MatchesService.rescheduleMatch(matchId, newDate, newTime);

          if (success) {
            get().updateMatchInList({
              ...get().currentMatch!,
              date: newDate,
              time: newTime,
            });

            if (get().currentMatch?.id === matchId) {
              set({
                currentMatch: {
                  ...get().currentMatch,
                  date: newDate,
                  time: newTime,
                },
              });
            }

            set({ isUpdating: false });
            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Reschedule match error:', error);
          set({
            error: error.message || 'Failed to reschedule match',
            isUpdating: false,
          });
          return false;
        }
      },

      updateMatchLocation: async (matchId: string, location: any) => {
        try {
          set({ isUpdating: true, error: null });

          const success = await MatchesService.updateMatchLocation(matchId, location);

          if (success) {
            get().updateMatchInList({
              ...get().currentMatch!,
              location,
            });

            if (get().currentMatch?.id === matchId) {
              set({
                currentMatch: {
                  ...get().currentMatch,
                  location,
                },
              });
            }

            set({ isUpdating: false });
            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Update match location error:', error);
          set({
            error: error.message || 'Failed to update match location',
            isUpdating: false,
          });
          return false;
        }
      },

      setCurrentMatch: (match: Match | null) => {
        set({ currentMatch: match });
      },

      updateMatchInList: (updatedMatch: Match) => {
        const { matches, upcomingMatches, pastMatches, activeMatches } = get();

        const updateArray = (array: Match[]) =>
          array.map(match => (match.id === updatedMatch.id ? updatedMatch : match));

        set({
          matches: updateArray(matches),
          upcomingMatches: updateArray(upcomingMatches),
          pastMatches: updateArray(pastMatches),
          activeMatches: updateArray(activeMatches),
        });
      },

      removeMatchFromList: (id: string) => {
        const { matches, upcomingMatches, pastMatches, activeMatches } = get();

        const filterArray = (array: Match[]) => array.filter(match => match.id !== id);

        set({
          matches: filterArray(matches),
          upcomingMatches: filterArray(upcomingMatches),
          pastMatches: filterArray(pastMatches),
          activeMatches: filterArray(activeMatches),
        });
      },

      setFilters: (filters: Partial<MatchesState['filters']>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...filters },
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        });
      },

      clearError: () => set({ error: null }),

      reset: () => set({
        matches: [],
        currentMatch: null,
        upcomingMatches: [],
        pastMatches: [],
        activeMatches: [],
        matchSuggestions: [],
        isLoading: false,
        isUpdating: false,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        filters: {
          sortBy: 'date',
          sortOrder: 'ASC',
        },
      }),
    }),
    { name: 'matches-store' }
  )
);

// Selectors
export const useMatches = () => useMatchesStore((state) => state.matches);

export const useCurrentMatch = () => useMatchesStore((state) => state.currentMatch);

export const useUpcomingMatches = () => useMatchesStore((state) => state.upcomingMatches);

export const usePastMatches = () => useMatchesStore((state) => state.pastMatches);

export const useActiveMatches = () => useMatchesStore((state) => state.activeMatches);

export const useMatchSuggestions = () => useMatchesStore((state) => state.matchSuggestions);

export const useMatchesLoading = () => useMatchesStore((state) => ({
  isLoading: state.isLoading,
  isUpdating: state.isUpdating,
}));

export const useMatchesError = () => useMatchesStore((state) => state.error);

export const useMatchesPagination = () => useMatchesStore((state) => state.pagination);

export const useMatchesFilters = () => useMatchesStore((state) => state.filters);

// Action selectors
export const useMatchesActions = () => useMatchesStore((state) => ({
  fetchMatches: state.fetchMatches,
  fetchMatchById: state.fetchMatchById,
  updateMatchStatus: state.updateMatchStatus,
  addMatchSuggestion: state.addMatchSuggestion,
  respondToSuggestion: state.respondToSuggestion,
  fetchTeamMatches: state.fetchTeamMatches,
  fetchUpcomingMatches: state.fetchUpcomingMatches,
  fetchPastMatches: state.fetchPastMatches,
  fetchActiveMatches: state.fetchActiveMatches,
  submitMatchResult: state.submitMatchResult,
  cancelMatch: state.cancelMatch,
  rescheduleMatch: state.rescheduleMatch,
  updateMatchLocation: state.updateMatchLocation,
  setCurrentMatch: state.setCurrentMatch,
  updateMatchInList: state.updateMatchInList,
  removeMatchFromList: state.removeMatchFromList,
  setFilters: state.setFilters,
  clearError: state.clearError,
  reset: state.reset,
}));

export default useMatchesStore;