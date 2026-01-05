import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Header, Icon, TeamAvatar, ErrorState } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { TeamService } from '@/services/api/team.service';
import type { TeamMember, Team } from '@/services/api/team.service';

/**
 * MemberProfile Screen
 *
 * View member details with stats, team info, and intro.
 */
const MemberProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, memberId } = useParams<{ teamId: string; memberId: string }>();
  const location = useLocation();

  const [member, setMember] = useState<TeamMember | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get member from navigation state (passed from members list)
  const memberFromState = location.state?.member as TeamMember | undefined;

  useEffect(() => {
    const loadData = async () => {
      if (!teamId || !memberId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Use member data from navigation state if available
        if (memberFromState) {
          setMember(memberFromState);
        } else {
          // Fallback: fetch all members and find the one we need
          const response = await TeamService.getTeamMembers(teamId);
          if (response.success && response.data) {
            const foundMember = response.data.find((m) => m.id === memberId);
            if (foundMember) {
              setMember(foundMember);
            } else {
              setError('Không tìm thấy thành viên');
              return;
            }
          }
        }

        // Fetch team data for team info section
        const teamResponse = await TeamService.getTeamById(teamId);
        if (teamResponse.success && teamResponse.data) {
          setTeam(teamResponse.data);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch member profile:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, memberId]);

  const getRoleLabel = (member: TeamMember) => {
    // Check position first (from API response)
    if (member.position) {
      return member.position;
    }
    // Fallback to role
    switch (member.role) {
      case 'CAPTAIN':
        return 'Đội trưởng';
      case 'admin':
        return 'Cầu thủ';
      case 'PLAYER':
        return 'Cầu thủ';
      case 'member':
        return 'Cầu thủ';
      case 'SUBSTITUTE':
        return 'Dự bị';
      default:
        return 'Thành viên';
    }
  };

  const isAdmin = (member: TeamMember) => {
    return member.role === 'CAPTAIN' ||
           member.role === 'admin' ||
           member.position === 'Captain';
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
        <Header title="Thông tin thành viên" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4 mx-auto" />
            <p className="text-sm text-gray-500">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !member) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
        <Header title="Thông tin thành viên" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorState
            title={error ? 'Có lỗi xảy ra' : 'Không tìm thấy thành viên'}
            message={error || 'Thành viên này không tồn tại'}
            onRetry={() => navigate(-1)}
            retryLabel="Quay lại"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header
        title="Thông tin thành viên"
        onBack={() => navigate(-1)}
        rightAction={
          <button className="p-2 text-gray-500 hover:text-slate-900 dark:hover:text-white">
            <Icon name="more_vert" />
          </button>
        }
      />

      <div className="p-4 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="relative mb-4">
            <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden">
              {member.user?.avatar ? (
                <img src={member.user.avatar} className="w-full h-full object-cover" alt={member.user?.name} />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Icon name="person" className="text-gray-400 text-4xl" />
                </div>
              )}
            </div>
            {/* Captain Badge */}
            {isAdmin(member) && (
              <div
                className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1.5 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm"
                title="Đội trưởng"
              >
                <Icon name="star" className="text-xs" filled />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{member.user?.name || 'Thành viên'}</h2>
          <div className="flex items-center gap-2 text-gray-500 dark:text-text-secondary font-medium mt-1">
            <span>{getRoleLabel(member)}</span>
          </div>
          {isAdmin(member) && (
            <div className="mt-2 text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              Đội trưởng
            </div>
          )}
        </div>

        {/* Player Stats - Using placeholder data since API doesn't provide stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Chỉ số kỹ năng</h3>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
            {/* Attack */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <div className="p-1 bg-red-500/10 rounded">
                    <Icon name="flash_on" className="text-sm" />
                  </div>
                  Tấn công
                </div>
                <span className="font-bold text-slate-900 dark:text-white">7.5</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Defense */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                  <div className="p-1 bg-blue-500/10 rounded">
                    <Icon name="shield" className="text-sm" />
                  </div>
                  Phòng thủ
                </div>
                <span className="font-bold text-slate-900 dark:text-white">7.0</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            {/* Technique */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <div className="p-1 bg-primary/10 rounded">
                    <Icon name="sports_soccer" className="text-sm" />
                  </div>
                  Kỹ thuật
                </div>
                <span className="font-bold text-slate-900 dark:text-white">7.5</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Đội bóng</h3>
          <div className="space-y-3">
            {team && (
              <div
                onClick={() => navigate(appRoutes.teamDetail(teamId || ''))}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 active:scale-98 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <TeamAvatar src={team.logo} size="sm" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{team.name}</h4>
                    <p className="text-xs text-primary font-medium">{getRoleLabel(member.role)}</p>
                  </div>
                </div>
                <Icon name="chevron_right" className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Intro - Using placeholder text since API doesn't provide bio */}
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Giới thiệu</h4>
          <p className="text-slate-900 dark:text-white text-sm leading-relaxed">
            {member.user?.name || 'Thành viên'} là {getRoleLabel(member.role).toLowerCase()} của đội. Tham gia đội từ{' '}
            {new Date(member.joinedAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="secondary"
            className="flex-1"
            icon="call"
            onClick={() => member.user?.phone && window.open(`tel:${member.user.phone}`)}
            disabled={!member.user?.phone}
          >
            Gọi điện
          </Button>
          <Button
            variant="primary"
            className="flex-[2]"
            icon="chat"
            onClick={() => member.user?.phone && window.open(`https://zalo.me/${member.user.phone}`)}
            disabled={!member.user?.phone}
          >
            Nhắn tin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileScreen;
