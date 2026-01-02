import React from 'react';
import { Icon } from './Icon';
import { LIST_ITEM, FONT_SIZES, SPACING, ICON_SIZES, BORDER_RADIUS } from '@/constants/design';

export interface PlayerCardProps {
  name: string;
  role: string;
  number?: string;
  image: string;
  isAdmin?: boolean;
  onClick?: () => void;
}

/**
 * PlayerCard Component
 *
 * Horizontal card displaying player information with admin badge support.
 *
 * @example
 * ```tsx
 * <PlayerCard
 *   name="John Doe"
 *   role="Captain"
 *   number="10"
 *   image={player.avatar}
 *   isAdmin
 *   onClick={() => navigate('/player/1')}
 * />
 * ```
 */
export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  role,
  number,
  image,
  isAdmin = false,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center ${LIST_ITEM.gap} bg-white dark:bg-surface-dark ${LIST_ITEM.padding} ${BORDER_RADIUS.md} border border-gray-100 dark:border-white/5 ${
        onClick ? 'active:scale-[0.99] cursor-pointer' : ''
      } transition-transform`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="size-12 rounded-full overflow-hidden bg-gray-700">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        {isAdmin && (
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5 border-2 border-surface-dark">
            <Icon name="star" className="text-[12px]" filled />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`flex items-center ${SPACING.sm}`}>
          <h4 className={`font-bold text-slate-900 dark:text-white ${FONT_SIZES.small} truncate`}>
            {name}
          </h4>
          {number && (
            <span className="bg-gray-200 dark:bg-white/10 text-[10px] px-1.5 rounded font-mono">
              {number}
            </span>
          )}
        </div>
        <p className={`text-gray-500 dark:text-text-secondary truncate ${FONT_SIZES.caption}`}>
          {role}
        </p>
      </div>
      {onClick && (
        <div className="flex items-center justify-center">
          <Icon name="chevron_right" className={`${ICON_SIZES.md} text-gray-400`} />
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
