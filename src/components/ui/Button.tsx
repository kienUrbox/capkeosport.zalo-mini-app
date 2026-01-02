import React from 'react';
import { Icon } from './Icon';
import { SPACING, ICON_SIZES } from '@/constants/design';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  icon?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button Component
 *
 * Multi-variant button with support for icons and loading states.
 *
 * @example
 * ```tsx
 * <Button onClick={handleClick}>Save</Button>
 * <Button variant="secondary" icon="add">Add New</Button>
 * <Button isLoading>Processing...</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  isLoading = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'rounded-xl font-semibold transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed';

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-10 px-4 py-2 text-sm',       // 40px height, 14px font
    md: 'h-11 px-5 py-2.5 text-base',   // 44px height, 16px font
    lg: 'h-12 px-6 py-3 text-lg',       // 48px height, 18px font
  };

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary hover:bg-primary-dark text-background-dark shadow-lg shadow-primary/20',
    secondary: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${SPACING.sm} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {icon && !isLoading && <Icon name={icon} className={ICON_SIZES.md} />}
      {children}
    </button>
  );
};

export default Button;
