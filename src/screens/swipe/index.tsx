import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, EmptyState, ErrorState } from '@/components/ui';
import { useSwipe } from '@/hooks/useSwipe';
import { useSelectedTeam } from '@/stores/team.store';
import { appRoutes } from '@/utils/navigation';

const SwipeHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const selectedTeam = useSelectedTeam();
  const {
    swipeHistory,
    historyPagination,
    isLoadingHistory,
    isLoadingMoreHistory,
    historyFilter,
    error,
    fetchHistory,
    setFilter,
    undoSwipe,
    goToTeamDetail,
  } = useSwipe();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTeam?.id) fetchHistory(1, false);
  }, [selectedTeam?.id]);

  // Infinite scroll
  useEffect(() => {
    if (!historyPagination.hasMore || isLoadingMoreHistory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchHistory(historyPagination.page + 1, false);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [historyPagination.hasMore, isLoadingMoreHistory, fetchHistory, historyPagination.page]);

  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  const canUndo = (createdAt: string): boolean => {
    return (Date.now() - new Date(createdAt).getTime()) < 5 * 60 * 1000;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="safe-area-top bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(appRoutes.matchFind)} className="text-gray-600 dark:text-gray-400">
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-slate-900 dark:text-white">Lịch sử swipe</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-3 flex gap-2 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/5">
        {[
          { label: 'Tất cả', value: 'all' },
          { label: 'Đã thích', value: 'LIKE' },
          { label: 'Đã bỏ qua', value: 'PASS' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilter(filter.value as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              historyFilter === filter.value
                ? 'bg-primary text-background-dark'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingHistory && swipeHistory.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && swipeHistory.length === 0 && (
          <ErrorState message={error} onRetry={() => fetchHistory(1, true)} />
        )}

        {!isLoadingHistory && !error && swipeHistory.length === 0 && (
          <EmptyState
            icon="history"
            title="Chưa có lịch sử swipe"
            description="Bắt đầu tìm kiếm đối thủ để xem lịch sử nhé"
          />
        )}

        <div className="space-y-3">
          {swipeHistory.map((swipe) => (
            <div
              key={swipe.id}
              className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  onClick={() => goToTeamDetail(swipe.targetTeamId)}
                  className="size-12 rounded-full overflow-hidden cursor-pointer bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold flex-shrink-0"
                >
                  {swipe.targetTeam?.logo ? (
                    <img src={swipe.targetTeam.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    swipe.targetTeam?.name?.charAt(0) || 'T'
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => goToTeamDetail(swipe.targetTeamId)}
                    className="font-bold text-slate-900 dark:text-white truncate cursor-pointer"
                  >
                    {swipe.targetTeam?.name || 'Unknown'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(swipe.createdAt)}</p>
                </div>

                {/* Action */}
                <div className={`flex items-center gap-1 ${swipe.action === 'LIKE' ? 'text-green-500' : 'text-red-500'}`}>
                  <Icon name={swipe.action === 'LIKE' ? 'favorite' : 'close'} filled={swipe.action === 'LIKE'} />
                  <span className="text-sm">{swipe.action === 'LIKE' ? 'Thích' : 'Bỏ qua'}</span>
                </div>

                {/* Undo */}
                {swipe.action === 'LIKE' && canUndo(swipe.createdAt) && (
                  <button
                    onClick={() => undoSwipe(swipe.id)}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Hoàn tác
                  </button>
                )}
              </div>

              {/* Match indicator */}
              {(swipe as any).isMatch && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                    <Icon name="celebration" />
                    <span>Match! Đã tạo trận đấu</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="h-1" />
        {isLoadingMoreHistory && (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">Đang tải...</div>
        )}
      </div>
    </div>
  );
};

export default SwipeHistoryScreen;
