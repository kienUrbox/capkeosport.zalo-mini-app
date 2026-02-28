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

  // State Management Actions
  setNotifications: (notifications: Notification[]) => void;
  setStats: (stats: NotificationStats) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (notificationId: string, updates: Partial<Notification>) => void;
  removeNotification: (notificationId: string) => void;
  clearError: () => void;
  setError: (error: string) => void;

  // API Methods
  fetchNotifications: (params?: NotificationQueryParams) => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchStats: () => Promise<NotificationStats>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  stats: null,
  unreadCount: 0,
  isLoading: false,
  isStatsLoading: false,
  error: null,

  // State Management Actions
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
  setError: (error) => set({ error }),

  // API Methods - simplified without caching

  /**
   * Fetch notifications
   * GET /notifications
   */
  fetchNotifications: async (params) => {
    try {
      const currentState = get();

      // Skip if already loading
      if (currentState.isLoading) {
        console.log('[NotificationStore] Skipping fetch - already loading');
        return currentState.notifications;
      }

      set({ isLoading: true, error: null });
      console.log('[NotificationStore] 📥 Fetching notifications with params:', params);

      const response = await api.get<{ items: Notification[]; total: number; unread: number } | Notification[]>('/notifications', { params });
      console.log('[NotificationStore] 📬 API response:', response);

      if (response.success && response.data) {
        // Handle multiple response formats:
        // 1. API format: { notifications: [...], total: ..., unreadCount: ..., pagination: {...} }
        // 2. Paginated: { items: [...], total: ..., unread: ... }
        // 3. Direct array: [...]
        let notifications: Notification[] = [];
        let unread = 0;

        if (Array.isArray(response.data)) {
          // Direct array response
          notifications = response.data;
          unread = notifications.filter((n) => !n.isRead).length;
        } else if ('notifications' in response.data) {
          // API format with notifications array
          notifications = response.data.notifications || [];
          unread = response.data.unreadCount || notifications.filter((n) => !n.isRead).length;
        } else {
          // Paginated response with items
          notifications = response.data.items || [];
          unread = response.data.unread || notifications.filter((n) => !n.isRead).length;
        }

        console.log('[NotificationStore] 📊 Raw notifications:', notifications.length);
        console.log('[NotificationStore] 🔍 First notification:', notifications[0]);

        // Filter by type if specified in params
        if (params?.type) {
          const beforeFilter = notifications.length;
          notifications = notifications.filter((n) => n.type === params.type);
          console.log('[NotificationStore] 🎯 Filtered by type:', params.type, 'from', beforeFilter, 'to', notifications.length);
        }

        // Filter by unread status if specified
        if (params?.unreadOnly) {
          const beforeFilter = notifications.length;
          notifications = notifications.filter((n) => !n.isRead);
          console.log('[NotificationStore] 📭 Filtered unread only: from', beforeFilter, 'to', notifications.length);
        }

        set({
          notifications,
          unreadCount: unread,
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
  fetchStats: async () => {
    try {
      const currentState = get();

      // Skip if already loading
      if (currentState.isStatsLoading) {
        return currentState.stats;
      }

      set({ isStatsLoading: true, error: null });

      const response = await api.get<NotificationStats>('/notifications/stats');

      if (response.success && response.data) {
        set({
          stats: response.data,
          unreadCount: response.data.unread,
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
    setError: store.setError,
    // API methods
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    fetchStats: store.fetchStats,
  };
};

export default useNotificationStore;
