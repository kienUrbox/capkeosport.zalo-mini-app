import { create } from 'zustand';
import { User } from '@/types/api.types';
import { Team } from '@/services/api/team.service';

export type LaunchingStatus =
  | 'idle'
  | 'loading'
  | 'auth_checking'
  | 'loading_data'
  | 'error'
  | 'ready';

export interface LaunchingState {
  // State
  status: LaunchingStatus;
  error: string | null;
  retryCount: number;
  profileLoaded: boolean;
  teamsLoaded: boolean;
  fontsLoaded: boolean;

  // Cached data
  profile: User | null;
  teams: Team[] | null;

  // Actions
  setStatus: (status: LaunchingStatus) => void;
  setError: (error: string | null) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
  reset: () => void;
  setProfileLoaded: (profile: User) => void;
  setTeamsLoaded: (teams: Team[]) => void;
  setFontsLoaded: () => void;
}

const initialState = {
  status: 'idle' as LaunchingStatus,
  error: null,
  retryCount: 0,
  profileLoaded: false,
  teamsLoaded: false,
  fontsLoaded: false,
  profile: null,
  teams: null,
};

export const useLaunchingStore = create<LaunchingState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),

  incrementRetry: () =>
    set((state) => ({ retryCount: state.retryCount + 1 })),

  resetRetry: () => set({ retryCount: 0 }),

  reset: () => set(initialState),

  setProfileLoaded: (profile) =>
    set({ profileLoaded: true, profile, status: 'loading_data' }),

  setTeamsLoaded: (teams) =>
    set({ teamsLoaded: true, teams, status: 'ready' }),

  setFontsLoaded: () => set({ fontsLoaded: true }),
}));

// Selectors
export const useLaunchingStatus = () =>
  useLaunchingStore((state) => state.status);

export const useLaunchingError = () =>
  useLaunchingStore((state) => state.error);

export const useLaunchingRetryCount = () =>
  useLaunchingStore((state) => state.retryCount);

export const useIsLaunchingReady = () =>
  useLaunchingStore((state) => state.status === 'ready');

export const useLaunchingActions = () => {
  const store = useLaunchingStore();
  return {
    setStatus: store.setStatus,
    setError: store.setError,
    incrementRetry: store.incrementRetry,
    resetRetry: store.resetRetry,
    reset: store.reset,
    setProfileLoaded: store.setProfileLoaded,
    setTeamsLoaded: store.setTeamsLoaded,
    setFontsLoaded: store.setFontsLoaded,
  };
};

export default useLaunchingStore;
