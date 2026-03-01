import React from 'react';
import { Button, Icon, TeamAvatar } from '@/components/ui';
import type { NormalizedInvitation } from '@/types/invitation.types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * InvitationCard Props
 */
export interface InvitationCardProps {
  invitation: NormalizedInvitation;
  onAccept: () => void;
  onDecline: () => void;
  onViewTeam: () => void;
  isLoading?: boolean;
}

/**
 * InvitationCard Component
 *
 * Hiển thị card lời mời tham gia đội bóng với:
 * - Team logo/avatar (clickable để navigate)
 * - Team name (clickable để navigate)
 * - Message (nếu có)
 * - Time ago
 * - Action buttons: Chấp nhận, Từ chối
 *
 * @example
 * ```tsx
 * <InvitationCard
 *   invitation={normalizedInvitation}
 *   onAccept={() => handleAccept(invite.inviteId)}
 *   onDecline={() => handleDecline(invite.inviteId)}
 *   onViewTeam={() => navigate(appRoutes.teamDetail(invite.teamId))}
 * />
 * ```
 */
export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
  onViewTeam,
  isLoading = false,
}) => {
  // Format time ago for invitations
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: vi });
    } catch {
      return 'vừa xong';
    }
  };

  return (
    <div className="min-w-[280px] w-[280px] shrink-0">
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-3">
        {/* Team Info - Clickable to navigate */}
        <button
          onClick={onViewTeam}
          className="flex items-center gap-3 w-full text-left group"
        >
          {invitation.teamLogo ? (
            <TeamAvatar src={invitation.teamLogo} size="md" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base border-2 border-white dark:border-white/10 shrink-0">
              {invitation.teamName?.charAt(0).toUpperCase() || 'T'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {invitation.teamName}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {invitation.title || 'Lời mời vào đội'}
            </p>
          </div>
          <Icon name="chevron_right" className="text-gray-300 group-hover:text-gray-400 transition-colors" />
        </button>

        {/* Message */}
        {invitation.message && (
          <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2 px-1">
            "{invitation.message}"
          </p>
        )}

        {/* Time */}
        <p className="text-[10px] text-gray-400 px-1">
          {formatTimeAgo(invitation.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onAccept();
            }}
            disabled={isLoading}
          >
            Chấp nhận
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDecline();
            }}
            disabled={isLoading}
          >
            Từ chối
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
