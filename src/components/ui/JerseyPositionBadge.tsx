import React from 'react';

export interface JerseyPositionBadgeProps {
  jerseyNumber?: number;
  position?: string;
  className?: string;
}

/**
 * JerseyPositionBadge Component
 *
 * Horizontal glass-morphism badge displaying jersey number and position.
 * Matches the reference design from stitch_home_screen_dark_mode.
 *
 * Layout: [icon] Số áo: 10 | [icon] Vị trí: Tiền đạo
 *
 * @example
 * ```tsx
 * <JerseyPositionBadge
 *   jerseyNumber={10}
 *   position="Tiền đạo"
 * />
 * ```
 */
export const JerseyPositionBadge: React.FC<JerseyPositionBadgeProps> = ({
  jerseyNumber,
  position,
  className = '',
}) => {
  // Don't render if both values are missing
  if (!jerseyNumber && !position) {
    return null;
  }

  return (
    <div
      className={`
        flex items-center gap-4
        py-2 px-4
        bg-white/80 dark:bg-surface-dark/50
        rounded-full
        border border-gray-200 dark:border-white/5
        backdrop-blur-sm shadow-sm
        ${className}
      `}
    >
      {/* Jersey Number */}
      {jerseyNumber !== undefined && jerseyNumber !== null && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="material-icons text-[#006af6] text-[18px]">label</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Số áo: <span className="text-slate-900 dark:text-white font-semibold">{jerseyNumber}</span>
            </span>
          </div>
          {/* Divider */}
          {position && <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />}
        </>
      )}

      {/* Position */}
      {position && (
        <div className="flex items-center gap-1.5">
          <span className="material-icons text-[#006af6] text-[18px]">sports_soccer</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Vị trí: <span className="text-slate-900 dark:text-white font-semibold">{position}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default JerseyPositionBadge;
