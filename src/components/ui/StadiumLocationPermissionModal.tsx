import React from 'react';
import { Icon } from './';

export interface StadiumLocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

/**
 * StadiumLocationPermissionModal Component
 *
 * Modal for requesting location permission specifically for stadium search.
 * Explains why location is needed before calling Zalo Location API.
 */
export const StadiumLocationPermissionModal: React.FC<StadiumLocationPermissionModalProps> = ({
  isOpen,
  onAllow,
  onDeny,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onDeny}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="place" className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Tìm sân gần bạn
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cho phép truy cập vị trí để tìm sân bóng gần khu vực của bạn
          </p>
        </div>

        {/* Explanation */}
        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="check" className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tìm kiếm sân bóng gần vị trí của bạn nhất
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="check" className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Hiển thị khoảng cách từ bạn đến sân
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="check" className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Gợi ý các sân bãi phổ biến ở khu vực lân cận
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Icon name="shield" className="text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                Quyền riêng tư
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Vị trí của bạn chỉ được sử dụng để tìm kiếm sân bóng gần đó. Chúng tôi không lưu trữ hay chia sẻ thông tin vị trí của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onAllow}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="place" />
            Cho phép truy cập
          </button>

          <button
            onClick={onDeny}
            className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            Không, cảm ơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default StadiumLocationPermissionModal;
