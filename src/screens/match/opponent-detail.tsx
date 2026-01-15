import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { appRoutes } from '@/utils/navigation';
import { TeamService } from '@/services/api/team.service';
import type { Team } from '@/services/api/team.service';

/**
 * OpponentDetail Screen
 *
 * View opponent team details before inviting to match.
 */
const OpponentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team data with recent matches from API
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch team with recent matches included
        const teamResponse = await TeamService.getTeamById(teamId, {
          includeRecentMatches: true
        });

        if (teamResponse.success && teamResponse.data) {
          setTeam(teamResponse.data);
        } else {
          setError(teamResponse.error?.message || 'Không tìm thấy thông tin đội bóng');
        }
      } catch (err: any) {
        setError(err.error?.message || err.message || 'Không thể tải thông tin đội');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
        {/* Header with back button */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center text-white safe-area-top">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors">
            <Icon name="arrow_back" />
          </button>
        </div>
        {/* Loading spinner */}
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
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Icon name="error" className="text-3xl text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy đội bóng</h2>
        <p className="text-gray-500 mb-6 text-center">{error || 'Đội bóng này không tồn tại hoặc đã bị xóa.'}</p>
        <Button
          onClick={() => navigate(-1)}
          variant="primary"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  // Get compatibility score from navigation state or calculate from team
  const compatibilityScore = 85; // Default compatibility score - could be calculated from team stats later

  // Get banner image or use gradient fallback
  const bannerImage = team.banner;
  const logoImage = team.logo;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 animate-fade-in">
      {/* Custom Header with transparent background initially */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center text-white safe-area-top">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors">
          <Icon name="arrow_back" />
        </button>
        <button className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors">
          <Icon name="more_vert" />
        </button>
      </div>

      {/* Cover & Header Info */}
      <div className="relative">
        <div className="h-64 w-full overflow-hidden relative">
          {bannerImage ? (
            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url("${bannerImage}")` }}></div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-green-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
        </div>
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="size-24 rounded-2xl border-4 border-background-light dark:border-background-dark bg-surface-dark overflow-hidden shadow-xl">
            {logoImage ? (
              <img className="w-full h-full object-cover" src={logoImage} alt={team.name} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{team.name?.charAt(0) || 'T'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-14 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{team.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
              <Icon name="location_on" className="text-sm" />
              <span className="text-sm font-medium">
                {team.location?.address || '...'}
              </span>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
            {compatibilityScore}% Hợp cạ
          </div>
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {team.description || 'Chưa có mô tả về đội bóng.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {team.pitch?.map((p) => (
            <span key={p} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">{p}</span>
          ))}
          <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">{team.level || '-'}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-8">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Chỉ số sức mạnh</h3>
        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
          {/* Attack */}
          {team.stats?.attack && (
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-red-500">Tấn công</span>
                <span className="text-slate-900 dark:text-white">{(team.stats.attack / 10).toFixed(1)}/10</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${team.stats.attack}%` }}></div>
              </div>
            </div>
          )}
          {/* Defense */}
          {team.stats?.defense && (
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-500">Phòng thủ</span>
                <span className="text-slate-900 dark:text-white">{(team.stats.defense / 10).toFixed(1)}/10</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${team.stats.defense}%` }}></div>
              </div>
            </div>
          )}
          {/* Technique */}
          {team.stats?.technique && (
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-primary">Kỹ thuật</span>
                <span className="text-slate-900 dark:text-white">{(team.stats.technique / 10).toFixed(1)}/10</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${team.stats.technique}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Matches */}
      {team.recentMatches && team.recentMatches.length > 0 && (
        <div className="px-6 mt-8 mb-4">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Trận đấu gần đây</h3>
          <div className="space-y-3">
            {team.recentMatches.map((match) => {
              // Xác định đội hiện tại là teamA hay teamB
              const isTeamA = match.teamAId === teamId;
              const opponent = isTeamA ? match.teamB : match.teamA;
              const myScore = isTeamA ? match.scoreA : match.scoreB;
              const opponentScore = isTeamA ? match.scoreB : match.scoreA;
              const isWin = myScore && opponentScore && myScore > opponentScore;
              const isLoss = myScore && opponentScore && myScore < opponentScore;

              // Format date: dd/MM
              const matchDate = new Date(match.date);
              const dateStr = `${matchDate.getDate().toString().padStart(2, '0')}/${(matchDate.getMonth() + 1).toString().padStart(2, '0')}`;

              return (
                <div key={match.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">{dateStr}</span>
                    {isWin && <div className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">W</div>}
                    {isLoss && <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">L</div>}
                    {!isWin && !isLoss && <div className="bg-gray-400 text-white text-xs font-bold px-1.5 py-0.5 rounded">D</div>}
                    <span className="text-sm font-semibold dark:text-white">vs {opponent?.name || '...'}</span>
                  </div>
                  <span className="text-sm font-mono font-bold dark:text-white">{myScore ?? '-'} - {opponentScore ?? '-'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
        <div className="flex gap-4 max-w-md mx-auto items-center">
          <button
            onClick={() => navigate(-1)}
            className="size-14 rounded-full bg-surface-dark border border-white/10 shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform active:scale-95"
          >
            <Icon name="close" className="text-3xl" />
          </button>
          <Button
            className="flex-1 h-14 text-lg shadow-glow"
            variant="primary"
            icon="sports"
            onClick={() => navigate(appRoutes.matchInvite, {
              state: { opponentTeam: { id: team.id, name: team.name, logo: team.logo } }
            })}
          >
            Mời giao lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpponentDetail;
