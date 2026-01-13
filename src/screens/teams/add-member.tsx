import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import TeamInviteService from '@/services/api/team-invite.service';

export interface AddMemberBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
}

/**
 * AddMemberBottomSheet Component
 *
 * Quick bottom sheet for inviting members by phone number.
 */
export const AddMemberBottomSheet: React.FC<AddMemberBottomSheetProps> = ({
  isOpen,
  onClose,
  teamId,
}) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when opened
  React.useEffect(() => {
    if (isOpen) {
      setPhone('');
      setMessage('');
      setError(null);
    }
  }, [isOpen]);

  // Format phone number to Vietnamese format
  const formatPhoneNumber = (phone: string): string => {
    let formatted = phone.replace(/\s/g, '');
    if (formatted.startsWith('0')) {
      formatted = '84' + formatted.slice(1);
    } else if (formatted.startsWith('+84')) {
      formatted = formatted.slice(1);
    }
    return '+' + formatted;
  };

  const handleSendInvite = async () => {
    if (!phone || phone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    if (!teamId) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await TeamInviteService.inviteByPhone(teamId, {
        phone: formatPhoneNumber(phone),
        customMessage: message.trim() || undefined,
      });

      if (response.success) {
        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          onClose();
        }, 1500);

        // Reset form for next invite
        setPhone('');
        setMessage('');
      } else {
        setError(response.error?.message || 'Không thể gửi lời mời');
      }
    } catch (err) {
      setError('Không thể gửi lời mời. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl">
        {/* Drag indicator */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mời tham gia đội</h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Phone Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Số điện thoại</label>
            <div className="flex gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Nhập SĐT..."
                className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl h-12 px-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Lời nhắn (tùy chọn)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="VD: Gia nhập đội chúng tôi nhé!"
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 h-24 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 text-right">{message.length}/100</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSendInvite}
          disabled={isSending || !phone}
          className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi lời mời'
          )}
        </button>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium animate-fade-in">
            <Icon name="check_circle" className="text-green-500" />
            Đã gửi lời mời thành công!
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMemberBottomSheet;
