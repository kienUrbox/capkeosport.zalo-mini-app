import React, { useState } from 'react';
import { Icon } from './';

export interface LocationValue {
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapLink?: string;
}

export interface LocationPickerProps {
  value?: LocationValue;
  onChange: (location: LocationValue) => void;
  error?: string;
}

// Popular stadiums in HCMC with coordinates
const POPULAR_STADIUMS = [
  { name: 'Sân Thanh Đa', address: 'Đường Điện Biên Phủ, Q.Bình Thạnh', lat: 10.8031, lng: 106.7081 },
  { name: 'Sân THĐ (Thống Nhất)', address: 'Đường Điện Biên Phủ, Q.1', lat: 10.7850, lng: 106.6950 },
  { name: 'Sân Rạch Kiếm', address: 'Đường CMT8, Q.3', lat: 10.7791, lng: 106.6818 },
  { name: 'Sân Phú Mỹ', address: 'Đường Phú Mỹ, Q.7', lat: 10.7564, lng: 106.7091 },
  { name: 'Sân Phú Thọ', address: 'Đường Lê Duẩn, Q.1', lat: 10.7729, lng: 106.6946 },
  { name: 'Sân Yết Kiêu', address: 'Đường Hồ Bá Kiện, Q.1', lat: 10.7698, lng: 106.6835 },
];

/**
 * LocationPicker Component
 *
 * Mobile-friendly location picker with popular stadium shortcuts.
 * User can select from preset stadiums or enter custom location.
 */
export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const [name, setName] = useState(value?.name || '');
  const [address, setAddress] = useState(value?.address || '');
  const [lat, setLat] = useState(value?.lat || 0);
  const [lng, setLng] = useState(value?.lng || 0);
  const [mapLink, setMapLink] = useState(value?.mapLink || '');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const updateLocation = (data: typeof POPULAR_STADIUMS[0]) => {
    setName(data.name);
    setAddress(data.address);
    setLat(data.lat);
    setLng(data.lng);
    const generatedMapLink = `https://www.google.com/maps?q=${data.lat},${data.lng}`;
    setMapLink(generatedMapLink);
    onChange({
      name: data.name,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      mapLink: generatedMapLink,
    });
  };

  const handleSelectStadium = (stadium: typeof POPULAR_STADIUMS[0]) => {
    updateLocation(stadium);
    setShowCustomInput(false);
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (lat && lng) {
      onChange({ name: newName, address, lat, lng, mapLink });
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    if (lat && lng) {
      onChange({ name, address: newAddress, lat, lng, mapLink });
    }
  };

  const handleLatChange = (newLat: string) => {
    const parsed = parseFloat(newLat);
    setLat(isNaN(parsed) ? 0 : parsed);
    if (!isNaN(parsed) && lng) {
      const link = mapLink || `https://www.google.com/maps?q=${parsed},${lng}`;
      setMapLink(link);
      onChange({ name, address, lat: parsed, lng, mapLink: link });
    }
  };

  const handleLngChange = (newLng: string) => {
    const parsed = parseFloat(newLng);
    setLng(isNaN(parsed) ? 0 : parsed);
    if (lat && !isNaN(parsed)) {
      const link = mapLink || `https://www.google.com/maps?q=${lat},${parsed}`;
      setMapLink(link);
      onChange({ name, address, lat, lng: parsed, mapLink: link });
    }
  };

  // Open Google Maps to get coordinates
  const handleOpenMaps = () => {
    const url = 'https://www.google.com/maps';
    window.open(url, '_blank');
  };

  const hasLocation = lat !== 0 && lng !== 0;
  const isCustomLocation = !POPULAR_STADIUMS.find(s => s.name === name && s.lat === lat);

  return (
    <div className="flex flex-col gap-4">
      {/* Popular Stadiums - Quick Select */}
      {!showCustomInput && !hasLocation && (
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
            Chọn sân phổ biến
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {POPULAR_STADIUMS.map((stadium) => (
              <button
                key={stadium.name}
                type="button"
                onClick={() => handleSelectStadium(stadium)}
                className="p-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl text-left hover:border-primary dark:hover:border-primary transition-colors active:scale-[0.98]"
              >
                <div className="flex items-start gap-2">
                  <Icon name="place" className="text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {stadium.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {stadium.address}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="mt-3 w-full py-3 text-sm font-medium text-primary border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
          >
            + Nhập sân khác
          </button>
        </div>
      )}

      {/* Selected Location Display */}
      {hasLocation && !showCustomInput && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <Icon name="place" className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-900 dark:text-green-100">
                  {name}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 truncate">
                  {address}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors shrink-0"
            >
              Đổi
            </button>
          </div>
        </div>
      )}

      {/* Custom Location Input */}
      {showCustomInput && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-900 dark:text-white">
              Nhập thông tin sân
            </label>
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                // Clear if it was custom
                if (isCustomLocation) {
                  setName('');
                  setAddress('');
                  setLat(0);
                  setLng(0);
                  setMapLink('');
                }
              }}
              className="text-xs text-primary"
            >
              ← Chọn sân có sẵn
            </button>
          </div>

          {/* Stadium Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Tên sân <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Sân Thanh Đa"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: 123 Đường ABC, Quận 1"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Coordinates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Tọa độ <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleOpenMaps}
                className="text-xs text-primary flex items-center gap-1"
              >
                <Icon name="open_in_new" size="xs" />
                Mở Google Maps
              </button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={lat || ''}
                  onChange={(e) => handleLatChange(e.target.value)}
                  className="w-full px-3 py-3.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={lng || ''}
                  onChange={(e) => handleLngChange(e.target.value)}
                  className="w-full px-3 py-3.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              💡 Mở Google Maps → Click phải vào vị trí → Copy tọa độ
            </p>
          </div>

          {/* Map Link - Auto-generated */}
          {mapLink && (
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Link Google Maps
              </label>
              <input
                type="url"
                value={mapLink}
                onChange={(e) => {
                  setMapLink(e.target.value);
                  if (lat && lng) {
                    onChange({ name, address, lat, lng, mapLink: e.target.value });
                  }
                }}
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <Icon name="error" className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
