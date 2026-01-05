import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { appRoutes } from '@/utils/navigation';

/**
 * OpponentDetail Screen
 *
 * View opponent team details before inviting to match.
 */
const OpponentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { opponentId } = useParams<{ opponentId: string }>();

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
           <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE")' }}></div>
           <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
        </div>
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="size-24 rounded-2xl border-4 border-background-light dark:border-background-dark bg-surface-dark overflow-hidden shadow-xl">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE" alt="Team Logo" />
          </div>
        </div>
      </div>

      <div className="mt-14 px-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Cá Sấu FC</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                    <Icon name="location_on" className="text-sm" />
                    <span className="text-sm font-medium">Cách 2.5km • Q. Tân Bình</span>
                </div>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                95% Hợp cạ
            </div>
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Anh em đá giao lưu mồ hôi là chính, không cay cú, không chơi xấu. Thường đá sân Chảo Lửa thứ 3-5-7 hàng tuần.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">Sân 7</span>
            <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">Trung bình</span>
            <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">Vui vẻ</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-8">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Chỉ số sức mạnh</h3>
        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
            {/* Attack */}
            <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-500">Tấn công</span>
                    <span className="text-slate-900 dark:text-white">8.0/10</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '80%' }}></div>
                </div>
            </div>
            {/* Defense */}
            <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-500">Phòng thủ</span>
                    <span className="text-slate-900 dark:text-white">6.5/10</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
            </div>
             {/* Fairplay */}
             <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-primary">Fair-play</span>
                    <span className="text-slate-900 dark:text-white">10/10</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                </div>
            </div>
        </div>
      </div>

       {/* Recent Matches */}
       <div className="px-6 mt-8 mb-4">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Trận đấu gần đây</h3>
        <div className="space-y-3">
             <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">10/05</span>
                    <div className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">W</div>
                    <span className="text-sm font-semibold dark:text-white">vs Tiger FC</span>
                </div>
                <span className="text-sm font-mono font-bold dark:text-white">5 - 3</span>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">05/05</span>
                    <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">L</div>
                    <span className="text-sm font-semibold dark:text-white">vs Storm Utd</span>
                </div>
                <span className="text-sm font-mono font-bold dark:text-white">2 - 4</span>
             </div>
        </div>
      </div>

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
            onClick={() => navigate(appRoutes.matchInvite)}
          >
            Mời giao lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpponentDetail;
