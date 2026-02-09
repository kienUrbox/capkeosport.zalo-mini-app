import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';

export interface ShareOption {
  id: string;
  icon: string;
  label: string;
  color?: string;
  action: () => void;
}

export interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  options: ShareOption[];
  title?: string;
}

/**
 * ShareSheet Component
 *
 * Bottom sheet component for sharing options.
 * Features slide-up animation, backdrop blur, and haptic feedback.
 *
 * @example
 * ```tsx
 * const shareOptions = [
 *   {
 *     id: 'zalo',
 *     icon: 'chat',
 *     label: 'Zalo',
 *     action: () => shareToZalo(),
 *   },
 *   {
 *     id: 'facebook',
 *     icon: 'public',
 *     label: 'Facebook',
 *     action: () => shareToFacebook(),
 *   },
 * ];
 *
 * <ShareSheet
 *   visible={showShare}
 *   onClose={() => setShowShare(false)}
 *   options={shareOptions}
 *   title="Chia sẻ hồ sơ"
 * />
 * ```
 */
export const ShareSheet: React.FC<ShareSheetProps> = ({
  visible,
  onClose,
  options,
  title = 'Chia sẻ với',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const handleOptionClick = (option: ShareOption) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    option.action();
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl animate-slide-up pb-safe"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Title */}
        {title && (
          <div className="px-6 pb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
              {title}
            </h3>
          </div>
        )}

        {/* Share Options */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-4 gap-3">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200 dark:active:bg-white/10 transition-all active:scale-95"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    option.color || 'bg-primary/10'
                  }`}
                >
                  <Icon
                    name={option.icon}
                    className={`text-2xl ${option.color?.replace('bg-', 'text-') || 'text-primary'}`}
                  />
                </div>

                {/* Label */}
                <span className="text-xs font-medium text-slate-900 dark:text-white">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-3 bg-gray-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSheet;
