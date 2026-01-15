import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, TeamAvatar } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import type { TeamInvite } from '@/types/api.types';

/**
 * InviteCard Component
 *
 * Display card for received team invitations.
 */
export interface InviteCardProps {
  invite: TeamInvite;
  onAccept?: () => void;
  onDecline?: () => void;
  onViewTeam?: () => void;
  isLoading?: boolean;
}

export const InviteCard: React.FC<InviteCardProps> = ({
  invite,
  onAccept,
  onDecline,
  onViewTeam,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Status badge colors
  const getStatusColor = (status: TeamInvite['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'accepted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'declined':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'expired':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Status text
  const getStatusText = (status: TeamInvite['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'accepted':
        return 'Đã chấp nhận';
      case 'declined':
        return 'Đã từ chối';
      case 'expired':
        return 'Hết hạn';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const isPending = invite.status === 'pending';
  const isAccepted = invite.status === 'accepted';

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5">
      {/* Header - Team Info */}
      <div
        className="flex items-start gap-3 mb-3 cursor-pointer"
        onClick={() => navigate(appRoutes.teamDetail(invite.teamId))}
      >
        <TeamAvatar
          src={invite.teamLogo}
          size="lg"
          className="shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {invite.teamName}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(invite.status)}`}>
              {getStatusText(invite.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {invite.inviterName} đã mời bạn tham gia
          </p>
          {invite.teamLevel && (
            <p className="text-xs text-gray-400 mt-1">
              {invite.teamLevel} {invite.teamGender && `• ${invite.teamGender === 'MALE' ? 'Nam' : invite.teamGender === 'FEMALE' ? 'Nữ' : 'Mixed'}`}
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      {(invite.position || invite.role || invite.customMessage) && (
        <div className="space-y-1 mb-3 px-2">
          {invite.role && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Vai trò:</span> {invite.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
            </p>
          )}
          {invite.position && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Vị trí:</span> {invite.position}
            </p>
          )}
          {invite.jerseyNumber && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Số áo:</span> {invite.jerseyNumber}
            </p>
          )}
          {invite.customMessage && (
            <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-2">
              "{invite.customMessage}"
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {isPending && !isLoading && (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onDecline}
            className="flex-1"
          >
            Từ chối
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={onAccept}
            className="flex-1"
          >
            Chấp nhận
          </Button>
        </div>
      )}

      {isPending && isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-pulse text-gray-400 text-sm">Đang xử lý...</div>
        </div>
      )}

      {isAccepted && (
        <button
          onClick={() => navigate(appRoutes.teamDetail(invite.teamId))}
          className="w-full text-center text-sm text-primary font-medium py-2 rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors"
        >
          Xem đội
        </button>
      )}

      {/* Expires info */}
      {invite.expiresAt && isPending && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Hết hạn: {new Date(invite.expiresAt).toLocaleString('vi-VN')}
        </p>
      )}
    </div>
  );
};

/**
 * SentInviteCard Component
 *
 * Display card for sent team invitations (admin view).
 */
export interface SentInviteCardProps {
  invite: TeamInvite;
  onCancel?: () => void;
  onResend?: () => void;
  isLoading?: boolean;
}

export const SentInviteCard: React.FC<SentInviteCardProps> = ({
  invite,
  onCancel,
  onResend,
  isLoading = false,
}) => {
  // Status badge colors
  const getStatusColor = (status: TeamInvite['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'accepted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'declined':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'expired':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Status text
  const getStatusText = (status: TeamInvite['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'accepted':
        return 'Đã chấp nhận';
      case 'declined':
        return 'Đã từ chối';
      case 'expired':
        return 'Hết hạn';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const isPending = invite.status === 'pending';
  const canCancel = isPending;
  const canResend = invite.status === 'expired' || invite.status === 'declined';

  // Calculate expiry
  const getTimeRemaining = () => {
    if (!invite.expiresAt) return null;
    const remaining = new Date(invite.expiresAt).getTime() - Date.now();
    if (remaining <= 0) return 'Đã hết hạn';
    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}p`;
    return `${minutes}p`;
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
              {getStatusText(invite.status)}
            </span>
            {invite.expiresAt && isPending && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Icon name="schedule" className="text-sm" />
                {getTimeRemaining()}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {invite.invitedPhone || 'Người dùng'}
          </h3>
          <p className="text-sm text-gray-500">
            {invite.position && `Vị trí: ${invite.position}`}
            {invite.position && invite.role && ' • '}
            {invite.role && `${invite.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}`}
          </p>
        </div>
      </div>

      {/* Custom message */}
      {invite.customMessage && (
        <div className="mb-3 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl">
          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
            "{invite.customMessage}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {canCancel && !isLoading && (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onCancel}
            className="flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Hủy lời mời
          </Button>
        )}
        {canResend && !isLoading && (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onResend}
            className="flex-1"
          >
            Gửi lại
          </Button>
        )}
        {isLoading && (
          <div className="flex-1 text-center text-sm text-gray-400 py-2">
            Đang xử lý...
          </div>
        )}
      </div>

      {/* Timestamp */}
      <p className="text-xs text-gray-400 text-center mt-3">
        Gửi: {new Date(invite.createdAt).toLocaleString('vi-VN')}
      </p>
    </div>
  );
};

export default InviteCard;
