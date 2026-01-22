import React, { useState } from 'react';
import { Icon, Button } from './';
import { TeamAvatar } from './TeamAvatar';
import { useMatchActions } from '@/stores/match.store';
import { PITCH_TYPE_VALUES } from '@/constants/design';

export interface OpponentTeamInfo {
  id: string;
  name: string;
  logo?: string;
  level?: string;
}

export interface RematchBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  myTeam: { id: string; name: string; logo?: string };
  opponentTeam: OpponentTeamInfo;
  onSuccess: () => void;
}

/**
 * RematchBottomSheet Component
 *
 * Bottom sheet for sending rematch invitation with date/time/pitch/notes.
 * Pattern follows InviteMatchModal + MatchRequestModal.
 */
export const RematchBottomSheet: React.FC<RematchBottomSheetProps> = ({
  isOpen,
  onClose,
  matchId,
  myTeam,
  opponentTeam,
  onSuccess,
}) => {
  const matchActions = useMatchActions();

  // Form state
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [proposedPitch, setProposedPitch] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!proposedDate || !proposedTime || !proposedPitch) {
      setError('Vui lòng điền đầy đủ thông tin ngày, giờ và sân dự kiến');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await matchActions.rematch(matchId, {
        proposedDate,
        proposedTime,
        proposedPitch,
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      console.error('Rematch error:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-t-3xl">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Đang gửi lời mời...
            </p>
          </div>
        )}

        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Đá lại
          </h3>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* VS Team Display with "Đối thủ cũ" badge */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
          {/* My Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamAvatar src={myTeam.logo || ''} size="md" />
            <span className="text-xs font-bold truncate w-full text-center text-slate-900 dark:text-white">
              {myTeam.name}
            </span>
            <span className="text-[10px] text-primary">Đội của bạn</span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center px-4">
            <div className="text-2xl font-black text-primary">VS</div>
          </div>

          {/* Opponent Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative">
              <TeamAvatar src={opponentTeam.logo || ''} size="md" />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-bold rounded-full">
                Cũ
              </span>
            </div>
            <span className="text-xs font-bold truncate w-full text-center text-slate-900 dark:text-white">
              {opponentTeam.name}
            </span>
            {opponentTeam.level && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{opponentTeam.level}</span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Ngày dự kiến <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Giờ dự kiến <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Loại sân <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PITCH_TYPE_VALUES.map((pitchType) => (
                <button
                  key={pitchType}
                  type="button"
                  onClick={() => setProposedPitch(pitchType)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    proposedPitch === pitchType
                      ? 'bg-primary text-background-dark'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  {pitchType}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Ghi chú <span className="text-gray-400">(Tùy chọn)</span>
            </label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
              placeholder="Nhắn tin cho đội bạn về áo đấu, kèo nước..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{notes.length}/200</p>
          </div>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="refresh" className="animate-spin" />
                Đang gửi...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="replay" />
                Gửi lời mời
              </span>
            )}
          </Button>

          <button
            onClick={handleClose}
            className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            Hủy
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Icon name="info" className="text-blue-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                Gửi lời mời tái đấu
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Sau khi gửi lời mời, đối thủ cũ sẽ nhận được thông báo và có thể chấp nhận để lên lịch đấu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RematchBottomSheet;
