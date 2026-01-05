import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, ErrorState } from '@/components/ui';
import { useSwipe } from '@/hooks/useSwipe';
import { useSelectedTeam } from '@/stores/team.store';

const SwipeStatsScreen: React.FC = () => {
  const navigate = useNavigate();
  const selectedTeam = useSelectedTeam();
  const { swipeStats, isLoadingStats, error, fetchStats } = useSwipe();

  useEffect(() => {
    if (selectedTeam?.id) fetchStats(false);
  }, [selectedTeam?.id]);

  if (isLoadingStats && !swipeStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error && !swipeStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
        <ErrorState message={error} onRetry={() => fetchStats(true)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="safe-area-top bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-slate-900 dark:text-white">Thống kê swipe</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {swipeStats && (
          <div className="space-y-4">
            {/* Main stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tổng swipe</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{swipeStats.totalSwipes}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Match</p>
                <p className="text-2xl font-bold text-green-500">{swipeStats.matches}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đã thích</p>
                <p className="text-2xl font-bold text-red-500">{swipeStats.likes}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Được thích</p>
                <p className="text-2xl font-bold text-pink-500">{swipeStats.totalLikesReceived || 0}</p>
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-4 space-y-3 border border-gray-100 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white">Tỷ lệ</h3>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Tỷ lệ thích</span>
                  <span className="font-medium text-slate-900 dark:text-white">{swipeStats.likeRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 transition-all" style={{ width: `${swipeStats.likeRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Tỷ lệ match</span>
                  <span className="font-medium text-slate-900 dark:text-white">{swipeStats.matchRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${swipeStats.matchRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Từ thích thành match</span>
                  <span className="font-medium text-slate-900 dark:text-white">{swipeStats.likeToMatchRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${swipeStats.likeToMatchRate}%` }} />
                </div>
              </div>
            </div>

            {/* Analytics */}
            {(swipeStats as any).averageResponseTime && (
              <div className="bg-white dark:bg-surface-dark rounded-xl p-4 space-y-2 border border-gray-100 dark:border-white/5">
                <h3 className="font-bold text-slate-900 dark:text-white">Phân tích</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Thời gian phản hồi TB</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {Math.round((swipeStats as any).averageResponseTime / 60000)} phút
                  </span>
                </div>
                {(swipeStats as any).mostSwipedDay && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Swipe nhiều nhất</span>
                    <span className="font-medium text-slate-900 dark:text-white">{(swipeStats as any).mostSwipedDay}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeStatsScreen;
