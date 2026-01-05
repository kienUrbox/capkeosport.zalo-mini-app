import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/services/api/notification.service';
import type { DiscoveredTeam } from '@/services/api/discovery.service';

interface HomeData {
  pendingInvitations: Notification[];
  nearbyTeams: DiscoveredTeam[];
  lastFetched: number; // timestamp
}

interface HomeStore extends HomeData {
  setHomeData: (data: Omit<HomeData, 'lastFetched'>) => void;
  clearHomeData: () => void;
  isDataStale: (staleTimeMs?: number) => boolean;
}

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useHomeStore = create<HomeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pendingInvitations: [],
      nearbyTeams: [],
      lastFetched: 0,

      // Actions
      setHomeData: (data) => {
        set({
          ...data,
          lastFetched: Date.now(),
        });
      },

      clearHomeData: () => {
        set({
          pendingInvitations: [],
          nearbyTeams: [],
          lastFetched: 0,
        });
      },

      isDataStale: (staleTimeMs = STALE_TIME) => {
        const { lastFetched } = get();
        if (lastFetched === 0) return true; // No data yet
        return Date.now() - lastFetched > staleTimeMs;
      },
    }),
    {
      name: 'home-storage', // localStorage key
    }
  )
);
