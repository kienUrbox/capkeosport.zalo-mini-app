import { create } from 'zustand';
import type {
  Notification,
  NotificationStats,
  NotificationQueryParams,
} from '@/types/api.types';
import { api } from '@/services/api/index';

interface NotificationState {
  // State
  notifications: Notification[];
  stats: NotificationStats | null;
  unreadCount: number;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;

  // Track fetched state to prevent duplicate requests
  _fetched: boolean;
  _fetchedStats: boolean;

  // ========== State Management Actions ==========
  setNotifications: (notifications: Notification[]) => void;
  setStats: (stats: NotificationStats) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (notificationId: string, updates: Partial<Notification>) => void;
  removeNotification: (notificationId: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;

  // ========== API Methods ==========

  /**
   * Fetch notifications
   * GET /notifications
   */
  fetchNotifications: (params?: NotificationQueryParams, forceRefresh?: boolean) => Promise<Notification[]>;

  /**
   * Mark notification as read
   * PATCH /notifications/:id/read
   */
  markAsRead: (notificationId: string) => Promise<void>;

  /**
   * Mark all notifications as read
   * POST /notifications/read-all
   */
  markAllAsRead: () => Promise<void>;

  /**
   * Fetch notification stats
   * GET /notifications/stats
   */
  fetchStats: (forceRefresh?: boolean) => Promise<NotificationStats>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  stats: null,
  unreadCount: 0,
  isLoading: false,
  isStatsLoading: false,
  error: null,
  _fetched: false,
  _fetchedStats: false,

  // ========== State Management Actions ==========

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  setStats: (stats) => set({ stats, unreadCount: stats.unread }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),

  updateNotification: (notificationId, updates) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, ...updates } : n
      ),
      // Update unread count if isRead changed
      unreadCount:
        updates.isRead !== undefined
          ? state.notifications.find((n) => n.id === notificationId)?.isRead && !updates.isRead
            ? state.unreadCount + 1
            : !state.notifications.find((n) => n.id === notificationId)?.isRead && updates.isRead
            ? state.unreadCount - 1
            : state.unreadCount
          : state.unreadCount,
    })),

  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
      unreadCount: state.notifications.find((n) => n.id === notificationId)?.isRead
        ? state.unreadCount
        : state.unreadCount - 1,
    })),

  clearError: () => set({ error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // ========== API Methods ==========

  /**
   * Fetch notifications
   * GET /notifications
   */
  fetchNotifications: async (params, forceRefresh = false) => {
    try {
      const currentState = get();

      // Skip if already loading
      if (currentState.isLoading) {
        console.log('[NotificationStore] Skipping fetch - already loading');
        return currentState.notifications;
      }

      // Skip if already fetched UNLESS forceRefresh
      if (!forceRefresh && currentState._fetched) {
        console.log('[NotificationStore] Skipping fetch - already fetched (use forceRefresh=true)');
        return currentState.notifications;
      }

      set({ isLoading: true, error: null });

      const response = await api.get<{ items: Notification[]; total: number; unread: number }>('/notifications', params);

      if (response.success && response.data) {
        const notifications = response.data.items || [];

        set({
          notifications,
          unreadCount: response.data.unread || notifications.filter((n) => !n.isRead).length,
          _fetched: true,
          error: null,
        });

        return notifications;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch notifications');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải thông báo';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Mark notification as read
   * PATCH /notifications/:id/read
   */
  markAsRead: async (notificationId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.patch<Notification>(`/notifications/${notificationId}/read`);

      if (response.success && response.data) {
        get().updateNotification(notificationId, { isRead: true });

        // Update stats if available
        const state = get();
        if (state.stats) {
          set({
            stats: {
              ...state.stats,
              unread: Math.max(0, state.stats.unread - 1),
            },
            unreadCount: Math.max(0, state.unreadCount - 1),
          });
        }
      } else {
        throw new Error(response.error?.message || 'Failed to mark as read');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể đánh dấu đã đọc';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Mark all notifications as read
   * POST /notifications/read-all
   */
  markAllAsRead: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<{ count: number }>('/notifications/read-all');

      if (response.success) {
        // Mark all local notifications as read
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));

        // Update stats if available
        const state = get();
        if (state.stats) {
          set({
            stats: {
              ...state.stats,
              unread: 0,
            },
          });
        }
      } else {
        throw new Error(response.error?.message || 'Failed to mark all as read');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể đánh dấu tất cả đã đọc';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetch notification stats
   * GET /notifications/stats
   */
  fetchStats: async (forceRefresh = false) => {
    try {
      const currentState = get();

      // Skip if already loading
      if (currentState.isStatsLoading) {
        return currentState.stats;
      }

      // Skip if already fetched UNLESS forceRefresh
      if (!forceRefresh && currentState._fetchedStats) {
        return currentState.stats;
      }

      set({ isStatsLoading: true, error: null });

      const response = await api.get<NotificationStats>('/notifications/stats');

      if (response.success && response.data) {
        set({
          stats: response.data,
          unreadCount: response.data.unread,
          _fetchedStats: true,
          error: null,
        });

        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch stats');
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Không thể tải thống kê';
      set({ error: errorMessage, isStatsLoading: false });
      throw error;
    } finally {
      set({ isStatsLoading: false });
    }
  },
}));

// Selectors
export const useNotifications = () => useNotificationStore((state) => state.notifications);

export const useNotificationStats = () => useNotificationStore((state) => state.stats);

export const useUnreadCount = () => useNotificationStore((state) => state.unreadCount);

export const useNotificationActions = () => {
  const store = useNotificationStore();
  return {
    setNotifications: store.setNotifications,
    setStats: store.setStats,
    addNotification: store.addNotification,
    updateNotification: store.updateNotification,
    removeNotification: store.removeNotification,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    // API methods
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    fetchStats: store.fetchStats,
  };
};

export default useNotificationStore;
