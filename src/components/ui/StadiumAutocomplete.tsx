import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './';
import { StadiumService, type StadiumAutocompleteDto } from '@/services/api/stadium.service';

export interface StadiumAutocompleteProps {
  value?: StadiumAutocompleteDto | null;
  onChange: (stadium: StadiumAutocompleteDto | null) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Google Maps URL validator
 * Validates various Google Maps URL formats
 */
const isValidGoogleMapsUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;

  const googleMapsPatterns = [
    /^https?:\/\/(www\.)?google\.com\/maps/,
    /^https?:\/\/(www\.)?maps\.google\.com/,
    /^https?:\/\/maps\.app\.goo\.gl/,
    /^https?:\/\/goo\.gl\/maps/,
  ];

  return googleMapsPatterns.some(pattern => pattern.test(url.trim()));
};

/**
 * StadiumAutocomplete Component
 *
 * Autocomplete dropdown for stadium selection with API search.
 * Features:
 * - Debounced search (300ms)
 * - Minimum 2 characters to trigger search
 * - Display match count
 * - Auto-create new stadium when not found
 * - Map URL input with validation
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

  // Map URL state and validation
  const [mapUrl, setMapUrl] = useState(value?.mapUrl || '');
  const [mapUrlError, setMapUrlError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const mapUrlInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Reset search text and mapUrl when value changes from outside
  useEffect(() => {
    if (value) {
      setSearchText(value.name);
      setMapUrl(value.mapUrl);
      setMapUrlError(null);
    } else {
      setSearchText('');
      setMapUrl('');
      setMapUrlError(null);
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

  // Validate mapUrl when user enters input
  useEffect(() => {
    if (!mapUrl || mapUrl.trim() === '') {
      setMapUrlError(null);
      return;
    }

    if (!isValidGoogleMapsUrl(mapUrl)) {
      setMapUrlError('Vui lòng nhập đường dẫn Google Maps hợp lệ');
    } else {
      setMapUrlError(null);
    }
  }, [mapUrl]);

  // Debounced search
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

        console.log(response);

        setOptions(response || []);
        // Always show dropdown (with or without results)
        setShowDropdown(true);
      } catch (err) {
        console.error('Stadium search error:', err);
        setOptions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchText, value]);

  const handleSelectStadium = (stadium: StadiumAutocompleteDto) => {
    setSearchText(stadium.name);
    setMapUrl(stadium.mapUrl); // Auto-fill map URL
    setMapUrlError(null);
    setOptions([]); // Clear options to prevent re-showing dropdown
    onChange(stadium);
    setShowDropdown(false);
  };

  // Create new stadium with current search text
  const handleCreateNewStadium = () => {
    if (!searchText || !searchText.trim()) {
      return;
    }

    const newStadium: StadiumAutocompleteDto = {
      id: `custom-${Date.now()}`,
      name: searchText.trim(),
      mapUrl: mapUrl.trim(),
      matchCount: 0,
      homeTeamCount: 0,
    };

    setSearchText(newStadium.name);
    setOptions([]); // Clear options to prevent re-showing dropdown
    onChange(newStadium);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearchText('');
    setMapUrl('');
    setMapUrlError(null);
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

  // Open Google Maps when clicking hint
  const handleFocusMapUrlInput = () => {
    // Use Google Maps deep link for Zalo Mini App
    // Try deep link first, fallback to web URL
    const mapsUrl = 'https://maps.google.com';
    const deepLinkUrl = 'comgooglemaps://';

    // Try to open with deep link (works on mobile with Google Maps app)
    const start = Date.now();
    window.location.href = deepLinkUrl;

    // Fallback to web URL if deep link doesn't work (after 500ms)
    setTimeout(() => {
      if (Date.now() - start < 600) {
        window.location.href = mapsUrl;
      }
    }, 500);
  };

  // Check if can create new stadium
  const canCreateNew = searchText.trim() !== '' && mapUrl.trim() !== '' && !mapUrlError && options.length === 0 && !loading;

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

      {/* Map URL Input */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          Link Google Maps <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            ref={mapUrlInputRef}
            type="url"
            placeholder="https://maps.google.com/..."
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            disabled={!!value}
            className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-dark border text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent ${value || disabled ? 'bg-gray-50 dark:bg-white/5 cursor-not-allowed opacity-50' : ''
              } ${mapUrlError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'}`}
            required
          />
          {value && !disabled && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="lock" className="text-gray-400 text-sm" />
            </div>
          )}
        </div>
        {mapUrlError && (
          <p className="text-xs text-red-500 mt-1">{mapUrlError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          💡 URL tự động điền khi chọn sân từ hệ thống
        </p>
      </div>

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
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {stadium.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {stadium.address || (stadium.district && stadium.city
                          ? `${stadium.district}, ${stadium.city}`
                          : 'Chưa có địa chỉ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {stadium.matchCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Icon name="sports_soccer" className="text-xs" />
                            {stadium.matchCount} trận
                          </span>
                        )}
                        {stadium.homeTeamCount > 0 && (
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
                    Nhập tên sân và copy link Google Maps vào ô bên dưới để thêm
                  </p>
                  <button
                    type="button"
                    onClick={handleFocusMapUrlInput}
                    className="text-xs text-primary hover:underline mt-2 text-left font-medium"
                  >
                    📍 Mở Google Maps để lấy link
                  </button>
                </div>
              </div>
              {canCreateNew && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={handleCreateNewStadium}
                    className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    ✓ Thêm sân "{searchText}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
