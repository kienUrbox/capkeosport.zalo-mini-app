import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TeamAvatar, Button, BottomNav } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

type TabType = 'pending' | 'live' | 'history';

interface PendingMatch {
  id: string;
  team: string;
  avatar: string;
  time: string;
  date: string;
  location: string;
  type: 'received' | 'sent' | 'accepted';
  message?: string;
}

interface ActiveMatch {
  id: string;
  team: string;
  avatar: string;
  time: string;
  date: string;
  location: string;
  score?: string;
  stage: 'upcoming' | 'live' | 'finished';
}

interface HistoryMatch {
  id: string;
  date: string;
  result: 'W' | 'L' | 'D';
  score: string;
  opponent: string;
  avatar: string;
  location: string;
}

const MY_TEAMS = [
  {
    id: 't1',
    name: 'FC Sài Gòn',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9',
  },
  {
    id: 't2',
    name: 'Old Boys FC',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDljyEJhi2zU-3QBVHfZ8QbZfKnazIoWQZAmqG7G1mNu8s6VsSJGYsnixLJaJTzhPxmh96DLuOiFNI1dhApZXHqobLdDAGMJ8S0abR7anNyvUa1FhvaUAKEa4EKyuvyXFWNuXksQRp__T-86x-LocMMsoVsxRdEV1tW9Ae2gRsreDNFbVDoY4TUev0aKDr6INDrJBmeXcL5K55IKacorRikenjrfUvZkE8bnSGxs3BMP1b6N6AUwZy8zBlI_B4Y6hsK8LoFmzlVF-al',
  },
];

/**
 * MatchSchedule Screen
 *
 * 3-tab interface: Pending (Chờ kèo), Live (Lịch đấu), History (Lịch sử)
 * Each tab has completely different card layouts and actions.
 */
const MatchScheduleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(MY_TEAMS[0]);

  // Simple toast helper
  const showToast = (message: string) => {
    alert(message);
  };

  const tabs = [
    { id: 'pending' as const, label: 'Chờ kèo' },
    { id: 'live' as const, label: 'Lịch đấu' },
    { id: 'history' as const, label: 'Lịch sử' },
  ];

  const pendingMatches: PendingMatch[] = [
    {
      id: '1',
      team: 'Văn Phòng Utd',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
      time: '18:00',
      date: '16/05',
      location: 'Sân K34',
      type: 'received',
      message: 'Giao lưu nhẹ nhàng chia tiền sân nha bạn!',
    },
    {
      id: '2',
      team: 'Tiger FC',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdSvJy9n3m4nDJboxMNyYIffoPOU-q_PGbSpEtCD7oZ3QLnawTx_1DEjQVzWpwzx6GI0HV0JsCpXaMYDzdOusm7IV8SDt-tv7lcvKkU9jgDe0q4JLtzD9NXRWWP0gualfKFckerrNu7uXjyLayhLsD4LPOLodvjUQxqIKDw0C25gTjlVsjebdqgrT6zpzHAJNBdjD7Sf8i6GBSnDq9Gn6J1kwtIiNbLUTGWhLS8YzzlBfZQNtaxu43uCkI2p3Y1JZYeAdvo81iUYE7',
      time: '19:30',
      date: '18/05',
      location: 'Sân Viettel',
      type: 'sent',
    },
    {
      id: '3',
      team: 'Cá Sấu FC',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE',
      time: '20:00',
      date: '20/05',
      location: 'Sân Chảo Lửa',
      type: 'accepted',
      message: 'Đã chốt sân số 3, anh em nhớ mang áo xanh nhé.',
    },
  ];

  const activeMatches: ActiveMatch[] = [
    {
      id: '4',
      team: 'Storm FC',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdPDVsU8HjXm7-BhSIWmJN6Ol7OqhYE-e1RWAMjoVIKjbNnq9dTvsofyF6O-IG9qZze4u9TELsdTw6yyQ0vM5hr4HG5UeAXrqppEiD9TXiHp8zXV3qkl3BjxK32D45DodzuIog1UC5VF1iK8OH_TX-Jfe2hwNZ0bINoK0E14pNsxl5jXu32L6N-r3L2I-pOD2FnpVliWPD6Fcb4DPQcf-ET4_XYzK_vs5HNlL1loJ7zsLl7Ra4JyZhj0n_i2Rt6F4OEDVLMo9k9Ucg',
      time: "35'",
      date: 'Hôm nay',
      location: 'Sân Quận 7',
      score: '2 - 1',
      stage: 'live',
    },
    {
      id: '5',
      team: 'FC Anh Em',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBypvDsi-D_phTOtQVDsuko1_OaeLHOPwHmhVianjSwwv5eXiQ5TI7fie-VKOFm-iNPkFWxJww3Phok10XnM2xeMBaAhHiM6qPUAdUNYq5nf1AvtF-q24k4xmzXc1hWjuPlMOqQOniDFxVh0ZkHaooaQ4OYzSSuMP9u6TNYh0DkSG6liPhKWavxJG405PNn8issj3m_-RoaeJs2kPsmhV5S0nTTxwPAbxwfKAPtRPkzmjUDq4_45ql8q8y7Byllkt5Ou8PGPsisKYJp',
      time: '19:30',
      date: 'Tối nay',
      location: 'Sân PM',
      stage: 'upcoming',
    },
    {
      id: '6',
      team: 'Old Boys',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDljyEJhi2zU-3QBVHfZ8QbZfKnazIoWQZAmqG7G1mNu8s6VsSJGYsnixLJaJTzhPxmh96DLuOiFNI1dhApZXHqobLdDAGMJ8S0abR7anNyvUa1FhvaUAKEa4EKyuvyXFWNuXksQRp__T-86x-LocMMsoVsxRdEV1tW9Ae2gRsreDNFbVDoY4TUev0aKDr6INDrJBmeXcL5K55IKacorRikenjrfUvZkE8bnSGxs3BMP1b6N6AUwZy8zBlI_B4Y6hsK8LoFmzlVF-al',
      time: 'Kết thúc',
      date: 'Vừa xong',
      location: 'Sân K34',
      score: '4 - 3',
      stage: 'finished',
    },
  ];

  const historyMatches: HistoryMatch[] = [
    {
      id: 'h1',
      date: '12/05',
      result: 'W',
      score: '5 - 3',
      opponent: 'Cá Sấu FC',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE',
      location: 'Sân Chảo Lửa',
    },
    {
      id: 'h2',
      date: '10/05',
      result: 'L',
      score: '2 - 4',
      opponent: 'Tiger Utd',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdSvJy9n3m4nDJboxMNyYIffoPOU-q_PGbSpEtCD7oZ3QLnawTx_1DEjQVzWpwzx6GI0HV0JsCpXaMYDzdOusm7IV8SDt-tv7lcvKkU9jgDe0q4JLtzD9NXRWWP0gualfKFckerrNu7uXjyLayhLsD4LPOLodvjUQxqIKDw0C25gTjlVsjebdqgrT6zpzHAJNBdjD7Sf8i6GBSnDq9Gn6J1kwtIiNbLUTGWhLS8YzzlBfZQNtaxu43uCkI2p3Y1JZYeAdvo81iUYE7',
      location: 'Sân K34',
    },
    {
      id: 'h3',
      date: '01/05',
      result: 'D',
      score: '3 - 3',
      opponent: 'Văn Phòng FC',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
      location: 'Sân Quận 7',
    },
  ];

  const handleNavTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate(appRoutes.dashboard, { replace: true });
        break;
      case 'schedule':
        // Already here
        break;
      case 'match':
        navigate(appRoutes.matchFind, { replace: true });
        break;
      case 'team':
        navigate(appRoutes.teams, { replace: true });
        break;
      case 'profile':
        navigate(appRoutes.profile, { replace: true });
        break;
    }
  };

  const renderPendingStatus = (type: PendingMatch['type']) => {
    switch (type) {
      case 'received':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            Lời mời mới
          </span>
        );
      case 'sent':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-500 border border-gray-500/20">
            Đã gửi • Chờ phản hồi
          </span>
        );
      case 'accepted':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            Đã đồng ý
          </span>
        );
    }
  };

  const renderPendingActions = (match: PendingMatch) => {
    switch (match.type) {
      case 'received':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs"
              icon="close"
              onClick={() => showToast('Đã từ chối lời mời')}
            >
              Từ chối
            </Button>
            <Button className="flex-1 h-10 text-xs" icon="check" onClick={() => showToast('Đã chấp nhận lời mời')}>
              Chấp nhận
            </Button>
          </div>
        );
      case 'sent':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" className="flex-1 h-10 text-xs" icon="undo" onClick={() => showToast('Đã hủy lời mời')}>
              Hủy lời mời
            </Button>
            <Button variant="secondary" className="flex-1 h-10 text-xs" icon="edit" onClick={() => navigate(appRoutes.matchInvite)}>
              Sửa thông tin
            </Button>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" className="flex-1 h-10 text-xs" icon="chat" onClick={() => showToast('Mở chat...')}>
              Nhắn tin
            </Button>
            <Button className="flex-1 h-10 text-xs bg-primary text-slate-900 shadow-lg shadow-primary/20" icon="handshake" onClick={() => showToast('Đã chốt kèo thành công')}>
              Chốt kèo
            </Button>
          </div>
        );
    }
  };

  const renderActiveStatus = (stage: ActiveMatch['stage']) => {
    switch (stage) {
      case 'upcoming':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Sắp diễn ra
          </span>
        );
      case 'live':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Đang đá
          </span>
        );
      case 'finished':
        return (
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-500 border border-gray-500/20">
            Vừa kết thúc
          </span>
        );
    }
  };

  const renderActiveActions = (match: ActiveMatch) => {
    switch (match.stage) {
      case 'upcoming':
        return (
          <div
            className="flex gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="secondary" className="flex-1 h-9 text-xs" icon="person_off" onClick={() => showToast('Đã báo bận')}>
              Báo bận
            </Button>
            <Button className="flex-1 h-9 text-xs" icon="how_to_reg" onClick={() => showToast('Đã điểm danh thành công')}>
              Điểm danh
            </Button>
          </div>
        );
      case 'live':
        return (
          <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              className="flex-1 h-10 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
              icon="flag"
              onClick={() => showToast('Trận đấu đã kết thúc')}
            >
              Kết thúc
            </Button>
            <Button
              className="flex-[1.5] h-10 text-xs bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
              icon="scoreboard"
              onClick={() => navigate(appRoutes.matchUpdateScore(match.id))}
            >
              Cập nhật tỉ số
            </Button>
          </div>
        );
      case 'finished':
        return (
          <div
            className="flex gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="secondary" className="flex-1 h-9 text-xs" icon="edit" onClick={() => navigate(appRoutes.matchUpdateScore(match.id))}>
              Sửa kết quả
            </Button>
            <Button className="flex-1 h-9 text-xs bg-slate-800 text-white dark:bg-white dark:text-slate-900" icon="verified" onClick={() => showToast('Đã xác nhận kết quả')}>
              Xác nhận
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe-with-nav">
      {/* Custom Header with Team Selector */}
      <div className="pt-6 px-4 pb-2 flex items-center justify-between bg-background-light dark:bg-background-dark sticky top-0 z-30 safe-area-top">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lịch thi đấu</h1>
        <div
          onClick={() => setShowTeamSelector(true)}
          className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          <TeamAvatar src={currentTeam.logo} size="sm" className="w-6 h-6" />
          <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[100px] truncate">{currentTeam.name}</span>
          <Icon name="expand_more" className="text-gray-400 text-sm" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-background-dark text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* PENDING TAB */}
        {activeTab === 'pending' && (
          <div className="space-y-4 animate-fade-in">
            {pendingMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden transition-all"
              >
                {match.type === 'accepted' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full -mr-8 -mt-8" />
                )}

                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <TeamAvatar src={match.avatar} size="sm" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{match.team}</h4>
                      <div className="mt-1">{renderPendingStatus(match.type)}</div>
                    </div>
                  </div>
                  <button className="text-gray-400">
                    <Icon name="more_horiz" />
                  </button>
                </div>

                {match.message && (
                  <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg mb-3 text-xs text-gray-600 dark:text-gray-300 italic flex gap-2 border border-gray-100 dark:border-white/5">
                    <Icon name="format_quote" className="text-gray-400 rotate-180 text-sm" />
                    <span className="flex-1">{match.message}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-text-secondary bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1 shrink-0">
                    <Icon name="calendar_today" size="sm" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {match.time} • {match.date}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-white/10 shrink-0" />
                  <div className="flex items-center gap-1 min-w-0">
                    <Icon name="location_on" size="sm" />
                    <span className="truncate">{match.location}</span>
                  </div>
                </div>

                {renderPendingActions(match)}
              </div>
            ))}

            {pendingMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 animate-fade-in">
                <Icon name="inbox" className="text-4xl mb-2 opacity-50" />
                <p className="text-sm">Hiện không có lời mời nào</p>
              </div>
            )}
          </div>
        )}

        {/* LIVE/ACTIVE TAB */}
        {activeTab === 'live' && (
          <div className="space-y-4 animate-fade-in">
            {activeMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(appRoutes.matchDetail(match.id))}
                className={`bg-white dark:bg-surface-dark p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:border-primary/50 active:scale-[0.99] ${
                  match.stage === 'live' ? 'border-red-500/30 ring-1 ring-red-500/20' : 'border-gray-100 dark:border-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  {renderActiveStatus(match.stage)}
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                    <Icon name="location_on" className="text-xs" />
                    {match.location}
                  </div>
                </div>

                {/* Match Content - VS Style */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2 w-1/3">
                    <TeamAvatar src={currentTeam.logo} size="sm" />
                    <span className="text-xs font-bold truncate w-full text-center">{currentTeam.name}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center w-1/3">
                    {match.stage === 'upcoming' ? (
                      <div className="text-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white block">{match.time}</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{match.date}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className={`text-3xl font-extrabold font-mono block ${match.stage === 'live' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                          {match.score}
                        </span>
                        {match.stage === 'live' && <span className="text-xs text-red-500 font-bold animate-pulse">{match.time}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/3">
                    <TeamAvatar src={match.avatar} size="sm" />
                    <span className="text-xs font-bold truncate w-full text-center">{match.team}</span>
                  </div>
                </div>

                {renderActiveActions(match)}
              </div>
            ))}

            {activeMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Icon name="event_busy" className="text-4xl mb-2 opacity-50" />
                <p className="text-sm">Không có lịch thi đấu nào</p>
                <Button variant="ghost" className="mt-2 text-primary" onClick={() => navigate(appRoutes.matchFind)}>
                  Tìm kèo ngay
                </Button>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            {historyMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(appRoutes.matchDetail(match.id))}
                className="bg-white dark:bg-surface-dark p-0 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden"
              >
                {/* Header Status Bar - Colored based on result */}
                <div
                  className={`h-1.5 w-full ${match.result === 'W' ? 'bg-green-500' : match.result === 'L' ? 'bg-red-500' : 'bg-gray-400'}`}
                />

                <div className="p-4">
                  {/* Top Row: Date & Location */}
                  <div className="flex justify-between items-center mb-4 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Icon name="calendar_today" className="text-xs" />
                      {match.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="location_on" className="text-xs" />
                      {match.location}
                    </div>
                  </div>

                  {/* Main Content: Team vs Team & Score */}
                  <div className="flex items-center justify-between mb-4">
                    {/* My Team */}
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <TeamAvatar src={currentTeam.logo} size="sm" />
                      <span className="text-xs font-bold text-center truncate w-full">{currentTeam.name}</span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                      <div className="text-2xl font-black text-slate-900 dark:text-white tracking-widest">{match.score}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          match.result === 'W'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : match.result === 'L'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                        }`}
                      >
                        {match.result === 'W' ? 'THẮNG' : match.result === 'L' ? 'THUA' : 'HÒA'}
                      </span>
                    </div>

                    {/* Opponent */}
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <TeamAvatar src={match.avatar} size="sm" />
                      <span className="text-xs font-bold text-center truncate w-full">{match.opponent}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
                    <Button
                      variant="secondary"
                      className="flex-1 h-9 text-xs"
                      icon="info"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(appRoutes.matchDetail(match.id));
                      }}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      className="flex-1 h-9 text-xs"
                      icon="replay"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(appRoutes.matchInvite);
                      }}
                    >
                      Đá lại
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Selector Bottom Sheet */}
      {showTeamSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowTeamSelector(false)} />

          {/* Sheet */}
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Xem lịch thi đấu của</h3>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              {MY_TEAMS.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setCurrentTeam(team);
                    setShowTeamSelector(false);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all active:scale-[0.98] ${
                    currentTeam.id === team.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <TeamAvatar src={team.logo} />
                  <div className="flex-1 text-left">
                    <h4 className={`font-bold ${currentTeam.id === team.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                      {team.name}
                    </h4>
                    <p className="text-xs text-gray-500">Quản trị viên</p>
                  </div>
                  {currentTeam.id === team.id && (
                    <div className="size-6 bg-primary rounded-full flex items-center justify-center text-black">
                      <Icon name="check" className="text-sm" />
                    </div>
                  )}
                </button>
              ))}

              {/* Add new team option */}
              <button
                onClick={() => {
                  setShowTeamSelector(false);
                  navigate(appRoutes.teamCreate);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-primary hover:border-primary transition-colors"
              >
                <Icon name="add" />
                <span className="font-medium">Tạo đội mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="schedule" onTabChange={handleNavTabChange} />
    </div>
  );
};

export default MatchScheduleScreen;
