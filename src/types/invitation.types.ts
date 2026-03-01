import type { Notification } from './api.types';
import { NotificationType } from './api.types';

/**
 * Team Phone Invitation Data
 *
 * Data structure cho TEAM_PHONE_INVITATION notification
 * Được trả về từ API notification với type = "team_phone_invitation"
 *
 * @example
 * {
 *   "id": "noti-123",
 *   "type": "team_phone_invitation",
 *   "title": "Lời mời vào đội",
 *   "message": "zô chơi nào",
 *   "data": {
 *     "teamId": "6ce60c9b-...",
 *     "inviteId": "cd0a604f-...",
 *     "teamName": "Xuan FC",
 *     "teamLogo": "https://..."
 *   }
 * }
 */
export interface TeamPhoneInvitationData {
  teamId: string;
  inviteId: string;
  teamName: string;
  teamLogo?: string;
  inviterName?: string;
}

/**
 * Normalized Invitation Data
 *
 * Chuẩn hóa data từ Notification thành format dễ sử dụng
 * - inviteId được dùng để gọi API respond (accept/decline)
 * - teamId được dùng để navigate đến team detail
 */
export interface NormalizedInvitation {
  id: string;           // notification.id - unique identifier
  inviteId: string;     // notification.data.inviteId - dùng để respond API
  teamId: string;       // notification.data.teamId - dùng để navigate
  teamName: string;     // notification.data.teamName
  teamLogo?: string;    // notification.data.teamLogo
  inviterName?: string; // notification.data.inviterName
  title?: string;       // notification.title - ví dụ: "Lời mời vào đội"
  message?: string;     // notification.message
  createdAt: string;    // notification.createdAt
  isRead: boolean;      // notification.isRead
}

/**
 * Type guard để check notification có phải là TEAM_PHONE_INVITATION không
 */
export function isTeamPhoneInvitation(
  notification: Notification
): notification is Notification & { data: TeamPhoneInvitationData } {
  return notification.type === NotificationType.TEAM_INVITATION;
}

/**
 * Normalize invitation từ Notification thành NormalizedInvitation
 *
 * @param notification - Raw notification from API
 * @returns NormalizedInvitation hoặc null nếu không phải team invitation
 */
export function normalizeInvitation(
  notification: Notification
): NormalizedInvitation | null {
  // Check if this is a team phone invitation
  if (!isTeamPhoneInvitation(notification)) {
    return null;
  }

  // Validate required fields
  if (!notification.data?.inviteId || !notification.data?.teamId) {
    console.warn('[normalizeInvitation] Missing required fields:', notification.data);
    return null;
  }

  return {
    id: notification.id,
    inviteId: notification.data.inviteId,
    teamId: notification.data.teamId,
    teamName: notification.data.teamName || 'Đội bóng',
    teamLogo: notification.data.teamLogo,
    inviterName: notification.data.inviterName,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
    isRead: notification.isRead,
  };
}

/**
 * Filter và normalize list invitations từ danh sách notifications
 *
 * @param notifications - Raw notifications from store
 * @returns Array of NormalizedInvitation
 */
export function normalizeInvitations(
  notifications: Notification[]
): NormalizedInvitation[] {
  return notifications
    .map(normalizeInvitation)
    .filter((inv): inv is NormalizedInvitation => inv !== null);
}
