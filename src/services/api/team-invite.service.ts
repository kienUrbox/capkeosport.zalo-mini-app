import { api } from './index';
import type {
  ApiResponse,
  InviteTokenResponse,
  CreateInviteTokenDto,
  PhoneInviteResponse,
  InviteByPhoneDto,
  PaginatedInvites,
  RespondInviteDto,
  RespondInviteResponse,
  InviteStatus,
} from '@/types/api.types';

/**
 * Team Invite Service
 *
 * Handles team invitation operations:
 * - QR Code invite tokens
 * - Phone-based invitations
 * - View sent/received invitations
 * - Accept/Decline/Cancel/Resend invitations
 */
class TeamInviteService {
  private readonly basePath = '/team-invites';
  private readonly teamsPath = '/teams';

  /**
   * Create QR Code invite token (Admin only)
   * POST /teams/:teamId/invite-token
   */
  async createInviteToken(
    teamId: string,
    data?: CreateInviteTokenDto
  ): Promise<ApiResponse<InviteTokenResponse>> {
    try {
      const response = await api.post(`${this.teamsPath}/${teamId}/invite-token`, data);
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'CREATE_INVITE_TOKEN_ERROR',
          message: error.response?.data?.message || 'Không thể tạo mã mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Send phone invitation (Admin only)
   * POST /team-invites/teams/:teamId/invite-by-phone
   */
  async inviteByPhone(
    teamId: string,
    data: InviteByPhoneDto
  ): Promise<ApiResponse<PhoneInviteResponse>> {
    try {
      const response = await api.post(`${this.basePath}/teams/${teamId}/invite-by-phone`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'INVITE_BY_PHONE_ERROR',
          message: error.response?.data?.message || 'Không thể gửi lời mời',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Get all invitations received by current user
   * GET /team-invites/my-invites
   */
  async getMyInvites(params?: {
    page?: number;
    limit?: number;
    status?: InviteStatus;
  }): Promise<ApiResponse<PaginatedInvites>> {
    try {
      const response = await api.get(`${this.basePath}/my-invites`, { params });
      return response;
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
   * Get all invitations sent by team admin (Admin only)
   * GET /team-invites/teams/:teamId/sent-invites
   */
  async getSentInvites(
    teamId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: InviteStatus;
    }
  ): Promise<ApiResponse<PaginatedInvites>> {
    try {
      const response = await api.get(`${this.basePath}/teams/${teamId}/sent-invites`, { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'GET_SENT_INVITES_ERROR',
          message: error.response?.data?.message || 'Không thể tải lời mời đã gửi',
          details: error.response?.data?.details,
        },
      };
    }
  }

  /**
   * Respond to invitation (Accept or Decline)
   * POST /team-invites/respond
   */
  async respondToInvite(data: RespondInviteDto): Promise<ApiResponse<RespondInviteResponse>> {
    try {
      const response = await api.post(`${this.basePath}/respond`, data);
      return response;
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
   * Cancel pending invitation (Admin only)
   * DELETE /team-invites/:inviteId/cancel
   */
  async cancelInvite(inviteId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`${this.basePath}/${inviteId}/cancel`);
      return response;
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
   * Resend expired or failed invitation (Admin only)
   * POST /team-invites/:inviteId/resend
   */
  async resendInvite(inviteId: string): Promise<ApiResponse<PhoneInviteResponse>> {
    try {
      const response = await api.post(`${this.basePath}/${inviteId}/resend`);
      return response;
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

export default new TeamInviteService();
