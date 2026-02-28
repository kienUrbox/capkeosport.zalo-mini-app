import React from 'react';
import { Icon } from './Icon';

export interface SettingsMenuItemProps {
  icon: string;
  label: string;
  value?: string;
  badge?: string | number;
  color?: string;
  showChevron?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  iconBackground?: boolean;
  variant?: 'default' | 'active' | 'danger';
  delay?: number;
}

/**
 * SettingsMenuItem Component
 *
 * Enhanced menu item for settings with icon, label, value, badge support.
 * Features gradient left border for active state, hover effects, and staggered animations.
 *
 * @example
 * ```tsx
 * <SettingsMenuItem
 *   icon="notifications"
 *   label="Thông báo"
 *   badge="3"
 *   onClick={() => navigate(appRoutes.notifications)}
 *   delay={0}
 * />
 *
 * <SettingsMenuItem
 *   icon="logout"
 *   label="Đăng xuất"
 *   variant="danger"
 *   onClick={handleLogout}
 * />
 * ```
 */
export const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({
  icon,
  label,
  value,
  badge,
  color,
  showChevron = true,
  onClick,
  disabled = false,
  iconBackground = true,
  variant = 'default',
  delay = 0,
}) => {
  const variantClasses = {
    default: {
      container: 'hover:bg-gray-50 dark:hover:bg-white/5',
      leftBorder: '',
      iconBg: 'bg-gray-100 dark:bg-white/10',
      iconColor: 'text-gray-500',
      labelColor: 'text-slate-900 dark:text-white',
      valueColor: 'text-gray-500 dark:text-gray-400',
    },
    active: {
      container: 'bg-primary/5 hover:bg-primary/10',
      leftBorder: 'border-l-4 border-l-primary',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
      labelColor: 'text-primary font-semibold',
      valueColor: 'text-primary/70',
    },
    danger: {
      container: 'hover:bg-red-50 dark:hover:bg-red-900/20',
      leftBorder: '',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-500',
      labelColor: 'text-red-500',
      valueColor: 'text-red-400',
    },
  };

  const classes = variantClasses[variant];

  const iconColorOverride = color || classes.iconColor;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center justify-between p-4
        border-b border-gray-100 dark:border-white/5 last:border-b-0
        transition-all duration-200
        ${classes.container}
        ${classes.leftBorder}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        animate-slide-in-right
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Left: Icon + Label */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`p-2 pb-1 rounded-xl ${iconBackground ? classes.iconBg : ''}`}>
          <Icon name={icon} className={`${iconColorOverride} text-lg`} />
        </div>

        {/* Label */}
        <span className={`font-medium ${classes.labelColor}`}>
          {label}
        </span>
      </div>

      {/* Right: Value, Badge, or Chevron */}
      <div className="flex items-center gap-2">
        {/* Value */}
        {value && (
          <span className={`text-sm ${classes.valueColor}`}>
            {value}
          </span>
        )}

        {/* Badge */}
        {badge && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}

        {/* Chevron */}
        {showChevron && !value && !badge && (
          <Icon name="chevron_right" className="text-gray-400 text-sm" />
        )}
      </div>
    </div>
  );
};

export default SettingsMenuItem;
