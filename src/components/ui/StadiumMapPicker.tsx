import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from './';

// Default center: Ho Chi Minh City
const DEFAULT_CENTER: [number, number] = [10.8231, 106.6297];
const DEFAULT_ZOOM = 15;

// Create custom marker icon using SVG data URL (more reliable)
const createMarkerIcon = () => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        position: relative;
      ">
        <svg viewBox="0 0 24 24" fill="#3b82f6" style="
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const markerIcon = createMarkerIcon();

export interface StadiumMapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lat: number, lng: number) => void;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  stadiumName?: string;
  // Place detail info from Goong API
  placeDetail?: {
    name: string;
    formattedAddress: string;
    district?: string;
    city?: string;
  };
}

/**
 * ChangeCenter Component
 * Updates map center when position prop changes
 */
const ChangeCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

/**
 * DraggableMarker Component
 * Handles marker drag events
 */
const DraggableMarker: React.FC<{
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          onPositionChange(pos.lat, pos.lng);
        },
      }}
      position={position}
      icon={markerIcon}
    />
  );
};

/**
 * StadiumMapPicker Component
 *
 * Modal for selecting stadium location on OpenStreetMap.
 * User can drag marker to adjust position.
 */
export const StadiumMapPicker: React.FC<StadiumMapPickerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialPosition,
  stadiumName = 'sân bóng',
  placeDetail,
}) => {
  // Current marker position - initialize safely
  const [position, setPosition] = useState<[number, number]>(() => {
    if (initialPosition?.lat && initialPosition?.lng) {
      // Convert to numbers in case they come as strings
      return [Number(initialPosition.lat), Number(initialPosition.lng)];
    }
    return DEFAULT_CENTER;
  });
  const [mapReady, setMapReady] = useState(false);

  // Reset position when modal opens with new initial position
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        setMapReady(true);
      }, 100);
    } else {
      setMapReady(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      if (initialPosition?.lat && initialPosition?.lng) {
        setPosition([Number(initialPosition.lat), Number(initialPosition.lng)]);
      } else {
        setPosition(DEFAULT_CENTER);
      }
    }
  }, [isOpen, initialPosition]);

  const handleConfirm = () => {
    onConfirm(position[0], position[1]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-t-3xl animate-slide-up shadow-2xl max-h-[90vh] flex flex-col">
        {/* Handle bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-4 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Xác nhận vị trí
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
              {placeDetail?.name || stadiumName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shrink-0 ml-2"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Place Detail Info */}
        {placeDetail && (
          <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 shrink-0">
            <div className="flex items-start gap-2">
              <Icon name="info" className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Thông tin từ Goong
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 truncate">
                  {placeDetail.formattedAddress}
                </p>
                {placeDetail.district && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {placeDetail.district}{placeDetail.city ? `, ${placeDetail.city}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Container - Fixed height for Leaflet */}
        <div
          className="shrink-0 bg-gray-100 dark:bg-gray-800"
          style={{ height: '350px', width: '100%' }}
        >
          {mapReady && (
            <MapContainer
              center={position}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <ChangeCenter center={position} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              <DraggableMarker
                position={position}
                onPositionChange={(lat, lng) => setPosition([lat, lng])}
              />
            </MapContainer>
          )}
          {!mapReady && (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        {/* Coordinates Display */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="place" className="text-primary" />
            <span className="font-mono text-gray-600 dark:text-gray-300">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Kéo thả marker để điều chỉnh vị trí chính xác
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="check" />
            Xác nhận vị trí này
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 mt-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default StadiumMapPicker;
