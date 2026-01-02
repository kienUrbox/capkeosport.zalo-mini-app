import React from 'react';
import { Icon } from './Icon';
import { HEADER, ICON_SIZES } from '@/constants/design';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

/**
 * Header Component
 *
 * Sticky header with optional back button and right action slot.
 *
 * @example
 * ```tsx
 * <Header title="Team Detail" showBack onBack={() => navigate(-1)} />
 * <Header
 *   title="Settings"
 *   rightAction={<Icon name="more_vert" />}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  onBack,
  rightAction,
}) => {
  return (
    <div className={`sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md ${HEADER.padding} flex items-center border-b border-gray-200 dark:border-white/5 ${HEADER.height} safe-area-top`}>
      {showBack && (
        <button
          onClick={onBack}
          className={`flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors -ml-2 ${HEADER.iconButtonSize}`}
        >
          <Icon name="arrow_back" className={ICON_SIZES.lg} />
        </button>
      )}
      <h1
        className={`flex-1 font-bold text-center text-slate-900 dark:text-white ${HEADER.titleSize} ${
          showBack && !rightAction ? 'pr-8' : ''
        }`}
      >
        {title}
      </h1>
      {rightAction && <div className="-mr-2">{rightAction}</div>}
    </div>
  );
};

export default Header;
