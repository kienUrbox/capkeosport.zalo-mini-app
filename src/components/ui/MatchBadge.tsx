import React from 'react';
import { Icon } from './Icon';

export interface MatchBadgeProps {
  type: 'match' | 'winrate';
  value: number;
  className?: string;
}

/**
 * MatchBadge Component - Badge for match percentage or win rate
 *
 * @example
 * ```tsx
 * <MatchBadge type="match" value={95} />
 * <MatchBadge type="winrate" value={67} />
 * ```
 */
export const MatchBadge: React.FC<MatchBadgeProps> = ({
  type,
  value,
  className = '',
}) => {
  if (type === 'match') {
    return (
      <div className={`bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 ${className}`}>
        <Icon name="bolt" className="text-primary text-sm" filled />
        <span className="text-xs font-bold text-white">{value}% Hợp cạ</span>
      </div>
    );
  }

  // Win rate badge - smaller and more compact
  return (
    <div className={`bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 flex items-center gap-1 ${className}`}>
      <Icon name="emoji_events" className="text-yellow-400 text-xs" filled />
      <span className="text-[10px] font-bold text-white">{value}% thắng</span>
    </div>
  );
};

export default MatchBadge;
