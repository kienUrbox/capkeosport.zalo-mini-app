import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Button } from './Button';
import { useDiscoveryStore, getDefaultFilters } from '@/stores/discovery.store';
import { useSelectedTeam } from '@/stores/team.store';
import { TEAM_LEVELS, TEAM_GENDER } from '@/constants/design';

export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

/**
 * FilterBottomSheet Component
 *
 * Bottom sheet for customizing discovery filters:
 * - Radius slider (5-50km)
 * - Level multi-select
 * - Gender multi-select
 * - Sort by options
 * - Reset to defaults button
 */
export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  console.log('FilterBottomSheet render, isOpen:', isOpen);

  const { filters, setFilters, resetFilters } = useDiscoveryStore();
  const selectedTeam = useSelectedTeam();

  // Debug
  useEffect(() => {
    console.log('FilterBottomSheet isOpen:', isOpen);
  }, [isOpen]);

  // Local state for filters (not applied until user clicks Apply)
  const [localRadius, setLocalRadius] = useState(filters.radius);
  const [localLevels, setLocalLevels] = useState<string[]>(filters.level);
  const [localGenders, setLocalGenders] = useState<string[]>(filters.gender);
  const [localSortBy, setLocalSortBy] = useState(filters.sortBy);

  // Sync local state with store when sheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalRadius(filters.radius);
      setLocalLevels(filters.level);
      setLocalGenders(filters.gender);
      setLocalSortBy(filters.sortBy);
    }
  }, [isOpen, filters]);

  const handleReset = () => {
    const defaults = getDefaultFilters(selectedTeam?.level, selectedTeam?.gender);
    setLocalRadius(defaults.radius);
    setLocalLevels(defaults.level);
    setLocalGenders(defaults.gender);
    setLocalSortBy(defaults.sortBy);
  };

  const handleApply = () => {
    setFilters({
      radius: localRadius,
      level: localLevels,
      gender: localGenders,
      sortBy: localSortBy,
    });
    onApply();
    onClose();
  };

  const toggleLevel = (level: string) => {
    if (localLevels.includes(level)) {
      // Don't allow deselecting all levels
      if (localLevels.length > 1) {
        setLocalLevels(localLevels.filter((l) => l !== level));
      }
    } else {
      setLocalLevels([...localLevels, level]);
    }
  };

  const toggleGender = (gender: string) => {
    if (localGenders.includes(gender)) {
      // Don't allow deselecting all genders
      if (localGenders.length > 1) {
        setLocalGenders(localGenders.filter((g) => g !== gender));
      }
    } else {
      setLocalGenders([...localGenders, gender]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl p-6 pb-safe animate-slide-up shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Drag indicator */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bộ lọc</h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Radius Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Bán kính tìm kiếm
              </label>
              <span className="text-sm font-bold text-primary">{localRadius}km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={localRadius}
              onChange={(e) => setLocalRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5km</span>
              <span>50km</span>
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white mb-3 block">
              Trình độ
            </label>
            <div className="flex flex-wrap gap-2">
              {TEAM_LEVELS.map((level) => {
                const isSelected = localLevels.includes(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-background-dark'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white mb-3 block">
              Giới tính
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TEAM_GENDER).map((gender) => {
                const isSelected = localGenders.includes(gender);
                return (
                  <button
                    key={gender}
                    onClick={() => toggleGender(gender)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-background-dark'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {gender}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white mb-3 block">
              Sắp xếp theo
            </label>
            <div className="flex gap-2">
              {[
                { value: 'distance', label: 'Khoảng cách' },
                { value: 'quality', label: 'Chất lượng' },
                { value: 'activity', label: 'Hoạt động' },
              ].map((option) => {
                const isSelected = localSortBy === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setLocalSortBy(option.value as any)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-background-dark'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="flex-1"
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBottomSheet;
