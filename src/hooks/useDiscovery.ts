import { useCallback, useEffect } from 'react';
import { DiscoveredTeam, DiscoveryFilter } from '../types/api.types';
import {
  useDiscoveryStore,
  useDiscoveredTeams,
  useDiscoveryResponse,
  useDiscoveryStats,
  useTrendingTeams,
  useNewTeams,
  useRecommendedTeamsList,
  useCompatibleTeams,
  useSimilarLevelTeams,
  usePopularAreas,
  useDiscoveryLoading,
  useDiscoveryError,
  useDiscoveryFilters,
  useSearchHistory,
  useLastSearchCenter,
  useDiscoveryActions
} from '../stores';

// Main discovery hook that provides both state and actions
export const useDiscovery = () => {
  const discoveryStore = useDiscoveryStore();

  return {
    ...discoveryStore,
  };
};

// Team discovery hook for the main discovery interface
export const useTeamDiscovery = () => {
  const discoveredTeams = useDiscoveredTeams();
  const discoveryResponse = useDiscoveryResponse();
  const { isSearching } = useDiscoveryLoading();
  const { error } = useDiscoveryError();
  const filters = useDiscoveryFilters();
  const { discoverTeams, setFilters, updateSearchLocation } = useDiscoveryActions();

  // Discover teams with filters
  const searchTeams = useCallback(async (searchFilters: DiscoveryFilter) => {
    return await discoverTeams(searchFilters);
  }, [discoverTeams]);

  // Search nearby teams
  const searchNearbyTeams = useCallback(async (lat: number, lng: number, radiusKm?: number, additionalFilters?: any) => {
    const searchFilters = {
      center: { lat, lng },
      radius: radiusKm || filters.radius,
      ...additionalFilters,
    };
    return await searchTeams(searchFilters);
  }, [filters.radius, searchTeams]);

  // Update search location
  const updateLocation = useCallback((lat: number, lng: number) => {
    updateSearchLocation(lat, lng);
  }, [updateSearchLocation]);

  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<DiscoveryFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    return searchTeams(updatedFilters);
  }, [filters, setFilters, searchTeams]);

  // Get search results count
  const getResultsCount = useCallback(() => {
    return discoveryResponse?.total || discoveredTeams.length;
  }, [discoveryResponse, discoveredTeams]);

  // Get search center
  const getSearchCenter = useCallback(() => {
    return filters.center;
  }, [filters]);

  return {
    teams: discoveredTeams,
    discoveryResponse,
    isSearching,
    error,
    filters,
    searchTeams,
    searchNearbyTeams,
    updateLocation,
    applyFilters,
    getResultsCount,
    getSearchCenter,
  };
};

// Discovery statistics hook
export const useDiscoveryStatistics = () => {
  const discoveryStats = useDiscoveryStats();
  const { isLoading } = useDiscoveryLoading();
  const { getDiscoveryStats } = useDiscoveryActions();

  // Load discovery statistics
  const loadStats = useCallback(async () => {
    await getDiscoveryStats();
  }, [getDiscoveryStats]);

  // Get total searches
  const getTotalSearches = useCallback(() => {
    return discoveryStats?.totalSearches || 0;
  }, [discoveryStats]);

  // Get average match rate
  const getAverageMatchRate = useCallback(() => {
    if (!discoveryStats?.averageMatchesPerSearch) return 0;
    return Math.round((discoveryStats.averageMatchesPerSearch / 20) * 100); // Assuming 20 teams per search
  }, [discoveryStats]);

  // Get most searched districts
  const getMostSearchedDistricts = useCallback(() => {
    return discoveryStats?.popularLocations?.slice(0, 5) || [];
  }, [discoveryStats]);

  return {
    stats: discoveryStats,
    isLoading,
    loadStats,
    getTotalSearches,
    getAverageMatchRate,
    getMostSearchedDistricts,
  };
};

// Trending teams hook
export const useTrendingTeams = (location?: { lat: number; lng: number }) => {
  const trendingTeams = useTrendingTeams();
  const { isLoading } = useDiscoveryLoading();
  const { getTrendingTeams } = useDiscoveryActions();

  // Load trending teams
  const loadTrendingTeams = useCallback(async (lat: number, lng: number, radiusKm = 20, limit = 20) => {
    await getTrendingTeams(lat, lng, radiusKm, limit);
  }, [getTrendingTeams]);

  // Auto-load trending teams when location changes
  useEffect(() => {
    if (location) {
      loadTrendingTeams(location.lat, location.lng);
    }
  }, [location, loadTrendingTeams]);

  return {
    trendingTeams,
    isLoading,
    loadTrendingTeams,
  };
};

// New teams hook
export const useNewTeams = (location?: { lat: number; lng: number }) => {
  const newTeams = useNewTeams();
  const { isLoading } = useDiscoveryLoading();
  const { getNewTeams } = useDiscoveryActions();

  // Load new teams
  const loadNewTeams = useCallback(async (lat: number, lng: number, radiusKm = 10, daysOld = 7) => {
    await getNewTeams(lat, lng, radiusKm, daysOld);
  }, [getNewTeams]);

  // Auto-load new teams when location changes
  useEffect(() => {
    if (location) {
      loadNewTeams(location.lat, location.lng);
    }
  }, [location, loadNewTeams]);

  return {
    newTeams,
    isLoading,
    loadNewTeams,
  };
};

// Recommended teams hook
export const useRecommendedTeams = (teamId?: string) => {
  const recommendedTeams = useRecommendedTeamsList();
  const { isLoading } = useDiscoveryLoading();
  const { getRecommendedTeams } = useDiscoveryActions();

  // Load recommended teams
  const loadRecommendedTeams = useCallback(async (teamId: string, limit = 20) => {
    await getRecommendedTeams(teamId, limit);
  }, [getRecommendedTeams]);

  // Auto-load recommended teams when teamId changes
  useEffect(() => {
    if (teamId) {
      loadRecommendedTeams(teamId);
    }
  }, [teamId, loadRecommendedTeams]);

  return {
    recommendedTeams,
    isLoading,
    loadRecommendedTeams,
  };
};

// Compatible teams hook
export const useCompatibleTeams = (teamId?: string, location?: { lat: number; lng: number }) => {
  const compatibleTeams = useCompatibleTeams();
  const { isLoading } = useDiscoveryLoading();
  const { getCompatibleTeams } = useDiscoveryActions();

  // Load compatible teams
  const loadCompatibleTeams = useCallback(async (teamId: string, lat: number, lng: number, radiusKm = 10) => {
    await getCompatibleTeams(teamId, lat, lng, radiusKm);
  }, [getCompatibleTeams]);

  // Auto-load compatible teams when teamId or location changes
  useEffect(() => {
    if (teamId && location) {
      loadCompatibleTeams(teamId, location.lat, location.lng);
    }
  }, [teamId, location, loadCompatibleTeams]);

  return {
    compatibleTeams,
    isLoading,
    loadCompatibleTeams,
  };
};

// Similar level teams hook
export const useSimilarLevelTeams = (teamId?: string, location?: { lat: number; lng: number }) => {
  const similarLevelTeams = useSimilarLevelTeams();
  const { isLoading } = useDiscoveryLoading();
  const { getSimilarLevelTeams } = useDiscoveryActions();

  // Load similar level teams
  const loadSimilarLevelTeams = useCallback(async (teamId: string, lat: number, lng: number, radiusKm = 10) => {
    await getSimilarLevelTeams(teamId, lat, lng, radiusKm);
  }, [getSimilarLevelTeams]);

  // Auto-load similar level teams when teamId or location changes
  useEffect(() => {
    if (teamId && location) {
      loadSimilarLevelTeams(teamId, location.lat, location.lng);
    }
  }, [teamId, location, loadSimilarLevelTeams]);

  return {
    similarLevelTeams,
    isLoading,
    loadSimilarLevelTeams,
  };
};

// Popular search areas hook
export const usePopularSearchAreas = () => {
  const popularAreas = usePopularAreas();
  const { isLoading } = useDiscoveryLoading();
  const { getPopularSearchAreas } = useDiscoveryActions();

  // Load popular search areas
  const loadPopularAreas = useCallback(async () => {
    await getPopularSearchAreas();
  }, [getPopularSearchAreas]);

  return {
    popularAreas,
    isLoading,
    loadPopularAreas,
  };
};

// Search history hook
export const useSearchHistory = () => {
  const searchHistory = useSearchHistory();
  const { addToSearchHistory, clearSearchHistory } = useDiscoveryActions();

  // Add to search history
  const recordSearch = useCallback((searchData: any) => {
    addToSearchHistory(searchData);
  }, [addToSearchHistory]);

  // Get recent searches
  const getRecentSearches = useCallback((limit = 10) => {
    return searchHistory.slice(0, limit);
  }, [searchHistory]);

  // Get unique search areas
  const getUniqueSearchAreas = useCallback(() => {
    const areas = searchHistory.map(search => search.center);
    const unique = areas.filter((area, index, self) =>
      index === self.findIndex(a => a.lat === area.lat && a.lng === area.lng)
    );
    return unique;
  }, [searchHistory]);

  return {
    searchHistory,
    recordSearch,
    getRecentSearches,
    getUniqueSearchAreas,
    clearSearchHistory,
  };
};

// Discovery preferences hook
export const useDiscoveryPreferences = () => {
  const { isLoading } = useDiscoveryLoading();
  const { error } = useDiscoveryError();
  const { saveDiscoveryPreferences, getDiscoveryPreferences } = useDiscoveryActions();

  // Save preferences
  const savePreferences = useCallback(async (preferences: any) => {
    return await saveDiscoveryPreferences(preferences);
  }, [saveDiscoveryPreferences]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    await getDiscoveryPreferences();
  }, [getDiscoveryPreferences]);

  return {
    isLoading,
    error,
    savePreferences,
    loadPreferences,
  };
};

// Advanced search hook
export const useAdvancedSearch = () => {
  const { isSearching } = useDiscoveryLoading();
  const { error } = useDiscoveryError();
  const { advancedSearch } = useDiscoveryActions();

  // Perform advanced search
  const performAdvancedSearch = useCallback(async (criteria: any) => {
    return await advancedSearch(criteria);
  }, [advancedSearch]);

  return {
    isSearching,
    error,
    performAdvancedSearch,
  };
};

// Discovery analytics hook
export const useDiscoveryAnalytics = () => {
  const discoveryStats = useDiscoveryStats();
  const searchHistory = useSearchHistory();

  // Calculate search frequency
  const getSearchFrequency = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSearches = searchHistory.filter(
      search => new Date(search.timestamp) > oneWeekAgo
    );

    return recentSearches.length;
  }, [searchHistory]);

  // Get peak search times
  const getPeakSearchTimes = useCallback(() => {
    const hourCounts: Record<number, number> = {};

    searchHistory.forEach(search => {
      const hour = new Date(search.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [searchHistory]);

  // Get average search radius
  const getAverageSearchRadius = useCallback(() => {
    if (searchHistory.length === 0) return 0;

    const totalRadius = searchHistory.reduce((sum, search) => sum + search.radius, 0);
    return Math.round(totalRadius / searchHistory.length);
  }, [searchHistory]);

  return {
    getSearchFrequency,
    getPeakSearchTimes,
    getAverageSearchRadius,
    discoveryStats,
  };
};

export default useDiscovery;