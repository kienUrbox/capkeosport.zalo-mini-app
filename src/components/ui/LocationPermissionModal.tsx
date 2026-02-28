import React from 'react';
import { Icon } from './';

export type LocationSource = 'current' | 'stadium' | 'default';

export interface LocationPermissionModalProps {
  isOpen: boolean;
  onUseCurrentLocation: () => void;
  onUseStadiumLocation: () => void;
  onUseDefault: () => void;
  stadiumName?: string;
}

/**
 * LocationPermissionModal Component
 *
 * Modal for requesting location permission with 3 options:
 * 1. Use current location (requires Zalo permission)
 * 2. Use stadium location (no permission needed)
 * 3. Use default location (Ho Chi Minh City)
 */
export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onUseCurrentLocation,
  onUseStadiumLocation,
  onUseDefault,
  stadiumName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop - non-dismissable */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="location" className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Chọn vị trí tìm kiếm
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chọn vị trí để tìm kiếm các đội bóng gần đó
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Current Location */}
          <button
            onClick={onUseCurrentLocation}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border-2 border-primary/30 hover:border-primary hover:from-primary/10 hover:to-primary/20 dark:hover:from-primary/30 dark:hover:to-primary/20 transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Icon name="location" className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Vị trí hiện tại của tôi
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sử dụng vị trí hiện tại để tìm đội gần bạn nhất
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Stadium Location */}
          <button
            onClick={onUseStadiumLocation}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/20 transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Icon name="stadium" className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Vị trí sân nhà
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stadiumName ? `Tìm đội gần ${stadiumName}` : 'Tìm đội gần sân nhà của bạn'}
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Default Location */}
          <button
            onClick={onUseDefault}
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <Icon name="map-pin" className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Mặc định (Hồ Chí Minh)
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Tìm đội ở khu vực Hồ Chí Minh
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Icon name="shield" className="text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                Quyền riêng tư
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Vị trí của bạn chỉ được sử dụng để tìm kiếm đội bóng gần đó. Chúng tôi không lưu trữ hay chia sẻ thông tin vị trí của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
