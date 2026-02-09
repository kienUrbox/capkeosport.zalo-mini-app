import React, { useState } from 'react';
import { Icon } from './';
import { PADDING, SPACE_Y, ICONS } from '@/constants/design';

export interface MatchBookingGuideProps {
  onDismiss: (dontShowAgain: boolean) => void;
  showAlways?: boolean;
}

/**
 * MatchBookingGuide Component
 *
 * Step-by-step guide for users to understand the match confirmation workflow.
 * Shows two approaches: 1) Have stadium ready, 2) Need to coordinate first.
 * Includes Phase 2 preview for stadium booking integration.
 */
export const MatchBookingGuide: React.FC<MatchBookingGuideProps> = ({
  onDismiss,
  showAlways = false,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleDismiss = () => {
    onDismiss(dontShowAgain);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAgain(e.target.checked);
  };

  return (
    <div className={`${PADDING.md} bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 mb-4 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Icon name={ICONS.info} className="text-blue-500" />
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Hướng dẫn chốt kèo
        </h4>
      </div>

      {/* Steps */}
      <div className={`${SPACE_Y.sm}`}>
        {/* Step 1: Chat with opponent */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
              Trao đổi với đội đối thủ
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Nhắn tin để thống nhất ngày, giờ và địa điểm thi đấu trước khi chốt kèo.
            </p>
          </div>
        </div>

        {/* Step 2: Two Approaches */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              Chọn cách thức chốt kèo
            </p>

            {/* Two approach cards */}
            <div className="grid grid-cols-2 gap-2">
              {/* Approach A: Have stadium */}
              <div className={`${PADDING.xs} bg-white dark:bg-surface-dark rounded-xl border border-blue-200 dark:border-blue-800/50`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon name={ICONS.stadium} className="text-green-500" size="sm" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Đã có sân?
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  Gửi lời mời với đầy đủ thông tin sân đã có sẵn.
                </p>
              </div>

              {/* Approach B: Need to agree */}
              <div className={`${PADDING.xs} bg-white dark:bg-surface-dark rounded-xl border border-blue-200 dark:border-blue-800/50`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon name={ICONS.groups} className="text-orange-500" size="sm" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Chưa có sân?
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  Trò chuyện để thống nhất thời gian và địa điểm trước.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 Preview */}
        <div className={`${PADDING.sm} bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-dashed border-amber-300 dark:border-amber-700/50`}>
          <div className="flex items-start gap-2">
            <Icon name="rocket_launch" className="text-amber-500 mt-0.5" size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Tính năng đặt sân sắp ra mắt
                </span>
                <span className="px-1.5 py-0.5 bg-amber-200 dark:bg-amber-800/30 rounded text-[10px] font-bold text-amber-800 dark:text-amber-200">
                  Sắp tới
                </span>
              </div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400">
                Hệ thống sẽ kết nối trực tiếp với sân để đặt sân nhanh chóng và tiện lợi hơn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with checkbox and button */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/50">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Đừng hiện lại
          </span>
        </label>

        <button
          onClick={handleDismiss}
          className="px-4 py-2 bg-primary text-slate-900 rounded-lg text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all"
        >
          Đã hiểu, tiếp tục
        </button>
      </div>
    </div>
  );
};

export default MatchBookingGuide;
