import { useCallback, useEffect } from 'react';
import { Notification, NotificationType, NotificationPriority } from '../types/api.types';
import {
  useNotificationsStore,
  useNotifications,
  useUnreadNotifications,
  useNotificationStats,
  useUnreadCount,
  useNotificationsLoading,
  useNotificationsError,
  useNotificationsPagination,
  useNotificationsFilters,
  useNotificationPreferences,
  useNotificationMuteStatus,
  useNotificationsActions
} from '../stores';

// Main notifications hook that provides both state and actions
export const useNotifications = () => {
  const notificationsStore = useNotificationsStore();

  return {
    ...notificationsStore,
  };
};

// Unread notifications hook
export const useUnreadNotifications = (limit = 20) => {
  const unreadNotifications = useUnreadNotifications();
  const unreadCount = useUnreadCount();
  const { isLoading } = useNotificationsLoading();
  const { error } = useNotificationsError();
  const { fetchUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead } = useNotificationsActions();

  // Load unread notifications
  const loadUnreadNotifications = useCallback(async (limitValue = limit) => {
    await fetchUnreadNotifications(limitValue);
  }, [fetchUnreadNotifications, limit]);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    await getUnreadCount();
  }, [getUnreadCount]);

  // Mark notification as read
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    const success = await markAsRead(notificationId);
    if (success) {
      await refreshUnreadCount();
    }
    return success;
  }, [markAsRead, refreshUnreadCount]);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    const success = await markAllAsRead();
    if (success) {
      await refreshUnreadCount();
    }
    return success;
  }, [markAllAsRead, refreshUnreadCount]);

  // Auto-load unread notifications on mount
  useEffect(() => {
    loadUnreadNotifications(limit);
  }, [loadUnreadNotifications, limit]);

  return {
    unreadNotifications,
    unreadCount,
    isLoading,
    error,
    loadUnreadNotifications,
    refreshUnreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
};

// Notification management hook
export const useNotificationManagement = (params?: any) => {
  const notifications = useNotifications();
  const { isLoading, isUpdating } = useNotificationsLoading();
  const { error } = useNotificationsError();
  const pagination = useNotificationsPagination();
  const { fetchNotifications, deleteNotification, deleteMultipleNotifications, searchNotifications } = useNotificationsActions();

  // Load notifications
  const loadNotifications = useCallback(async (params?: any) => {
    await fetchNotifications(params);
  }, [fetchNotifications]);

  // Delete notification
  const handleDeleteNotification = useCallback(async (notificationId: string) => {
    return await deleteNotification(notificationId);
  }, [deleteNotification]);

  // Delete multiple notifications
  const handleDeleteMultipleNotifications = useCallback(async (notificationIds: string[]) => {
    return await deleteMultipleNotifications(notificationIds);
  }, [deleteMultipleNotifications]);

  // Search notifications
  const searchNotificationsByQuery = useCallback(async (query: string, searchParams?: any) => {
    await searchNotifications(query, searchParams);
  }, [searchNotifications]);

  // Load more notifications (pagination)
  const loadMoreNotifications = useCallback(async () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      await fetchNotifications({ ...params, page: nextPage });
    }
  }, [pagination, params, fetchNotifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    return fetchNotifications(params);
  }, [params, fetchNotifications]);

  // Auto-load notifications on mount
  useEffect(() => {
    loadNotifications(params);
  }, [loadNotifications, params]);

  return {
    notifications,
    isLoading,
    isUpdating,
    error,
    pagination,
    loadNotifications,
    deleteNotification: handleDeleteNotification,
    deleteMultipleNotifications: handleDeleteMultipleNotifications,
    searchNotifications: searchNotificationsByQuery,
    loadMoreNotifications,
    refreshNotifications,
    hasMore: pagination.page < pagination.totalPages,
  };
};

// Notification types hook
export const useNotificationsByType = (type: NotificationType, params?: any) => {
  const notifications = useNotifications();
  const { isLoading } = useNotificationsLoading();
  const { error } = useNotificationsError();
  const { getNotificationsByType } = useNotificationsActions();

  // Load notifications by type
  const loadNotificationsByType = useCallback(async (type: NotificationType, loadParams?: any) => {
    await getNotificationsByType(type, loadParams);
  }, [getNotificationsByType]);

  // Auto-load notifications when type or params change
  useEffect(() => {
    loadNotificationsByType(type, params);
  }, [type, params, loadNotificationsByType]);

  return {
    notifications,
    isLoading,
    error,
    loadNotificationsByType,
  };
};

// Notification priorities hook
export const useNotificationsByPriority = (priority: NotificationPriority, params?: any) => {
  const notifications = useNotifications();
  const { isLoading } = useNotificationsLoading();
  const { error } = useNotificationsError();
  const { getNotificationsByPriority } = useNotificationsActions();

  // Load notifications by priority
  const loadNotificationsByPriority = useCallback(async (priority: NotificationPriority, loadParams?: any) => {
    await getNotificationsByPriority(priority, loadParams);
  }, [getNotificationsByPriority]);

  // Auto-load notifications when priority or params change
  useEffect(() => {
    loadNotificationsByPriority(priority, params);
  }, [priority, params, loadNotificationsByPriority]);

  return {
    notifications,
    isLoading,
    error,
    loadNotificationsByPriority,
  };
};

// Notification statistics hook
export const useNotificationStatistics = () => {
  const notificationStats = useNotificationStats();
  const { isLoading } = useNotificationsLoading();
  const { getNotificationStats } = useNotificationsActions();

  // Load notification statistics
  const loadStats = useCallback(async () => {
    await getNotificationStats();
  }, [getNotificationStats]);

  // Auto-load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Get notification count by type
  const getCountByType = useCallback((type: NotificationType) => {
    if (!notificationStats?.notificationsByType) return 0;
    return notificationStats.notificationsByType[type] || 0;
  }, [notificationStats]);

  // Get unread count by type
  const getUnreadCountByType = useCallback((type: NotificationType) => {
    if (!notificationStats?.unreadByType) return 0;
    return notificationStats.unreadByType[type] || 0;
  }, [notificationStats]);

  // Get total notifications
  const getTotalCount = useCallback(() => {
    return notificationStats?.total || 0;
  }, [notificationStats]);

  // Get total unread
  const getTotalUnreadCount = useCallback(() => {
    return notificationStats?.unread || 0;
  }, [notificationStats]);

  return {
    stats: notificationStats,
    isLoading,
    loadStats,
    getCountByType,
    getUnreadCountByType,
    getTotalCount,
    getTotalUnreadCount,
  };
};

// Notification preferences hook
export const useNotificationPreferences = () => {
  const preferences = useNotificationPreferences();
  const { isLoading } = useNotificationsLoading();
  const { error } = useNotificationsError();
  const { getNotificationPreferences, updateNotificationPreferences } = useNotificationsActions();

  // Load preferences
  const loadPreferences = useCallback(async () => {
    await getNotificationPreferences();
  }, [getNotificationPreferences]);

  // Update preferences
  const handleUpdatePreferences = useCallback(async (newPreferences: any) => {
    return await updateNotificationPreferences(newPreferences);
  }, [updateNotificationPreferences]);

  // Auto-load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    isLoading,
    error,
    loadPreferences,
    updatePreferences: handleUpdatePreferences,
  };
};

// Notification mute status hook
export const useNotificationMuteStatus = () => {
  const { isMuted, mutedUntil } = useNotificationMuteStatus();
  const { isLoading } = useNotificationsLoading();
  const { muteNotifications, unmuteNotifications, getNotificationSettings } = useNotificationsActions();

  // Mute notifications
  const handleMuteNotifications = useCallback(async (duration: number, unit: 'minutes' | 'hours' | 'days' = 'hours') => {
    return await muteNotifications(duration, unit);
  }, [muteNotifications]);

  // Unmute notifications
  const handleUnmuteNotifications = useCallback(async () => {
    return await unmuteNotifications();
  }, [unmuteNotifications]);

  // Load settings
  const loadSettings = useCallback(async () => {
    await getNotificationSettings();
  }, [getNotificationSettings]);

  // Check if mute is still active
  const isMuteActive = useCallback(() => {
    if (!isMuted || !mutedUntil) return false;
    return new Date(mutedUntil) > new Date();
  }, [isMuted, mutedUntil]);

  // Get mute remaining time
  const getMuteRemainingTime = useCallback(() => {
    if (!isMuted || !mutedUntil) return null;
    const now = new Date();
    const muteEnd = new Date(mutedUntil);
    const remaining = muteEnd.getTime() - now.getTime();

    if (remaining <= 0) return null;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }, [isMuted, mutedUntil]);

  // Auto-load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    isMuted,
    mutedUntil,
    isLoading,
    muteNotifications: handleMuteNotifications,
    unmuteNotifications: handleUnmuteNotifications,
    loadSettings,
    isMuteActive,
    getMuteRemainingTime,
  };
};

// Real-time notifications hook (for WebSocket integration)
export const useRealTimeNotifications = () => {
  const { addNotification, updateNotificationInList, removeNotificationFromList } = useNotificationsActions();

  // Handle new notification
  const handleNewNotification = useCallback((notification: Notification) => {
    addNotification(notification);
  }, [addNotification]);

  // Handle notification update
  const handleNotificationUpdate = useCallback((updatedNotification: Notification) => {
    updateNotificationInList(updatedNotification);
  }, [updateNotificationInList]);

  // Handle notification deletion
  const handleNotificationDeletion = useCallback((notificationId: string) => {
    removeNotificationFromList(notificationId);
  }, [removeNotificationFromList]);

  // Setup WebSocket connection (placeholder - implement based on your WebSocket setup)
  const setupWebSocketConnection = useCallback(() => {
    // WebSocket setup would go here
    console.log('Setting up WebSocket connection for real-time notifications');
  }, []);

  // Cleanup WebSocket connection
  const cleanupWebSocketConnection = useCallback(() => {
    // WebSocket cleanup would go here
    console.log('Cleaning up WebSocket connection');
  }, []);

  return {
    handleNewNotification,
    handleNotificationUpdate,
    handleNotificationDeletion,
    setupWebSocketConnection,
    cleanupWebSocketConnection,
  };
};

// Notification filters hook
export const useNotificationFilters = () => {
  const filters = useNotificationsFilters();
  const { setFilters, clearError } = useNotificationsActions();

  // Update filters
  const updateFilters = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Filter by type
  const filterByType = useCallback((type: NotificationType) => {
    updateFilters({ type });
  }, [updateFilters]);

  // Filter by priority
  const filterByPriority = useCallback((priority: NotificationPriority) => {
    updateFilters({ priority });
  }, [updateFilters]);

  // Filter by read status
  const filterByReadStatus = useCallback((unreadOnly: boolean) => {
    updateFilters({ unreadOnly: unreadOnly });
  }, [updateFilters]);

  // Clear filters
  const clearFilters = useCallback(() => {
    updateFilters({
      type: undefined,
      priority: undefined,
      unreadOnly: undefined,
    });
  }, [updateFilters]);

  return {
    filters,
    updateFilters,
    filterByType,
    filterByPriority,
    filterByReadStatus,
    clearFilters,
  };
};

export default useNotifications;