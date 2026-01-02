import { api } from './index';

// Request/Response types
export interface DiscoveryFilterDto {
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  level?: string;
  gender?: 'male' | 'female' | 'mixed';
  pitchType?: '5' | '7';
}

export interface DiscoveredTeam {
  id: string;
  name: string;
  logo: string;
  level?: string;
  distance: number;
  matchScore: number;
  location: string;
}

export interface DiscoveryResponse {
  teams: DiscoveredTeam[];
  hasMore: boolean;
}

export interface CreateSwipeDto {
  targetTeamId: string;
  action: 'like' | 'pass';
}

/**
 * Discovery Service
 *
 * API methods for team discovery and matching
 */
export const DiscoveryService = {
  /**
   * Discover teams nearby
   */
  discoverTeams: async (filters: DiscoveryFilterDto) => {
    return api.post<DiscoveryResponse>('/discovery', filters);
  },

  /**
   * Swipe on a team (like/pass)
   */
  swipeTeam: async (swipeData: CreateSwipeDto) => {
    return api.post<import('../../stores/match.store').SwipeResponse>('/swipes', swipeData);
  },

  /**
   * Get swipe stats
   */
  getSwipeStats: async () => {
    return api.get('/swipes/stats');
  },
};
