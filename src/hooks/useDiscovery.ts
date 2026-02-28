import { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import zmp from "zmp-sdk";
import {
  DiscoveryService,
  type DiscoveryFilterDto,
  type DiscoveredTeam,
} from "@/services/api/discovery.service";
import { SwipeService } from "@/services/api/swipe.service";
import { useDiscoveryStore, getDefaultFilters } from "@/stores/discovery.store";
import useTeamStore, { useSelectedTeam } from "@/stores/team.store";
import { useUIStore } from "@/stores/ui.store";
import { appRoutes } from "@/utils/navigation";
import type { Match } from "@/types/api.types";

interface SwipeQueueItem {
  direction: "left" | "right";
  teamId: string;
}

interface UseDiscoveryReturn {
  // Data
  currentTeam: DiscoveredTeam | null;
  allTeams: DiscoveredTeam[];
  currentIndex: number;
  hasMoreCards: boolean;
  matchedTeam: DiscoveredTeam | null;
  matchedMatch: Match | null;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Pending swipes
  pendingSwipeCount: number;
  canSwipe: boolean; // Whether user can swipe (limited by pending count)

  // Location permission (DEPRECATED - use location modal options)
  showLocationPermission: boolean;

  // Actions
  fetchTeams: (isRefresh?: boolean) => Promise<void>;
  handleSwipe: (direction: "left" | "right") => void;
  nextCard: () => void;
  openFilters: () => void;
  closeMatchModal: () => void;
  goToMatchDetail: (matchId: string) => void;
  refresh: () => Promise<void>;
  handleLocationPermissionResponse: (allowed: boolean) => void;

  // New: Manual trigger for fetching with specific location source
  fetchWithLocation: (
    locationSource: "current" | "stadium" | "default",
    stadiumLocation?: { lat: number; lng: number },
    teamId?: string | null,
  ) => Promise<void>;
}

const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

/**
 * Custom hook for discovery/swipe functionality
 *
 * Handles:
 * - Fetching discovered teams based on filters
 * - Swipe actions (like/pass)
 * - Match detection and modal
 * - Filter defaults from selected team
 */
export const useDiscovery = (): UseDiscoveryReturn => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const selectedTeam = useSelectedTeam();

  // Store state
  const {
    teams,
    currentIndex,
    isLoading,
    isRefreshing,
    error,
    matchedTeam,
    matchedMatch,
    setFilters,
    resetFilters,
    setTeams,
    nextCard,
    setMatchedTeam,
    setMatchedMatch,
    setLoading,
    setRefreshing,
    setError,
  } = useDiscoveryStore();

  // Track if component is mounted
  const isMounted = useRef(true);
  // Track if initial fetch has completed
  const hasFetched = useRef(false);
  // Track card view start time for swipe metadata
  const cardViewStartTime = useRef<number>(Date.now());
  // Swipe queue for optimistic UI
  const swipeQueueRef = useRef<SwipeQueueItem[]>([]);
  const isProcessingRef = useRef(false);
  const [pendingSwipeCount, setPendingSwipeCount] = useState(0);

  // Location permission state
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const locationPermissionRef = useRef<{
    resolve: (location: { lat: number; lng: number }) => void;
    reject: () => void;
  } | null>(null);

  // Track if location permission has been asked before
  const locationAskedRef = useRef(false);
  // Store selected location source for refetch
  const locationSourceRef = useRef<{
    source: "current" | "stadium" | "default";
    stadiumLocation?: { lat: number; lng: number };
  } | null>(null);
  // Track the last fetch timestamp to prevent immediate re-fetch
  const lastFetchTimeRef = useRef<number>(0);

  // Update card view time when current index changes
  useEffect(() => {
    // Guard against undefined currentIndex during hydration
    if (typeof currentIndex !== "number") return;
    cardViewStartTime.current = Date.now();
  }, [currentIndex]);

  // Get user's location using Zalo API (DEPRECATED - kept for backward compatibility)
  const getUserLocation = useCallback((): Promise<{
    lat: number;
    lng: number;
  }> => {
    return new Promise((resolve) => {
      // If permission was already asked and denied, use default location
      if (locationAskedRef.current) {
        // Try to get location without showing modal
        zmp
          .getLocation()
          .then((location: any) => {
            resolve({
              lat: location.latitude,
              lng: location.longitude,
            });
          })
          .catch(() => {
            console.warn("Zalo location error, using default location");
            resolve(DEFAULT_LOCATION);
          });
        return;
      }

      // First time asking - show permission modal
      locationAskedRef.current = true;
      setShowLocationPermission(true);

      // Store the resolve function to call after user response
      locationPermissionRef.current = {
        resolve: (location) => resolve(location),
        reject: () => resolve(DEFAULT_LOCATION),
      };
    });
  }, []);

  // New: Fetch with specific location source
  const fetchWithLocation = useCallback(
    async (
      locationSource: "current" | "stadium" | "default",
      stadiumLocation?: { lat: number; lng: number },
      teamId?: string | null,
    ) => {
      // Set last fetch time to prevent immediate re-fetch
      lastFetchTimeRef.current = Date.now();

      // Store location source for future refetches
      locationSourceRef.current = { source: locationSource, stadiumLocation };

      let location: { lat: number; lng: number };

      switch (locationSource) {
        case "current":
          try {
            const zaloLocation = (await zmp.getLocation()) as any; // Use any to access deprecated fields
            // Zalo getLocation returns token by default, but deprecated latitude/longitude still work
            // latitude/longitude are strings, need to convert to numbers
            const lat = zaloLocation.latitude || zaloLocation.lat;
            const lng = zaloLocation.longitude || zaloLocation.lng;
            if (lat && lng) {
              location = {
                lat: typeof lat === "string" ? parseFloat(lat) : lat,
                lng: typeof lng === "string" ? parseFloat(lng) : lng,
              };
            } else {
              console.warn(
                "Zalo location did not return coordinates, using default location",
              );
              showToast(
                "Không thể lấy vị trí của bạn. Đang sử dụng vị trí mặc định (Hồ Chí Minh)",
                "info",
              );
              location = DEFAULT_LOCATION;
            }
          } catch (error) {
            console.warn("Zalo location error, using default location", error);
            showToast(
              "Không thể lấy vị trí của bạn. Đang sử dụng vị trí mặc định (Hồ Chí Minh)",
              "warning",
            );
            location = DEFAULT_LOCATION;
          }
          break;
        case "stadium":
          location = stadiumLocation || DEFAULT_LOCATION;
          break;
        case "default":
        default:
          location = DEFAULT_LOCATION;
          break;
      }

      setLoading(true);
      setError(null);

      try {
        // Get current filters from store directly to avoid dependency on filters
        const currentFilters = useDiscoveryStore.getState().filters;

        // Update filters with current location
        setFilters({ center: { lat: location.lat, lng: location.lng } });

        // Build API params - exclude current team from results
        const params: DiscoveryFilterDto = {
          lat: location.lat,
          lng: location.lng,
          radius: currentFilters.radius,
          level: currentFilters.level,
          gender: currentFilters.gender,
          sortBy:
            currentFilters.sortBy === "rating"
              ? "quality"
              : currentFilters.sortBy === "createdAt"
                ? "activity"
                : currentFilters.sortBy === "lastActive"
                  ? "activity"
                  : currentFilters.sortBy,
          sortOrder: currentFilters.sortOrder,
          limit: 50,
        };

        // // Add teamId to exclude current team - get fresh value from store
        if (teamId) {
          params.teamId = teamId;
        }

        const response = await DiscoveryService.discoverTeams(params);

        if (response.success && response.data) {
          const fetchedTeams = response.data.teams || [];
          const convertedTeams = fetchedTeams.map((team) => ({
            ...team,
            logo: team.logo || "",
            isActive: true,
            isArchived: false,
            createdBy: "",
            createdAt: team.lastActive || new Date().toISOString(),
          }));
          setTeams(convertedTeams as any, response.data.total || 0);
          hasFetched.current = true;
        } else {
          setError("Không thể tải danh sách đội");
        }
      } catch (err: any) {
        console.error("Discovery fetch error:", err);
        const errorMessage =
          err?.message || "Không thể tải danh sách đội. Vui lòng thử lại.";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    },
    [setFilters, setTeams, setLoading, setError, showToast],
  );

  // Initialize filters from selected team on first load
  useEffect(() => {
    if (!hasFetched.current && selectedTeam) {
      const defaults = getDefaultFilters(
        selectedTeam.level,
        selectedTeam.gender,
      );
      // Only update if filters haven't been set by user (check if filters are still default)
      const currentFilters = useDiscoveryStore.getState().filters;
      const isDefaultFilter =
        (currentFilters.center?.lat ?? DEFAULT_LOCATION.lat) ===
          defaults.center.lat &&
        (currentFilters.center?.lng ?? DEFAULT_LOCATION.lng) ===
          defaults.center.lng &&
        currentFilters.radius === defaults.radius;

      if (isDefaultFilter) {
        resetFilters(selectedTeam.level, selectedTeam.gender);
      }
    }
  }, [selectedTeam, resetFilters]);

  // Fetch discovered teams (uses stored location source for refetch)
  const fetchTeams = useCallback(
    async (isRefresh = false) => {
      // Skip if already loading
      if (isLoading && !isRefresh) {
        return;
      }

      // If no location source stored, this shouldn't be called
      // Return early - let the screen handle the location selection
      if (!locationSourceRef.current) {
        console.warn("fetchTeams called without location source");
        return;
      }

      // Set last fetch time to prevent immediate re-fetch
      lastFetchTimeRef.current = Date.now();

      setLoading(true);
      if (isRefresh) {
        setRefreshing(true);
      }
      setError(null);

      try {
        let location: { lat: number; lng: number };

        // Use stored location source
        switch (locationSourceRef.current.source) {
          case "current":
            try {
              const zaloLocation = (await zmp.getLocation()) as any; // Use any to access deprecated fields
              // Zalo getLocation returns token by default, but deprecated latitude/longitude still work
              // latitude/longitude are strings, need to convert to numbers
              const lat = zaloLocation.latitude || zaloLocation.lat;
              const lng = zaloLocation.longitude || zaloLocation.lng;
              if (lat && lng) {
                location = {
                  lat: typeof lat === "string" ? parseFloat(lat) : lat,
                  lng: typeof lng === "string" ? parseFloat(lng) : lng,
                };
              } else {
                location = DEFAULT_LOCATION;
              }
            } catch (error) {
              console.warn("Zalo location error, using default location");
              location = DEFAULT_LOCATION;
            }
            break;
          case "stadium":
            location =
              locationSourceRef.current.stadiumLocation || DEFAULT_LOCATION;
            break;
          case "default":
          default:
            location = DEFAULT_LOCATION;
            break;
        }

        // Get current filters from store directly to avoid dependency on filters
        const currentFilters = useDiscoveryStore.getState().filters;

        // Update filters with current location
        setFilters({ center: { lat: location.lat, lng: location.lng } });

        // Build API params - exclude current team from results
        const params: DiscoveryFilterDto = {
          lat: location.lat,
          lng: location.lng,
          radius: currentFilters.radius,
          level: currentFilters.level,
          gender: currentFilters.gender,
          sortBy:
            currentFilters.sortBy === "rating"
              ? "quality"
              : currentFilters.sortBy === "createdAt"
                ? "activity"
                : currentFilters.sortBy === "lastActive"
                  ? "activity"
                  : currentFilters.sortBy,
          sortOrder: currentFilters.sortOrder,
          limit: 50,
        };

        // Add teamId to exclude current team
        if (selectedTeam?.id) {
          params.teamId = selectedTeam.id;
        }

        const response = await DiscoveryService.discoverTeams(params);

        if (response.success && response.data) {
          const fetchedTeams = response.data.teams || [];
          // Convert from service DiscoveredTeam to store DiscoveredTeam
          const convertedTeams = fetchedTeams.map((team) => ({
            ...team,
            logo: team.logo || "",
            isActive: true,
            isArchived: false,
            createdBy: "",
            createdAt: team.lastActive || new Date().toISOString(),
          }));
          setTeams(convertedTeams as any, response.data.total || 0);
          hasFetched.current = true;
        } else {
          setError("Không thể tải danh sách đội");
        }
      } catch (err: any) {
        console.error("Discovery fetch error:", err);
        const errorMessage =
          err?.message || "Không thể tải danh sách đội. Vui lòng thử lại.";
        setError(errorMessage);
        if (isRefresh) {
          showToast(errorMessage, "error");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [
      selectedTeam,
      isLoading,
      setFilters,
      setTeams,
      setLoading,
      setRefreshing,
      setError,
      showToast,
    ],
  );

  // Process swipe queue (process one at a time)
  const processSwipeQueue = useCallback(async () => {
    if (isProcessingRef.current || swipeQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const swipe = swipeQueueRef.current.shift()!;

    try {
      const action: "like" | "pass" =
        swipe.direction === "right" ? "like" : "pass";
      const timeSpent = Date.now() - cardViewStartTime.current;

      const apiResponse = await SwipeService.createSwipe({
        swiperTeamId: selectedTeam!.id,
        targetTeamId: swipe.teamId,
        action,
        swipeMetadata: {
          timeSpentViewing: timeSpent,
          locationPreferenceMatch: true,
          levelPreferenceMatch: true,
          genderPreferenceMatch: true,
        },
      });

      if (apiResponse.success && apiResponse.data?.isMatch) {
        // Show match modal - can appear even if user moved to other cards
        const matchedTeamData = teams.find((t) => t.id === swipe.teamId);
        if (matchedTeamData) {
          setMatchedTeam(matchedTeamData);
          if (apiResponse.data.newMatch) {
            setMatchedMatch(apiResponse.data.newMatch);
          }
        }
      }
    } catch (err: any) {
      console.error("Swipe error:", err);
      const errorMessage =
        err?.message || "Không thể thực hiện hành động. Vui lòng thử lại.";
      showToast(errorMessage, "error");
    } finally {
      setPendingSwipeCount((prev) => prev - 1);
      isProcessingRef.current = false;
      // Process next in queue
      if (swipeQueueRef.current.length > 0) {
        processSwipeQueue();
      }
    }
  }, [selectedTeam, teams, setMatchedTeam, setMatchedMatch, showToast]);

  // Handle swipe action (like/pass) - OPTIMISTIC
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const currentCard = teams[currentIndex];
      if (!currentCard || !selectedTeam) {
        return;
      }

      // Check swipe limit (max 5 pending)
      if (pendingSwipeCount >= 5) {
        showToast(
          "Đang xử lý quá nhiều thao tác, vui lòng đợi trong giây lát",
          "error",
        );
        return;
      }

      // OPTIMISTIC: Advance card immediately before API call
      nextCard();

      // Add to queue for background processing
      swipeQueueRef.current.push({ direction, teamId: currentCard.id });
      setPendingSwipeCount((prev) => prev + 1);

      // Start processing if not already
      if (!isProcessingRef.current) {
        processSwipeQueue();
      }
    },
    [
      teams,
      currentIndex,
      selectedTeam,
      nextCard,
      processSwipeQueue,
      pendingSwipeCount,
      showToast,
    ],
  );

  // Open filters (navigate to filter bottom sheet - will be handled by screen)
  const openFilters = useCallback(() => {
    // This will be handled by the screen component
    // The screen will set a local state to show the FilterBottomSheet
  }, []);

  // Close match modal
  const closeMatchModal = useCallback(() => {
    setMatchedTeam(null);
    setMatchedMatch(null);
  }, [setMatchedTeam, setMatchedMatch]);

  // Go to match detail
  const goToMatchDetail = useCallback(
    (matchId: string) => {
      closeMatchModal();
      if (matchId) {
        navigate(appRoutes.matchDetail(matchId));
      }
    },
    [closeMatchModal, navigate],
  );

  // Refresh function
  const refresh = useCallback(async () => {
    // If no location source stored, can't refresh
    if (!locationSourceRef.current) {
      showToast("Vui lòng chọn bộ lọc trước", "error");
      return;
    }
    await fetchTeams(true);
  }, [fetchTeams, showToast]);

  // NOTE: Removed initial auto-fetch on mount
  // The screen component is responsible for calling fetchWithLocation
  // after user has selected team, filters, and location

  // Auto-fetch more teams when getting close to end
  // Use a ref to track fetchTeams to avoid dependency issues
  const fetchTeamsRef = useRef(fetchTeams);
  fetchTeamsRef.current = fetchTeams;

  useEffect(() => {
    // Fetch more when we have 3 or fewer cards left
    // But NOT immediately after an initial fetch (prevent infinite loop)
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;

    if (
      locationSourceRef.current && // Only fetch if we have a location source
      teams.length > 0 &&
      teams.length - currentIndex <= 3 &&
      !isLoading &&
      !isRefreshing &&
      timeSinceLastFetch > 1000 // Only fetch if at least 1 second has passed since last fetch
    ) {
      lastFetchTimeRef.current = now;
      fetchTeamsRef.current(false);
    }
  }, [currentIndex, teams.length, isRefreshing]); // Removed isLoading from deps to prevent loop

  // Current team card
  const currentTeam = teams[currentIndex] || null;
  const hasMoreCards = currentIndex < teams.length;

  // Limit swipes: allow only 5 pending at a time
  const canSwipe = pendingSwipeCount < 5;

  // Handle location permission response
  const handleLocationPermissionResponse = useCallback(
    async (allowed: boolean) => {
      setShowLocationPermission(false);

      if (!locationPermissionRef.current) {
        return;
      }

      if (allowed) {
        try {
          const location = await zmp.getLocation();
          locationPermissionRef.current.resolve({
            lat: location.latitude,
            lng: location.longitude,
          });
        } catch (error) {
          console.warn("Zalo location error:", error);
          locationPermissionRef.current.resolve(DEFAULT_LOCATION);
        }
      } else {
        // User denied - use default location
        locationPermissionRef.current.resolve(DEFAULT_LOCATION);
      }

      locationPermissionRef.current = null;
    },
    [],
  );

  return {
    // Data
    currentTeam,
    allTeams: teams,
    currentIndex,
    hasMoreCards,
    matchedTeam,
    matchedMatch,

    // Loading states
    isLoading,
    isRefreshing,
    error,

    // Pending swipes
    pendingSwipeCount,
    canSwipe,

    // Location permission
    showLocationPermission,

    // Actions
    fetchTeams,
    fetchWithLocation,
    handleSwipe,
    nextCard,
    openFilters,
    closeMatchModal,
    goToMatchDetail,
    refresh,
    handleLocationPermissionResponse,
  };
};

export default useDiscovery;
