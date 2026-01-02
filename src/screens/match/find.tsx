import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TeamAvatar, MatchBadge } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

interface CardData {
  id: string;
  name: string;
  distance: string;
  time: string;
  level: string;
  format: string;
  image: string;
  logo: string;
  matchPercent: number;
  members?: number;
  stats?: {
    attack: number;
    defense: number;
    technique: number;
  };
  winRate?: number;
}

const MOCK_CARDS: CardData[] = [
  {
    id: '1',
    name: 'Cá Sấu FC',
    distance: '2.5km',
    time: 'Thứ 5, 19:30',
    level: 'Trung Bình',
    format: 'Sân 7',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE',
    matchPercent: 95,
    members: 14,
    stats: { attack: 8.5, defense: 6.0, technique: 7.5 },
    winRate: 65,
  },
  {
    id: '2',
    name: 'Storm FC',
    distance: '3.1km',
    time: 'Thứ 6, 18:00',
    level: 'Khá',
    format: 'Sân 5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdPDVsU8HjXm7-BhSIWmJN6Ol7OqhYE-e1RWAMjoVIKjbNnq9dTvsofyF6O-IG9qZze4u9TELsdTw6yyQ0vM5hr4HG5UeAXrqppEiD9TXiHp8zXV3qkl3BjxK32D45DodzuIog1UC5VF1iK8OH_TX-Jfe2hwNZ0bINoK0E14pNsxl5jXu32L6N-r3L2I-pOD2FnpVliWPD6Fcb4DPQcf-ET4_XYzK_vs5HNlL1loJ7zsLl7Ra4JyZhj0n_i2Rt6F4OEDVLMo9k9Ucg',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdPDVsU8HjXm7-BhSIWmJN6Ol7OqhYE-e1RWAMjoVIKjbNnq9dTvsofyF6O-IG9qZze4u9TELsdTw6yyQ0vM5hr4HG5UeAXrqppEiD9TXiHp8zXV3qkl3BjxK32D45DodzuIog1UC5VF1iK8OH_TX-Jfe2hwNZ0bINoK0E14pNsxl5jXu32L6N-r3L2I-pOD2FnpVliWPD6Fcb4DPQcf-ET4_XYzK_vs5HNlL1loJ7zsLl7Ra4JyZhj0n_i2Rt6F4OEDVLMo9k9Ucg',
    matchPercent: 88,
    members: 20,
    stats: { attack: 7.0, defense: 8.0, technique: 6.5 },
    winRate: 50,
  },
  {
    id: '3',
    name: 'Tiger Utd',
    distance: '1.2km',
    time: 'Hôm nay, 20:30',
    level: 'Vui vẻ',
    format: 'Sân 7',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
    matchPercent: 92,
    members: 12,
    stats: { attack: 6.5, defense: 6.0, technique: 8.0 },
    winRate: 40,
  },
];

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
 * FindMatch Screen
 *
 * Tinder-style swipe interface for finding opponents.
 * Features team selector bottom sheet to choose which team to find matches for.
 */
const FindMatchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardData[]>(MOCK_CARDS);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(MY_TEAMS[0]);

  // Swipe Logic
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const removeCard = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'right') {
        navigate(appRoutes.matchFound);
      }
      setCards((prev) => prev.slice(1));
      setSwipeDirection(null);
      setDragDelta({ x: 0, y: 0 });
    }, 300); // Wait for animation
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragStart) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragDelta({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleTouchEnd = () => {
    if (!dragStart) return;
    setIsDragging(false);

    // Threshold to trigger swipe
    if (dragDelta.x > 120) {
      removeCard('right');
    } else if (dragDelta.x < -120) {
      removeCard('left');
    } else {
      // Reset if threshold not met
      setDragDelta({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  const handleClickCard = () => {
    if (Math.abs(dragDelta.x) < 5 && Math.abs(dragDelta.y) < 5) {
      navigate(appRoutes.opponentDetail(cards[0]?.id || ''));
    }
  };

  // Calculate transform style based on drag
  const getCardStyle = (index: number) => {
    if (index === 0) {
      const rotate = dragDelta.x * 0.05;
      const opacity = swipeDirection ? 0 : 1;
      const xPos = swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : dragDelta.x;

      return {
        transform: `translate(${xPos}px, ${dragDelta.y * 0.2}px) rotate(${rotate}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        opacity: opacity,
        zIndex: 10,
      };
    } else if (index === 1) {
      // Next card animation
      const scale = 0.95 + (Math.min(Math.abs(dragDelta.x), 100) / 100) * 0.05;
      return {
        transform: `scale(${scale}) translateY(10px)`,
        zIndex: 9,
        opacity: 1,
        transition: 'transform 0.1s ease',
      };
    }
    return { zIndex: 0, opacity: 0 };
  };

  // Overlay opacity for Like/Nope badges
  const likeOpacity = Math.max(0, Math.min(dragDelta.x / 100, 1));
  const nopeOpacity = Math.max(0, Math.min(-dragDelta.x / 100, 1));

  if (cards.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark items-center justify-center p-6 text-center">
        <div className="size-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 animate-bounce">
          <Icon name="sentiment_satisfied" className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hết đội rồi!</h2>
        <p className="text-gray-500 mb-6">
          Bạn đã xem hết các đội phù hợp trong khu vực. Hãy thử mở rộng tìm kiếm hoặc quay lại sau.
        </p>
        <button onClick={() => navigate(appRoutes.dashboard)} className="text-primary font-bold">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 pt-4 px-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <Icon name="arrow_back" />
        </button>

        {/* Team Selector Trigger */}
        <div
          onClick={() => setShowTeamSelector(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/10 cursor-pointer hover:scale-105 transition-transform active:scale-95"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </div>
          <p className="text-white text-xs font-bold truncate max-w-[120px]">
            Tìm cho: <span className="text-primary">{currentTeam.name}</span>
          </p>
          <Icon name="expand_more" className="text-sm text-gray-400" />
        </div>

        <button className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
          <Icon name="tune" />
        </button>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 relative mt-4">
        {cards.map((card, index) => {
          if (index > 1) return null; // Only render top 2 cards for performance

          return (
            <div
              key={card.id}
              ref={index === 0 ? cardRef : null}
              style={getCardStyle(index)}
              className="absolute w-full max-w-sm aspect-[3/4] max-h-[65vh] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col group cursor-grab active:cursor-grabbing select-none"
              onTouchStart={index === 0 ? handleTouchStart : undefined}
              onTouchMove={index === 0 ? handleTouchMove : undefined}
              onTouchEnd={index === 0 ? handleTouchEnd : undefined}
              onMouseDown={index === 0 ? handleTouchStart : undefined}
              onMouseMove={index === 0 ? handleTouchMove : undefined}
              onMouseUp={index === 0 ? handleTouchEnd : undefined}
              onMouseLeave={index === 0 ? handleTouchEnd : undefined}
            >
              {/* Swipe Overlay Indicators */}
              {index === 0 && (
                <>
                  <div
                    className="absolute top-8 left-8 z-30 border-4 border-green-500 rounded-lg px-4 py-1 transform -rotate-12 pointer-events-none transition-opacity"
                    style={{ opacity: likeOpacity }}
                  >
                    <span className="text-4xl font-black text-green-500 uppercase tracking-widest">LIKE</span>
                  </div>
                  <div
                    className="absolute top-8 right-8 z-30 border-4 border-red-500 rounded-lg px-4 py-1 transform rotate-12 pointer-events-none transition-opacity"
                    style={{ opacity: nopeOpacity }}
                  >
                    <span className="text-4xl font-black text-red-500 uppercase tracking-widest">NOPE</span>
                  </div>
                </>
              )}

              {/* Image */}
              <div className="relative h-[55%] w-full pointer-events-none">
                <img src={card.image} alt="Match" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                  <MatchBadge type="match" value={card.matchPercent} />
                  {/* <MatchBadge type="winrate" value={card.winRate ?? 0} /> */}
                </div>
              </div>

              {/* Content (Clickable area to view detail) */}
              <div className="flex-1 px-5 pb-5 flex flex-col items-center -mt-16 relative z-20" onClick={handleClickCard}>
                {/* Logo & Basic Info */}
                <div className="size-16 rounded-full border-4 border-white dark:border-surface-dark bg-surface-dark p-0.5 shadow-lg mb-1">
                  <img src={card.logo} className="w-full h-full rounded-full object-cover" alt="logo" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  {card.name}
                  <Icon name="info" className="text-gray-400 text-lg hover:text-primary transition-colors cursor-pointer" />
                </h2>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
                  <div className="flex items-center gap-1"><Icon name="schedule" className="text-sm" /> {card.time}</div>
                  <span>•</span>
                  <div className="flex items-center gap-1"><Icon name="location_on" className="text-sm" /> {card.distance}</div>
                </div>

                {/* Members & Win Rate */}
                <div className="flex items-center justify-center gap-4 mb-4 w-full text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 py-2 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Icon name="groups" className="text-gray-400" />
                    <span className="font-semibold">{card.members ?? '-'} mems</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200 dark:bg-white/10"></div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="emoji_events" className="text-yellow-500" />
                    <span className="font-semibold">Thắng {card.winRate ?? 0}%</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="flex flex-col items-center p-2 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                    <Icon name="flash_on" className="text-red-500 text-lg mb-1" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{card.stats?.attack ?? '-'}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <Icon name="shield" className="text-blue-500 text-lg mb-1" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{card.stats?.defense ?? '-'}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                    <Icon name="sports_soccer" className="text-green-500 text-lg mb-1" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{card.stats?.technique ?? '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe Actions */}
      <div className="pb-8 pt-2 px-4 flex items-center justify-center gap-8 z-20">
        <button
          onClick={() => removeCard('left')}
          className="size-16 rounded-full bg-surface-dark border border-white/10 shadow-lg flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-transform"
        >
          <Icon name="close" className="text-3xl" />
        </button>

        <button className="size-12 rounded-full bg-surface-dark border border-white/10 shadow-lg flex items-center justify-center text-blue-400 hover:scale-110 active:scale-95 transition-transform">
          <Icon name="star" className="text-2xl" />
        </button>

        <button
          onClick={() => removeCard('right')}
          className="size-16 rounded-full bg-primary shadow-glow flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform"
        >
          <Icon name="favorite" className="text-4xl" filled />
        </button>
      </div>

      {/* Team Selector Bottom Sheet */}
      {showTeamSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowTeamSelector(false)}
          />

          {/* Sheet */}
          <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Chọn đội đi "cáp kèo"</h3>

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
    </div>
  );
};

export default FindMatchScreen;
