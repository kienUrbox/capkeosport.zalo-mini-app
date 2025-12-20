import { api } from './index';
import {
  Notification,
  NotificationStats,
  NotificationType,
  NotificationPriority,
  NotificationQueryParams,
  ApiResponse,
  PaginatedApiResponse
} from '../../types/api.types';

export class NotificationsService {
  /**
   * Get user notifications with pagination
   */
  static async getUserNotifications(params?: NotificationQueryParams): Promise<PaginatedApiResponse<Notification>> {
    return api.get<Notification>('/notifications', { params });
  }

  /**
   * Get unread notifications
   */
  static async getUnreadNotifications(limit = 20): Promise<PaginatedApiResponse<Notification>> {
    return api.get<Notification>('/notifications', {
      params: {
        unreadOnly: true,
        limit
      }
    });
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<ApiResponse<{
    unreadCount: number;
    unreadByType: Record<NotificationType, number>;
  }>> {
    return api.get<any>('/notifications/unread-count');
  }

  /**
   * Get notification statistics for current user
   */
  static async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    return api.get<NotificationStats>('/notifications/stats');
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<ApiResponse<void>> {
    return api.post<void>(`/notifications/${id}/read`);
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<ApiResponse<{
    markedCount: number;
    message: string;
  }>> {
    return api.post<any>('/notifications/read-all');
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/notifications/${id}`);
  }

  /**
   * Mark multiple notifications as read
   */
  static async markMultipleAsRead(notificationIds: string[]): Promise<ApiResponse<{
    markedCount: number;
  }>> {
    return api.post<any>('/notifications/mark-multiple-read', {
      notificationIds
    });
  }

  /**
   * Delete multiple notifications
   */
  static async deleteMultipleNotifications(notificationIds: string[]): Promise<ApiResponse<{
    deletedCount: number;
  }>> {
    return api.post<any>('/notifications/delete-multiple', {
      notificationIds
    });
  }

  /**
   * Get notifications by type
   */
  static async getNotificationsByType(
    type: NotificationType,
    params?: Omit<NotificationQueryParams, 'type'>
  ): Promise<PaginatedApiResponse<Notification>> {
    return api.get<Notification>('/notifications', {
      params: {
        type,
        ...params
      }
    });
  }

  /**
   * Get notifications by priority
   */
  static async getNotificationsByPriority(
    priority: NotificationPriority,
    params?: Omit<NotificationQueryParams, 'priority'>
  ): Promise<PaginatedApiResponse<Notification>> {
    return api.get<Notification>('/notifications', {
      params: {
        priority,
        ...params
      }
    });
  }

  /**
   * Get recent notifications
   */
  static async getRecentNotifications(limit = 10): Promise<PaginatedApiResponse<Notification>> {
    return api.get<Notification>('/notifications', {
      params: {
        limit,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      }
    });
  }

  /**
   * Get high priority notifications
   */
  static async getHighPriorityNotifications(): Promise<PaginatedApiResponse<Notification>> {
    return this.getNotificationsByPriority(NotificationPriority.HIGH);
  }

  /**
   * Get urgent notifications
   */
  static async getUrgentNotifications(): Promise<PaginatedApiResponse<Notification>> {
    return this.getNotificationsByPriority(NotificationPriority.URGENT);
  }

  /**
   * Search notifications
   */
  static async searchNotifications(
    query: string,
    params?: NotificationQueryParams
  ): Promise<PaginatedApiResponse<Notification>> {
    return api.get<Notification>('/notifications/search', {
      params: {
        query,
        ...params
      }
    });
  }

  /**
   * Create custom notification (admin only)
   */
  static async createNotification(notification: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: NotificationPriority;
    actionUrl?: string;
    actionText?: string;
    expiresAt?: string;
  }): Promise<ApiResponse<Notification>> {
    return api.post<Notification>('/notifications', notification);
  }

  /**
   * Send bulk notifications (admin only)
   */
  static async sendBulkNotification(notifications: {
    userIds: string[];
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: NotificationPriority;
    actionUrl?: string;
    actionText?: string;
    expiresAt?: string;
  }): Promise<ApiResponse<{
    sentCount: number;
    failedCount: number;
  }>> {
    return api.post<any>('/notifications/bulk', notifications);
  }

  /**
   * Get notification preferences
   */
  static async getNotificationPreferences(): Promise<ApiResponse<{
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
  }>> {
    return api.get<any>('/notifications/preferences');
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    inAppNotifications?: boolean;
    types?: Partial<Record<NotificationType, {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
    }>>;
    quietHours?: {
      enabled?: boolean;
      start?: string;
      end?: string;
    };
  }): Promise<ApiResponse<any>> {
    return api.patch<any>('/notifications/preferences', preferences);
  }

  /**
   * Mute notifications for a period
   */
  static async muteNotifications(duration: number, unit: 'minutes' | 'hours' | 'days' = 'hours'): Promise<ApiResponse<void>> {
    return api.post<void>('/notifications/mute', {
      duration,
      unit
    });
  }

  /**
   * Unmute notifications
   */
  static async unmuteNotifications(): Promise<ApiResponse<void>> {
    return api.post<void>('/notifications/unmute');
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<ApiResponse<{
    isMuted: boolean;
    mutedUntil?: string;
    preferences: any;
  }>> {
    return api.get<any>('/notifications/settings');
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications(): Promise<ApiResponse<{
    deletedCount: number;
  }>> {
    return api.delete<void>('/notifications/clear-all');
  }

  /**
   * Get notification analytics (admin only)
   */
  static async getNotificationAnalytics(): Promise<ApiResponse<{
    totalNotifications: number;
    sentToday: number;
    sentThisWeek: number;
    sentThisMonth: number;
    openRate: number;
    clickRate: number;
    byType: Record<NotificationType, {
      count: number;
      openRate: number;
      clickRate: number;
    }>;
    byPriority: Record<NotificationPriority, {
      count: number;
      openRate: number;
      clickRate: number;
    }>;
  }>> {
    return api.get<any>('/notifications/analytics');
  }

  /**
   * Export notifications to CSV
   */
  static async exportNotifications(params?: NotificationQueryParams): Promise<Blob> {
    const response = await api.get<Blob>('/notifications/export', {
      params,
      responseType: 'blob'
    });
    return response.data as Blob;
  }
}

export default NotificationsService;