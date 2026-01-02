import React from 'react';
import { Icon } from './Icon';

export interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface NavTab {
  id: string;
  icon: string;
  label: string;
  isFab?: boolean;
}

const tabs: NavTab[] = [
  { id: 'home', icon: 'home', label: 'Trang chủ' },
  { id: 'schedule', icon: 'calendar_month', label: 'Lịch đấu' },
  { id: 'match', icon: 'sports_soccer', label: '', isFab: true },
  { id: 'team', icon: 'groups', label: 'Đội bóng' },
  { id: 'profile', icon: 'person', label: 'Cá nhân' },
];

/**
 * BottomNav Component
 *
 * Fixed bottom navigation with 5 tabs and a center FAB for "Find Match".
 *
 * @example
 * ```tsx
 * const [activeTab, setActiveTab] = useState('home');
 * <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
 * ```
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-stretch justify-around h-[72px] bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 pt-1 safe-area-bottom">
        {tabs.map((tab) => {
          if (tab.isFab) {
            return (
              <div key={tab.id} className="relative -top-6 flex items-center justify-center">
                <button
                  onClick={() => onTabChange(tab.id)}
                  className="h-[56px] w-[56px] rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all text-slate-900 border-4 border-white dark:border-surface-dark"
                >
                  <Icon name={tab.icon} className="text-[28px]" filled />
                </button>
              </div>
            );
          }

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 max-w-[80px] h-full gap-0.5 px-1 ${
                isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <Icon name={tab.icon} filled={isActive} className="text-[22px]" />
              <span className="text-[10px] font-medium leading-tight whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
