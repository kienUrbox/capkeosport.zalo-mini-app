import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notification, NotificationStats, NotificationType, NotificationPriority } from '../types/api.types';
import { NotificationsService } from '../services/api/services';

interface NotificationsState {
  // State
  notifications: Notification[];
  unreadNotifications: Notification[];
  notificationStats: NotificationStats | null;
  unreadCount: number;
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
    unreadOnly?: boolean;
    type?: NotificationType;
    priority?: NotificationPriority;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    inAppNotifications: boolean;
    types: Record<NotificationType, {
      email: boolean;
      push: boolean;
      inApp: boolean;
    }>;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  } | null;
  isMuted: boolean;
  mutedUntil?: string;

  // Actions
  fetchNotifications: (params?: any) => Promise<void>;
  fetchUnreadNotifications: (limit?: number) => Promise<void>;
  getUnreadCount: () => Promise<void>;
  getNotificationStats: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  markMultipleAsRead: (notificationIds: string[]) => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  deleteMultipleNotifications: (notificationIds: string[]) => Promise<boolean>;
  getNotificationsByType: (type: NotificationType, params?: any) => Promise<void>;
  getNotificationsByPriority: (priority: NotificationPriority, params?: any) => Promise<void>;
  getRecentNotifications: (limit?: number) => Promise<void>;
  getHighPriorityNotifications: () => Promise<void>;
  getUrgentNotifications: () => Promise<void>;
  searchNotifications: (query: string, params?: any) => Promise<void>;
  getNotificationPreferences: () => Promise<void>;
  updateNotificationPreferences: (preferences: any) => Promise<boolean>;
  muteNotifications: (duration: number, unit?: 'minutes' | 'hours' | 'days') => Promise<boolean>;
  unmuteNotifications: () => Promise<boolean>;
  getNotificationSettings: () => Promise<void>;
  clearAllNotifications: () => Promise<boolean>;
  addNotification: (notification: Notification) => void;
  updateNotificationInList: (updatedNotification: Notification) => void;
  removeNotificationFromList: (id: string) => void;
  setFilters: (filters: Partial<NotificationsState['filters']>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadNotifications: [],
      notificationStats: null,
      unreadCount: 0,
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
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      },
      preferences: null,
      isMuted: false,
      mutedUntil: undefined,

      // Actions
      fetchNotifications: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const currentFilters = get().filters;
          const queryParams = {
            page: 1,
            limit: 20,
            ...currentFilters,
            ...params,
          };

          const response = await NotificationsService.getUserNotifications(queryParams);

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
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
          console.error('Fetch notifications error:', error);
          set({
            error: error.message || 'Failed to fetch notifications',
            isLoading: false,
          });
        }
      },

      fetchUnreadNotifications: async (limit = 20) => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getUnreadNotifications(limit);

          if (response.success && response.data) {
            set({
              unreadNotifications: response.data.items,
              unreadCount: response.data.items.length,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch unread notifications error:', error);
          set({
            error: error.message || 'Failed to fetch unread notifications',
            isLoading: false,
          });
        }
      },

      getUnreadCount: async () => {
        try {
          const response = await NotificationsService.getUnreadCount();

          if (response.success && response.data) {
            set({
              unreadCount: response.data.unreadCount,
            });
          }
        } catch (error: any) {
          console.error('Get unread count error:', error);
          set({
            error: error.message || 'Failed to get unread count',
          });
        }
      },

      getNotificationStats: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getNotificationStats();

          if (response.success && response.data) {
            set({
              notificationStats: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get notification stats error:', error);
          set({
            error: error.message || 'Failed to fetch notification statistics',
            isLoading: false,
          });
        }
      },

      markAsRead: async (id: string) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.markAsRead(id);

          if (response.success) {
            const { notifications, unreadNotifications, unreadCount } = get();

            const updatedNotifications = notifications.map(notification =>
              notification.id === id ? { ...notification, isRead: true } : notification
            );

            const updatedUnreadNotifications = unreadNotifications.filter(
              notification => notification.id !== id
            );

            set({
              notifications: updatedNotifications,
              unreadNotifications: updatedUnreadNotifications,
              unreadCount: Math.max(0, unreadCount - 1),
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Mark as read error:', error);
          set({
            error: error.message || 'Failed to mark notification as read',
            isUpdating: false,
          });
          return false;
        }
      },

      markAllAsRead: async () => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.markAllAsRead();

          if (response.success && response.data) {
            const { notifications } = get();

            const updatedNotifications = notifications.map(notification => ({
              ...notification,
              isRead: true,
            }));

            set({
              notifications: updatedNotifications,
              unreadNotifications: [],
              unreadCount: 0,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Mark all as read error:', error);
          set({
            error: error.message || 'Failed to mark all notifications as read',
            isUpdating: false,
          });
          return false;
        }
      },

      markMultipleAsRead: async (notificationIds: string[]) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.markMultipleAsRead(notificationIds);

          if (response.success && response.data) {
            const { notifications, unreadNotifications, unreadCount } = get();

            const updatedNotifications = notifications.map(notification =>
              notificationIds.includes(notification.id)
                ? { ...notification, isRead: true }
                : notification
            );

            const updatedUnreadNotifications = unreadNotifications.filter(
              notification => !notificationIds.includes(notification.id)
            );

            const newUnreadCount = Math.max(0, unreadCount - response.data.markedCount);

            set({
              notifications: updatedNotifications,
              unreadNotifications: updatedUnreadNotifications,
              unreadCount: newUnreadCount,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Mark multiple as read error:', error);
          set({
            error: error.message || 'Failed to mark notifications as read',
            isUpdating: false,
          });
          return false;
        }
      },

      deleteNotification: async (id: string) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.deleteNotification(id);

          if (response.success) {
            const { notifications, unreadNotifications, unreadCount } = get();

            const updatedNotifications = notifications.filter(
              notification => notification.id !== id
            );

            const deletedNotification = notifications.find(
              notification => notification.id === id
            );

            const updatedUnreadNotifications = unreadNotifications.filter(
              notification => notification.id !== id
            );

            const newUnreadCount = deletedNotification?.isRead === false
              ? Math.max(0, unreadCount - 1)
              : unreadCount;

            set({
              notifications: updatedNotifications,
              unreadNotifications: updatedUnreadNotifications,
              unreadCount: newUnreadCount,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Delete notification error:', error);
          set({
            error: error.message || 'Failed to delete notification',
            isUpdating: false,
          });
          return false;
        }
      },

      deleteMultipleNotifications: async (notificationIds: string[]) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.deleteMultipleNotifications(notificationIds);

          if (response.success && response.data) {
            const { notifications, unreadNotifications, unreadCount } = get();

            const updatedNotifications = notifications.filter(
              notification => !notificationIds.includes(notification.id)
            );

            const deletedUnreadCount = notifications.filter(
              notification => notificationIds.includes(notification.id) && !notification.isRead
            ).length;

            const updatedUnreadNotifications = unreadNotifications.filter(
              notification => !notificationIds.includes(notification.id)
            );

            const newUnreadCount = Math.max(0, unreadCount - deletedUnreadCount);

            set({
              notifications: updatedNotifications,
              unreadNotifications: updatedUnreadNotifications,
              unreadCount: newUnreadCount,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Delete multiple notifications error:', error);
          set({
            error: error.message || 'Failed to delete notifications',
            isUpdating: false,
          });
          return false;
        }
      },

      getNotificationsByType: async (type: NotificationType, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getNotificationsByType(type, params);

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
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
          console.error('Get notifications by type error:', error);
          set({
            error: error.message || 'Failed to fetch notifications by type',
            isLoading: false,
          });
        }
      },

      getNotificationsByPriority: async (priority: NotificationPriority, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getNotificationsByPriority(priority, params);

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
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
          console.error('Get notifications by priority error:', error);
          set({
            error: error.message || 'Failed to fetch notifications by priority',
            isLoading: false,
          });
        }
      },

      getRecentNotifications: async (limit = 10) => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getRecentNotifications(limit);

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get recent notifications error:', error);
          set({
            error: error.message || 'Failed to fetch recent notifications',
            isLoading: false,
          });
        }
      },

      getHighPriorityNotifications: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getHighPriorityNotifications();

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get high priority notifications error:', error);
          set({
            error: error.message || 'Failed to fetch high priority notifications',
            isLoading: false,
          });
        }
      },

      getUrgentNotifications: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getUrgentNotifications();

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get urgent notifications error:', error);
          set({
            error: error.message || 'Failed to fetch urgent notifications',
            isLoading: false,
          });
        }
      },

      searchNotifications: async (query: string, params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.searchNotifications(query, params);

          if (response.success && response.data) {
            set({
              notifications: response.data.items,
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
          console.error('Search notifications error:', error);
          set({
            error: error.message || 'Failed to search notifications',
            isLoading: false,
          });
        }
      },

      getNotificationPreferences: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getNotificationPreferences();

          if (response.success && response.data) {
            set({
              preferences: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get notification preferences error:', error);
          set({
            error: error.message || 'Failed to fetch notification preferences',
            isLoading: false,
          });
        }
      },

      updateNotificationPreferences: async (preferences: any) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.updateNotificationPreferences(preferences);

          if (response.success) {
            const { preferences: currentPreferences } = get();

            if (currentPreferences) {
              const updatedPreferences = { ...currentPreferences, ...preferences };
              set({
                preferences: updatedPreferences,
                isUpdating: false,
              });
            }

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Update notification preferences error:', error);
          set({
            error: error.message || 'Failed to update notification preferences',
            isUpdating: false,
          });
          return false;
        }
      },

      muteNotifications: async (duration: number, unit = 'hours') => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.muteNotifications(duration, unit);

          if (response.success) {
            // Calculate muted until time
            const now = new Date();
            let mutedUntil = new Date();

            switch (unit) {
              case 'minutes':
                mutedUntil.setMinutes(now.getMinutes() + duration);
                break;
              case 'hours':
                mutedUntil.setHours(now.getHours() + duration);
                break;
              case 'days':
                mutedUntil.setDate(now.getDate() + duration);
                break;
            }

            set({
              isMuted: true,
              mutedUntil: mutedUntil.toISOString(),
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Mute notifications error:', error);
          set({
            error: error.message || 'Failed to mute notifications',
            isUpdating: false,
          });
          return false;
        }
      },

      unmuteNotifications: async () => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.unmuteNotifications();

          if (response.success) {
            set({
              isMuted: false,
              mutedUntil: undefined,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Unmute notifications error:', error);
          set({
            error: error.message || 'Failed to unmute notifications',
            isUpdating: false,
          });
          return false;
        }
      },

      getNotificationSettings: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await NotificationsService.getNotificationSettings();

          if (response.success && response.data) {
            set({
              isMuted: response.data.isMuted,
              mutedUntil: response.data.mutedUntil,
              preferences: response.data.preferences,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Get notification settings error:', error);
          set({
            error: error.message || 'Failed to fetch notification settings',
            isLoading: false,
          });
        }
      },

      clearAllNotifications: async () => {
        try {
          set({ isUpdating: true, error: null });

          const response = await NotificationsService.clearAllNotifications();

          if (response.success && response.data) {
            set({
              notifications: [],
              unreadNotifications: [],
              unreadCount: 0,
              isUpdating: false,
            });

            return true;
          }

          return false;
        } catch (error: any) {
          console.error('Clear all notifications error:', error);
          set({
            error: error.message || 'Failed to clear all notifications',
            isUpdating: false,
          });
          return false;
        }
      },

      addNotification: (notification: Notification) => {
        const { notifications, unreadNotifications, unreadCount } = get();

        set({
          notifications: [notification, ...notifications],
          unreadNotifications: notification.isRead ? unreadNotifications : [notification, ...unreadNotifications],
          unreadCount: notification.isRead ? unreadCount : unreadCount + 1,
        });
      },

      updateNotificationInList: (updatedNotification: Notification) => {
        const { notifications, unreadNotifications, unreadCount } = get();

        const wasUnread = !notifications.find(n => n.id === updatedNotification.id)?.isRead;
        const isNowUnread = !updatedNotification.isRead;

        set({
          notifications: notifications.map(notification =>
            notification.id === updatedNotification.id ? updatedNotification : notification
          ),
          unreadNotifications: unreadNotifications.map(notification =>
            notification.id === updatedNotification.id ? updatedNotification : notification
          ),
          unreadCount: wasUnread && !isNowUnread ? unreadCount - 1 :
                        !wasUnread && isNowUnread ? unreadCount + 1 : unreadCount,
        });
      },

      removeNotificationFromList: (id: string) => {
        const { notifications, unreadNotifications, unreadCount } = get();

        const deletedNotification = notifications.find(n => n.id === id);
        const wasUnread = deletedNotification?.isRead === false;

        set({
          notifications: notifications.filter(notification => notification.id !== id),
          unreadNotifications: unreadNotifications.filter(notification => notification.id !== id),
          unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount,
        });
      },

      setFilters: (filters: Partial<NotificationsState['filters']>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...filters },
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        });
      },

      clearError: () => set({ error: null }),

      reset: () => set({
        notifications: [],
        unreadNotifications: [],
        notificationStats: null,
        unreadCount: 0,
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
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        },
        preferences: null,
        isMuted: false,
        mutedUntil: undefined,
      }),
    }),
    { name: 'notifications-store' }
  )
);

// Selectors
export const useNotifications = () => useNotificationsStore((state) => state.notifications);

export const useUnreadNotifications = () => useNotificationsStore((state) => state.unreadNotifications);

export const useNotificationStats = () => useNotificationsStore((state) => state.notificationStats);

export const useUnreadCount = () => useNotificationsStore((state) => state.unreadCount);

export const useNotificationsLoading = () => useNotificationsStore((state) => ({
  isLoading: state.isLoading,
  isUpdating: state.isUpdating,
}));

export const useNotificationsError = () => useNotificationsStore((state) => state.error);

export const useNotificationsPagination = () => useNotificationsStore((state) => state.pagination);

export const useNotificationsFilters = () => useNotificationsStore((state) => state.filters);

export const useNotificationPreferences = () => useNotificationsStore((state) => state.preferences);

export const useNotificationMuteStatus = () => useNotificationsStore((state) => ({
  isMuted: state.isMuted,
  mutedUntil: state.mutedUntil,
}));

// Action selectors
export const useNotificationsActions = () => useNotificationsStore((state) => ({
  fetchNotifications: state.fetchNotifications,
  fetchUnreadNotifications: state.fetchUnreadNotifications,
  getUnreadCount: state.getUnreadCount,
  getNotificationStats: state.getNotificationStats,
  markAsRead: state.markAsRead,
  markAllAsRead: state.markAllAsRead,
  markMultipleAsRead: state.markMultipleAsRead,
  deleteNotification: state.deleteNotification,
  deleteMultipleNotifications: state.deleteMultipleNotifications,
  getNotificationsByType: state.getNotificationsByType,
  getNotificationsByPriority: state.getNotificationsByPriority,
  getRecentNotifications: state.getRecentNotifications,
  getHighPriorityNotifications: state.getHighPriorityNotifications,
  getUrgentNotifications: state.getUrgentNotifications,
  searchNotifications: state.searchNotifications,
  getNotificationPreferences: state.getNotificationPreferences,
  updateNotificationPreferences: state.updateNotificationPreferences,
  muteNotifications: state.muteNotifications,
  unmuteNotifications: state.unmuteNotifications,
  getNotificationSettings: state.getNotificationSettings,
  clearAllNotifications: state.clearAllNotifications,
  addNotification: state.addNotification,
  updateNotificationInList: state.updateNotificationInList,
  removeNotificationFromList: state.removeNotificationFromList,
  setFilters: state.setFilters,
  clearError: state.clearError,
  reset: state.reset,
}));

export default useNotificationsStore;