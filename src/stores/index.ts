// Main stores export
export { default as useAuthStore } from './auth.store';
export {
  useAuth,
  useUser,
  useTokens,
  useAuthActions,
  useIsAuthenticated,
  useUserId,
  useUserName,
  useUserAvatar,
} from './auth.store';

export { default as useTeamsStore } from './teams.store';
export {
  useTeams,
  useMyTeams,
  useCurrentTeam,
  useTeamMembers,
  useTeamStats,
  useTeamsLoading,
  useTeamsError,
  useTeamsPagination,
  useTeamsFilters,
  useTeamsActions,
} from './teams.store';

export { default as useMatchesStore } from './matches.store';
export {
  useMatches,
  useCurrentMatch,
  useUpcomingMatches,
  usePastMatches,
  useActiveMatches,
  useMatchSuggestions,
  useMatchesLoading,
  useMatchesError,
  useMatchesPagination,
  useMatchesFilters,
  useMatchesActions,
} from './matches.store';

export { default as useSwipesStore } from './swipes.store';
export {
  useSwipes,
  useReceivedSwipes,
  useMutualLikes,
  useCurrentSwipeResponse,
  useSwipeStats,
  useSwipesLoading,
  useSwipesError,
  useSwipesPagination,
  useSwipesFilters,
  useSwipesActions,
} from './swipes.store';

export { default as useDiscoveryStore } from './discovery.store';
export {
  useDiscoveredTeams,
  useDiscoveryResponse,
  useDiscoveryStats,
  useRecommendedParams,
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
  useDiscoveryActions,
} from './discovery.store';

export { default as useNotificationsStore } from './notifications.store';
export {
  useNotifications,
  useUnreadNotifications,
  useNotificationStats,
  useUnreadCount,
  useNotificationsLoading,
  useNotificationsError,
  useNotificationsPagination,
  useNotificationsFilters,
  useNotificationPreferences,
  useNotificationMuteStatus,
  useNotificationsActions,
} from './notifications.store';

// Reset all stores utility
export const useResetAllStores = () => {
  const { reset: resetAuth } = useAuthStore();
  const { reset: resetTeams } = useTeamsStore();
  const { reset: resetMatches } = useMatchesStore();
  const { reset: resetSwipes } = useSwipesStore();
  const { reset: resetDiscovery } = useDiscoveryStore();
  const { reset: resetNotifications } = useNotificationsStore();

  return () => {
    resetAuth();
    resetTeams();
    resetMatches();
    resetSwipes();
    resetDiscovery();
    resetNotifications();
  };
};

// Global state utilities
export const useGlobalLoading = () => {
  const teamsLoading = useTeamsLoading();
  const matchesLoading = useMatchesLoading();
  const swipesLoading = useSwipesLoading();
  const discoveryLoading = useDiscoveryLoading();
  const notificationsLoading = useNotificationsLoading();

  return {
    isLoading: teamsLoading.isLoading || matchesLoading.isLoading ||
               swipesLoading.isLoading || discoveryLoading.isLoading ||
               notificationsLoading.isLoading,
    isUpdating: teamsLoading.isUpdating || matchesLoading.isUpdating ||
                swipesLoading.isSwiping || discoveryLoading.isSearching ||
                notificationsLoading.isUpdating,
  };
};

export const useGlobalErrors = () => {
  const teamsError = useTeamsError();
  const matchesError = useMatchesError();
  const swipesError = useSwipesError();
  const discoveryError = useDiscoveryError();
  const notificationsError = useNotificationsError();

  return {
    hasError: !!(teamsError || matchesError || swipesError || discoveryError || notificationsError),
    errors: {
      teams: teamsError,
      matches: matchesError,
      swipes: swipesError,
      discovery: discoveryError,
      notifications: notificationsError,
    },
  };
};

export * from '../types/api.types';