import { api } from './index';

// Types
export interface Notification {
  id: string;
  type: 'team_invite' | 'match_invite' | 'match_update' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

/**
 * Notification Service
 *
 * API methods for notifications
 */
export const NotificationService = {
  /**
   * Get notifications
   */
  getNotifications: async (params?: { unreadOnly?: boolean; type?: string }) => {
    return api.get<Notification[]>('/notifications', { params });
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string) => {
    return api.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    return api.post('/notifications/read-all');
  },

  /**
   * Get notification stats
   */
  getNotificationStats: async () => {
    return api.get<NotificationStats>('/notifications/stats');
  },
};
