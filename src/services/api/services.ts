// API Services Export
export { default as apiClient } from './index';
export { api, uploadFile, ApiResponse, PaginatedApiResponse } from './index';

export { default as AuthService } from './auth.service';
export { default as TeamsService } from './teams.service';
export { default as MatchesService } from './matches.service';
export { default as SwipesService } from './swipes.service';
export { default as DiscoveryService } from './discovery.service';
export { default as FilesService } from './files.service';
export { default as NotificationsService } from './notifications.service';

// Re-export all API types
export * from '../../types/api.types';