import { api } from './index';
import type {
  CreateSwipeDto,
  SwipeResponse,
  SwipeHistoryResponse,
  ReceivedSwipesResponse,
  SwipeStats,
  SwipeAnalytics,
  SwipeCheckResponse,
  UndoSwipeResponse,
  ApiResponse,
} from '@/types/api.types';

/**
 * Swipe Service
 *
 * Complete API integration for swipe functionality including:
 * - Creating swipes (like/pass)
 * - Getting swipe history
 * - Getting received swipes (who liked me)
 * - Getting swipe statistics
 * - Checking swipe eligibility
 * - Undoing swipes (within 5 minutes)
 */
export const SwipeService = {
  /**
   * Create a swipe (like or pass)
   * POST /api/v1/swipes
   *
   * @param swipeData - The swipe data to create
   * @returns Promise<ApiResponse<SwipeResponse>> - Contains swipe info and match status
   */
  createSwipe: async (swipeData: CreateSwipeDto): Promise<ApiResponse<SwipeResponse>> => {
    return api.post<SwipeResponse>('/swipes', swipeData);
  },

  /**
   * Get swipe history for a team
   * GET /api/v1/swipes/team/:teamId
   *
   * @param teamId - The team ID to get swipes for
   * @param params - Optional pagination and filter params
   * @returns Promise<ApiResponse<SwipeHistoryResponse>> - Paginated swipe history
   */
  getSwipeHistory: async (
    teamId: string,
    params?: {
      page?: number;
      limit?: number;
      action?: 'LIKE' | 'PASS';
    }
  ): Promise<ApiResponse<SwipeHistoryResponse>> => {
    return api.get<SwipeHistoryResponse>(
      `/swipes/team/${teamId}`,
      { params }
    );
  },

  /**
   * Get received swipes (teams that liked this team)
   * GET /api/v1/swipes/team/:teamId/received
   *
   * @param teamId - The team ID to get received swipes for
   * @param params - Optional pagination params
   * @returns Promise<ApiResponse<ReceivedSwipesResponse>> - Received swipes with match status
   */
  getReceivedSwipes: async (
    teamId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<ReceivedSwipesResponse>> => {
    return api.get<ReceivedSwipesResponse>(
      `/swipes/team/${teamId}/received`,
      { params }
    );
  },

  /**
   * Get swipe statistics for a team
   * GET /api/v1/swipes/team/:teamId/stats
   *
   * @param teamId - The team ID to get stats for
   * @returns Promise<ApiResponse<SwipeStats & SwipeAnalytics>> - Comprehensive swipe statistics
   */
  getSwipeStats: async (
    teamId: string
  ): Promise<ApiResponse<SwipeStats & SwipeAnalytics>> => {
    return api.get<SwipeStats & SwipeAnalytics>(
      `/swipes/team/${teamId}/stats`
    );
  },

  /**
   * Check if a team can swipe another team
   * POST /api/v1/swipes/check/:swiperTeamId/:targetTeamId
   *
   * @param swiperTeamId - The team performing the swipe
   * @param targetTeamId - The team being swiped
   * @returns Promise<ApiResponse<SwipeCheckResponse>> - Whether swipe is allowed and reason
   */
  checkSwipeEligibility: async (
    swiperTeamId: string,
    targetTeamId: string
  ): Promise<ApiResponse<SwipeCheckResponse>> => {
    return api.post<SwipeCheckResponse>(
      `/swipes/check/${swiperTeamId}/${targetTeamId}`
    );
  },

  /**
   * Undo a swipe (within 5 minutes of creation)
   * POST /api/v1/swipes/:swipeId/undo
   *
   * @param swipeId - The swipe ID to undo
   * @returns Promise<ApiResponse<UndoSwipeResponse>> - Success status and message
   */
  undoSwipe: async (swipeId: string): Promise<ApiResponse<UndoSwipeResponse>> => {
    return api.post<UndoSwipeResponse>(
      `/swipes/${swipeId}/undo`
    );
  },
};
