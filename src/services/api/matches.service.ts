import { api } from './index';
import {
  Match,
  MatchSuggestion,
  MatchResult,
  MatchStatus,
  MatchQueryParams,
  ApiResponse,
  PaginatedApiResponse
} from '../../types/api.types';

export class MatchesService {
  /**
   * Get all matches with pagination and filtering
   */
  static async getMatches(params?: MatchQueryParams): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', { params });
  }

  /**
   * Get match by ID
   */
  static async getMatchById(id: string): Promise<ApiResponse<Match>> {
    return api.get<Match>(`/matches/${id}`);
  }

  /**
   * Update match status
   */
  static async updateMatchStatus(id: string, status: MatchStatus): Promise<ApiResponse<Match>> {
    return api.patch<Match>(`/matches/${id}/status`, { status });
  }

  /**
   * Add match suggestion
   */
  static async addMatchSuggestion(id: string, suggestion: {
    type: string;
    content: string;
  }): Promise<ApiResponse<MatchSuggestion>> {
    return api.post<MatchSuggestion>(`/matches/${id}/suggestions`, suggestion);
  }

  /**
   * Respond to match suggestion
   */
  static async respondToSuggestion(
    matchId: string,
    suggestionId: string,
    response: 'ACCEPT' | 'REJECT'
  ): Promise<ApiResponse<MatchSuggestion>> {
    return api.post<MatchSuggestion>(`/matches/${matchId}/suggestions/${suggestionId}/respond`, {
      response
    });
  }

  /**
   * Get matches for a specific team
   */
  static async getTeamMatches(teamId: string, params?: Omit<MatchQueryParams, 'teamId'>): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', {
      params: {
        teamId,
        ...params
      }
    });
  }

  /**
   * Get upcoming matches for a team
   */
  static async getUpcomingMatches(teamId: string, limit = 10): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', {
      params: {
        teamId,
        status: MatchStatus.UPCOMING,
        limit,
        sortBy: 'date',
        sortOrder: 'ASC'
      }
    });
  }

  /**
   * Get past matches for a team
   */
  static async getPastMatches(teamId: string, params?: Omit<MatchQueryParams, 'teamId'>): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', {
      params: {
        teamId,
        status: MatchStatus.FINISHED,
        sortBy: 'date',
        sortOrder: 'DESC',
        ...params
      }
    });
  }

  /**
   * Get active matches (matched, confirming, confirmed)
   */
  static async getActiveMatches(teamId: string): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', {
      params: {
        teamId,
        status: [MatchStatus.MATCHED, MatchStatus.CONFIRMING, MatchStatus.CONFIRMED],
        sortBy: 'date',
        sortOrder: 'ASC'
      }
    });
  }

  /**
   * Get pending matches
   */
  static async getPendingMatches(teamId: string): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', {
      params: {
        teamId,
        status: [MatchStatus.PENDING, MatchStatus.CAPPING],
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      }
    });
  }

  /**
   * Submit match result
   */
  static async submitMatchResult(matchId: string, result: {
    scoreA: number;
    scoreB: number;
    winnerTeamId: string;
    notes?: string;
    mvp?: string;
  }): Promise<ApiResponse<Match>> {
    return api.patch<Match>(`/matches/${matchId}`, result);
  }

  /**
   * Confirm match result
   */
  static async confirmMatchResult(matchId: string): Promise<ApiResponse<Match>> {
    return api.patch<Match>(`/matches/${matchId}`, {
      action: 'CONFIRM_RESULT'
    });
  }

  /**
   * Cancel match
   */
  static async cancelMatch(matchId: string, reason?: string): Promise<ApiResponse<Match>> {
    return api.patch<Match>(`/matches/${matchId}`, {
      status: MatchStatus.CANCELLED,
      reason
    });
  }

  /**
   * Reschedule match
   */
  static async rescheduleMatch(matchId: string, newDate: string, newTime: string): Promise<ApiResponse<Match>> {
    return api.patch<Match>(`/matches/${matchId}`, {
      date: newDate,
      time: newTime
    });
  }

  /**
   * Update match location
   */
  static async updateMatchLocation(matchId: string, location: {
    lat: number;
    lng: number;
    address: string;
  }): Promise<ApiResponse<Match>> {
    return api.patch<Match>(`/matches/${id}`, {
      location
    });
  }

  /**
   * Get match history for a team
   */
  static async getMatchHistory(teamId: string, params?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    status?: MatchStatus;
  }): Promise<PaginatedApiResponse<Match>> {
    return api.get<Match>('/matches', {
      params: {
        teamId,
        ...params
      }
    });
  }

  /**
   * Get match statistics for a team
   */
  static async getTeamMatchStats(teamId: string): Promise<ApiResponse<{
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
    recentForm: string[];
  }>> {
    return api.get<any>(`/matches/stats/team/${teamId}`);
  }

  /**
   * Get head-to-head record between two teams
   */
  static async getHeadToHead(teamAId: string, teamBId: string): Promise<ApiResponse<{
    matches: Match[];
    teamAWins: number;
    teamBWins: number;
    draws: number;
    totalMatches: number;
  }>> {
    return api.get<any>(`/matches/head-to-head/${teamAId}/${teamBId}`);
  }

  /**
   * Get available time slots for a team
   */
  static async getAvailableTimeSlots(teamId: string, date: string): Promise<ApiResponse<{
    availableSlots: string[];
    preferredSlots: string[];
  }>> {
    return api.get<any>(`/matches/availability/${teamId}`, {
      params: { date }
    });
  }
}

export default MatchesService;