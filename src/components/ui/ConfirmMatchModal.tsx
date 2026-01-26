import React, { useState, useEffect } from 'react';
import { Icon, Button } from './';
import { TeamAvatar } from './TeamAvatar';
import { StadiumAutocomplete, type StadiumAutocompleteDto } from './StadiumAutocomplete';
import { useMatchActions } from '@/stores/match.store';

export interface OpponentTeamInfo {
  id: string;
  name: string;
  logo?: string;
  level?: string;
}

export interface MatchInfo {
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface ConfirmMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  match?: MatchInfo; // Match data for auto-fill date/time
  myTeam: { id: string; name: string; logo?: string };
  opponentTeam: OpponentTeamInfo;
  onSuccess: () => void;
}

/**
 * ConfirmMatchModal Component
 *
 * Modal for confirming match details with date, time, and stadium.
 * Follows the API requirements for POST /matches/:id/confirm
 */
export const ConfirmMatchModal: React.FC<ConfirmMatchModalProps> = ({
  isOpen,
  onClose,
  matchId,
  match,
  myTeam,
  opponentTeam,
  onSuccess,
}) => {
  const matchActions = useMatchActions();

  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedStadium, setSelectedStadium] = useState<StadiumAutocompleteDto | null>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill date/time from match data
  useEffect(() => {
    if (match?.scheduledDate) {
      setDate(match.scheduledDate);
    }
    if (match?.scheduledTime) {
      setTime(match.scheduledTime);
    }
  }, [match]);

  const handleSubmit = async () => {
    // Validation
    if (!date || !time) {
      setError('Vui lòng chọn ngày và giờ thi đấu');
      return;
    }

    if (!selectedStadium) {
      setError('Vui lòng chọn sân thi đấu');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await matchActions.confirmMatch(matchId, {
        date, // YYYY-MM-DD format from date input
        time, // HH:mm format from time input
        stadiumName: selectedStadium.name,
        mapUrl: selectedStadium.mapUrl,
        // lat/lng is optional - backend already has it for known stadiums
      });

      onSuccess();
    } catch (err: any) {
      console.error('Confirm match error:', err);
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

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-t-3xl">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Đang chốt kèo...
            </p>
          </div>
        )}

        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Chốt kèo
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
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamAvatar src={myTeam.logo || ''} size="md" />
            <span className="text-xs font-bold truncate w-full text-center text-slate-900 dark:text-white">
              {myTeam.name}
            </span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center px-4">
            <div className="text-2xl font-black text-primary">VS</div>
          </div>

          {/* Opponent Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamAvatar src={opponentTeam.logo || ''} size="md" />
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
          {/* Date + Time */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Ngày thi đấu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Giờ thi đấu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Stadium Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Sân thi đấu <span className="text-red-500">*</span>
            </label>
            <StadiumAutocomplete
              value={selectedStadium}
              onChange={setSelectedStadium}
              error={error && !selectedStadium ? 'Vui lòng chọn sân thi đấu' : undefined}
            />
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
                Đang chốt...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="handshake" />
                Xác nhận chốt kèo
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
                Chốt kèo trận đấu
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Sau khi chốt kèo, thông tin trận đấu sẽ được gửi đến đối thủ và trận đấu sẽ chuyển sang trạng thái Lịch đấu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMatchModal;
