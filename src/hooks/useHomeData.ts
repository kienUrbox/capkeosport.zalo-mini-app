import { useEffect, useState, useCallback, useRef } from 'react';
import { useMatchStore } from '@/stores/match.store';
import { useUIStore } from '@/stores/ui.store';
import { useHomeStore } from '@/stores/home.store';
import { NotificationService, type Notification } from '@/services/api/notification.service';
import { MatchService } from '@/services/api/match.service';

// Default location: Ho Chi Minh City center
const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

interface HomeDataState {
  // Data
  pendingInvitations: Notification[];
  nearbyTeams: any[]; // Keep for backward compatibility but always empty

  // Loading states - separated by section
  isLoadingInvitations: boolean;
  isLoadingTeams: boolean;
  isLoadingMatches: boolean;
  isRefreshing: boolean;

  // Error states
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
}

export const useHomeData = (): HomeDataState => {
  const { setUpcomingMatches } = useMatchStore();
  const { showToast } = useUIStore();
  const homeStore = useHomeStore();

  const [pendingInvitations, setPendingInvitations] = useState<Notification[]>([]);
  const [nearbyTeams, setNearbyTeams] = useState<any[]>([]);

  // Individual loading states
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted
  const isMounted = useRef(true);
  // Track if initial fetch has completed
  const hasFetched = useRef(false);

  // Get user's location
  const getUserLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using default location');
        resolve(DEFAULT_LOCATION);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error, using default location:', error.message);
          resolve(DEFAULT_LOCATION);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }, []);

  // Fetch all home data
  const fetchData = useCallback(async (isRefresh = false) => {
    // For initial load (not refresh), always fetch data
    // For navigation back to home, use cache if available and fresh
    if (!isRefresh && hasFetched.current && !homeStore.isDataStale()) {
      // Already loaded before and cache is still fresh - use cached data
      setPendingInvitations(homeStore.pendingInvitations);
      setNearbyTeams([]);
      setIsLoadingInvitations(false);
      setIsLoadingTeams(false);
      setIsLoadingMatches(false);
      return;
    }

    // Set loading states for both initial load and refresh
    setIsRefreshing(true);
    setIsLoadingInvitations(true);
    setIsLoadingTeams(true);
    setIsLoadingMatches(true);
    setError(null);

    try {
      // Get user location first (no longer used for nearby teams)
      await getUserLocation();

      // Fetch invitations separately
      const invitationsPromise = NotificationService.getNotifications({
        type: 'team_invitation',
        unreadOnly: true,
      })
        .then((response) => {
          if (response.success) {
            const notifications = response.data || [];
            setPendingInvitations(notifications);
            return { success: true, data: notifications };
          }
          return { success: false, error: 'Failed to load invitations' };
        })
        .catch((err) => ({ success: false, error: err }))
        .then((result) => {
          setIsLoadingInvitations(false);
          return result;
        });

      // Fetch matches separately
      const matchesPromise = MatchService.getMatches({
        status: 'CONFIRMED',
      })
        .then((response) => {
          if (response.success) {
            const matches = Array.isArray(response.data) ? response.data : [];
            setUpcomingMatches(matches);
            return { success: true };
          }
          return { success: false, error: 'Failed to load matches' };
        })
        .catch((err) => ({ success: false, error: err }))
        .then((result) => {
          setIsLoadingMatches(false);
          return result;
        });

      // Fetch teams separately (requires location) - DISABLED
      // const teamsPromise = DiscoveryService.discoverTeams(discoveryFilters)
      //   .then((response) => {
      //     if (response.success) {
      //       const discoveredTeams = response.data?.teams || [];
      //       setNearbyTeams(discoveredTeams);
      //       return { success: true, data: discoveredTeams };
      //     }
      //     return { success: false, error: 'Failed to load teams' };
      //   })
      //   .catch((err) => ({ success: false, error: err }))
      //   .then((result) => {
      //     setIsLoadingTeams(false);
      //     return result;
      //   });

      // Wait for all to complete (excluding teams)
      const results = await Promise.all([invitationsPromise, matchesPromise]);
      setIsLoadingTeams(false); // Skip teams loading

      // Collect errors
      const errors: string[] = [];
      let fetchedNotifications: Notification[] = [];

      const invitationsResult = results[0];
      if ('data' in invitationsResult && invitationsResult.data) {
        fetchedNotifications = invitationsResult.data;
      } else {
        errors.push('Không thể tải lời mời');
      }

      const matchesResult = results[1];
      if (!matchesResult.success) {
        errors.push('Không thể tải trận đấu');
      }

      // Show error toast if there were errors
      if (errors.length > 0 && isRefresh) {
        showToast(errors.join('. '), 'error');
      }

      // Set error state if all failed
      if (errors.length === 2) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      }

      // Save to Zustand store if at least partial success
      if (errors.length < 2 && fetchedNotifications.length > 0) {
        homeStore.setHomeData({
          pendingInvitations: fetchedNotifications,
          nearbyTeams: [],
        });
      }

      hasFetched.current = true;
    } catch (err: any) {
      console.error('Home data fetch error:', err);
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Có lỗi xảy ra';
      setError(errorMessage);
      if (isRefresh) {
        showToast(errorMessage, 'error');
      }
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
      }
    }
  }, [getUserLocation, setUpcomingMatches, showToast, homeStore]);

  // Refresh function
  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Initial fetch on mount
  useEffect(() => {
    // Always fetch data - let the API handle authentication
    // The axios interceptor will add the auth token automatically
    fetchData(false);

    // Cleanup
    return () => {
      isMounted.current = false;
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pendingInvitations,
    nearbyTeams,
    isLoadingInvitations,
    isLoadingTeams,
    isLoadingMatches,
    isRefreshing,
    error,
    refresh,
  };
};
