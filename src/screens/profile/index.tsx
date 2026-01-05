import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, TeamAvatar, ThemeSwitch, EmptyState, ErrorState } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useUser } from '@/stores/auth.store';
import { TeamService } from '@/services/api/team.service';
import type { Team } from '@/services/api/team.service';

/**
 * Profile Screen
 *
 * User profile with stats, teams, and settings.
 */
const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoadingTeams(true);
        setTeamsError(null);

        const response = await TeamService.getMyTeams();

        if (response.success && response.data) {
          setTeams(response.data);
        } else {
          setTeamsError('Không thể tải danh sách đội');
        }
      } catch (err: unknown) {
        console.error('Failed to fetch teams:', err);
        setTeamsError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout
    console.log('Logout clicked');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header
        title="Hồ sơ cá nhân"
        showBack={false}
        rightAction={
          <button
            onClick={() => navigate(appRoutes.profileEdit)}
            className="p-2 text-primary font-bold text-sm"
          >
            Sửa
          </button>
        }
      />

      <div className="p-4 overflow-y-auto pb-safe-with-nav">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-3xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-1 bg-green-500 size-6 rounded-full border-4 border-background-light dark:border-background-dark"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Người dùng'}</h2>
          <p className="text-gray-500 dark:text-text-secondary font-medium">
            {user?.phone || 'Chưa cập nhật số điện thoại'}
          </p>
        </div>

        {/* Player Stats - Using placeholder data since API doesn't provide stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Chỉ số cá nhân
          </h3>
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
                <div
                  className="h-full bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  style={{ width: '75%' }}
                ></div>
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
                <div
                  className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: '70%' }}
                ></div>
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
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(17,212,115,0.5)]"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Teams */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Đội bóng của tôi ({teams.length})
          </h3>

          {isLoadingTeams ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4 mx-auto" />
                <p className="text-sm text-gray-500">Đang tải danh sách đội...</p>
              </div>
            </div>
          ) : teamsError ? (
            <ErrorState message={teamsError} onRetry={() => window.location.reload()} />
          ) : teams.length === 0 ? (
            <EmptyState icon="sports_soccer" title="Chưa tham gia đội nào" description="Hãy tìm hoặc tạo đội để bắt đầu!" />
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => navigate(appRoutes.teamDetail(team.id))}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 active:scale-98 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <TeamAvatar src={team.logo} size="sm" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{team.name}</h4>
                      <p className="text-xs text-primary font-medium">
                        {team.membersCount || 0} thành viên
                      </p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Menu */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <ThemeSwitch />

          {[
            { icon: 'settings', label: 'Cài đặt tài khoản' },
            {
              icon: 'notifications',
              label: 'Thông báo',
              badge: '3',
              action: () => navigate(appRoutes.notifications),
            },
            { icon: 'help', label: 'Trợ giúp & Hỗ trợ' },
            { icon: 'logout', label: 'Đăng xuất', color: 'text-red-500', action: handleLogout },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className={`flex items-center justify-between p-4 ${
                idx !== 3 ? 'border-b border-gray-100 dark:border-white/5' : ''
              } active:bg-gray-50 dark:active:bg-white/5 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon} className={item.color || 'text-gray-500'} />
                <span
                  className={`font-medium ${item.color || 'text-slate-900 dark:text-white'}`}
                >
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {!item.badge && <Icon name="chevron_right" className="text-gray-400 text-sm" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
