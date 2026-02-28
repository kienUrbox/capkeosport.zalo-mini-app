import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './';
import { StadiumMapPicker } from './StadiumMapPicker';
import {
  StadiumService,
  type StadiumAutocompleteDto,
  type GoongPlaceDetailDto
} from '@/services/api/stadium.service';

export interface StadiumAutocompleteProps {
  value?: StadiumAutocompleteDto | null;
  onChange: (
    stadium: StadiumAutocompleteDto | null,
    coordinates?: { lat: number; lng: number },
    placeDetail?: GoongPlaceDetailDto
  ) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * StadiumAutocomplete Component
 *
 * Autocomplete dropdown for stadium selection with API search.
 * Features:
 * - Debounced search (1000ms)
 * - Minimum 2 characters to trigger search
 * - Display match count
 * - ALWAYS show map picker for location confirmation
 * - User confirms marker position on map before proceeding
 */
export const StadiumAutocomplete: React.FC<StadiumAutocompleteProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [searchText, setSearchText] = useState(value?.name || '');
  const [options, setOptions] = useState<StadiumAutocompleteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Map picker state
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pendingStadium, setPendingStadium] = useState<StadiumAutocompleteDto | null>(null);
  const [pendingPlaceDetail, setPendingPlaceDetail] = useState<GoongPlaceDetailDto | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Reset search text when value changes from outside
  useEffect(() => {
    if (value) {
      setSearchText(value.name);
    } else {
      setSearchText('');
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search (1000ms as requested)
  useEffect(() => {
    clearTimeout(searchTimeoutRef.current);

    // Don't search if already selected a stadium from the list
    if (value) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }

    if (searchText.length < 2) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await StadiumService.autocompleteStadiums(searchText, 10);
        // Convert lat/lng from strings to numbers if they exist
        const stadiumData = response || [];
        const normalizedResponse = stadiumData.map((stadium: StadiumAutocompleteDto) => ({
          ...stadium,
          lat: stadium.lat ? Number(stadium.lat) : undefined,
          lng: stadium.lng ? Number(stadium.lng) : undefined,
        }));
        setOptions(normalizedResponse);
        // Always show dropdown (with or without results)
        setShowDropdown(true);
      } catch (err) {
        console.error('Stadium search error:', err);
        setOptions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 1000); // Changed from 300ms to 1000ms

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchText, value]);

  const handleSelectStadium = async (stadium: StadiumAutocompleteDto) => {
    setShowDropdown(false);

    // For Goong places without coordinates OR database stadiums with placeId, fetch place detail first
    const shouldFetchDetail =
      (stadium.source === 'goong_places' && (!stadium.lat || !stadium.lng))

    if (shouldFetchDetail) {
      setIsFetchingDetail(true);
      try {
        const detailResponse = await StadiumService.getPlaceDetail(
          stadium.placeId!,
          stadium.sessionToken
        );

        if (detailResponse.result) {
          setPendingStadium(stadium);
          setPendingPlaceDetail(detailResponse.result);
          setShowMapPicker(true);
        } else if (detailResponse.status === 'SESSION_ERROR') {
          console.error('Session token expired for place:', stadium.placeId);
          // Fallback: show map picker with default center
          setPendingStadium(stadium);
          setPendingPlaceDetail(null);
          setShowMapPicker(true);
        } else {
          console.error('Failed to fetch place detail:', detailResponse.error);
          // Fallback: show map picker with default center
          setPendingStadium(stadium);
          setPendingPlaceDetail(null);
          setShowMapPicker(true);
        }
      } catch (err) {
        console.error('Error fetching place detail:', err);
        // Fallback: show map picker with default center
        setPendingStadium(stadium);
        setPendingPlaceDetail(null);
        setShowMapPicker(true);
      } finally {
        setIsFetchingDetail(false);
      }
    } else {
      // Database stadium or Goong place with coordinates
      setPendingStadium(stadium);
      setPendingPlaceDetail(null);
      setShowMapPicker(true);
    }
  };

  // Handle map picker confirm
  const handleMapConfirm = (lat: number, lng: number) => {
    if (pendingStadium) {
      // Update stadium with confirmed coordinates
      const confirmedStadium: StadiumAutocompleteDto = {
        ...pendingStadium,
        lat,
        lng,
      };
      setSearchText(confirmedStadium.name);
      onChange(confirmedStadium, { lat, lng }, pendingPlaceDetail || undefined);
      setPendingStadium(null);
      setPendingPlaceDetail(null);
    }
  };

  // Handle map picker close
  const handleMapClose = () => {
    setShowMapPicker(false);
    setPendingStadium(null);
    setPendingPlaceDetail(null);
  };

  // Create new stadium with current search text
  const handleCreateNewStadium = () => {
    if (!searchText || !searchText.trim()) {
      return;
    }

    const newStadium: StadiumAutocompleteDto = {
      id: `custom-${Date.now()}`,
      name: searchText.trim(),
      mapUrl: '', // No longer using manual URL input
      matchCount: 0,
      homeTeamCount: 0,
      lat: undefined,
      lng: undefined,
    };

    // Show map picker for user to select location
    setPendingStadium(newStadium);
    setShowMapPicker(true);
    setOptions([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearchText('');
    onChange(null);
    setOptions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && options.length === 0 && !loading && searchText.length >= 2) {
      // Press Enter to create new stadium when no results
      e.preventDefault();
      handleCreateNewStadium();
    }
  };

  // Check if can create new stadium (always true for custom stadiums now)
  const canCreateNew = searchText.trim() !== '' && options.length === 0 && !loading;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            // Only show dropdown if: has search text, NOT already selected a stadium, and has options
            if (searchText.length >= 2 && !value && options.length > 0) {
              setShowDropdown(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm sân bóng..."
          disabled={disabled}
          className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-dark border pr-24 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-200 dark:border-white/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {/* Clear Button */}
        {searchText && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Icon name="close" className="text-lg" />
          </button>
        )}

        {/* Search Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          ) : (
            <Icon name="search" className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-2">
        💡 Nhập tên sân để tìm kiếm, sau đó xác nhận vị trí trên bản đồ
      </p>

      {/* Dropdown */}
      {showDropdown && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2" />
              Đang tìm kiếm...
            </div>
          ) : options.length > 0 ? (
            <>
              {options.map((stadium) => (
                <button
                  key={stadium.id}
                  type="button"
                  onClick={() => handleSelectStadium(stadium)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="place" className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {stadium.name}
                        </p>
                        {/* Source Badge */}
                        {stadium.source === 'goong_places' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shrink-0">
                            Goong
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {stadium.address || stadium.description || (stadium.district && stadium.city
                          ? `${stadium.district}, ${stadium.city}`
                          : 'Chưa có địa chỉ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {stadium.source === 'database' && stadium.matchCount !== undefined && stadium.matchCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Icon name="sports_soccer" className="text-xs" />
                            {stadium.matchCount} trận
                          </span>
                        )}
                        {stadium.source === 'database' && stadium.homeTeamCount !== undefined && stadium.homeTeamCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary">
                            <Icon name="home" className="text-xs" />
                            {stadium.homeTeamCount} sân nhà
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            // No results - show info message
            <div className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                  <Icon name="info" className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Sân này chưa có trong hệ thống
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bạn có thể thêm sân mới và chọn vị trí trên bản đồ
                  </p>
                </div>
              </div>
              {canCreateNew && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={handleCreateNewStadium}
                    className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    📍 Thêm sân "{searchText}" và chọn vị trí
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Map Picker Modal */}
      <StadiumMapPicker
        key={pendingStadium?.id || 'map-picker'}
        isOpen={showMapPicker}
        onClose={handleMapClose}
        onConfirm={handleMapConfirm}
        initialPosition={
          pendingPlaceDetail?.lat && pendingPlaceDetail?.lng
            ? { lat: pendingPlaceDetail.lat, lng: pendingPlaceDetail.lng }
            : pendingStadium?.lat && pendingStadium?.lng
              ? { lat: pendingStadium.lat, lng: pendingStadium.lng }
              : undefined
        }
        stadiumName={pendingPlaceDetail?.name || pendingStadium?.name || 'sân bóng'}
        placeDetail={
          pendingPlaceDetail
            ? {
              name: pendingPlaceDetail.name,
              formattedAddress: pendingPlaceDetail.formattedAddress,
              district: pendingPlaceDetail.district,
              city: pendingPlaceDetail.city,
            }
            : undefined
        }
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-2">
          <Icon name="error" className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default StadiumAutocomplete;
