import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, TeamAvatar, BottomNav, ThemeSwitch } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * Profile Screen
 *
 * User profile with stats, teams, and settings.
 */
const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab] = React.useState('profile');

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate(appRoutes.dashboard, { replace: true });
        break;
      case 'schedule':
        navigate(appRoutes.matchSchedule, { replace: true });
        break;
      case 'match':
        navigate(appRoutes.matchFind, { replace: true });
        break;
      case 'team':
        navigate(appRoutes.teams, { replace: true });
        break;
      case 'profile':
        // Already on profile
        break;
    }
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
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcZGCgosiZhitSLhxeXNSiZQtDcPB3OM3HOGwTPBVAKaNYIyYAO2AV7PfhJi3SQ0lDg3HuSHtt4LSvGU-krS5yrGyODyEGFUzWY4zJBhboEmEJkKGjNFsAiBkQEEcTQRK87uPMXNdAJ7fAZkYCX5KYjr1Ud6Mr09lydz1UPjarDbEg16DkNVAqKA-uCgEOvwgepT1Uy6FrBwB0a_RYF0hq47bG4Fzxr0yFXC3qMp7XOgWuy_S6ilPS3AJFyWW1bIJrx0ib9fHrAbuK"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-1 bg-green-500 size-6 rounded-full border-4 border-background-light dark:border-background-dark"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Minh Nguyễn</h2>
          <p className="text-gray-500 dark:text-text-secondary font-medium">
            Tiền vệ cánh • Số 10
          </p>
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
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <div className="p-1 bg-red-500/10 rounded">
                    <Icon name="flash_on" className="text-sm" />
                  </div>
                  Tấn công
                </div>
                <span className="font-bold text-slate-900 dark:text-white">8.5</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  style={{ width: '85%' }}
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
                <span className="font-bold text-slate-900 dark:text-white">6.0</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: '60%' }}
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
                <span className="font-bold text-slate-900 dark:text-white">9.0</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(17,212,115,0.5)]"
                  style={{ width: '90%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Teams */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Đội bóng của tôi
          </h3>
          <div className="space-y-3">
            <div
              onClick={() => navigate(appRoutes.teamDetail('1'))}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <TeamAvatar
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9"
                  size="sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">FC Sài Gòn</h4>
                  <p className="text-xs text-primary font-medium">Quản trị viên</p>
                </div>
              </div>
              <Icon name="chevron_right" className="text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 opacity-75">
              <div className="flex items-center gap-3">
                <TeamAvatar
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDljyEJhi2zU-3QBVHfZ8QbZfKnazIoWQZAmqG7G1mNu8s6VsSJGYsnixLJaJTzhPxmh96DLuOiFNI1dhApZXHqobLdDAGMJ8S0abR7anNyvUa1FhvaUAKEa4EKyuvyXFWNuXksQRp__T-86x-LocMMsoVsxRdEV1tW9Ae2gRsreDNFbVDoY4TUev0aKDr6INDrJBmeXcL5K55IKacorRikenjrfUvZkE8bnSGxs3BMP1b6N6AUwZy8zBlI_B4Y6hsK8LoFmzlVF-al"
                  size="sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Old Boys FC</h4>
                  <p className="text-xs text-gray-500">Thành viên</p>
                </div>
              </div>
              <Icon name="chevron_right" className="text-gray-400" />
            </div>
          </div>
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
            { icon: 'logout', label: 'Đăng xuất', color: 'text-red-500' },
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

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default ProfileScreen;
