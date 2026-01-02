import React from 'react';

export interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

/**
 * Icon Component - Material Icons wrapper
 *
 * Uses Material Icons (hosted by Zalo CDN) with support for filled/unfilled variants.
 *
 * @example
 * ```tsx
 * <Icon name="home" />
 * <Icon name="favorite" filled size="lg" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  filled = false,
  size
}) => {
  const sizeClasses: Record<NonNullable<IconProps['size']>, string> = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
    '3xl': 'text-5xl',
  };

  return (
    <span
      className={`material-icons select-none ${sizeClasses[size || 'lg']} ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
};

export default Icon;
