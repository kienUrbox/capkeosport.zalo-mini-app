import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Header, Icon, TeamAvatar, BottomNav } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

interface Team {
  id: string;
  name: string;
  logo: string;
  role: 'admin' | 'member';
  members: number;
  stats?: {
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
  };
  nextMatch?: {
    opponent: string;
    time: string;
    location: string;
  };
}

/**
 * MyTeams Screen
 *
 * List of user's teams with admin/member badges and next match info.
 */
const TeamsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('team');

  const myTeams: Team[] = [
    {
      id: '1',
      name: 'FC Sài Gòn',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9',
      role: 'admin',
      members: 14,
      stats: {
        wins: 12,
        draws: 4,
        losses: 6,
        winRate: 67,
      },
      nextMatch: {
        opponent: 'Tiger Utd',
        time: '19:30 T5, 18/05',
        location: 'Sân Chảo Lửa',
      },
    },
    {
      id: '2',
      name: 'Old Boys FC',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDljyEJhi2zU-3QBVHfZ8QbZfKnazIoWQZAmqG7G1mNu8s6VsSJGYsnixLJaJTzhPxmh96DLuOiFNI1dhApZXHqobLdDAGMJ8S0abR7anNyvUa1FhvaUAKEa4EKyuvyXFWNuXksQRp__T-86x-LocMMsoVsxRdEV1tW9Ae2gRsreDNFbVDoY4TUev0aKDr6INDrJBmeXcL5K55IKacorRikenjrfUvZkE8bnSGxs3BMP1b6N6AUwZy8zBlI_B4Y6hsK8LoFmzlVF-al',
      role: 'member',
      members: 22,
      stats: {
        wins: 8,
        draws: 5,
        losses: 10,
        winRate: 50,
      },
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
        // Already on teams
        break;
      case 'profile':
        navigate(appRoutes.profile, { replace: true });
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
      <Header title="Đội bóng của tôi" showBack={false} rightAction={
        <button onClick={() => navigate(appRoutes.teamsCreate)} className="p-2 text-primary">
          <Icon name="add_circle" className="text-2xl" />
        </button>
      } />

      <div className="p-4 space-y-6">
        {/* Teams List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1">Danh sách đội ({myTeams.length})</h3>

          {myTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(appRoutes.teamDetail(team.id))}
              className="group bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Role Badge */}
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider ${
                team.role === 'admin'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-500'
              }`}>
                {team.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <TeamAvatar src={team.logo} size="lg" className="shrink-0" />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{team.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-text-secondary text-sm">
                    <Icon name="groups" className="text-sm" />
                    <span>{team.members} thành viên</span>
                  </div>
                </div>
              </div>

              {/* Next Match Info or Action */}
              <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                {team.nextMatch ? (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-background-dark p-2 rounded-lg">
                    <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                      <Icon name="calendar_today" className="text-sm" filled />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-500 uppercase">Trận tiếp theo</p>
                      <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">vs {team.nextMatch.opponent} • {team.nextMatch.time}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 italic">Chưa có lịch thi đấu</p>
                    {team.role === 'admin' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(appRoutes.matchFind); }}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Tìm kèo ngay
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Create New Team CTA */}
          <button
            onClick={() => navigate(appRoutes.teamsCreate)}
            className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="size-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon name="add" className="text-lg" />
            </div>
            <span className="font-semibold">Tạo đội bóng mới</span>
          </button>
        </div>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default TeamsScreen;
