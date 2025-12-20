import { api } from './index';
import {
  Swipe,
  SwipeResponse,
  SwipeStats,
  CreateSwipeDto,
  SwipeAction,
  SwipeQueryParams,
  ApiResponse,
  PaginatedApiResponse
} from '../../types/api.types';

export class SwipesService {
  /**
   * Create a new swipe (like or pass)
   */
  static async createSwipe(data: CreateSwipeDto): Promise<ApiResponse<SwipeResponse>> {
    return api.post<SwipeResponse>('/swipes', data);
  }

  /**
   * Like a team
   */
  static async likeTeam(swiperTeamId: string, targetTeamId: string, metadata?: any): Promise<ApiResponse<SwipeResponse>> {
    return this.createSwipe({
      swiperTeamId,
      targetTeamId,
      action: SwipeAction.LIKE,
      swipeMetadata: metadata
    });
  }

  /**
   * Pass on a team
   */
  static async passTeam(swiperTeamId: string, targetTeamId: string, metadata?: any): Promise<ApiResponse<SwipeResponse>> {
    return this.createSwipe({
      swiperTeamId,
      targetTeamId,
      action: SwipeAction.PASS,
      swipeMetadata: metadata
    });
  }

  /**
   * Get swipe history for a team
   */
  static async getTeamSwipes(teamId: string, params?: SwipeQueryParams): Promise<PaginatedApiResponse<Swipe>> {
    return api.get<Swipe>(`/swipes/team/${teamId}`, { params });
  }

  /**
   * Get received swipes (likes) for a team
   */
  static async getReceivedSwipes(teamId: string, params?: SwipeQueryParams): Promise<PaginatedApiResponse<Swipe>> {
    return api.get<Swipe>(`/swipes/team/${teamId}/received`, { params });
  }

  /**
   * Get team swipe statistics
   */
  static async getTeamSwipeStats(teamId: string): Promise<ApiResponse<SwipeStats>> {
    return api.get<SwipeStats>(`/swipes/team/${teamId}/stats`);
  }

  /**
   * Undo a swipe (within 5 minutes)
   */
  static async undoSwipe(swipeId: string): Promise<ApiResponse<Swipe>> {
    return api.post<Swipe>(`/swipes/${swipeId}/undo`);
  }

  /**
   * Check if a team can swipe on another team
   */
  static async checkSwipeEligibility(swiperTeamId: string, targetTeamId: string): Promise<ApiResponse<{
    canSwipe: boolean;
    reason?: string;
  }>> {
    return api.post<any>(`/swipes/check/${swiperTeamId}/${targetTeamId}`);
  }

  /**
   * Get all likes made by a team
   */
  static async getTeamLikes(teamId: string, params?: SwipeQueryParams): Promise<PaginatedApiResponse<Swipe>> {
    return this.getTeamSwipes(teamId, {
      ...params,
      action: SwipeAction.LIKE
    });
  }

  /**
   * Get all passes made by a team
   */
  static async getTeamPasses(teamId: string, params?: SwipeQueryParams): Promise<PaginatedApiResponse<Swipe>> {
    return this.getTeamSwipes(teamId, {
      ...params,
      action: SwipeAction.PASS
    });
  }

  /**
   * Get mutual likes (matches)
   */
  static async getMutualLikes(teamId: string, params?: SwipeQueryParams): Promise<PaginatedApiResponse<Swipe>> {
    return api.get<Swipe>('/swipes/mutual', {
      params: {
        teamId,
        ...params
      }
    });
  }

  /**
   * Get recent swipe activity
   */
  static async getRecentSwipes(teamId: string, limit = 10): Promise<PaginatedApiResponse<Swipe>> {
    return this.getTeamSwipes(teamId, {
      limit,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  }

  /**
   * Get swipe trends
   */
  static async getSwipeTrends(teamId: string): Promise<ApiResponse<{
    dailySwipes: {
      date: string;
      likes: number;
      passes: number;
      matches: number;
    }[];
    weeklyStats: {
      week: string;
      totalSwipes: number;
      matches: number;
      matchRate: number;
    }[];
    preferences: {
      levelPreference: Record<string, number>;
      genderPreference: Record<string, number>;
      locationPreference: number;
    };
  }>> {
    return api.get<any>(`/swipes/trends/${teamId}`);
  }

  /**
   * Get swipe recommendations
   */
  static async getSwipeRecommendations(teamId: string, limit = 20): Promise<ApiResponse<{
    teams: any[];
    recommendationScore: number;
    reason: string;
  }[]>> {
    return api.get<any>(`/swipes/recommendations/${teamId}`, {
      params: { limit }
    });
  }

  /**
   * Batch swipe operations
   */
  static async batchSwipes(swiperTeamId: string, actions: {
    targetTeamId: string;
    action: SwipeAction;
    metadata?: any;
  }[]): Promise<ApiResponse<SwipeResponse[]>> {
    return api.post<SwipeResponse[]>('/swipes/batch', {
      swiperTeamId,
      actions
    });
  }

  /**
   * Get swipe compatibility score between two teams
   */
  static async getCompatibilityScore(teamAId: string, teamBId: string): Promise<ApiResponse<{
    score: number;
    factors: {
      level: number;
      location: number;
      gender: number;
      stats: number;
      activity: number;
    };
    explanation: string;
  }>> {
    return api.get<any>(`/swipes/compatibility/${teamAId}/${teamBId}`);
  }

  /**
   * Update swipe preferences
   */
  static async updateSwipePreferences(teamId: string, preferences: {
    preferredLevels?: string[];
    preferredGenders?: string[];
    maxDistance?: number;
    minRating?: number;
    ageRange?: {
      min?: number;
      max?: number;
    };
  }): Promise<ApiResponse<any>> {
    return api.patch<any>(`/swipes/preferences/${teamId}`, preferences);
  }

  /**
   * Get swipe preferences
   */
  static async getSwipePreferences(teamId: string): Promise<ApiResponse<{
    preferredLevels: string[];
    preferredGenders: string[];
    maxDistance: number;
    minRating: number;
    ageRange?: {
      min?: number;
      max?: number;
    };
  }>> {
    return api.get<any>(`/swipes/preferences/${teamId}`);
  }
}

export default SwipesService;