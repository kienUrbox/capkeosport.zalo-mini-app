import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Using simplified types for now
export type MatchStatus = 'pending' | 'upcoming' | 'live' | 'finished';

export interface Match {
  id: string;
  teamA: {
    id: string;
    name: string;
    logo: string;
  };
  teamB: {
    id: string;
    name: string;
    logo: string;
  };
  scoreA?: number;
  scoreB?: number;
  time: string;
  date: string;
  location: string;
  status: MatchStatus;
  type?: 'received' | 'sent' | 'accepted';
}

interface MatchState {
  // State
  pendingMatches: Match[];
  upcomingMatches: Match[];
  liveMatches: Match[];
  historyMatches: Match[];
  selectedMatch: Match | null;
  isLoading: boolean;
  error: string | null;

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

      // Actions
      setPendingMatches: (matches) => set({ pendingMatches: matches }),

      setUpcomingMatches: (matches) => set({ upcomingMatches: matches }),

      setLiveMatches: (matches) => set({ liveMatches: matches }),

      setHistoryMatches: (matches) => set({ historyMatches: matches }),

      setSelectedMatch: (match) => set({ selectedMatch: match }),

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
  };
};

export default useMatchStore;
