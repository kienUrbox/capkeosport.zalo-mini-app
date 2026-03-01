import React from 'react';
import { Icon, Button } from '@/components/ui';
import { TeamAvatar } from '@/components/ui';
import type { Notification } from '@/types/api.types';
import { NotificationType } from '@/types/api.types';
import { normalizeInvitation } from '@/types/invitation.types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * InvitationSection Props
 */
export interface InvitationSectionProps {
  invitations: Notification[];  // Raw notifications from store
  isLoading: boolean;
  isProcessing?: boolean;  // Loading state for accept/decline actions
  onAccept: (inviteId: string) => Promise<void>;
  onDecline: (inviteId: string) => Promise<void>;
  onViewTeam: (teamId: string) => void;
  onViewAll: () => void;
}

/**
 * InvitationSection Component
 *
 * Compact section hiển thị lời mời tham gia đội bóng:
 * - Layout gọn gàng, chiếm ít không gian
 * - Hiển thị tối đa 1 lời mời đầu tiên
 * - Button "Xem tất cả" để xem danh sách đầy đủ
 *
 * @example
 * ```tsx
 * <InvitationSection
 *   invitations={pendingInvitations}
 *   isLoading={isLoading}
 *   onAccept={acceptInvite}
 *   onDecline={declineInvite}
 *   onViewTeam={(teamId) => navigate(appRoutes.teamDetail(teamId))}
 *   onViewAll={() => navigate(appRoutes.myInvites)}
 * />
 * ```
 */
export const InvitationSection: React.FC<InvitationSectionProps> = ({
  invitations,
  isLoading,
  isProcessing = false,
  onAccept,
  onDecline,
  onViewTeam,
  onViewAll,
}) => {
  // Filter and normalize invitations - chỉ lấy 1 cái đầu tiên
  const firstInvitation = invitations
    .filter(n => n.type === NotificationType.TEAM_INVITATION)
    .map(normalizeInvitation)
    .filter((inv): inv is Exclude<typeof inv, null> => inv !== null)[0];

  // Don't render if no invitations and not loading
  if (!isLoading && !firstInvitation) {
    return null;
  }

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: vi });
    } catch {
      return 'vừa xong';
    }
  };

  return (
    <section className="px-5">
      {/* Compact Card */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-4 border border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Lời mời tham gia
            </h3>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Xem tất cả
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        ) : firstInvitation ? (
          <div className="flex items-center gap-3">
            {/* Team Avatar */}
            <button
              onClick={() => onViewTeam(firstInvitation.teamId)}
              className="shrink-0"
            >
              {firstInvitation.teamLogo ? (
                <TeamAvatar src={firstInvitation.teamLogo} size="sm" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-white/10">
                  {firstInvitation.teamName?.charAt(0).toUpperCase() || 'T'}
                </div>
              )}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <button
                onClick={() => onViewTeam(firstInvitation.teamId)}
                className="text-left w-full"
              >
                <p className="text-xs text-gray-500 mb-0.5">
                  {firstInvitation.title || 'Lời mời vào đội'}
                </p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {firstInvitation.teamName}
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {formatTimeAgo(firstInvitation.createdAt)}
                </p>
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => onAccept(firstInvitation.inviteId)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Chấp nhận'
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onDecline(firstInvitation.inviteId)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="h-3 w-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                  <Icon name="close" className="text-sm" />
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default InvitationSection;
