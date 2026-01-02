import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon } from '@/components/ui';
import { Button } from '@/components/ui/Button';

/**
 * MatchDetail Screen
 *
 * Display match information with countdown timer and action buttons.
 */
const MatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-32">
      <Header title="Chi tiết trận đấu" onBack={() => navigate(-1)} />

      {/* Versus Header Section */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex flex-col items-center">
          {/* Status Badge */}
          <div className="mb-6 rounded-full bg-primary/20 px-3 py-1">
            <p className="text-primary text-xs font-bold uppercase tracking-wide">Sắp diễn ra</p>
          </div>
          {/* Teams Display */}
          <div className="flex w-full items-start justify-between gap-2 px-2">
            {/* Home Team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <div className="relative aspect-square w-20 sm:w-24 rounded-full bg-gray-200 dark:bg-gray-800 p-1 shadow-lg ring-2 ring-primary/20">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz6A3GWMzf4AI0quziAPb6BARuvVdV-cRlpkCAIh9aMaaZpSUvM9hjc_BhjASlj9QpjeRyXOHgE1qgwkaH3lN_qngWyJhW04VcoW84OqT0_h4kHW8V9WJ8gAemWE6t2ZasnffmtbyWVujHPdrWUi_TEoX7u_VRqwXGpg8rRsSOqcqxZVNyFsq_ETS6kZejnHBRew5zca0Ei0_N4qBQMtRG2wFBvMmPtporfJ5tnVjbo9kswS7VEqtoPVqjfBx76tnwbWtzPAefRdc_" alt="FC Saigon" className="h-full w-full rounded-full object-cover" />
              </div>
              <p className="text-center text-base sm:text-lg font-bold leading-tight">FC Saigon</p>
            </div>
            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center pt-6">
              <span className="text-3xl font-black italic tracking-tighter text-gray-300 dark:text-gray-600">VS</span>
            </div>
            {/* Away Team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <div className="relative aspect-square w-20 sm:w-24 rounded-full bg-gray-200 dark:bg-gray-800 p-1 shadow-lg ring-2 ring-transparent">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHF0GkJyXMpEJRGf8MBb5NjD5_PuzxBYBNRRDRmrvXCjuUxydY2DMd2QIEHbWXgPtcGZfYRbfeTNhtBRe-o_WiqEOqG2kw4BvdiWAJv58mf6ARETaj1flzbOGPFVI_ugIvBOnIVHhksHBSoM-aFUCq_-QTeFYU-jf1N61gnBqyaOLZJp2ZW_4k4V0UXptOLgp9KFKhhzI_I-sNQa7SDIMupdhvs3e-xczxE7vMkB4wUiKDOZk6oCZoPOKsRn1GdV6ybNpfKAlsSvO5" alt="FC Hanoi" className="h-full w-full rounded-full object-cover" />
              </div>
              <p className="text-center text-base sm:text-lg font-bold leading-tight">FC Hanoi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mt-6 px-4">
        <p className="mb-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Trận đấu sẽ bắt đầu sau</p>
        <div className="flex justify-center gap-3">
          <div className="flex min-w-[70px] flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1A2C23] p-3 shadow-sm border border-gray-100 dark:border-gray-800/50">
            <span className="text-2xl font-bold text-primary">02</span>
            <span className="text-xs font-medium text-gray-400">Ngày</span>
          </div>
          <div className="flex h-8 items-center text-gray-400">:</div>
          <div className="flex min-w-[70px] flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1A2C23] p-3 shadow-sm border border-gray-100 dark:border-gray-800/50">
            <span className="text-2xl font-bold text-primary">04</span>
            <span className="text-xs font-medium text-gray-400">Giờ</span>
          </div>
          <div className="flex h-8 items-center text-gray-400">:</div>
          <div className="flex min-w-[70px] flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1A2C23] p-3 shadow-sm border border-gray-100 dark:border-gray-800/50">
            <span className="text-2xl font-bold text-primary">15</span>
            <span className="text-xs font-medium text-gray-400">Phút</span>
          </div>
        </div>
      </div>

      {/* Match Info Card */}
      <div className="mt-8 px-4">
        <div className="rounded-2xl bg-white dark:bg-[#1A2C23] p-5 shadow-sm border border-gray-100 dark:border-gray-800/50">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Thông tin chi tiết</h3>
            <Icon name="info" className="text-gray-400" />
          </div>
          <div className="flex flex-col gap-5">
            {/* Date & Time */}
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="calendar_month" className="text-[20px]" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Thời gian</p>
                <p className="text-base font-semibold">19:30 - Thứ 7, 24/02/2024</p>
              </div>
            </div>
            {/* Stadium */}
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="stadium" className="text-[20px]" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa điểm</p>
                <p className="text-base font-semibold">Sân bóng đá Chảo Lửa</p>
                <p className="text-sm text-gray-500">30 Phan Thúc Duyện, Tân Bình</p>
              </div>
            </div>
            {/* Pitch Number */}
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="sports_soccer" className="text-[20px]" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sân đấu</p>
                <p className="text-base font-semibold">Sân số 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-light dark:bg-background-dark p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          <Button fullWidth icon="chat" className="bg-primary text-black">Mở Zalo chat</Button>
          <Button fullWidth icon="edit_note" className="bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500" disabled>Cập nhật kết quả</Button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
