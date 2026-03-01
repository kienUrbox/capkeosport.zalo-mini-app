import { useState, useCallback } from 'react';
import teamInviteService from '@/services/api/team-invite.service';
import { toast } from '@/utils/toast';

/**
 * Action type for responding to team invitations
 */
export type InviteAction = 'accept' | 'decline';

/**
 * Hook options for invitation actions
 */
export interface UseInvitationActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onRefresh?: () => Promise<void>;  // Refresh notifications list after action
}

/**
 * Return type for useInvitationActions hook
 */
export interface UseInvitationActionsReturn {
  acceptInvite: (inviteId: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
  isProcessing: boolean;
}

/**
 * useInvitationActions Hook
 *
 * Hook quản lý logic xử lý lời mời tham gia đội bóng:
 * - Chấp nhận lời mời (accept)
 * - Từ chối lời mời (decline)
 * - Loading state tracking
 * - Error handling với toast notification
 *
 * Sử dụng TeamInviteService.respondToInvite() để gọi API
 * API endpoint: POST /team-invites/respond
 *
 * @example
 * ```tsx
 * const { acceptInvite, declineInvite, isProcessing } = useInvitationActions({
 *   onSuccess: () => {
 *     refresh(); // Refresh data sau khi action thành công
 *   },
 *   onError: (error) => {
 *     console.error('Action failed:', error);
 *   },
 * });
 * ```
 */
export function useInvitationActions(
  options?: UseInvitationActionsOptions
): UseInvitationActionsReturn {
  const [isProcessing, setIsProcessing] = useState(false);

  const acceptInvite = useCallback(async (inviteId: string) => {
    setIsProcessing(true);
    try {
      const response = await teamInviteService.respondToInvite({
        inviteId,
        action: 'accept',
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Không thể tham gia đội');
      }

      toast.success('Đã tham gia đội thành công!');

      // Refresh notifications list after successful action
      await options?.onRefresh?.();

      options?.onSuccess?.();
    } catch (error) {
      const err = error as Error;
      console.error('[useInvitationActions] Accept error:', err);
      toast.error(err.message || 'Không thể tham gia đội. Vui lòng thử lại.');
      options?.onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const declineInvite = useCallback(async (inviteId: string) => {
    setIsProcessing(true);
    try {
      const response = await teamInviteService.respondToInvite({
        inviteId,
        action: 'decline',
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Không thể từ chối lời mời');
      }

      toast.success('Đã từ chối lời mời');

      // Refresh notifications list after successful action
      await options?.onRefresh?.();

      options?.onSuccess?.();
    } catch (error) {
      const err = error as Error;
      console.error('[useInvitationActions] Decline error:', err);
      toast.error(err.message || 'Không thể từ chối lời mời. Vui lòng thử lại.');
      options?.onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  return {
    acceptInvite,
    declineInvite,
    isProcessing,
  };
}

export default useInvitationActions;
