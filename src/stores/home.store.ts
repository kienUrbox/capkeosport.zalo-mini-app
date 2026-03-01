import { create } from "zustand";
import type { Notification } from "@/types/api.types";
import { NotificationType } from "@/types/api.types";

interface HomeStore {
  // State
  _hasFetched: boolean;
  pendingInvitations: Notification[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setPendingInvitations: (invitations: Notification[]) => void;
  clearHomeData: () => void;

  // API Method
  fetchHomeData: (forceRefresh?: boolean) => Promise<void>;
}

export const useHomeStore = create<HomeStore>()((set, get) => ({
  // Initial state
  _hasFetched: false,
  pendingInvitations: [],
  isLoading: false,
  error: null,

  // Actions
  setPendingInvitations: (invitations) =>
    set({ pendingInvitations: invitations }),

  clearHomeData: () => {
    set({
      _hasFetched: false,
      pendingInvitations: [],
      error: null,
    });
  },

  // API Method - with caching support
  fetchHomeData: async (forceRefresh: boolean = false) => {
    try {
      const currentState = get();

      // Guard: Skip if already loading
      if (currentState.isLoading) {
        console.log("[HomeStore] ✋ Skipping fetch - already loading");
        return;
      }

      // Guard: Skip if already fetched and not forcing refresh
      if (!forceRefresh && currentState._hasFetched) {
        console.log(
          "[HomeStore] ✋ Already fetched, use forceRefresh=true to refresh",
        );
        return;
      }

      console.log("[HomeStore] 📥 Fetching home data...");
      set({ isLoading: true, error: null });

      // Fetch invitations and matches in parallel using store methods
      const notificationModule = await import("@/stores/notification.store");
      const matchModule = await import("@/stores/match.store");

      // Get the store state directly (not using hooks)
      const notificationState =
        notificationModule.useNotificationStore.getState();
      const matchState = matchModule.useMatchStore.getState();

      // Call the store methods directly
      // Fetch new match notifications (which represent match opportunities/invitations)
      const invitations = await notificationState.fetchNotifications({
        type: NotificationType.TEAM_INVITATION,
        unreadOnly: true,
      });
      console.log("[HomeStore] 📬 Fetched invitations:", invitations);
      console.log("[HomeStore] 📊 Invitations count:", invitations.length);
      console.log("[HomeStore] 🔍 First invitation:", invitations[0]);
      // Don't await match fetching since we don't store the results
      matchState.fetchUpcomingMatches(undefined, 1).catch((err) => {
        console.error("[HomeStore] Failed to fetch upcoming matches:", err);
      });

      // Update store with fetched data
      set({
        _hasFetched: true,
        pendingInvitations: invitations,
        isLoading: false,
        error: null,
      });

      console.log("[HomeStore] ✅ Successfully fetched home data");
      console.log("[HomeStore] 📦 Store state after update:", get());
    } catch (error: any) {
      console.error("[HomeStore] ❌ Fetch home data error:", error);
      const errorMessage =
        error.error?.message || error.message || "Không thể tải dữ liệu";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },
}));

// Selectors
export const usePendingInvitations = () =>
  useHomeStore((state) => state.pendingInvitations);

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
