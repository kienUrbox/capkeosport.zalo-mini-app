import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { appRoutes } from '@/utils/navigation';

/**
 * MatchFound Screen
 *
 * Celebration screen shown when a match is found with animations and confetti.
 */
const MatchFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-full bg-background-light dark:bg-background-dark relative overflow-hidden transition-colors duration-300">
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(5deg); }
          70% { transform: scale(0.9) rotate(-5deg); }
          100% { opacity: 1; transform: scale(1) rotate(-6deg); }
        }
        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-100px) rotate(-45deg); }
          100% { opacity: 1; transform: translateX(0) rotate(-12deg); }
        }
        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(100px) rotate(45deg); }
          100% { opacity: 1; transform: translateX(0) rotate(12deg); }
        }
        @keyframes badgePop {
          0% { opacity: 0; transform: scale(0) rotate(180deg); }
          80% { opacity: 1; transform: scale(1.5) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1.25) rotate(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-slide-left { animation: slideLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-slide-right { animation: slideRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-badge-pop { animation: badgePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards; }
        .animate-fade-up { animation: fadeInUp 0.8s ease-out 1s forwards; }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20 grayscale"></div>

      {/* Gradient Overlay: Light (White fade) vs Dark (Black fade) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-background-light dark:from-background-dark/80 dark:via-background-dark/90 dark:to-background-dark"></div>

      {/* Animated Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-primary/30 dark:bg-primary/20 blur-[100px] animate-pulse rounded-full pointer-events-none"></div>

      {/* Simple Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full opacity-0 shadow-sm"
                 style={{
                    backgroundColor: ['#3b82f6', '#FFD700', '#60a5fa'][i % 3], // Changed from #11d473
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animation: `fall ${3 + Math.random() * 2}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`
                 }}
            />
         ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">

        {/* Title */}
        <div className="text-center mb-12 opacity-0 animate-pop-in">
          <h1 className="text-5xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-primary to-primary-dark dark:from-primary dark:via-white dark:to-primary drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(17,212,115,0.5)] transform -rotate-6">
            IT'S A MATCH!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-medium">Đội bạn và <span className="text-slate-900 dark:text-white font-bold">Cá Sấu FC</span> rất hợp cạ nhau</p>
        </div>

        {/* Avatars Collision */}
        <div className="flex items-center justify-center w-full mb-16 relative h-40">
          {/* Left Team (User) */}
          <div className="absolute left-[15%] opacity-0 animate-slide-left z-10">
            <div className="size-32 rounded-full border-4 border-white dark:border-white shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden bg-gray-100 dark:bg-surface-dark">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* VS Badge */}
          <div className="absolute z-20 bg-primary text-background-dark font-black text-xl size-12 flex items-center justify-center rounded-full border-4 border-white dark:border-background-dark shadow-xl opacity-0 animate-badge-pop">
            VS
          </div>

          {/* Right Team (Opponent) */}
          <div className="absolute right-[15%] opacity-0 animate-slide-right z-0">
            <div className="size-32 rounded-full border-4 border-primary shadow-xl dark:shadow-[0_0_30px_rgba(17,212,115,0.4)] overflow-hidden bg-gray-100 dark:bg-surface-dark">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-full shadow-lg border border-gray-100 dark:border-none">
               <Icon name="favorite" filled className="text-red-500 text-sm" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 max-w-sm opacity-0 animate-fade-up">
          <Button
            fullWidth
            onClick={() => navigate(appRoutes.matchInvite)}
            className="h-14 text-lg bg-primary hover:bg-primary-dark text-background-dark hover:text-white transition-colors border-0 shadow-xl shadow-primary/30"
            icon="send"
          >
            GỬI LỜI MỜI GIAO LƯU
          </Button>

          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate(appRoutes.matchFind)}
            className="h-14 text-slate-600 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-white/20 dark:hover:bg-white/10"
            icon="search"
          >
            Tìm đội khác
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchFound;
