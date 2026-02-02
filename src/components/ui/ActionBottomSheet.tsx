import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { useKeyboardAvoidance } from '@/hooks/useKeyboardAvoidance';

export interface ActionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;

  // Loại action xác định UI
  type: 'confirm' | 'input';

  // Nội dung
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;

  // Input-specific (cho type='input')
  inputPlaceholder?: string;
  inputMaxLength?: number;

  // Button config
  primaryButtonText: string;
  onPrimaryAction: (inputValue?: string) => void | Promise<void>;
  secondaryButtonText?: string;

  // States
  isLoading?: boolean;
}

/**
 * ActionBottomSheet Component
 *
 * Reusable bottom sheet for match actions:
 * - 'confirm' type: Simple confirmation dialog with two buttons
 * - 'input' type: Dialog with textarea input for optional reason
 */
export const ActionBottomSheet: React.FC<ActionBottomSheetProps> = ({
  isOpen,
  onClose,
  type,
  title,
  description,
  icon,
  iconColor = 'text-red-500',
  inputPlaceholder = 'Nhập lý do (tùy chọn)...',
  inputMaxLength = 200,
  primaryButtonText,
  onPrimaryAction,
  secondaryButtonText = 'Hủy',
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  // Enable keyboard avoidance when sheet has input
  useKeyboardAvoidance();

  // Reset input when sheet opens
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handlePrimaryAction = () => {
    if (type === 'input') {
      onPrimaryAction(inputValue.trim());
    } else {
      onPrimaryAction();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setInputValue('');
      onClose();
    }
  };

  const getIconBgColor = () => {
    if (iconColor.includes('red')) return 'bg-red-100 dark:bg-red-900/30';
    if (iconColor.includes('orange')) return 'bg-orange-100 dark:bg-orange-900/30';
    if (iconColor.includes('green')) return 'bg-green-100 dark:bg-green-900/30';
    return 'bg-gray-100 dark:bg-white/5';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl max-h-[calc(100dvh-80px)] overflow-y-auto">
        {/* Drag indicator */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header with Icon */}
        <div className="text-center mb-4">
          {icon && (
            <div className={`size-16 rounded-full ${getIconBgColor()} flex items-center justify-center mx-auto mb-3`}>
              <Icon name={icon} className={`text-3xl ${iconColor}`} />
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Input area for type='input' */}
        {type === 'input' && (
          <div className="mb-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 min-h-[100px] text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              maxLength={inputMaxLength}
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {inputValue.length}/{inputMaxLength}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {secondaryButtonText}
          </button>
          <button
            onClick={handlePrimaryAction}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              iconColor.includes('red')
                ? 'bg-red-500 text-white hover:bg-red-600'
                : iconColor.includes('orange')
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-primary text-slate-900 hover:bg-primary/90'
            }`}
          >
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              primaryButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBottomSheet;
