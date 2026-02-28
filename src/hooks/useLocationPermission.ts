import { useState, useRef, useCallback } from 'react';
import zmp from 'zmp-sdk';

const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

interface UseLocationPermissionOptions {
  /**
   * Storage key to persist user's choice
   * Default: 'location_permission_asked'
   */
  storageKey?: string;
  /**
   * Whether to show the permission modal on first use
   * Default: true
   */
  showExplanation?: boolean;
  /**
   * Custom explanation message
   */
  explanationTitle?: string;
  explanationReasons?: string[];
}

interface UseLocationPermissionReturn {
  /**
   * Whether to show the permission modal
   */
  showPermissionModal: boolean;
  /**
   * Get user location using Zalo API
   * Will show permission modal on first use (if enabled)
   */
  getLocation: () => Promise<{ lat: number; lng: number }>;
  /**
   * Handle user's response to permission modal
   */
  handlePermissionResponse: (allowed: boolean) => Promise<void>;
  /**
   * Reset permission state (force ask again)
   */
  resetPermission: () => void;
}

/**
 * Reusable hook for requesting and getting user location using Zalo API
 *
 * Features:
 * - Shows permission modal with explanation on first use
 * - Persists user's choice in localStorage
 * - Falls back to default location if denied
 * - Can be customized for different use cases
 *
 * @example
 * ```tsx
 * const { showPermissionModal, getLocation, handlePermissionResponse } = useLocationPermission({
 *   storageKey: 'stadium_location_permission',
 *   explanationTitle: 'Cho phép truy cập vị trí để tìm sân gần bạn',
 *   explanationReasons: [
 *     'Tìm kiếm sân bóng gần vị trí của bạn',
 *     'Hiển thị khoảng cách đến các sân',
 *   ],
 * });
 * ```
 */
export const useLocationPermission = (
  options: UseLocationPermissionOptions = {}
): UseLocationPermissionReturn => {
  const {
    storageKey = 'location_permission_asked',
    showExplanation = true,
    explanationTitle,
    explanationReasons,
  } = options;

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const locationPromiseRef = useRef<{
    resolve: (location: { lat: number; lng: number }) => void;
  } | null>(null);

  // Get user location
  const getLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      // Check if permission was already asked
      let wasAsked = false;
      console.log(localStorage.getItem(storageKey));
      
      if (typeof window !== 'undefined') {
        try {
          wasAsked = localStorage.getItem(storageKey) === 'true';
        } catch {
          // Ignore localStorage errors
        }
      }

      // If already asked, try to get location directly (skip modal)
      if (wasAsked) {
        zmp
          .getLocation()
          .then((location: any) => {
            resolve({
              lat: location.latitude,
              lng: location.longitude,
            });
          })
          .catch(() => {
            console.warn('Zalo location error, using default location');
            resolve(DEFAULT_LOCATION);
          });
        return;
      }

      // If explanation disabled, just mark as asked and get location
      if (!showExplanation) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(storageKey, 'true');
          } catch {
            // Ignore localStorage errors
          }
        }
        zmp
          .getLocation()
          .then((location: any) => {
            resolve({
              lat: location.latitude,
              lng: location.longitude,
            });
          })
          .catch(() => {
            console.warn('Zalo location error, using default location');
            resolve(DEFAULT_LOCATION);
          });
        return;
      }

      // First time asking - show permission modal
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, 'true');
        } catch {
          // Ignore localStorage errors
        }
      }
      setShowPermissionModal(true);

      // Store the resolve function to call after user response
      locationPromiseRef.current = {
        resolve: (location) => resolve(location),
      };
    });
  }, [storageKey, showExplanation]);

  // Handle permission modal response
  const handlePermissionResponse = useCallback(async (allowed: boolean) => {
    // Close modal immediately without animation delay
    setShowPermissionModal(false);

    if (!locationPromiseRef.current) {
      return;
    }

    if (allowed) {
      // Small delay to ensure modal starts closing before Zalo popup appears
      // This prevents UI blocking
      setTimeout(async () => {
        try {
          const location = await zmp.getLocation();
          locationPromiseRef.current?.resolve({
            lat: location.latitude,
            lng: location.longitude,
          });
        } catch (error) {
          console.warn('Zalo location error:', error);
          locationPromiseRef.current?.resolve(DEFAULT_LOCATION);
        }
      }, 100);
    } else {
      // User denied - resolve immediately with default location
      locationPromiseRef.current.resolve(DEFAULT_LOCATION);
      locationPromiseRef.current = null;
    }
  }, []);

  // Reset permission state (force ask again)
  const resetPermission = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey]);

  return {
    showPermissionModal,
    getLocation,
    handlePermissionResponse,
    resetPermission,
  };
};

export default useLocationPermission;
