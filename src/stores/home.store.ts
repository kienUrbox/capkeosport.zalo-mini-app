import { create } from 'zustand';
import type { Notification } from '@/types/api.types';

interface HomeStore {
  // State
  pendingInvitations: Notification[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setPendingInvitations: (invitations: Notification[]) => void;
  clearHomeData: () => void;

  // API Method
  fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeStore>()((set, get) => ({
  // Initial state
  pendingInvitations: [],
  isLoading: false,
  error: null,

  // Actions
  setPendingInvitations: (invitations) => set({ pendingInvitations: invitations }),

  clearHomeData: () => {
    set({
      pendingInvitations: [],
      error: null,
    });
  },

  // API Method - simplified without caching
  fetchHomeData: async () => {
    try {
      const currentState = get();

      // Guard: Skip if already loading
      if (currentState.isLoading) {
        console.log('[HomeStore] ✋ Skipping fetch - already loading');
        return;
      }

      console.log('[HomeStore] 📥 Fetching home data...');
      set({ isLoading: true, error: null });

      // Fetch invitations and matches in parallel
      const { fetchNotifications } = await import('@/stores/notification.store');
      const { fetchUpcomingMatches } = await import('@/stores/match.store');

      const [invitations] = await Promise.all([
        fetchNotifications({ type: 'team_invitation', unreadOnly: true }),
        fetchUpcomingMatches(undefined, 1),
      ]);

      // Update store with fetched data
      set({
        pendingInvitations: invitations,
        isLoading: false,
        error: null,
      });

      console.log('[HomeStore] ✅ Successfully fetched home data');
      console.log('[HomeStore] 📊 Invitations:', invitations.length);
    } catch (error: any) {
      console.error('[HomeStore] ❌ Fetch home data error:', error);
      const errorMessage = error.error?.message || error.message || 'Không thể tải dữ liệu';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },
}));

// Selectors
export const usePendingInvitations = () => useHomeStore((state) => state.pendingInvitations);

export const useHomeLoading = () => useHomeStore((state) => state.isLoading);

export const useHomeError = () => useHomeStore((state) => state.error);

export const useHomeActions = () => {
  const store = useHomeStore();
  return {
    setPendingInvitations: store.setPendingInvitations,
    clearHomeData: store.clearHomeData,
    fetchHomeData: store.fetchHomeData,
  };
};

export default useHomeStore;
