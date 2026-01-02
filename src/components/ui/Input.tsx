import React from 'react';
import { Icon } from './Icon';
import { SPACING, ICON_SIZES, FONT_SIZES, BORDER_RADIUS } from '@/constants/design';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
}

/**
 * Input Component
 *
 * Text input with optional label, icon, and error message.
 *
 * @example
 * ```tsx
 * <Input label="Team Name" placeholder="Enter team name" />
 * <Input icon="search" placeholder="Search..." />
 * <Input label="Email" error="Invalid email address" />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col ${SPACING.sm} ${className}`}>
      {label && (
        <label className={`font-medium text-gray-600 dark:text-text-secondary ml-1 ${FONT_SIZES.small}`}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
            <Icon name={icon} className={ICON_SIZES.lg} />
          </div>
        )}
        <input
          className={`w-full bg-white dark:bg-surface-dark border ${
            error ? 'border-red-500' : 'border-gray-200 dark:border-border-dark'
          } ${BORDER_RADIUS.md} h-11 ${icon ? 'pl-12' : 'pl-4'} pr-4 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${FONT_SIZES.base}`}
          {...props}
        />
      </div>
      {error && (
        <span className={`text-red-500 ml-1 ${FONT_SIZES.caption}`}>{error}</span>
      )}
    </div>
  );
};

export default Input;
