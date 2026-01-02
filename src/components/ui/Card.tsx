import React from 'react';
import { PADDING, BORDER_RADIUS } from '@/constants/design';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

/**
 * Card Component
 *
 * Generic card wrapper with consistent styling.
 *
 * @example
 * ```tsx
 * <Card padding="md">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 * <Card onClick={handleClick} className="cursor-pointer">
 *   Clickable card content
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  onClick,
}) => {
  const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
    none: '',
    sm: PADDING.sm,    // p-3 (12px)
    md: PADDING.md,    // p-4 (16px)
    lg: PADDING.lg,    // p-6 (24px)
  };

  return (
    <div
      className={`bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 ${BORDER_RADIUS.md} shadow-lg ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } transition-transform ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
