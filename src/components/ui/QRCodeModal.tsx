import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';

export interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  qrValue: string;
  userName?: string;
  userAvatar?: string;
}

/**
 * QRCodeModal Component
 *
 * Modal component for displaying QR code for profile sharing.
 * Features slide-up animation, backdrop blur, and copy functionality.
 *
 * @example
 * ```tsx
 * <QRCodeModal
 *   visible={showQR}
 *   onClose={() => setShowQR(false)}
 *   qrValue={profileUrl}
 *   userName={user?.name}
 *   userAvatar={user?.avatar}
 * />
 * ```
 */
export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  qrValue,
  userName,
  userAvatar,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  // Prevent body scroll when modal is open
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Generate QR code URL using a public QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 animate-slide-up pb-safe"
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            Mã QR hồ sơ
          </h3>
          <p className="text-sm text-gray-500">
            Quét mã để xem hồ sơ của {userName || 'người dùng'}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center mb-6">
          <div className="relative p-4 bg-white rounded-2xl shadow-lg">
            {/* QR Code Image */}
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64"
            />

            {/* Logo overlay in center */}
            {userAvatar && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-white">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Profile URL */}
        <div className="mb-6 p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Liên kết hồ sơ:</p>
          <p className="text-sm text-slate-900 dark:text-white truncate">
            {qrValue}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
          >
            <Icon name={copied ? 'check_circle' : 'content_copy'} />
            {copied ? 'Đã sao chép' : 'Sao chép link'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
