// API Services Export
export { default as apiClient } from './index';
export { api } from './index';
export { uploadFile } from './index';

// Auth Service
export { default as AuthService } from './auth.service';

// Football Connect Services
export { TeamService } from './team.service';
export { MatchService } from './match.service';
export { DiscoveryService } from './discovery.service';
export { NotificationService } from './notification.service';
export { FileService } from './file.service';
export { SwipeService } from './swipe.service';
export { default as PhoneInviteService } from './phone-invite.service';
export { default as TeamInviteService } from './team-invite.service';

// Re-export all API types
export * from '@/types/api.types';
