import { api } from './index';
import type { PhoneInvite, ApiResponse } from '@/types/api.types';

/**
 * Phone Invite Service
 *
 * Handles phone-based team invitations (inviting users via phone number to join teams)
 */
class PhoneInviteService {
  private readonly basePath = '/phone-invites';

  /**
   * Get all pending phone invitations for current user
   */
  async getMyInvites(): Promise<ApiResponse<{ invites: PhoneInvite[] }>> {
    try {
      const response = await api.get(`${this.basePath}/my-invites`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'GET_MY_INVITES_ERROR',
          message: error.response?.data?.message || 'Không thể tải lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Respond to a phone invitation (accept or decline)
   */
  async respondInvite(
    inviteId: string,
    action: 'accept' | 'decline'
  ): Promise<ApiResponse<{ team: any; message?: string }>> {
    try {
      const response = await api.post(`${this.basePath}/${inviteId}/respond`, { action });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'RESPOND_INVITE_ERROR',
          message: error.response?.data?.message || 'Không thể phản hồi lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Send a phone invitation to invite a user to join a team
   */
  async sendPhoneInvite(data: {
    teamId: string;
    phone: string;
    message?: string;
  }): Promise<ApiResponse<{ invite: PhoneInvite }>> {
    try {
      const response = await api.post(`${this.basePath}/send`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'SEND_PHONE_INVITE_ERROR',
          message: error.response?.data?.message || 'Không thể gửi lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Get invitation details by ID
   */
  async getInviteDetails(inviteId: string): Promise<ApiResponse<{ invite: PhoneInvite }>> {
    try {
      const response = await api.get(`${this.basePath}/${inviteId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'GET_INVITE_DETAILS_ERROR',
          message: error.response?.data?.message || 'Không thể tải thông tin lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Cancel a pending phone invitation
   */
  async cancelInvite(inviteId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`${this.basePath}/${inviteId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'CANCEL_INVITE_ERROR',
          message: error.response?.data?.message || 'Không thể hủy lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Resend an expired or failed phone invitation
   */
  async resendInvite(inviteId: string): Promise<ApiResponse<{ invite: PhoneInvite }>> {
    try {
      const response = await api.post(`${this.basePath}/${inviteId}/resend`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'RESEND_INVITE_ERROR',
          message: error.response?.data?.message || 'Không thể gửi lại lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }
}

export default new PhoneInviteService();
