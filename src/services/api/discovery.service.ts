import { api } from './index';

// Request types - Match API documentation
export interface DiscoveryFilterDto {
  lat: number;
  lng: number;
  radius?: number;
  level?: string[]; // ["Trung bình", "Khá", "Giỏi"]
  gender?: string[]; // ["Nam", "Nữ", "Mixed"]
  teamId?: string; // Exclude specific team ID
  exclude?: string[]; // Exclude list of team IDs
  limit?: number;
  minScore?: number;
  sortBy?: 'distance' | 'compatibility' | 'quality' | 'activity';
  sortOrder?: 'ASC' | 'DESC';
}

export interface TeamStats {
  attack: number;
  defense: number;
  technique: number;
}

export interface TeamLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface DiscoveredTeam {
  id: string;
  name: string;
  logo: string;
  level: string;
  gender: string;
  description?: string;
  pitch?: string[]; // Preferred pitch types e.g., ["Sân 7", "Sân 11"]
  stats: TeamStats;
  location: TeamLocation;
  distance: number;
  membersCount: number;
  compatibilityScore: number;
  qualityScore: number;
  activityScore: number;
  lastActive: string;
}

export interface DiscoverySearchInfo {
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  filters: {
    level?: string[];
    gender?: string[];
  };
}

export interface DiscoveryResponse {
  teams: DiscoveredTeam[];
  total: number;
  searchInfo: DiscoverySearchInfo;
}

export interface DiscoveryStats {
  totalTeamsDiscovered: number;
  averageDistance: number;
  mostPreferredLevel: string;
  mostPreferredGender: string;
  lastDiscoveryTime: string;
}

export interface RecommendedParams {
  recommendedLevel: string[];
  recommendedGender: string[];
  recommendedRadius: number;
  preferredLocations: TeamLocation[];
}

// Helper to map Gender enum to Vietnamese
const GENDER_MAP: Record<string, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  MIXED: 'Mixed',
  Nam: 'Nam',
  Nữ: 'Nữ',
  Mixed: 'Mixed',
};

// Helper to map Vietnamese back to enum (exported for use in other files)
export const REVERSE_GENDER_MAP: Record<string, string> = {
  Nam: 'MALE',
  Nữ: 'FEMALE',
  Mixed: 'MIXED',
};

/**
 * Discovery Service
 *
 * API methods for team discovery and matching
 */
export const DiscoveryService = {
  /**
   * Discover teams nearby
   * POST /discovery
   */
  discoverTeams: async (params: DiscoveryFilterDto) => {
    // Map gender enums to Vietnamese for API
    const mappedParams = {
      ...params,
      gender: params.gender?.map(g => GENDER_MAP[g] || g),
    };
    return api.post<DiscoveryResponse>('/discovery', mappedParams);
  },

  /**
   * Get discovery statistics
   * GET /api/v1/discovery/stats
   */
  getStats: async () => {
    return api.get<DiscoveryStats>('/discovery/stats');
  },

  /**
   * Get recommended search parameters
   * GET /api/v1/discovery/recommendations
   */
  getRecommendations: async () => {
    return api.get<RecommendedParams>('/discovery/recommendations');
  },
};
