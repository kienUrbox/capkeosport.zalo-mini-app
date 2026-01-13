import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, Input } from './';
import { TeamAvatar } from './TeamAvatar';
import { useMatchActions } from '@/stores/match.store';
import { appRoutes } from '@/utils/navigation';
import type { SendMatchRequestDto, UpdateMatchRequestDto } from '@/services/api/match.service';

export interface OpponentTeamInfo {
  id: string;
  name: string;
  logo?: string;
  level?: string;
}

export interface MatchRequestModalProps {
  isOpen: boolean;
  mode: 'send' | 'edit';
  matchId: string;
  myTeam: OpponentTeamInfo;
  opponentTeam: OpponentTeamInfo;
  initialData?: {
    proposedDate?: string;
    proposedTime?: string;
    proposedPitch?: string;
    notes?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * MatchRequestModal Component
 *
 * Modal for sending or editing match request with date/time/pitch/notes.
 */
export const MatchRequestModal: React.FC<MatchRequestModalProps> = ({
  isOpen,
  mode,
  matchId,
  myTeam,
  opponentTeam,
  initialData,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const matchActions = useMatchActions();

  // Form state
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [proposedPitch, setProposedPitch] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setProposedDate(initialData.proposedDate || '');
      setProposedTime(initialData.proposedTime || '');
      setProposedPitch(initialData.proposedPitch || '');
      setNotes(initialData.notes || '');
    } else {
      // Reset form when sending new request
      setProposedDate('');
      setProposedTime('');
      setProposedPitch('');
      setNotes('');
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = async () => {
    // Validation
    if (!proposedDate || !proposedTime || !proposedPitch) {
      setError('Vui lòng điền đầy đủ thông tin ngày, giờ và sân dự kiến');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'send') {
        const requestData: SendMatchRequestDto = {
          proposedDate,
          proposedTime,
          proposedPitch,
          notes: notes || undefined,
        };
        await matchActions.sendMatchRequest(matchId, requestData);
      } else {
        const requestData: UpdateMatchRequestDto = {
          proposedDate,
          proposedTime,
          proposedPitch,
          notes: notes || undefined,
        };
        await matchActions.updateMatchRequest(matchId, requestData);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Match request error:', err);
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
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'send' ? 'Gửi lời mời giao lưu' : 'Cập nhật lời mời'}
          </h3>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* VS Team Display */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
          {/* My Team */}
          <div
            className="flex flex-col items-center gap-2 flex-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(appRoutes.teamDetail(myTeam.id));
            }}
          >
            <div className="relative">
              <TeamAvatar
                src={myTeam.logo || ''}
                size="md"
              />
              <button
                className="absolute -top-1 -right-1 size-5 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(appRoutes.teamDetail(myTeam.id));
                }}
              >
                <Icon name="info" size="sm" className="text-gray-500" />
              </button>
            </div>
            <span className="text-xs font-bold truncate w-full text-center">
              {myTeam.name}
            </span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center px-4">
            <div className="text-2xl font-black text-primary">VS</div>
          </div>

          {/* Opponent Team */}
          <div
            className="flex flex-col items-center gap-2 flex-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(appRoutes.teamDetail(opponentTeam.id));
            }}
          >
            <div className="relative">
              <TeamAvatar
                src={opponentTeam.logo || ''}
                size="md"
              />
              <button
                className="absolute -top-1 -right-1 size-5 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(appRoutes.teamDetail(opponentTeam.id));
                }}
              >
                <Icon name="info" size="sm" className="text-gray-500" />
              </button>
            </div>
            <span className="text-xs font-bold truncate w-full text-center">
              {opponentTeam.name}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-3">
            <Input
              label="Ngày dự kiến"
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="flex-1"
              required
            />
            <Input
              label="Giờ dự kiến"
              type="time"
              value={proposedTime}
              onChange={(e) => setProposedTime(e.target.value)}
              className="flex-1"
              required
            />
          </div>

          <Input
            label="Sân dự kiến"
            placeholder="Nhập tên sân hoặc địa chỉ..."
            value={proposedPitch}
            onChange={(e) => setProposedPitch(e.target.value)}
            icon="location_on"
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">
              Ghi chú (Tùy chọn)
            </label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
              placeholder="Nhắn tin cho đội bạn về áo đấu, kèo nước..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 text-right">{notes.length}/200</p>
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
                {mode === 'send' ? 'Đang gửi...' : 'Đang cập nhật...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="send" />
                {mode === 'send' ? 'Gửi lời mời' : 'Cập nhật'}
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
        {mode === 'send' && (
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
        )}
      </div>
    </div>
  );
};

export default MatchRequestModal;
