import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiscoveredTeam } from '@/services/api/discovery.service';
import { TEAM_LEVELS, TEAM_GENDER } from '@/constants/design';

// Default location: Ho Chi Minh City center
const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

export interface DiscoveryFilters {
  lat: number;
  lng: number;
  radius: number;
  level: string[];
  gender: string[];
  sortBy: 'distance' | 'quality' | 'activity';
  sortOrder: 'ASC' | 'DESC';
}

interface DiscoveryState {
  // Filters
  filters: DiscoveryFilters;

  // Teams data
  teams: DiscoveredTeam[];
  currentIndex: number;
  totalAvailable: number;

  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Match state
  matchedTeam: DiscoveredTeam | null;

  // Actions
  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  resetFilters: (teamLevel?: string, teamGender?: string) => void;
  setTeams: (teams: DiscoveredTeam[], total: number) => void;
  setCurrentIndex: (index: number) => void;
  nextCard: () => void;
  setMatchedTeam: (team: DiscoveredTeam | null) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Helper to map gender enum to Vietnamese
const mapGenderToVietnamese = (gender?: string): string => {
  if (!gender) return TEAM_GENDER.MALE;
  const genderUpper = gender.toUpperCase();
  if (genderUpper === 'MALE') return TEAM_GENDER.MALE;
  if (genderUpper === 'FEMALE') return TEAM_GENDER.FEMALE;
  return TEAM_GENDER.MIXED;
};

// Get default filters based on team info
export const getDefaultFilters = (teamLevel?: string, teamGender?: string): DiscoveryFilters => {
  return {
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    radius: 15,
    level: teamLevel ? [teamLevel] : TEAM_LEVELS.slice(0, 3), // Default: first 3 levels
    gender: teamGender ? [mapGenderToVietnamese(teamGender)] : Object.values(TEAM_GENDER),
    sortBy: 'distance',
    sortOrder: 'ASC',
  };
};

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: getDefaultFilters(),
      teams: [],
      currentIndex: 0,
      totalAvailable: 0,
      isLoading: false,
      isRefreshing: false,
      error: null,
      matchedTeam: null,

      // Actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: (teamLevel, teamGender) =>
        set({
          filters: getDefaultFilters(teamLevel, teamGender),
        }),

      setTeams: (teams, total) =>
        set({
          teams,
          totalAvailable: total,
          currentIndex: 0,
        }),

      setCurrentIndex: (index) =>
        set({
          currentIndex: index,
        }),

      nextCard: () =>
        set((state) => ({
          currentIndex: state.currentIndex + 1,
        })),

      setMatchedTeam: (team) =>
        set({
          matchedTeam: team,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      setRefreshing: (refreshing) =>
        set({
          isRefreshing: refreshing,
        }),

      setError: (error) =>
        set({
          error,
        }),

      clearError: () =>
        set({
          error: null,
        }),
    }),
    {
      name: 'discovery-storage',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);

// Selectors
export const useDiscoveryFilters = () => useDiscoveryStore((state) => state.filters);
export const useDiscoveryTeams = () => useDiscoveryStore((state) => state.teams);
export const useCurrentCard = () =>
  useDiscoveryStore((state) => (state.teams[state.currentIndex] ? state.teams[state.currentIndex] : null));
export const useDiscoveryMatchedTeam = () => useDiscoveryStore((state) => state.matchedTeam);

export default useDiscoveryStore;
