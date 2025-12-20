// Export all custom hooks
export { default as useAuth, useUserAuth, useUserProfile, useAuthStatus, useRequireAuth, useUserPermissions, useSessionManagement } from './useAuth';
export { default as useTeams, useMyTeams, useTeamDetails, useTeamsDiscovery, useTeamManagement, useTeamStatistics, useTeamSearch } from './useTeams';
export { default as useMatches, useMatchDetails, useUpcomingMatches, usePastMatches, useActiveMatches, useMatchManagement, useMatchesSearch } from './useMatches';
export { default as useSwipes, useSwipeDeck, useTeamSwipes, useReceivedSwipes, useMutualLikes, useSwipeStats, useSwipeTrends, useSwipeRecommendations, useBatchSwipes, useSwipeAnalytics, useSwipeFilters } from './useSwipes';
export { default as useDiscovery, useTeamDiscovery, useDiscoveryStatistics, useTrendingTeams, useNewTeams, useRecommendedTeams, useCompatibleTeams, useSimilarLevelTeams, usePopularSearchAreas, useSearchHistory, useDiscoveryPreferences, useAdvancedSearch, useDiscoveryAnalytics } from './useDiscovery';
export { default as useNotifications, useUnreadNotifications, useNotificationManagement, useNotificationsByType, useNotificationsByPriority, useNotificationStatistics, useNotificationPreferences, useNotificationMuteStatus, useRealTimeNotifications, useNotificationFilters } from './useNotifications';

// Legacy export for backward compatibility
export const useMockData = <T,>(data: T) => data