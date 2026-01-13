import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Header, Icon, TeamAvatar, ErrorState } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import type { TeamMember, Team } from '@/services/api/team.service';

/**
 * MemberProfile Screen
 *
 * View member details with stats, team info, and intro.
 * Uses data passed from navigation state - no API calls.
 */
const MemberProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, memberId } = useParams<{ teamId: string; memberId: string }>();
  const location = useLocation();

  const [error, setError] = useState<string | null>(null);

  // Get member and team from navigation state (passed from members list)
  const member = location.state?.member as TeamMember | undefined;
  const team = location.state?.team as Team | undefined;

  useEffect(() => {
    // Validate data
    if (!member) {
      setError('Không tìm thấy thông tin thành viên');
    }
  }, [member]);

  const getRoleLabel = (member: TeamMember) => {
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
           member.position === 'Captain' ||
           member.user?.position?.toLowerCase() === 'đội trưởng' ||
           member.user?.position?.toLowerCase() === 'captain';
  };

  const getJerseyNumber = (member: TeamMember) => {
    // Priority: user.jerseyNumber > member.jerseyNumber
    if (member.user?.jerseyNumber) return member.user.jerseyNumber;
    return member.jerseyNumber;
  };

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

      <div className="overflow-y-auto">
        {/* Banner */}
        {member.user?.banner && (
          <div className="h-40 w-full overflow-hidden">
            <img src={member.user.banner} className="w-full h-full object-cover" alt="Banner" />
          </div>
        )}

        <div className="p-4">
          {/* Profile Header */}
          <div className={`flex flex-col items-center mb-8 ${!member.user?.banner ? 'pt-4' : '-mt-16'}`}>
            <div className="relative mb-4">
              <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden bg-white dark:bg-surface-dark">
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
              {/* Jersey Number Badge */}
              {member.user?.jerseyNumber && (
                <div
                  className="absolute -top-2 -left-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white dark:border-surface-dark"
                >
                  {member.user.jerseyNumber}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{member.user?.name || 'Thành viên'}</h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-text-secondary font-medium mt-1">
              {member.user?.position && (
                <span>{member.user.position}</span>
              )}
            </div>
            {isAdmin(member) && (
              <div className="mt-2 text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                Đội trưởng
              </div>
            )}
          </div>

        {/* Player Stats */}
        {member.user?.playerStats && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Chỉ số kỹ năng</h3>
            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
              {/* Attack */}
              {member.user.playerStats.attack !== undefined && member.user.playerStats.attack !== null && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                      <div className="p-1 bg-red-500/10 rounded">
                        <Icon name="flash_on" className="text-sm" />
                      </div>
                      Tấn công
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(member.user.playerStats.attack / 10).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${member.user.playerStats.attack}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Defense */}
              {member.user.playerStats.defense !== undefined && member.user.playerStats.defense !== null && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                      <div className="p-1 bg-blue-500/10 rounded">
                        <Icon name="shield" className="text-sm" />
                      </div>
                      Phòng thủ
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(member.user.playerStats.defense / 10).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${member.user.playerStats.defense}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Technique */}
              {member.user.playerStats.technique !== undefined && member.user.playerStats.technique !== null && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <div className="p-1 bg-primary/10 rounded">
                        <Icon name="sports_soccer" className="text-sm" />
                      </div>
                      Kỹ thuật
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(member.user.playerStats.technique / 10).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${member.user.playerStats.technique}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                    <p className="text-xs text-primary font-medium">{getRoleLabel(member)}</p>
                  </div>
                </div>
                <Icon name="chevron_right" className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Intro */}
        {member.user?.bio && (
          <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Giới thiệu</h4>
            <p className="text-slate-900 dark:text-white text-sm leading-relaxed whitespace-pre-wrap">
              {member.user.bio}
            </p>
          </div>
        )}

        {/* Join Date */}
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="event" className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Ngày tham gia</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Date(member.joinedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
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
