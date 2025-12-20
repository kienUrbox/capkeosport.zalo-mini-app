import { api } from './index';
import {
  DiscoveredTeam,
  DiscoveryResponse,
  DiscoveryFilter,
  DiscoveryFilterDto,
  DiscoveryStats,
  ApiResponse
} from '../../types/api.types';

export class DiscoveryService {
  /**
   * Discover teams based on location and preferences
   */
  static async discoverTeams(filter: DiscoveryFilterDto): Promise<ApiResponse<DiscoveryResponse>> {
    return api.post<DiscoveryResponse>('/discovery', filter);
  }

  /**
   * Get user discovery statistics
   */
  static async getDiscoveryStats(): Promise<ApiResponse<DiscoveryStats>> {
    return api.get<DiscoveryStats>('/discovery/stats');
  }

  /**
   * Get recommended search parameters for user
   */
  static async getRecommendedParams(): Promise<ApiResponse<{
    center: {
      lat: number;
      lng: number;
    };
    radius: number;
    filters: Partial<DiscoveryFilter>;
    explanation: string;
  }>> {
    return api.get<any>('/discovery/recommendations');
  }

  /**
   * Search teams near a location
   */
  static async searchNearbyTeams(
    lat: number,
    lng: number,
    radiusKm = 10,
    filters?: Partial<DiscoveryFilter>
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return this.discoverTeams({
      center: { lat, lng },
      radius: radiusKm,
      ...filters
    });
  }

  /**
   * Search teams by level and location
   */
  static async searchTeamsByLevel(
    levels: string[],
    lat: number,
    lng: number,
    radiusKm = 10,
    additionalFilters?: Partial<DiscoveryFilter>
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return this.discoverTeams({
      center: { lat, lng },
      radius: radiusKm,
      level: levels,
      ...additionalFilters
    });
  }

  /**
   * Search teams by gender and location
   */
  static async searchTeamsByGender(
    genders: string[],
    lat: number,
    lng: number,
    radiusKm = 10,
    additionalFilters?: Partial<DiscoveryFilter>
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return this.discoverTeams({
      center: { lat, lng },
      radius: radiusKm,
      gender: genders as any,
      ...additionalFilters
    });
  }

  /**
   * Get trending teams in area
   */
  static async getTrendingTeams(
    lat: number,
    lng: number,
    radiusKm = 20,
    limit = 20
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return this.discoverTeams({
      center: { lat, lng },
      radius: radiusKm,
      sortBy: 'rating',
      sortOrder: 'DESC',
      activeOnly: true
    });
  }

  /**
   * Get newly created teams in area
   */
  static async getNewTeams(
    lat: number,
    lng: number,
    radiusKm = 10,
    daysOld = 7
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return this.discoverTeams({
      center: { lat, lng },
      radius: radiusKm,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      activeOnly: true
    });
  }

  /**
   * Get most active teams
   */
  static async getMostActiveTeams(
    lat: number,
    lng: number,
    radiusKm = 15,
    limit = 15
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return this.discoverTeams({
      center: { lat, lng },
      radius: radiusKm,
      sortBy: 'lastActive',
      sortOrder: 'DESC',
      activeOnly: true
    });
  }

  /**
   * Get teams with similar level
   */
  static async getSimilarLevelTeams(
    teamId: string,
    lat: number,
    lng: number,
    radiusKm = 10
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return api.get<DiscoveryResponse>(`/discovery/similar-level/${teamId}`, {
      params: {
        lat,
        lng,
        radius: radiusKm
      }
    });
  }

  /**
   * Get teams with compatible stats
   */
  static async getCompatibleTeams(
    teamId: string,
    lat: number,
    lng: number,
    radiusKm = 10
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return api.get<DiscoveryResponse>(`/discovery/compatible/${teamId}`, {
      params: {
        lat,
        lng,
        radius: radiusKm
      }
    });
  }

  /**
   * Get recommended teams for a team
   */
  static async getRecommendedTeams(
    teamId: string,
    limit = 20
  ): Promise<ApiResponse<DiscoveryResponse>> {
    return api.get<DiscoveryResponse>(`/discovery/recommended/${teamId}`, {
      params: { limit }
    });
  }

  /**
   * Search teams by multiple criteria
   */
  static async advancedSearch(criteria: {
    location?: {
      lat: number;
      lng: number;
      radius: number;
    };
    level?: string[];
    gender?: string[];
    minRating?: number;
    minPlayers?: number;
    maxPlayers?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    excludeIds?: string[];
    activeOnly?: boolean;
    limit?: number;
  }): Promise<ApiResponse<DiscoveryResponse>> {
    const filter: DiscoveryFilterDto = {
      center: criteria.location?.center || { lat: 10.7769, lng: 106.7009 },
      radius: criteria.location?.radius || 10,
      level: criteria.level,
      gender: criteria.gender as any,
      minRating: criteria.minRating,
      minPlayers: criteria.minPlayers,
      maxPlayers: criteria.maxPlayers,
      sortBy: criteria.sortBy,
      sortOrder: criteria.sortOrder,
      excludeIds: criteria.excludeIds,
      activeOnly: criteria.activeOnly !== false
    };

    return this.discoverTeams(filter);
  }

  /**
   * Save discovery preferences
   */
  static async saveDiscoveryPreferences(preferences: {
    defaultRadius: number;
    preferredLevels: string[];
    preferredGenders: string[];
    minRating: number;
    activeOnly: boolean;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  }): Promise<ApiResponse<any>> {
    return api.post<any>('/discovery/preferences', preferences);
  }

  /**
   * Get discovery preferences
   */
  static async getDiscoveryPreferences(): Promise<ApiResponse<{
    defaultRadius: number;
    preferredLevels: string[];
    preferredGenders: string[];
    minRating: number;
    activeOnly: boolean;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  }>> {
    return api.get<any>('/discovery/preferences');
  }

  /**
   * Get popular search areas
   */
  static async getPopularSearchAreas(): Promise<ApiResponse<{
    areas: {
      name: string;
      lat: number;
      lng: number;
      teamCount: number;
      searchCount: number;
    }[];
  }>> {
    return api.get<any>('/discovery/popular-areas');
  }

  /**
   * Record discovery search
   */
  static async recordSearch(searchData: {
    center: { lat: number; lng: number };
    radius: number;
    filters: Partial<DiscoveryFilter>;
    resultsCount: number;
  }): Promise<ApiResponse<void>> {
    return api.post<void>('/discovery/search-log', searchData);
  }
}

export default DiscoveryService;