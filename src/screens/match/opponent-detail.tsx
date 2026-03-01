import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon, TeamAvatar, ScoreExplanationModal } from '@/components/ui';
import type { ScoreType } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useTeamDetail } from '@/hooks/useTeamDetail';
import type { DiscoveredTeam } from '@/services/api/discovery.service';
import { getLevelColor, LEVEL_ICON, STAT_COLORS, STAT_ICONS } from '@/constants/design';

// Types for match data
interface RecentMatch {
  id: string;
  date: string;
  teamAId: string;
  teamBId: string;
  scoreA?: number;
  scoreB?: number;
  teamA?: { id: string; name: string };
  teamB?: { id: string; name: string };
}

// Helper function to format last active time (pure function, outside component)
const formatLastActive = (lastActive?: string) => {
  if (!lastActive) return null;
  const now = Date.now();
  const lastActiveTime = new Date(lastActive).getTime();
  const hoursDiff = (now - lastActiveTime) / (1000 * 60 * 60);
  const isToday = new Date(lastActive).toDateString() === new Date().toDateString();

  if (hoursDiff < 1) {
    return { text: 'Đang hoạt động', isOnline: true };
  } else if (hoursDiff < 24) {
    return { text: `Hoạt động ${Math.floor(hoursDiff)}h trước`, isOnline: false };
  } else if (isToday) {
    return { text: 'Hoạt động hôm nay', isOnline: false };
  } else if (hoursDiff < 48) {
    return { text: 'Hoạt động hôm qua', isOnline: false };
  } else {
    return { text: `Hoạt động ${Math.floor(hoursDiff / 24)} ngày trước`, isOnline: false };
  }
};

// Helper function to format stadium address
const formatStadiumAddress = (stadium?: { address?: string; district?: string; city?: string }): string => {
  if (!stadium) return '...';
  const parts = [stadium.address, stadium.district, stadium.city].filter(Boolean);
  return parts.join(', ') || '...';
};

/**
 * OpponentDetail Screen - Tinder Style
 *
 * Immersive full-screen profile with:
 * - Hero gradient background
 * - Large centered avatar
 * - Compatibility score with animation
 * - Quick info cards
 * - Visual stats progress bars
 * - Recent matches with result badges
 * - Glassmorphism effects
 */
const OpponentDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams<{ teamId: string }>();

  // Get navigation state data from find match page
  const navState = location.state as {
    team?: DiscoveredTeam;
    sortBy?: string;
    compatibilityScore?: number;
    qualityScore?: number;
    activityScore?: number;
  } | undefined;

  const teamFromState = navState?.team;
  const compatibilityScoreFromState = navState?.compatibilityScore;
  const qualityScoreFromState = navState?.qualityScore;
  const activityScoreFromState = navState?.activityScore;

  // Use hook for opponent detail with caching
  const { team: teamFromApi, isLoading, error, isRefreshing, refresh } = useTeamDetail(teamId, true);

  // Prioritize data from navigation state, fallback to API data
  const team = teamFromState || teamFromApi;

  // Use compatibility score from state or calculate from team compatibility
  const compatibilityScore = compatibilityScoreFromState || Math.round(((team?.compatibilityScore || 0.5) * 100));

  // Only show loading if we don't have state data AND still loading from API
  const isLoadingFinal = !teamFromState && isLoading && !isRefreshing;

  // Pull-to-refresh state
  const [touchStart, setTouchStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  // Score explanation modal state
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [selectedScoreType, setSelectedScoreType] = useState<ScoreType>('quality');
  const [selectedScoreValue, setSelectedScoreValue] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart && window.scrollY === 0) {
      const distance = e.touches[0].clientY - touchStart;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 120));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80) {
      await refresh();
    }
    setTouchStart(0);
    setPullDistance(0);
  };

  // Handle score click - open explanation modal
  const handleScoreClick = (scoreType: ScoreType, scoreValue: number) => {
    setSelectedScoreType(scoreType);
    setSelectedScoreValue(scoreValue);
    setScoreModalOpen(true);
  };

  // Loading state
  if (isLoadingFinal) {
    return (
      <div className="flex flex-col min-h-dvh bg-gradient-to-br from-primary/20 to-green-600/20">
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center text-white safe-area-top">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors">
            <Icon name="arrow_back" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white pb-8 text-center">Đang tải...</p>
      </div>
    );
  }

  // Error state
  if (error || !team) {
    return (
      <div className="flex flex-col min-h-dvh bg-background-light dark:bg-background-dark items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Icon name="error" className="text-3xl text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy đội bóng</h2>
        <p className="text-gray-500 mb-6 text-center">{error || 'Đội bóng này không tồn tại hoặc đã bị xóa.'}</p>
        <Button onClick={() => navigate(-1)} variant="primary">Quay lại</Button>
      </div>
    );
  }

  const lastActiveInfo = formatLastActive(team.lastActive);
  const qualityScore = qualityScoreFromState || Math.round((team.qualityScore || 0) * 100);
  const activityScore = activityScoreFromState || Math.round((team.activityScore || 0) * 100);
  const compatibilityScoreCalculated = compatibilityScoreFromState || Math.round((team.compatibilityScore || 0) * 100);
  const isVerified = qualityScore >= 80;

  return (
    <div
      className="flex flex-col min-h-dvh bg-gradient-to-br from-primary/15 via-green-50/50 to-background-light dark:from-background-dark dark:to-surface-dark pb-safe animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header - Absolute positioned with glassmorphism */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-start items-center safe-area-top">
        <button
          onClick={() => navigate(-1)}
          className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors text-white"
        >
          <Icon name="arrow_back" />
        </button>
      </div>

      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="absolute top-16 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-200"
          style={{
            opacity: Math.min(pullDistance / 80, 1),
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
          }}
        >
          <div className="flex items-center gap-2 text-sm text-white">
            {isRefreshing ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : pullDistance > 80 ? (
              <>
                <Icon name="refresh" className="text-white" />
                <span>Thả để tải</span>
              </>
            ) : (
              <>
                <Icon name="arrow_downward" />
                <span>Kéo để tải</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section - Banner with avatar at bottom edge (half-in/half-out) */}
      <div className="relative">
        {/* Banner image */}
        <div className="relative h-[40vh] min-h-[280px]">
          <div className="absolute inset-0 bg-gray-100 dark:bg-surface-dark">
            {team.banner ? (
              <img src={team.banner} className="w-full h-full object-cover" alt="Team Banner" />
            ) : team.logo ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl"
                style={{ backgroundImage: `url("${team.logo}")` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-green-400/20 to-primary/20 dark:from-primary/20 dark:to-green-900/20" />
            )}
          </div>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
        </div>

        {/* Avatar at bottom edge of banner (half-in/half-out) */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            {/* Avatar */}
            <div className="relative w-28 h-28 rounded-full p-1 bg-white/40 dark:bg-white/10 backdrop-blur-sm">
              <TeamAvatar
                src={team.logo || ''}
                size="xl"
                className="w-full h-full rounded-full border-4 border-white dark:border-surface-dark shadow-2xl"
              />
            </div>
            {/* Online status indicator */}
            {lastActiveInfo?.isOnline && (
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-emerald-400 rounded-full border-4 border-white dark:border-surface-dark flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team info below avatar */}
      <div className="mt-16 text-center px-4">
        {/* Team name with verified badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {team.name}
          </h1>
          {isVerified && (
            <Icon name="verified" className="text-primary text-xl" />
          )}
        </div>

        {/* Compatibility badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="px-3 py-1 bg-primary/90 dark:bg-primary/80 backdrop-blur-sm border border-primary/50 rounded-full flex items-center gap-1.5 shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold text-white">
              {compatibilityScore}% Hợp cạ
            </span>
          </div>

          {/* Last active status */}
          {lastActiveInfo && (
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${lastActiveInfo.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lastActiveInfo.text}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content below hero */}
      <div className="flex-1 px-4 space-y-4 pb-24">
        {/* Quick Info Cards - Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Members count */}
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="groups" className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Thành viên</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{team.membersCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Level */}
          {(() => {
            const levelColor = getLevelColor(team.level);
            return (
              <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${levelColor.bg} flex items-center justify-center`}>
                    <Icon name={LEVEL_ICON} className={`${levelColor.main} text-lg`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Trình độ</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{team.level || '-'}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Home Stadium */}
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Icon name="stadium" className="text-blue-500 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Sân nhà</p>
                {team.homeStadium ? (
                  <>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{team.homeStadium.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{formatStadiumAddress(team.homeStadium)}</p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{formatStadiumAddress(team.location)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pitch types */}
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="sports_soccer" className="text-green-500 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Sân</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{team.pitch?.join(' & ') || '...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section with Visual Progress Bars */}
        {team.stats && (team.stats.attack || team.stats.defense || team.stats.technique) && (
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Chỉ số sức mạnh</h3>
            <div className="space-y-3">
              {team.stats.attack !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name={STAT_ICONS.attack} className={`${STAT_COLORS.attack.main} text-sm`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Tấn công</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{(team.stats.attack / 10).toFixed(1)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${STAT_COLORS.attack.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${team.stats.attack}%` }}
                    />
                  </div>
                </div>
              )}
              {team.stats.defense !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name={STAT_ICONS.defense} className={`${STAT_COLORS.defense.main} text-sm`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Phòng thủ</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{(team.stats.defense / 10).toFixed(1)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${STAT_COLORS.defense.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${team.stats.defense}%` }}
                    />
                  </div>
                </div>
              )}
              {team.stats.technique !== undefined && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name={STAT_ICONS.technique} className={`${STAT_COLORS.technique.main} text-sm`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Kỹ thuật</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{(team.stats.technique / 10).toFixed(1)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${STAT_COLORS.technique.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${team.stats.technique}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quality Scores Section - Quality, Activity, Compatibility */}
        {(qualityScore > 0 || activityScore > 0 || compatibilityScoreCalculated > 0) && (
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Icon name="info" className="text-text-secondary text-xs" />
              Chỉ số đánh giá
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Quality Score */}
              {qualityScore > 0 && (
                <button
                  onClick={() => handleScoreClick('quality', qualityScore)}
                  className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform duration-200"
                >
                  <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${qualityScore}, 100`}
                        className={qualityScore >= 80 ? 'text-primary' : qualityScore >= 60 ? 'text-amber-500' : 'text-gray-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xs font-bold ${qualityScore >= 80 ? 'text-primary' : qualityScore >= 60 ? 'text-amber-500' : 'text-gray-500'}`}>
                        {qualityScore}
                      </span>
                    </div>
                    {/* Pulse ring on hover */}
                    <div className={`absolute inset-0 rounded-full ${qualityScore >= 80 ? 'bg-primary' : qualityScore >= 60 ? 'bg-amber-500' : 'bg-gray-500'} opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500 -z-10`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase group-hover:text-primary transition-colors">Chất lượng</span>
                </button>
              )}

              {/* Activity Score */}
              {activityScore > 0 && (
                <button
                  onClick={() => handleScoreClick('activity', activityScore)}
                  className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform duration-200"
                >
                  <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${activityScore}, 100`}
                        className={activityScore >= 80 ? 'text-orange-500' : activityScore >= 60 ? 'text-amber-500' : 'text-gray-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xs font-bold ${activityScore >= 80 ? 'text-orange-500' : activityScore >= 60 ? 'text-amber-500' : 'text-gray-500'}`}>
                        {activityScore}
                      </span>
                    </div>
                    <div className={`absolute inset-0 rounded-full ${activityScore >= 80 ? 'bg-orange-500' : activityScore >= 60 ? 'bg-amber-500' : 'bg-gray-500'} opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500 -z-10`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase group-hover:text-orange-500 transition-colors">Hoạt động</span>
                </button>
              )}

              {/* Compatibility Score */}
              {compatibilityScoreCalculated > 0 && (
                <button
                  onClick={() => handleScoreClick('compatibility', compatibilityScoreCalculated)}
                  className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform duration-200"
                >
                  <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${compatibilityScoreCalculated}, 100`}
                        className={compatibilityScoreCalculated >= 80 ? 'text-pink-500' : compatibilityScoreCalculated >= 60 ? 'text-amber-500' : 'text-gray-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="favorite" filled className={compatibilityScoreCalculated >= 80 ? 'text-pink-500' : compatibilityScoreCalculated >= 60 ? 'text-amber-500' : 'text-gray-500'} />
                    </div>
                    <div className={`absolute inset-0 rounded-full ${compatibilityScoreCalculated >= 80 ? 'bg-pink-500' : compatibilityScoreCalculated >= 60 ? 'bg-amber-500' : 'bg-gray-500'} opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500 -z-10`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase group-hover:text-pink-500 transition-colors">Hợp cạ</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* About Section */}
        {team.description && (
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Giới thiệu</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{team.description}</p>
          </div>
        )}

        {/* Recent Matches */}
        {team.recentMatches && team.recentMatches.length > 0 && (
          <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Trận đấu gần đây</h3>
            <div className="space-y-2">
              {team.recentMatches.map((match: RecentMatch) => {
                const isTeamA = match.teamAId === teamId;
                const opponent = isTeamA ? match.teamB : match.teamA;
                const myScore = isTeamA ? match.scoreA : match.scoreB;
                const opponentScore = isTeamA ? match.scoreB : match.scoreA;
                const isWin = myScore && opponentScore && myScore > opponentScore;
                const isLoss = myScore && opponentScore && myScore < opponentScore;

                const matchDate = new Date(match.date);
                const dateStr = `${matchDate.getDate().toString().padStart(2, '0')}/${(matchDate.getMonth() + 1).toString().padStart(2, '0')}`;

                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-gray-400">{dateStr}</span>
                      {isWin && (
                        <div className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">W</div>
                      )}
                      {isLoss && (
                        <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">L</div>
                      )}
                      {!isWin && !isLoss && (
                        <div className="bg-gray-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">D</div>
                      )}
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        vs {opponent?.name || '...'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white ml-2">
                      {myScore ?? '-'} - {opponentScore ?? '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Score Explanation Modal */}
      <ScoreExplanationModal
        isOpen={scoreModalOpen}
        onClose={() => setScoreModalOpen(false)}
        scoreType={selectedScoreType}
        scoreValue={selectedScoreValue}
      />
    </div>
  );
};

export default OpponentDetail;
