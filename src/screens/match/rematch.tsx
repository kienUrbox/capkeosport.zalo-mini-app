import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon, TeamAvatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { appRoutes } from '@/utils/navigation';
import { MatchService, type RematchDto } from '@/services/api/match.service';
import { useMatchActions } from '@/stores/match.store';
import { toast } from '@/utils/toast';

/**
 * Rematch Screen
 *
 * Send rematch invitation form with date/time and location selection.
 * Shows opponent team info from previous match.
 */
const RematchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id: matchId } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [opponentTeam, setOpponentTeam] = useState<{
    id: string;
    name: string;
    logo?: string;
    level?: string;
  } | null>(null);
  const [myTeamId, setMyTeamId] = useState<string | null>(null);

  // Form state
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [proposedPitch, setProposedPitch] = useState('');
  const [notes, setNotes] = useState('');

  const matchActions = useMatchActions();

  // Fetch match details to get opponent info
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId) return;

      try {
        const response = await MatchService.getMatchById(matchId);
        if (response.success && response.data) {
          const match = response.data;

          // Determine opponent team (assuming current team is teamA)
          // TODO: Get current team ID from auth/team store
          const currentTeamId = match.teamA?.id || '';
          setMyTeamId(currentTeamId);

          const opponent = currentTeamId === match.teamA?.id ? match.teamB : match.teamA;
          if (opponent) {
            setOpponentTeam({
              id: opponent.id,
              name: opponent.name,
              logo: opponent.logo,
              level: opponent.level,
            });
          }

          // Pre-fill with previous match info
          setProposedDate(match.date || '');
          setProposedTime(match.time || '');
          setProposedPitch(match.location?.address || match.proposedPitch || '');
        }
      } catch (error) {
        console.error('Failed to fetch match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handleSubmit = async () => {
    if (!matchId) return;

    // Validation
    if (!proposedDate || !proposedTime || !proposedPitch) {
      toast.warning('Vui lòng điền đầy đủ thông tin ngày, giờ và sân dự kiến');
      return;
    }

    setIsLoading(true);

    try {
      const rematchData: RematchDto = {
        proposedDate,
        proposedTime,
        proposedPitch,
        notes: notes || undefined,
      };

      await matchActions.rematch(matchId, rematchData);

      // Show success and navigate back
      toast.success('Đã gửi lời mời đá lại!');
      navigate(appRoutes.matchSchedule);
    } catch (error: any) {
      console.error('Rematch error:', error);
      toast.error(error.message || 'Không thể gửi lời mời đá lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header title="Đá lại" onBack={handleBack} />

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {/* Opponent Card */}
        {opponentTeam ? (
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-white/5 shadow-sm mb-6">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="size-20 rounded-full bg-gray-100 dark:bg-black/30 border-2 border-primary p-1">
                  {opponentTeam.logo ? (
                    <img src={opponentTeam.logo} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Icon name="sports_soccer" className="text-3xl text-gray-400" />
                    </div>
                  )}
                </div>
                {opponentTeam.level && (
                  <div className="absolute -bottom-2 -right-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-surface-dark">
                    {opponentTeam.level}
                  </div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{opponentTeam.name}</h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-gray-500 dark:text-text-secondary text-sm">
                  <Icon name="sports_soccer" className="text-primary text-sm" />
                  <span>Đối thủ cũ</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 mb-6">
            <Icon name="refresh" className="animate-spin text-2xl text-primary" />
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div className="flex gap-4">
            <Input
              label="Ngày dự kiến"
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="flex-1"
            />
            <Input
              label="Giờ dự kiến"
              type="time"
              value={proposedTime}
              onChange={(e) => setProposedTime(e.target.value)}
              className="flex-1"
            />
          </div>

          <Input
            label="Sân dự kiến"
            placeholder="Nhập tên sân hoặc địa chỉ..."
            value={proposedPitch}
            onChange={(e) => setProposedPitch(e.target.value)}
            icon="location_on"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-text-secondary ml-1">
              Ghi chú (Tùy chọn)
            </label>
            <textarea
              className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] resize-none"
              placeholder="Nhắn tin cho đội bạn về áo đấu, kèo nước..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300">
            <Icon name="info" className="shrink-0" />
            <p className="text-xs leading-relaxed">
              Lời mời tái đấu sẽ được gửi đến đội bạn. Họ có thể chấp nhận hoặc từ chối lời mời.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5">
        <Button fullWidth icon="send" onClick={handleSubmit} disabled={isLoading || !opponentTeam}>
          {isLoading ? 'ĐANG GỬI...' : 'GỬI LỜI MỜI TÁI ĐẤU'}
        </Button>
      </div>
    </div>
  );
};

export default RematchScreen;
