import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, EmptyState, ErrorState } from '@/components/ui';
import { useSwipe } from '@/hooks/useSwipe';
import { useSelectedTeam } from '@/stores/team.store';

const ReceivedSwipesScreen: React.FC = () => {
  const navigate = useNavigate();
  const selectedTeam = useSelectedTeam();
  const {
    receivedSwipes,
    receivedPagination,
    isLoadingReceived,
    isLoadingMoreReceived,
    error,
    fetchReceived,
    goToTeamDetail,
    goToMatchDetail,
  } = useSwipe();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTeam?.id) fetchReceived(1, false);
  }, [selectedTeam?.id]);

  useEffect(() => {
    if (!receivedPagination.hasMore || isLoadingMoreReceived) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchReceived(receivedPagination.page + 1, false);
      },
      { threshold: 0.1 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [receivedPagination.hasMore, isLoadingMoreReceived, fetchReceived, receivedPagination.page]);

  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    return `${Math.floor(seconds / 3600)} giờ trước`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="safe-area-top bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
            <Icon name="arrow_back" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Được thích</h1>
            {receivedSwipes.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{receivedSwipes.length} đội</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingReceived && receivedSwipes.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && receivedSwipes.length === 0 && (
          <ErrorState message={error} onRetry={() => fetchReceived(1, true)} />
        )}

        {!isLoadingReceived && !error && receivedSwipes.length === 0 && (
          <EmptyState
            icon="favorite"
            title="Chưa có lượt thích nào"
            description="Khi có đội thích lại, họ sẽ hiện ở đây"
          />
        )}

        <div className="space-y-3">
          {receivedSwipes.map((received) => (
            <div
              key={received.id}
              className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  onClick={() => goToTeamDetail(received.swiperTeamId)}
                  className="size-12 rounded-full overflow-hidden cursor-pointer relative bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0"
                >
                  {received.swiperTeam?.logo ? (
                    <img src={received.swiperTeam.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    received.swiperTeam?.name?.charAt(0) || 'T'
                  )}
                  <div className="absolute -bottom-1 -right-1 size-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-dark">
                    <Icon name="favorite" className="text-white text-xs" filled />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => goToTeamDetail(received.swiperTeamId)}
                    className="font-bold text-slate-900 dark:text-white truncate cursor-pointer"
                  >
                    {received.swiperTeam?.name || 'Unknown'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Đã thích bạn · {formatTimeAgo(received.swipedAt)}</p>
                </div>

                {received.isMatch && received.matchId && (
                  <button
                    onClick={() => goToMatchDetail(received.matchId)}
                    className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium flex items-center gap-1 hover:bg-green-600 transition-colors"
                  >
                    <Icon name="celebration" />
                    <span>Match!</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="h-1" />
        {isLoadingMoreReceived && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">Đang tải...</div>
        )}
      </div>
    </div>
  );
};

export default ReceivedSwipesScreen;
