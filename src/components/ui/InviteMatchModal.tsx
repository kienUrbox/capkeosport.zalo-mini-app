import React, { useState } from 'react';
import { Icon, Button, Input } from './';
import { TeamAvatar } from './TeamAvatar';
import { MatchService } from '@/services/api/services';
import { appRoutes } from '@/utils/navigation';
import { useNavigate } from 'react-router-dom';

export interface MyTeamInfo {
  id: string;
  name: string;
  logo?: string;
}

export interface InviteMatchModalProps {
  isOpen: boolean;
  matchId: string;
  myTeam: MyTeamInfo;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * InviteMatchModal Component
 *
 * Modal for scheduling a matched team invitation.
 * Shows when user clicks "View Match" after a successful swipe match.
 *
 * Features:
 * - View match details
 * - Send invitation to opponent team
 * - Navigate to match detail after sending
 */
export const InviteMatchModal: React.FC<InviteMatchModalProps> = ({
  isOpen,
  matchId,
  myTeam,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendInvite = async () => {
    setIsSending(true);
    setError(null);

    try {
      const response = await MatchService.sendInvitation(matchId, {
        message: message || 'Chào đối thủ, hãy cùng lên lịch đấu nhé!',
      });

      if (response.success) {
        onSuccess();
        // Navigate to match detail after sending invitation
        navigate(appRoutes.matchDetail(matchId));
      } else {
        setError(response.error?.message || 'Gửi lời mời thất bại');
      }
    } catch (err: any) {
      console.error('Send invitation error:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSending(false);
    }
  };

  const handleViewMatch = () => {
    onClose();
    navigate(appRoutes.matchDetail(matchId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Mời đối đấu
          </h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Team Display */}
        <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="size-16 rounded-full border-2 border-primary overflow-hidden bg-surface-dark">
              {myTeam.logo ? (
                <img src={myTeam.logo} alt={myTeam.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-xl">
                  {myTeam.name?.charAt(0) || 'T'}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-primary mt-1">Đội của bạn</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-10 rounded-full bg-surface-dark border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-500">VS</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-16 rounded-full border-2 border-primary overflow-hidden bg-surface-dark">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                ?
              </div>
            </div>
            <span className="text-xs font-medium text-primary mt-1">Đối thủ</span>
          </div>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Lời nhắn (tùy chọn)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập lời nhắn cho đối thủ..."
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {message.length}/200
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full py-3.5"
            onClick={handleSendInvite}
            disabled={isSending}
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="refresh" className="animate-spin" />
                Đang gửi...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="send" />
                Gửi lời mời
              </span>
            )}
          </Button>

          <button
            onClick={handleViewMatch}
            className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            Xem chi tiết kèo
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Icon name="info" className="text-blue-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                Gửi lời mời chốt kèo
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Sau khi gửi lời mời, đối thủ sẽ nhận được thông báo và có thể chấp nhận để lên lịch đấu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMatchModal;
