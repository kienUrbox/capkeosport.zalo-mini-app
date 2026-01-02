import { api } from './index';
import { Match } from '@/stores/match.store';

// Request/Response types
export interface CreateMatchDto {
  teamAId: string;
  teamBId: string;
  date: string;
  time: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  note?: string;
}

export interface MatchResultDto {
  scoreA: number;
  scoreB: number;
  mvpId?: string;
  note?: string;
  photos?: string[];
}

export interface SwipeResponse {
  matched: boolean;
  match?: Match;
}

/**
 * Match Service
 *
 * API methods for match management
 */
export const MatchService = {
  /**
   * Get matches with optional filters
   */
  getMatches: async (params?: { status?: string; teamId?: string }) => {
    return api.get<Match[]>('/matches', { params });
  },

  /**
   * Get match by ID
   */
  getMatchById: async (matchId: string) => {
    return api.get<Match>(`/matches/${matchId}`);
  },

  /**
   * Send match invitation
   */
  sendMatchInvitation: async (matchData: CreateMatchDto) => {
    return api.post<Match>('/matches', matchData);
  },

  /**
   * Accept match invitation
   */
  acceptMatchInvitation: async (matchId: string) => {
    return api.post<Match>(`/matches/${matchId}/accept`);
  },

  /**
   * Reject match invitation
   */
  rejectMatchInvitation: async (matchId: string) => {
    return api.post<Match>(`/matches/${matchId}/reject`);
  },

  /**
   * Update match score
   */
  updateMatchScore: async (matchId: string, result: MatchResultDto) => {
    return api.post<Match>(`/matches/${matchId}/result`, result);
  },

  /**
   * Get match history
   */
  getMatchHistory: async (params?: { teamId?: string; limit?: number }) => {
    return api.get<Match[]>('/matches/history', { params });
  },
};
