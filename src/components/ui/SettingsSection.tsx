import React from 'react';

export interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
  className?: string;
}

/**
 * SettingsSection Component
 *
 * Grouped section container for settings menu items.
 * Features card-based layout with optional section title.
 *
 * @example
 * ```tsx
 * <SettingsSection title="Quick Settings">
 *   <SettingsMenuItem icon="dark_mode" label="Dark Mode" />
 *   <SettingsMenuItem icon="notifications" label="Notifications" />
 * </SettingsSection>
 * ```
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = `
    rounded-2xl border overflow-hidden
    transition-all duration-200
  `;

  const variantClasses = {
    default: 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="px-4 pt-3 pb-2">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h4>
        </div>
      )}
      {children}
    </div>
  );
};

export default SettingsSection;
