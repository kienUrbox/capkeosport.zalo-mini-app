import React from 'react';
import { Icon } from './Icon';
import { QUICK_ACTION_CONFIG, QuickActionType } from '@/constants/design';

export interface QuickActionButtonProps {
  type: QuickActionType;
  onPress?: () => void;
  delay?: number;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'glass';
}

/**
 * QuickActionButton Component
 *
 * Individual quick action button for the profile page.
 * Features staggered entrance animation, haptic feedback on touch,
 * and glass morphism effect.
 *
 * @example
 * ```tsx
 * <QuickActionButton
 *   type={QUICK_ACTIONS.SHARE}
 *   onPress={() => handleShare()}
 *   delay={0}
 * />
 * ```
 */
export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  type,
  onPress,
  delay = 0,
  disabled = false,
  variant = 'default',
}) => {
  const config = QUICK_ACTION_CONFIG[type];

  const delayClass = delay === 0 ? '' : `delay-${delay}`;

  const baseClasses = `
    flex flex-col items-center justify-center
    gap-1.5 p-3 rounded-2xl
    transition-all duration-200
    animate-quick-action-slide ${delayClass}
    active:scale-95
    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10',
    primary: 'bg-primary/10 hover:bg-primary/20',
    glass: 'bg-white/40 dark:bg-white/10 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/15',
  };

  const iconClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    primary: 'text-primary',
    glass: 'text-primary',
  };

  const labelClasses = `
    text-xs font-medium
    ${variant === 'primary' || variant === 'glass' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}
  `;

  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback (if available)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onPress?.();
  };

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon
        name={config.icon}
        className={`${iconClasses[variant]} text-xl`}
      />
      <span className={labelClasses}>{config.label}</span>
    </button>
  );
};

export default QuickActionButton;
