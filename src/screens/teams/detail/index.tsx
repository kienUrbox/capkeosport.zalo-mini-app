import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon, Button } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * TeamDetail Screen
 *
 * Display team information with cover, logo, stats, and members.
 */
const TeamDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header title="Chi tiết đội bóng" onBack={() => navigate(-1)} />

      {/* Cover & Header Info */}
      <div className="relative">
        <div className="h-40 w-full overflow-hidden">
          <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(16,34,25,0.2), rgba(16,34,25,0.9)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmyUKbWlNoXecN8CHjDjXp5IddTXSZcP54Wsk-N5ToWcDBY3c0ajCtNHeKoxBtrQxx45dG68lIuAm3RfLR-EDZ34oN-empT027zV4qSqw-KP-LP29-k5zEGdKhbfBCpmC2SjktJZQF51194CD6Z2yLba-cu9x_2ZYymXZkxBWQyV7VoXMLrmmV9Rousy5Hg6cXZBppIM_t5rA-LOgv4IAtemyaXG1M0JWiKiLojEln5-wN9zaAwCASwfWb-EYF0qmb4KW_MnwhEhOQ")' }}></div>
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="size-24 rounded-full border-4 border-background-light dark:border-background-dark bg-surface-dark overflow-hidden shadow-lg">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9" alt="Team Logo" />
          </div>
        </div>
      </div>

      <div className="mt-12 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FC Sài Gòn</h1>
        <div className="flex justify-center gap-2 mt-3">
          <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-xs font-medium flex items-center gap-1"><Icon name="wc" className="text-sm" /> Nam</span>
          <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-xs font-medium flex items-center gap-1"><Icon name="hotel_class" className="text-sm" /> Trung bình</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5 space-y-4 shadow-sm">
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon name="location_on" className="text-lg" /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Khu vực</p>
              <p className="text-sm font-medium">Quận 7, TP.HCM</p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon name="sports_soccer" className="text-lg" /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Loại sân</p>
              <p className="text-sm font-medium">Sân 5 • Sân 7</p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon name="info" className="text-lg" /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Giới thiệu</p>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-300">Đội bóng văn phòng, đá vui vẻ là chính, giao lưu học hỏi, không cay cú.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Chỉ số đội</h3>
          <span className="text-primary text-sm font-medium">Chi tiết</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
            <div className="size-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center"><Icon name="flash_on" /></div>
            <span className="text-xs font-medium text-gray-500">Tấn công</span>
            <span className="font-bold text-lg">7.5</span>
          </div>
          <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
            <div className="size-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center"><Icon name="shield" /></div>
            <span className="text-xs font-medium text-gray-500">Phòng thủ</span>
            <span className="font-bold text-lg">6.0</span>
          </div>
          <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
            <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center"><Icon name="sports_soccer" /></div>
            <span className="text-xs font-medium text-gray-500">Kỹ thuật</span>
            <span className="font-bold text-lg">8.5</span>
          </div>
        </div>
      </div>

      {/* Members Summary Link */}
      <div className="px-4 mt-6">
        <h3 className="font-bold text-lg mb-3">Thành viên (14)</h3>
        <div
          onClick={() => navigate(appRoutes.teamMembers(teamId))}
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm active:bg-gray-50 dark:active:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAVTbFbEVKyBAT5wyQDrv7lnWXESXkvb8eUj3e1kAsxwVEClkl8R16ZgndkQ5MiXIdQeQyikmJyFpSrs3gy7Nrh05FPLNvuUbee73ajLOhm2zbYP1u1G91fw5tAfKsZcyOiz-XpOxEqIYlOZH1F19lsDCgBqycoEm50-LjpGnmU3tjLRWzTOcS13En2OwxJErDMn8WYetuT0WKhCzhW4r4NVFR4y_ecMILTeqfpytlGSOu72Vbx0sSKpF6dfRg_nc69NMCY_Mtpsy9m",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDljyEJhi2zU-3QBVHfZ8QbZfKnazIoWQZAmqG7G1mNu8s6VsSJGYsnixLJaJTzhPxmh96DLuOiFNI1dhApZXHqobLdDAGMJ8S0abR7anNyvUa1FhvaUAKEa4EKyuvyXFWNuXksQRp__T-86x-LocMMsoVsxRdEV1tW9Ae2gRsreDNFbVDoY4TUev0aKDr6INDrJBmeXcL5K55IKacorRikenjrfUvZkE8bnSGxs3BMP1b6N6AUwZy8zBlI_B4Y6hsK8LoFmzlVF-al",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA834-l0cKqY_4j-wZgqKqXlF3N5Qk7RjE1M4Xp8S6T2W9V0Z_L5H3Y_c7B6D1F9G2J8K4Lm0N3P5Q7R8S1T9V2W4X6Y0Z8L5K3M1N9P7Q4R2S6T8V0W3X5Y7Z9/avatar.png"
              ].map((img, i) => (
                <div key={i} className="size-10 rounded-full border-2 border-white dark:border-surface-dark overflow-hidden bg-gray-200">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="size-10 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                +11
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Xem tất cả</span>
              <span className="text-xs text-gray-500">Quản lý thành viên</span>
            </div>
          </div>
          <div className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
            <Icon name="arrow_forward" className="text-gray-400 text-lg" />
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="secondary"
            className="flex-1"
            icon="edit"
            onClick={() => navigate(appRoutes.teamEdit(teamId))}
          >
            Sửa đội
          </Button>
          <Button variant="primary" className="flex-[1.5]" icon="sports" onClick={() => navigate(appRoutes.matchFind)}>Cáp kèo</Button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailScreen;
