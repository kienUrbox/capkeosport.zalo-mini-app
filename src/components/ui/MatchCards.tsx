import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, TeamAvatar } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import type { Match } from '@/stores/match.store';

// ==================== Pending Match Card ====================

interface PendingMatchCardProps {
  match: Match;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onSendRequest?: (id: string) => void;
  onEditRequest?: (id: string) => void;
}

export const PendingMatchCard: React.FC<PendingMatchCardProps> = ({
  match,
  onAccept,
  onDecline,
  onCancel,
  onConfirm,
  onSendRequest,
  onEditRequest,
}) => {
  const navigate = useNavigate();

  const renderStatus = () => {
    switch (match.type) {
      case 'matched':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Đã match
          </span>
        );
      case 'received':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            Lời mời mới
          </span>
        );
      case 'sent':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-500 border border-gray-500/20">
            Đã gửi • Chờ phản hồi
          </span>
        );
      case 'accepted':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            Đã đồng ý
          </span>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    switch (match.type) {
      case 'matched':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs"
              icon="close"
              onClick={() => onCancel?.(match.id)}
            >
              Bỏ qua
            </Button>
            <Button
              className="flex-1 h-10 text-xs"
              icon="send"
              onClick={() => onSendRequest?.(match.id)}
            >
              Gửi lời mời
            </Button>
          </div>
        );
      case 'received':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs"
              icon="close"
              onClick={() => onDecline?.(match.id)}
            >
              Từ chối
            </Button>
            <Button
              className="flex-1 h-10 text-xs"
              icon="check"
              onClick={() => onAccept?.(match.id)}
            >
              Chấp nhận
            </Button>
          </div>
        );
      case 'sent':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs"
              icon="edit"
              onClick={() => onEditRequest?.(match.id)}
            >
              Sửa
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
              icon="undo"
              onClick={() => onCancel?.(match.id)}
            >
              Hủy lời mời
            </Button>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs"
              icon="chat"
              onClick={() => {
                /* TODO: Open chat */
              }}
            >
              Nhắn tin
            </Button>
            <Button
              className="flex-1 h-10 text-xs bg-primary text-slate-900 shadow-lg shadow-primary/20"
              icon="handshake"
              onClick={() => onConfirm?.(match.id)}
            >
              Chốt kèo
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden transition-all"
      onClick={() => navigate(appRoutes.matchDetail(match.id))}
    >
      {match.type === 'matched' && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full -mr-8 -mt-8" />
      )}
      {match.type === 'accepted' && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full -mr-8 -mt-8" />
      )}

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <TeamAvatar src={match.teamB.logo || ''} size="sm" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {match.teamB.name}
            </h4>
            <div className="mt-1">{renderStatus()}</div>
          </div>
        </div>
        <button
          className="text-gray-400"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Show more options
          }}
        >
          <Icon name="more_horiz" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-text-secondary bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-1 shrink-0">
          <Icon name="calendar_today" size="sm" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {match.time} • {match.date}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-300 dark:bg-white/10 shrink-0" />
        <div className="flex items-center gap-1 min-w-0">
          <Icon name="location_on" size="sm" />
          <span className="truncate">{match.location}</span>
        </div>
      </div>

      {renderActions()}
    </div>
  );
};

// ==================== Upcoming Match Card ====================

interface UpcomingMatchCardProps {
  match: Match;
  myTeam: { id: string; name: string; logo?: string };
  onFinish?: (id: string) => void;
  onUpdateScore?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const UpcomingMatchCard: React.FC<UpcomingMatchCardProps> = ({
  match,
  myTeam,
  onFinish,
  onUpdateScore,
  onCancel,
}) => {
  const navigate = useNavigate();

  // Determine match stage based on date/time
  const getMatchStage = (): 'upcoming' | 'live' | 'finished' => {
    // For now, assume all upcoming matches are 'upcoming'
    // In real implementation, check date/time to determine if live
    return 'upcoming';
  };

  const stage = getMatchStage();

  const renderStatus = () => {
    switch (stage) {
      case 'upcoming':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Sắp diễn ra
          </span>
        );
      case 'live':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Đang đá
          </span>
        );
      case 'finished':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-500 border border-gray-500/20">
            Vừa kết thúc
          </span>
        );
    }
  };

  const renderActions = () => {
    switch (stage) {
      case 'upcoming':
        return (
          <div
            className="flex gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="secondary"
              className="flex-1 h-9 text-xs"
              icon="person_off"
              onClick={() => onCancel?.(match.id)}
            >
              Báo bận
            </Button>
            <Button
              className="flex-1 h-9 text-xs"
              icon="how_to_reg"
              onClick={() => navigate(appRoutes.matchAttendance(match.id))}
            >
              Điểm danh
            </Button>
          </div>
        );
      case 'live':
        return (
          <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
              icon="flag"
              onClick={() => onFinish?.(match.id)}
            >
              Kết thúc
            </Button>
            <Button
              className="flex-[1.5] h-10 text-xs bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
              icon="scoreboard"
              onClick={() => onUpdateScore?.(match.id)}
            >
              Cập nhật tỉ số
            </Button>
          </div>
        );
      case 'finished':
        return (
          <div
            className="flex gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="secondary"
              className="flex-1 h-9 text-xs"
              icon="edit"
              onClick={() => onUpdateScore?.(match.id)}
            >
              Sửa kết quả
            </Button>
            <Button
              className="flex-1 h-9 text-xs bg-slate-800 text-white dark:bg-white dark:text-slate-900"
              icon="verified"
              onClick={() => {
                /* TODO: Confirm result */
              }}
            >
              Xác nhận
            </Button>
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => navigate(appRoutes.matchDetail(match.id))}
      className={`bg-white dark:bg-surface-dark p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:border-primary/50 active:scale-[0.99] ${
        stage === 'live'
          ? 'border-red-500/30 ring-1 ring-red-500/20'
          : 'border-gray-100 dark:border-white/5'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        {renderStatus()}
        <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
          <Icon name="location_on" className="text-xs" />
          {match.location}
        </div>
      </div>

      {/* Match Content - VS Style */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <TeamAvatar src={myTeam.logo || ''} size="sm" />
          <span className="text-xs font-bold truncate w-full text-center">
            {myTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center w-1/3">
          {stage === 'upcoming' ? (
            <div className="text-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white block">
                {match.time}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold">
                {match.date}
              </span>
            </div>
          ) : (
            <div className="text-center">
              <span
                className={`text-3xl font-extrabold font-mono block ${
                  stage === 'live'
                    ? 'text-red-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {match.scoreA !== undefined && match.scoreB !== undefined
                  ? `${match.scoreA} - ${match.scoreB}`
                  : 'VS'}
              </span>
              {stage === 'live' && (
                <span className="text-xs text-red-500 font-bold animate-pulse">
                  {match.time}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <TeamAvatar src={match.teamB.logo || ''} size="sm" />
          <span className="text-xs font-bold truncate w-full text-center">
            {match.teamB.name}
          </span>
        </div>
      </div>

      {renderActions()}
    </div>
  );
};

// ==================== History Match Card ====================

interface HistoryMatchCardProps {
  match: Match;
  myTeam: { id: string; name: string; logo?: string };
  onViewDetail?: (id: string) => void;
  onRematch?: (id: string) => void;
}

export const HistoryMatchCard: React.FC<HistoryMatchCardProps> = ({
  match,
  myTeam,
  onViewDetail,
  onRematch,
}) => {
  const navigate = useNavigate();

  // Calculate match result
  const getResult = (): 'W' | 'L' | 'D' => {
    if (match.scoreA === undefined || match.scoreB === undefined) {
      return 'D';
    }

    if (match.scoreA > match.scoreB) return 'W';
    if (match.scoreA < match.scoreB) return 'L';
    return 'D';
  };

  const result = getResult();
  const score =
    match.scoreA !== undefined && match.scoreB !== undefined
      ? `${match.scoreA} - ${match.scoreB}`
      : 'VS';

  const getResultColor = () => {
    switch (result) {
      case 'W':
        return 'bg-green-500';
      case 'L':
        return 'bg-red-500';
      case 'D':
        return 'bg-gray-400';
    }
  };

  const getResultText = () => {
    switch (result) {
      case 'W':
        return 'THẮNG';
      case 'L':
        return 'THUA';
      case 'D':
        return 'HÒA';
    }
  };

  const getResultBgColor = () => {
    switch (result) {
      case 'W':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'L':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'D':
        return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300';
    }
  };

  return (
    <div
      onClick={() => navigate(appRoutes.matchDetail(match.id))}
      className="bg-white dark:bg-surface-dark p-0 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden cursor-pointer hover:border-primary/50 active:scale-[0.99] transition-all"
    >
      {/* Header Status Bar - Colored based on result */}
      <div className={`h-1.5 w-full ${getResultColor()}`} />

      <div className="p-4">
        {/* Top Row: Date & Location */}
        <div className="flex justify-between items-center mb-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1">
            <Icon name="calendar_today" className="text-xs" />
            {match.date}
          </div>
          <div className="flex items-center gap-1">
            <Icon name="location_on" className="text-xs" />
            {match.location}
          </div>
        </div>

        {/* Main Content: Team vs Team & Score */}
        <div className="flex items-center justify-between mb-4">
          {/* My Team */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <TeamAvatar src={myTeam.logo || ''} size="sm" />
            <span className="text-xs font-bold text-center truncate w-full">
              {myTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center w-1/3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-widest">
              {score}
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${getResultBgColor()}`}
            >
              {getResultText()}
            </span>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <TeamAvatar src={match.teamB.logo || ''} size="sm" />
            <span className="text-xs font-bold text-center truncate w-full">
              {match.teamB.name}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="secondary"
            className="flex-1 h-9 text-xs"
            icon="info"
            onClick={() => onViewDetail?.(match.id)}
          >
            Chi tiết
          </Button>
          <Button
            className="flex-1 h-9 text-xs"
            icon="replay"
            onClick={() => onRematch?.(match.id)}
          >
            Đá lại
          </Button>
        </div>
      </div>
    </div>
  );
};
