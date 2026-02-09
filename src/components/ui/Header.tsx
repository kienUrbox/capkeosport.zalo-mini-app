import React from 'react';
import { Icon } from './Icon';
import { HEADER, ICON_SIZES } from '@/constants/design';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

/**
 * Header Component
 *
 * Sticky header with optional back button and right action slot.
 * Can be transparent to overlay over banners.
 *
 * @example
 * ```tsx
 * <Header title="Team Detail" showBack onBack={() => navigate(-1)} />
 * <Header
 *   title="Settings"
 *   rightAction={<Icon name="more_vert" />}
 * />
 * <Header title="" transparent showBack />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  onBack,
  rightAction,
  transparent = false,
}) => {
  const baseClasses = transparent
    ? `absolute top-0 left-0 right-0 z-50 ${HEADER.padding} flex items-center ${HEADER.height} safe-area-top`
    : `sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md ${HEADER.padding} flex items-center border-b border-gray-200 dark:border-white/5 ${HEADER.height} safe-area-top`;

  const textClass = transparent ? 'text-white' : 'text-slate-900 dark:text-white';
  const iconClass = transparent
    ? 'text-white hover:bg-white/10'
    : 'hover:bg-gray-200 dark:hover:bg-white/10';

  return (
    <div className={baseClasses}>
      {showBack && (
        <button
          onClick={onBack}
          className={`flex items-center justify-center rounded-full transition-colors -ml-2 ${iconClass} ${HEADER.iconButtonSize}`}
        >
          <Icon name="arrow_back" className={ICON_SIZES.lg} />
        </button>
      )}
      {title && (
        <h1
          className={`flex-1 font-bold text-center ${textClass} ${HEADER.titleSize} ${
            showBack && !rightAction ? 'pr-8' : ''
          }`}
        >
          {title}
        </h1>
      )}
      {rightAction && <div className="-mr-2">{rightAction}</div>}
    </div>
  );
};

export default Header;
