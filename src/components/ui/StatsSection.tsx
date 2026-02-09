import React from 'react';

export interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

/**
 * StatBar Component
 *
 * Individual stat bar with label, value, and progress indicator.
 * Matches the reference design from stitch_home_screen_dark_mode.
 *
 * @example
 * ```tsx
 * <StatBar label="Tấn công" value={75} maxValue={100} />
 * ```
 */
export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue = 100,
  color = '#006af6',
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="relative flex w-full flex-col gap-2 py-1">
      {/* Label and Value */}
      <div className="flex w-full items-center justify-between">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{label}</p>
        <span className="font-bold text-sm" style={{ color }}>{value}</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full rounded-full bg-gray-200 dark:bg-[#394556]">
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        {/* Indicator Dot */}
        <div
          className="absolute -top-1 size-4 rounded-full bg-white border-2 shadow dark:border-gray-800"
          style={{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            borderColor: color,
          }}
        />
      </div>
    </div>
  );
};

export interface StatsSectionProps {
  stats: {
    attack?: number;
    defense?: number;
    technique?: number;
  };
  maxValue?: number;
  showInfo?: boolean;
  className?: string;
}

/**
 * StatsSection Component
 *
 * Stats display section matching the reference design.
 * Features card container, header with icon, stat bars, and info note.
 *
 * @example
 * ```tsx
 * <StatsSection
 *   stats={{ attack: 75, defense: 60, technique: 85 }}
 *   maxValue={100}
 *   showInfo={true}
 * />
 * ```
 */
export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  maxValue = 100,
  showInfo = true,
  className = '',
}) => {
  const { attack, defense, technique } = stats;

  return (
    <div
      className={`
        flex flex-col gap-2
        bg-white dark:bg-surface-dark
        p-5 rounded-2xl
        shadow-lg
        border border-gray-100 dark:border-white/5
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-2">
        <span className="material-icons text-[#006af6]">equalizer</span>
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Chỉ số cá nhân</h3>
      </div>

      {/* Stat Bars */}
      {attack !== undefined && (
        <StatBar label="Tấn công" value={attack} maxValue={maxValue} color="#ef4444" />
      )}
      {defense !== undefined && (
        <StatBar label="Phòng ngự" value={defense} maxValue={maxValue} color="#3b82f6" />
      )}
      {technique !== undefined && (
        <StatBar label="Kỹ thuật" value={technique} maxValue={maxValue} color="#3b82f6" />
      )}

      {/* Info Note */}
      {showInfo && (
        <div className="flex items-start gap-2 pt-2">
          <span className="material-icons text-gray-400 dark:text-[#8e8e93] text-[16px] mt-0.5">info</span>
          <p className="text-gray-500 dark:text-[#8e8e93] text-xs font-normal leading-normal">
            Dữ liệu này dùng để tính level đội
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsSection;
