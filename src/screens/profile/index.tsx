import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, ThemeSwitch } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useUser, useAuthActions, useAuthStore } from '@/stores/auth.store';
import { STAT_COLORS, STAT_ICONS } from '@/constants/design';

/**
 * Profile Screen
 *
 * User profile with stats, teams, and settings.
 * - Loads data from store (no direct API calls)
 * - Pull-to-refresh to reload profile
 * - Banner display as background behind avatar
 */
const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const { getProfile } = useAuthActions();
  const authStore = useAuthStore();

  // Pull-to-refresh state
  const [pullState, setPullState] = useState({
    isPulling: false,
    pullDistance: 0,
    shouldRefresh: false,
  });

  // Refs for pull-to-refresh
  const touchStartY = useRef(0);
  const currentScrollTop = useRef(0);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    currentScrollTop.current = e.currentTarget.scrollTop;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only allow pull when at the top
    if (currentScrollTop.current > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    // Only respond to downward pull
    if (diff > 0) {
      setPullState({
        isPulling: true,
        pullDistance: Math.min(diff * 0.5, 120), // Damping effect
        shouldRefresh: diff > 100,
      });
    }
  };

  const handleTouchEnd = async () => {
    if (pullState.shouldRefresh) {
      // Force refresh profile from API
      await handleRefresh();
    }

    setPullState({
      isPulling: false,
      pullDistance: 0,
      shouldRefresh: false,
    });
  };

  // Refresh handler
  const handleRefresh = async () => {
    try {
      await getProfile(true); // forceRefresh = true
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Default stats values - divide by 10 because DB stores max 100, UI shows max 10
  const defaultStats = { attack: 7.5, defense: 7.0, technique: 7.5 };
  const stats = user?.playerStats
    ? {
        attack: user.playerStats.attack / 10,
        defense: user.playerStats.defense / 10,
        technique: user.playerStats.technique / 10,
      }
    : defaultStats;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header
        title="Hồ sơ cá nhân"
        showBack={false}
      />

      {/* Pull-to-refresh indicator */}
      {pullState.isPulling && (
        <div
          className="flex items-center justify-center transition-all duration-150 overflow-hidden"
          style={{ height: pullState.pullDistance, opacity: pullState.pullDistance / 120 }}
        >
          <Icon
            name="refresh"
            className={`text-primary ${pullState.shouldRefresh ? 'animate-spin' : ''}`}
          />
        </div>
      )}

      {/* Refresh indicator */}
      {authStore.isLoading && !pullState.isPulling && user && (
        <div className="flex items-center justify-center py-2">
          <Icon name="refresh" className="animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
        </div>
      )}

      <div
        className="p-4 overflow-y-auto pb-safe-with-nav"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Profile Header with Banner */}
        <div className="mb-6">
          {/* Banner Section */}
          {user?.banner ? (
            <div className="relative -mx-4 -mt-4 mb-16 h-48 overflow-hidden">
              <img
                src={user.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
            </div>
          ) : (
            <div className="relative -mx-4 -mt-4 mb-16 h-32 bg-gradient-to-r from-primary to-green-600"></div>
          )}

          {/* Avatar - overlaps banner */}
          <div className="relative flex flex-col items-center">
            <div className="relative -mt-20 mb-3">
              <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden bg-gray-200 dark:bg-white/5">
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

            {/* Name with edit icon */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Người dùng'}</h2>
              <button
                onClick={() => navigate(appRoutes.profileEdit)}
                className="p-1 text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                <Icon name="edit" className="text-lg" />
              </button>
            </div>

            <p className="text-gray-500 dark:text-text-secondary font-medium">
              {user?.phone || 'Chưa cập nhật số điện thoại'}
            </p>

            {/* Position and Jersey Number */}
            {(user?.position || user?.jerseyNumber) && (
              <div className="flex items-center gap-3 mt-2 text-sm">
                {user.position && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    <Icon name="sports_soccer" className="text-sm" />
                    {user.position}
                  </div>
                )}
                {user.jerseyNumber && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full font-bold">
                    <Icon name="tag" className="text-sm" />
                    #{user.jerseyNumber}
                  </div>
                )}
              </div>
            )}

            {/* Bio */}
            {user?.bio && (
              <p className="mt-3 text-sm text-gray-600 dark:text-text-secondary text-center max-w-md px-4">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Player Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Chỉ số cá nhân
          </h3>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
            {/* Attack */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className={`flex items-center gap-2 ${STAT_COLORS.attack.main} font-bold text-sm`}>
                  <div className={`p-1 ${STAT_COLORS.attack.bg} rounded`}>
                    <Icon name={STAT_ICONS.attack} className="text-sm" />
                  </div>
                  Tấn công
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{stats.attack}</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${STAT_COLORS.attack.gradient} rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
                  style={{ width: `${stats.attack * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Defense */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className={`flex items-center gap-2 ${STAT_COLORS.defense.main} font-bold text-sm`}>
                  <div className={`p-1 ${STAT_COLORS.defense.bg} rounded`}>
                    <Icon name={STAT_ICONS.defense} className="text-sm" />
                  </div>
                  Phòng thủ
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{stats.defense}</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${STAT_COLORS.defense.gradient} rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                  style={{ width: `${stats.defense * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Technique */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className={`flex items-center gap-2 ${STAT_COLORS.technique.main} font-bold text-sm`}>
                  <div className={`p-1 ${STAT_COLORS.technique.bg} rounded`}>
                    <Icon name={STAT_ICONS.technique} className="text-sm" />
                  </div>
                  Kỹ thuật
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{stats.technique}</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${STAT_COLORS.technique.gradient} rounded-full shadow-[0_0_10px_rgba(17,212,115,0.5)]`}
                  style={{ width: `${stats.technique * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Teams - Hidden */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Đội bóng của tôi ({myTeams.length})
          </h3>

          {teamStore.isLoading && myTeams.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Icon name="refresh" className="animate-spin text-4xl text-primary mb-4 mx-auto" />
                <p className="text-sm text-gray-500">Đang tải danh sách đội...</p>
              </div>
            </div>
          ) : myTeams.length === 0 ? (
            <EmptyState icon="sports_soccer" title="Chưa tham gia đội nào" description="Hãy tìm hoặc tạo đội để bắt đầu!" />
          ) : (
            <div className="space-y-3">
              {myTeams.map((team) => (
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
                        {team.memberCount || 0} thành viên
                      </p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* Settings Menu */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <ThemeSwitch />

          {[
            {
              icon: 'notifications',
              label: 'Thông báo',
              badge: '3',
              action: () => navigate(appRoutes.notifications),
            },
            { icon: 'help', label: 'Trợ giúp & Hỗ trợ' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className={`flex items-center justify-between p-4 ${
                idx !== 1 ? 'border-b border-gray-100 dark:border-white/5' : ''
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
