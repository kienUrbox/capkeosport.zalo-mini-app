import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Icon } from './Icon';

export const ThemeSwitch: React.FC = () => {
  const { setTheme, effectiveTheme } = useTheme();
  const isDarkMode = effectiveTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div
      onClick={toggleTheme}
      className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 active:bg-gray-50 dark:active:bg-white/5 cursor-pointer animate-slide-in-right"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/10">
          <Icon name={isDarkMode ? 'dark_mode' : 'light_mode'} className="text-gray-500 text-lg" />
        </div>
        <span className="font-medium text-slate-900 dark:text-white">Chế độ hiển thị</span>
      </div>

      {/* Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={isDarkMode}
        onClick={(e) => {
          e.stopPropagation();
          toggleTheme();
        }}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white
            transition-transform duration-200 ease-in-out
            ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ThemeSwitch;
