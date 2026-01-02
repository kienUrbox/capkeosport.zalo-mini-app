import React from 'react';
import { Icon } from './Icon';

export interface StatBadgeProps {
  icon: string;
  label: string;
  value: string | number;
}

/**
 * StatBadge Component - Compact stat badge with icon
 */
export const StatBadge: React.FC<StatBadgeProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="inline-flex flex-col items-center gap-0.5 min-w-[50px]">
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50/80 dark:bg-teal-500/10">
        <Icon name={icon} className="text-xs text-teal-600 dark:text-teal-400" />
        <span className="text-[10px] font-medium text-teal-700 dark:text-teal-300">{label}</span>
      </div>
      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
};

export default StatBadge;
