import React from 'react';

export interface FilterBarProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * FilterBar Component
 *
 * Horizontal scrollable filter tabs for filtering lists.
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selected,
  onChange,
  className = '',
}) => {
  return (
    <div className={`sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-white/5 ${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide gap-2 px-4 py-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selected === option
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
