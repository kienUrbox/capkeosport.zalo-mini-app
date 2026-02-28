import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, TeamAvatar } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { getLevelColor } from '@/constants/design';
import type { Match } from '@/stores/match.store';

// ==================== Pending Match Card ====================

interface PendingMatchCardProps {
  match: Match;
  isAdmin?: boolean;
  canEditRequest?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onSendRequest?: (id: string) => void;
  onEditRequest?: (id: string) => void;
  onShowGuide?: () => void;
  index?: number; // For staggered entrance animation
}

export const PendingMatchCard: React.FC<PendingMatchCardProps> = ({
  match,
  isAdmin = true,
  canEditRequest = false,
  onAccept,
  onDecline,
  onCancel,
  onConfirm,
  onSendRequest,
  onEditRequest,
  onShowGuide,
  index = 0,
}) => {
  const navigate = useNavigate();
  const [notesExpanded, setNotesExpanded] = useState(false);

  // Truncate team name at 24 chars
  const displayName = match.teamB.name?.length > 24
    ? `${match.teamB.name.slice(0, 24)}...`
    : match.teamB.name;

  // Get level color styling
  const levelColor = match.teamB.level ? getLevelColor(match.teamB.level) : null;

  // Format relative time for display
  const getRelativeTime = () => {
    // This could be enhanced with actual relative time calculation
    // For now, we'll return empty to keep it simple
    return '';
  };

  // Calculate stagger delay based on index (max 6 cards)
  const animationDelay = Math.min(index * 75, 375);

  const renderStatus = () => {
    switch (match.type) {
      case 'matched':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/20">
            <Icon name="handshake" size="sm" />
            <span className="text-xs font-bold">Đã match</span>
          </div>
        );
      case 'received':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md shadow-yellow-500/20 animate-status-pulse">
            <Icon name="notifications" size="sm" />
            <span className="text-xs font-bold">Lời mời mới</span>
          </div>
        );
      case 'sent':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm">
            <Icon name="schedule" size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight">Đã gửi</span>
              <span className="text-[10px] opacity-90">Chờ phản hồi</span>
            </div>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/20">
            <Icon name="check_circle" size="sm" />
            <span className="text-xs font-bold">Đã đồng ý</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Get status color for border gradient
  const getStatusGradient = () => {
    switch (match.type) {
      case 'matched':
        return 'from-purple-500 via-purple-500/50 to-transparent';
      case 'received':
        return 'from-yellow-500 via-yellow-500/50 to-transparent';
      case 'sent':
        return 'from-gray-400 via-gray-400/50 to-transparent';
      case 'accepted':
        return 'from-green-500 via-green-500/50 to-transparent';
      default:
        return 'from-transparent via-transparent to-transparent';
    }
  };

  const renderActions = () => {
    // Members (non-admin) cannot perform any actions
    if (!isAdmin) {
      return (
        <div className="flex items-center justify-center gap-2 mt-3">
          <Icon name="info" size="sm" className="text-gray-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Chỉ quản trị viên được thực hiện thao tác
          </span>
        </div>
      );
    }

    switch (match.type) {
      case 'matched':
        return (
          <div className="flex gap-3 mt-3 button-press" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-11 text-sm"
              icon="close"
              onClick={() => onCancel?.(match.id)}
            >
              Bỏ qua
            </Button>
            <Button
              className="flex-1 h-11 text-sm font-semibold shadow-lg shadow-primary/20"
              icon="send"
              onClick={() => onSendRequest?.(match.id)}
            >
              Gửi lời mời
            </Button>
          </div>
        );
      case 'received':
        return (
          <div className="flex gap-3 mt-3 button-press" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-11 text-sm"
              icon="close"
              onClick={() => onDecline?.(match.id)}
            >
              Từ chối
            </Button>
            <Button
              className="flex-1 h-11 text-sm font-semibold shadow-lg shadow-yellow-500/20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
              icon="check"
              onClick={() => onAccept?.(match.id)}
            >
              Chấp nhận
            </Button>
          </div>
        );
      case 'sent':
        // Nếu không có quyền edit, chỉ hiện button "Hủy lời mời"
        if (!canEditRequest) {
          return (
            <div className="flex gap-3 mt-3 button-press" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                className="flex-1 h-11 text-sm border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
                icon="undo"
                onClick={() => onCancel?.(match.id)}
              >
                Hủy lời mời
              </Button>
            </div>
          );
        }
        // Có quyền edit - hiện cả 2 buttons
        return (
          <div className="flex gap-3 mt-3 button-press" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-11 text-sm"
              icon="edit"
              onClick={() => onEditRequest?.(match.id)}
            >
              Sửa
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-11 text-sm border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
              icon="undo"
              onClick={() => onCancel?.(match.id)}
            >
              Hủy lời mời
            </Button>
          </div>
        );
      case 'accepted':
        // Stacked layout: Primary button top row, secondary buttons bottom row
        return (
          <div className="mt-3 button-press" onClick={(e) => e.stopPropagation()}>
            {/* Primary action - Chốt kèo - full width top row */}
            <Button
              className="w-full h-12 text-sm font-semibold shadow-lg shadow-green-500/20 bg-gradient-to-r from-green-500 to-green-600 text-white mb-2"
              icon="handshake"
              onClick={() => onConfirm?.(match.id)}
            >
              Chốt kèo
            </Button>
            {/* Secondary actions - bottom row */}
            <div className="flex gap-2">
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
                variant="secondary"
                className="w-10 h-10 px-0"
                icon="help_outline"
                onClick={() => onShowGuide?.()}
                title="Xem hướng dẫn chốt kèo"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden transition-all cursor-pointer
        card-entrance
        hover:border-primary/30 active:scale-[0.99]
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => navigate(appRoutes.matchDetail(match.id))}
    >
      {/* Status gradient border at top */}
      <div className={`h-1 w-full bg-gradient-to-r ${getStatusGradient()} animate-status-shimmer`} />

      {/* Corner accent decoration */}
      {match.type === 'matched' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full -mr-12 -mt-12 pointer-events-none" />
      )}
      {match.type === 'received' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-bl-full -mr-12 -mt-12 pointer-events-none" />
      )}
      {match.type === 'accepted' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full -mr-12 -mt-12 pointer-events-none" />
      )}

      <div className="p-4">
        {/* Header - Status Badge + Team Info + Menu */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          {/* Status Badge - Left side, prominent */}
          <div className="flex-shrink-0">
            {renderStatus()}
          </div>

          {/* Menu button - Right side */}
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 -mr-1"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Show more options
            }}
          >
            <Icon name="more_vert" />
          </button>
        </div>

        {/* Team Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <TeamAvatar src={match.teamB.logo || ''} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
              <span className="truncate" title={match.teamB.name}>{displayName}</span>
              <button
                className="flex-shrink-0 size-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(appRoutes.teamDetail(match.teamB.id));
                }}
                aria-label={`Xem thông tin ${match.teamB.name}`}
              >
                <Icon name="info" size="xs" className="text-gray-500" />
              </button>
            </h4>
            {match.teamB.level && levelColor && (
              <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${levelColor.main} ${levelColor.bg}`}>
                <Icon name="military_tech" size="xs" />
                <span>{match.teamB.level}</span>
              </div>
            )}
          </div>
        </div>

        {/* Match Info Section - Different for Matched vs others */}
        {match.type === 'matched' ? (
          <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 p-3 rounded-lg border border-purple-200 dark:border-purple-500/20">
            <Icon name="auto_awesome" size="sm" className="shrink-0" />
            <span className="text-xs font-medium">
              Đã hợp cạ thành công! Hãy gửi lời mời với đầy đủ thông tin thời gian, địa điểm để chốt kèo.
            </span>
          </div>
        ) : (
          <>
            {/* Quick Info Grid - 3 columns with icons */}
            <div className="grid grid-cols-3 gap-3 text-sm bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5 mb-3">
              {/* Date */}
              <div className="flex flex-col items-center">
                <Icon name="calendar_today" size="sm" className={`text-gray-500 mb-1 ${!match.date && 'text-gray-300 dark:text-gray-600'}`} />
                <span className={`font-bold text-slate-900 dark:text-white ${!match.date && 'text-gray-400 dark:text-gray-500'}`}>
                  {match.date || '---'}
                </span>
                <span className="text-[10px] uppercase text-gray-400 mt-0.5">Ngày</span>
              </div>
              {/* Time */}
              <div className="flex flex-col items-center">
                <Icon name="schedule" size="sm" className={`text-gray-500 mb-1 ${!match.time && 'text-gray-300 dark:text-gray-600'}`} />
                <span className={`font-bold text-slate-900 dark:text-white ${!match.time && 'text-gray-400 dark:text-gray-500'}`}>
                  {match.time || 'TBD'}
                </span>
                <span className="text-[10px] uppercase text-gray-400 mt-0.5">Giờ</span>
              </div>
              {/* Pitch Type */}
              <div className="flex flex-col items-center">
                <Icon name="sports_soccer" size="sm" className={`text-gray-500 mb-1 ${!match.proposedPitch && 'text-gray-300 dark:text-gray-600'}`} />
                <span className={`font-bold text-slate-900 dark:text-white ${!match.proposedPitch && 'text-gray-400 dark:text-gray-500'}`}>
                  {match.proposedPitch || 'TBD'}
                </span>
                <span className="text-[10px] uppercase text-gray-400 mt-0.5">Loại sân</span>
              </div>
            </div>

            {/* Notes Section - Expandable */}
            {match.notes && (
              <div className={`
                bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5
                transition-all duration-300 ease-in-out overflow-hidden
                ${notesExpanded ? 'notes-expanded' : ''}
              `}>
                <div className="flex items-start gap-2">
                  <Icon name="edit_note" size="xs" className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs text-gray-600 dark:text-gray-400 ${notesExpanded ? '' : 'line-clamp-2'}`}>
                      <span className="font-medium">Ghi chú: </span>
                      {match.notes}
                    </span>
                    {match.notes.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotesExpanded(!notesExpanded);
                        }}
                        className="ml-1 text-primary text-xs font-medium hover:underline"
                      >
                        {notesExpanded ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    )}
                  </div>
                  {match.notes.length > 100 && !notesExpanded && (
                    <Icon name="expand_more" size="xs" className="text-gray-400 shrink-0 mt-1" />
                  )}
                  {notesExpanded && (
                    <Icon name="expand_less" size="xs" className="text-gray-400 shrink-0 mt-1" />
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        {renderActions()}
      </div>
    </div>
  );
};

// ==================== Upcoming Match Card ====================

interface UpcomingMatchCardProps {
  match: Match;
  myTeam: { id: string; name: string; logo?: string };
  isAdmin?: boolean;
  onFinish?: (id: string) => void;
  onUpdateScore?: (id: string) => void;
  onCancel?: (id: string) => void;
  onConfirmAttendance?: (id: string) => void;
  onAttendanceView?: (id: string) => void;
  onSubmitResult?: (id: string) => void;
  onConfirmResult?: (id: string) => void;
}

export const UpcomingMatchCard: React.FC<UpcomingMatchCardProps> = ({
  match,
  myTeam,
  isAdmin = true,
  onFinish,
  onUpdateScore,
  onCancel,
  onConfirmAttendance,
  onAttendanceView,
  onSubmitResult,
  onConfirmResult,
}) => {
  const navigate = useNavigate();

  // Use match status to determine stage (status is now calculated by the store)
  const stage: 'upcoming' | 'live' | 'finished' =
    match.status === 'live' ? 'live' :
      match.status === 'finished' ? 'finished' :
        'upcoming';

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
    const hasResult = match.result !== undefined;
    const isLocked = match.resultLocked === true;

    // Check if current team has confirmed
    const myTeamId = myTeam.id;
    const hasConfirmed = myTeamId === match.teamA.id
      ? match.resultConfirmations?.teamA?.confirmed
      : match.resultConfirmations?.teamB?.confirmed;

    // If match has result and is locked, show confirmed message
    if (hasResult && isLocked) {
      return (
        <div className="flex items-center justify-center gap-2 mt-4 text-green-600">
          <Icon name="verified" size="sm" />
          <span className="text-xs font-medium">Đã xác nhận bởi cả 2 đội</span>
        </div>
      );
    }

    // If match has result but not locked, can edit or confirm
    if (hasResult && !isLocked) {
      return (
        <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
          {!hasConfirmed && (
            <Button
              variant="secondary"
              className="flex-1 h-9 text-xs"
              icon="edit"
              onClick={() => onSubmitResult?.(match.id)}
            >
              Sửa kết quả
            </Button>
          )}
          <Button
            className={`flex-1 h-9 text-xs ${hasConfirmed
              ? 'bg-green-500 text-white'
              : 'bg-primary text-slate-900'
            }`}
            icon={hasConfirmed ? 'check_circle' : 'verified'}
            onClick={() => onConfirmResult?.(match.id)}
          >
            {hasConfirmed ? 'Đã xác nhận' : 'Xác nhận'}
          </Button>
        </div>
      );
    }

    switch (stage) {
      case 'upcoming':
        return (
          <div
            className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="secondary"
              className="flex-1 h-9 text-xs"
              icon="how_to_reg"
              onClick={() => onConfirmAttendance?.(match.id)}
            >
              Điểm danh
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-9 text-xs"
              icon="person_off"
              onClick={() => onCancel?.(match.id)}
            >
              Báo bận
            </Button>
            <Button
              variant="secondary"
              className="flex-1 h-9 text-xs"
              icon="groups"
              onClick={() => onAttendanceView?.(match.id)}
            >
              Lực lượng
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
              onClick={() => onSubmitResult?.(match.id)}
            >
              Cập nhật tỉ số
            </Button>
          </div>
        );
      case 'finished':
        // Match is finished but no result yet - show button to submit result
        return (
          <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <Button
              className="flex-1 h-9 text-xs bg-primary text-slate-900"
              icon="scoreboard"
              onClick={() => onSubmitResult?.(match.id)}
            >
              Cập nhật kết quả
            </Button>
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => navigate(appRoutes.matchDetail(match.id))}
      className={`bg-white dark:bg-surface-dark p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:border-primary/50 active:scale-[0.99] ${stage === 'live'
        ? 'border-red-500/30 ring-1 ring-red-500/20'
        : 'border-gray-100 dark:border-white/5'
        }`}
    >
      {match.proposedPitch && (
        <div className="flex justify-start mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary">
            {match.proposedPitch}
          </span>
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        {renderStatus()}
        <div className="flex items-start gap-1.5">
          <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 rounded-md flex items-center justify-center shrink-0 mt-0.5">
            <Icon name="place" className="text-primary" size="xs" />
          </div>
          <div className="flex-1 min-w-0">
            {match.locationName ? (
              <>
                <button
                  className="text-xs font-bold text-slate-900 dark:text-white truncate text-left hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open Google Maps with deep link fallback
                    if (match.locationMapLink) {
                      const mapsUrl = match.locationMapLink;
                      const deepLinkUrl = 'comgooglemaps://';
                      const start = Date.now();
                      window.location.href = deepLinkUrl;
                      setTimeout(() => {
                        if (Date.now() - start < 600) {
                          window.location.href = mapsUrl;
                        }
                      }, 500);
                    }
                  }}
                >
                  {match.locationName}
                </button>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {match.locationAddress}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {match.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {match.notes && (
        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
          <span className="font-medium">Ghi chú: </span>{match.notes}
        </div>
      )}

      {/* Match Content - VS Style */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <TeamAvatar src={myTeam.logo || ''} size="sm" />
          <span className="text-xs font-bold truncate w-full text-center">
            {myTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center w-1/3">
          {stage === 'upcoming' && !match.result ? (
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
                className={`text-3xl font-extrabold font-mono block ${stage === 'live'
                  ? 'text-red-500'
                  : 'text-slate-900 dark:text-white'
                  }`}
              >
                {match.result
                  ? `${match.result.teamAScore} - ${match.result.teamBScore}`
                  : (match.scoreA !== undefined && match.scoreB !== undefined
                    ? `${match.scoreA} - ${match.scoreB}`
                    : 'VS')
                }
              </span>
              {match.resultLocked ? (
                <span className="text-xs text-green-600 font-bold flex items-center justify-center gap-1 mt-1">
                  <Icon name="verified" size="xs" />
                  Đã chốt
                </span>
              ) : stage === 'live' ? (
                <span className="text-xs text-red-500 font-bold animate-pulse">
                  {match.time}
                </span>
              ) : match.result ? (
                <span className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <Icon name="schedule" size="xs" />
                  Chờ xác nhận
                </span>
              ) : null}
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
  isAdmin?: boolean;
  onViewDetail?: (id: string) => void;
  onRematch?: (id: string) => void;
}

export const HistoryMatchCard: React.FC<HistoryMatchCardProps> = ({
  match,
  myTeam,
  isAdmin = true,
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
          {/* Members (non-admin) cannot perform any actions */}
          {!isAdmin ? (
            <div className="flex items-center justify-center gap-2 w-full">
              <Icon name="info" size="sm" className="text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Chỉ quản trị viên được thực hiện thao tác
              </span>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
