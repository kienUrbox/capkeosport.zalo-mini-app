import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  message?: string;
  iconName?: string;
  duration?: number;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * SuccessModal Component
 *
 * Modal component to show success state after completing actions.
 * Auto-closes after specified duration (default 3s).
 *
 * @example
 * ```tsx
 * <SuccessModal
 *   isOpen={showSuccess}
 *   title="Đã tạo đội thành công!"
 *   message="FC Anh Em đã sẵn sàng tìm đối thủ"
 *   iconName="check_circle"
 *   duration={3000}
 *   onClose={() => setShowSuccess(false)}
 * />
 * ```
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  iconName = 'check_circle',
  duration = 3000,
  showButton = false,
  buttonText = 'OK',
  onButtonClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10);

      // Auto-close after duration
      if (duration > 0 && !showButton) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before removing
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, showButton]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleButtonClick = () => {
    onButtonClick?.();
    handleClose();
  };

  if (!isVisible) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
    >
      <div
        className={`bg-white dark:bg-surface-dark rounded-3xl shadow-2xl max-w-sm w-full p-8 transition-all duration-300 transform ${
          isAnimating
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-90 opacity-0 translate-y-4'
        }`}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`size-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-all duration-500 delay-100 ${
              isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}
          >
            <Icon
              name={iconName}
              filled
              className="text-5xl text-green-500 dark:text-green-400"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-3">
          {title}
        </h2>

        {/* Message */}
        {message && (
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {message}
          </p>
        )}

        {/* Button (optional) */}
        {showButton && (
          <button
            onClick={handleButtonClick}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-background-dark font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Confetti Animation */}
      {isAnimating && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#3b82f6', '#FFD700', '#60a5fa'][i % 3],
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animation: `fall ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );

  // Use portal to render outside root
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default SuccessModal;
