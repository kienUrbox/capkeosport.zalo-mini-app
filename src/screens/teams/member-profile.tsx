import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Icon, TeamAvatar } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * MemberProfile Screen
 *
 * View member details with stats, team info, and intro.
 */
const MemberProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, memberId } = useParams<{ teamId: string; memberId: string }>();

  // Mock Data for "Nguyễn Văn A"
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header title="Thông tin thành viên" onBack={() => navigate(-1)} rightAction={
        <button className="p-2 text-gray-500 hover:text-slate-900 dark:hover:text-white">
          <Icon name="more_vert" />
        </button>
      } />

      <div className="p-4 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="relative mb-4">
            <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVTbFbEVKyBAT5wyQDrv7lnWXESXkvb8eUj3e1kAsxwVEClkl8R16ZgndkQ5MiXIdQeQyikmJyFpSrs3gy7Nrh05FPLNvuUbee73ajLOhm2zbYP1u1G91fw5tAfKsZcyOiz-XpOxEqIYlOZH1F19lsDCgBqycoEm50-LjpGnmU3tjLRWzTOcS13En2OwxJErDMn8WYetuT0WKhCzhW4r4NVFR4y_ecMILTeqfpytlGSOu72Vbx0sSKpF6dfRg_nc69NMCY_Mtpsy9m" className="w-full h-full object-cover" />
            </div>
            {/* Admin Badge */}
            <div className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1.5 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm" title="Admin">
              <Icon name="star" className="text-xs" filled />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nguyễn Văn A</h2>
          <div className="flex items-center gap-2 text-gray-500 dark:text-text-secondary font-medium mt-1">
            <span>Tiền đạo</span>
            <span className="size-1 rounded-full bg-gray-400"></span>
            <span>Số 10</span>
          </div>
          <div className="mt-2 text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            Quản trị viên
          </div>
        </div>

        {/* Player Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Chỉ số kỹ năng</h3>
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-5">

            {/* Attack */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <div className="p-1 bg-red-500/10 rounded"><Icon name="flash_on" className="text-sm" /></div>
                  Tấn công
                </div>
                <span className="font-bold text-slate-900 dark:text-white">9.0</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            {/* Defense */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                  <div className="p-1 bg-blue-500/10 rounded"><Icon name="shield" className="text-sm" /></div>
                  Phòng thủ
                </div>
                <span className="font-bold text-slate-900 dark:text-white">6.5</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* Technique */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <div className="p-1 bg-primary/10 rounded"><Icon name="sports_soccer" className="text-sm" /></div>
                  Kỹ thuật
                </div>
                <span className="font-bold text-slate-900 dark:text-white">8.0</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Participating Teams (Only showing common or public) */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Đội bóng</h3>
          <div className="space-y-3">
            <div
              onClick={() => navigate(appRoutes.teamDetail(teamId))}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <TeamAvatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9" size="sm" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">FC Sài Gòn</h4>
                  <p className="text-xs text-primary font-medium">Quản trị viên</p>
                </div>
              </div>
              <Icon name="chevron_right" className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Giới thiệu</h4>
          <p className="text-slate-900 dark:text-white text-sm leading-relaxed">
            Đam mê bóng đá từ nhỏ, đá được cả 2 chân. Thích lối đá ban bật nhỏ, hạn chế va chạm mạnh.
          </p>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="secondary" className="flex-1" icon="call">Gọi điện</Button>
          <Button variant="primary" className="flex-[2]" icon="chat">Nhắn tin</Button>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileScreen;
