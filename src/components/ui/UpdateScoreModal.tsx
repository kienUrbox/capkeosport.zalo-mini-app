import React, { useState, useEffect } from 'react';
import { Icon, Button } from './';
import { TeamAvatar } from './TeamAvatar';
import { useMatchActions } from '@/stores/match.store';
import { useKeyboardAvoidance } from '@/hooks/useKeyboardAvoidance';

export interface UpdateScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  myTeam: { id: string; name: string; logo?: string };
  opponentTeam: { id: string; name: string; logo?: string };
  initialData?: {
    teamAScore?: number;
    teamBScore?: number;
    notes?: string;
    fileIds?: string[];
  };
  onSuccess: () => void;
}

/**
 * UpdateScoreModal Component
 *
 * Modal for submitting/updating match results.
 * Follows the API requirements for POST /matches/:id/result
 */
export const UpdateScoreModal: React.FC<UpdateScoreModalProps> = ({
  isOpen,
  onClose,
  matchId,
  myTeam,
  opponentTeam,
  initialData,
  onSuccess,
}) => {
  const matchActions = useMatchActions();

  // Form state
  const [teamAScore, setTeamAScore] = useState(initialData?.teamAScore ?? 0);
  const [teamBScore, setTeamBScore] = useState(initialData?.teamBScore ?? 0);
  const [notes, setNotes] = useState(initialData?.notes ?? '');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enable keyboard avoidance for textarea input
  useKeyboardAvoidance();

  // Reset form when modal opens with new initialData
  useEffect(() => {
    if (isOpen) {
      setTeamAScore(initialData?.teamAScore ?? 0);
      setTeamBScore(initialData?.teamBScore ?? 0);
      setNotes(initialData?.notes ?? '');
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    // Validation
    if (teamAScore < 0 || teamBScore < 0) {
      setError('Tỷ số không được âm');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await matchActions.submitMatchResult(matchId, {
        teamAScore,
        teamBScore,
        notes: notes.trim() || undefined,
      });

      onSuccess();
    } catch (err: any) {
      console.error('Submit result error:', err);
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

  // Helper to increment/decrement score
  const adjustScore = (team: 'A' | 'B', delta: number) => {
    if (team === 'A') {
      setTeamAScore((prev) => Math.max(0, prev + delta));
    } else {
      setTeamBScore((prev) => Math.max(0, prev + delta));
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

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe-with-nav animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Drag Handle */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {initialData?.teamAScore !== undefined ? 'Sửa kết quả' : 'Nhập kết quả'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nhập tỷ số trận đấu
          </p>
        </div>

        {/* Teams Display */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Team A */}
          <div className="flex-1 flex flex-col items-center">
            <TeamAvatar src={myTeam.logo} size="md" />
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-2 text-center">
              {myTeam.name}
            </span>
          </div>

          {/* VS */}
          <div className="text-gray-400 font-bold text-sm">VS</div>

          {/* Team B */}
          <div className="flex-1 flex flex-col items-center">
            <TeamAvatar src={opponentTeam.logo} size="md" />
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-2 text-center">
              {opponentTeam.name}
            </span>
          </div>
        </div>

        {/* Score Input */}
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4">
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
            Tỷ số <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center justify-center gap-4">
            {/* Team A Score */}
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all"
                  onClick={() => adjustScore('A', -1)}
                  disabled={isSubmitting}
                >
                  <Icon name="remove" size="sm" />
                </button>
                <input
                  type="number"
                  min={0}
                  value={teamAScore}
                  onChange={(e) => setTeamAScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 h-14 text-center text-2xl font-bold text-slate-900 dark:text-white bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all"
                  onClick={() => adjustScore('A', 1)}
                  disabled={isSubmitting}
                >
                  <Icon name="add" size="sm" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="text-2xl font-bold text-gray-400 px-2">-</div>

            {/* Team B Score */}
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all"
                  onClick={() => adjustScore('B', -1)}
                  disabled={isSubmitting}
                >
                  <Icon name="remove" size="sm" />
                </button>
                <input
                  type="number"
                  min={0}
                  value={teamBScore}
                  onChange={(e) => setTeamBScore(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 h-14 text-center text-2xl font-bold text-slate-900 dark:text-white bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all"
                  onClick={() => adjustScore('B', 1)}
                  disabled={isSubmitting}
                >
                  <Icon name="add" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Ghi chú
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú về trận đấu (tùy chọn)"
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 text-sm bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {notes.length}/200
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <Icon name="error" size="sm" className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Icon name="refresh" className="animate-spin" size="sm" />
                Đang lưu...
              </span>
            ) : (
              'Lưu kết quả'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
