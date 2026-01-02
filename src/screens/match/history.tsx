import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * MatchHistory Screen
 *
 * View past matches with filtering and stats.
 */
const MatchHistory: React.FC = () => {
  const navigate = useNavigate();

  const matches = [
    { date: '12/05', result: 'W', score: '5 - 3', opponent: 'Cá Sấu FC', location: 'Sân Chảo Lửa', isHome: true },
    { date: '10/05', result: 'L', score: '2 - 4', opponent: 'Tiger Utd', location: 'Sân K34', isHome: false },
    { date: '05/05', result: 'D', score: '4 - 4', opponent: 'Storm FC', location: 'Sân PM', isHome: true },
    { date: '01/05', result: 'W', score: '3 - 1', opponent: 'Văn Phòng FC', location: 'Sân Quận 7', isHome: true },
  ];

  const getResultColor = (res: string) => {
    switch (res) {
      case 'W': return 'bg-green-500 text-white';
      case 'L': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="Lịch sử thi đấu" onBack={() => navigate(-1)} />

      <div className="p-4 space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-2">
           <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
             <span className="block text-xl font-bold text-green-500">15</span>
             <span className="text-[10px] text-gray-500 font-bold uppercase">Thắng</span>
           </div>
           <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
             <span className="block text-xl font-bold text-gray-500">4</span>
             <span className="text-[10px] text-gray-500 font-bold uppercase">Hòa</span>
           </div>
           <div className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
             <span className="block text-xl font-bold text-red-500">3</span>
             <span className="text-[10px] text-gray-500 font-bold uppercase">Thua</span>
           </div>
        </div>

        {/* List */}
        {matches.map((match, idx) => (
          <div
            key={idx}
            onClick={() => navigate(appRoutes.matchDetail('1'))}
            className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex flex-col items-center w-10">
               <span className="text-xs font-bold text-gray-500 mb-1">{match.date}</span>
               <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${getResultColor(match.result)}`}>
                  {match.result}
               </div>
            </div>

            <div className="w-px h-10 bg-gray-100 dark:bg-white/10"></div>

            <div className="flex-1">
               <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">vs {match.opponent}</h4>
                  <span className={`font-mono font-bold ${match.result === 'W' ? 'text-green-500' : match.result === 'L' ? 'text-red-500' : 'text-gray-400'}`}>
                    {match.score}
                  </span>
               </div>
               <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="location_on" className="text-xs" />
                  {match.location}
               </div>
            </div>

            <Icon name="chevron_right" className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;
