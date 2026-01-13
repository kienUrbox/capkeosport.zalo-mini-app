import React, { useState } from 'react';
import { Icon } from './Icon';

export interface DeclineInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => void;
  isLoading?: boolean;
}

/**
 * DeclineInviteModal Component
 *
 * Modal for declining team invitation with optional reason.
 */
export const DeclineInviteModal: React.FC<DeclineInviteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(message.trim() || undefined);
    setMessage('');
  };

  const handleClose = () => {
    if (!isLoading) {
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
            <Icon name="close" className="text-3xl text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Từ chối lời mời?
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Bạn có thể nhập lý do (tùy chọn)
          </p>
        </div>

        {/* Message input */}
        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="VD: Đã tham gia đội khác, bận rộn..."
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 min-h-[100px] text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            maxLength={200}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-400 text-right mt-1">{message.length}/200</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Từ chối'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineInviteModal;
