import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Icon } from './Icon';

export const ThemeSwitch: React.FC = () => {
  const { setTheme, effectiveTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div
      onClick={toggleTheme}
      className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Icon name={effectiveTheme === 'dark' ? 'dark_mode' : 'light_mode'} className="text-gray-500" />
        <span className="font-medium text-slate-900 dark:text-white">Chế độ hiển thị</span>
      </div>
      <Icon name="chevron_right" className="text-gray-400 text-sm" />
    </div>
  );
};

export default ThemeSwitch;
