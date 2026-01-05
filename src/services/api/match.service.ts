import { api } from './index';

// Match Status Types
export type MatchStatus = 'MATCHED' | 'REQUESTED' | 'ACCEPTED' | 'CONFIRMED' | 'FINISHED' | 'CANCELLED';

// Request/Response types
export interface MatchLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapLink?: string;
}

export interface MatchScore {
  teamA: number;
  teamB: number;
  updatedBy?: string;
  updatedAt?: string;
}

export interface Match {
  id: string;
  teamAId?: string;
  teamBId?: string;
  teamA?: {
    id: string;
    name: string;
    logo?: string;
    level?: string;
  };
  teamB?: {
    id: string;
    name: string;
    logo?: string;
    level?: string;
  };
  status: MatchStatus;
  date: string;
  time: string;
  location?: MatchLocation;
  score?: MatchScore;
  proposedDate?: string;
  proposedTime?: string;
  proposedPitch?: string;
  requestedBy?: string;
  requestedAt?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  createdAt?: string;
  notes?: string;
}

export interface GetMatchesParams {
  teamId?: string;
  status?: MatchStatus;
  statuses?: MatchStatus | MatchStatus[];
  page?: number;
  limit?: number;
}

export interface GetMatchesResponse {
  matches: Match[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SendMatchRequestDto {
  proposedDate: string;
  proposedTime: string;
  proposedPitch: string;
}

export interface ConfirmMatchDto {
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    mapLink?: string;
  };
}

export interface FinishMatchDto {
  score: {
    teamA: number;
    teamB: number;
  };
  notes?: string;
}

export interface CancelMatchDto {
  reason: string;
}

export interface RematchDto {
  proposedDate: string;
  proposedTime: string;
  proposedPitch: string;
  notes?: string;
}

// Attendance types
export type AttendanceStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

export interface Attendee {
  id: string;
  userId: string;
  teamId: string;
  status: AttendanceStatus;
  responseTime?: string;
  reason?: string;
  fullName: string;
  avatar?: string;
  phone?: string;
}

export interface TeamAttendance {
  teamId: string;
  attendance: Attendee[];
  summary: {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
    confirmedPercentage: number;
  };
}

export interface MatchAttendance {
  matchId: string;
  teamA: TeamAttendance;
  teamB: TeamAttendance;
}

export interface UpdateAttendanceDto {
  status: AttendanceStatus;
  reason?: string;
}

/**
 * Match Service
 *
 * API methods for match management
 */
export const MatchService = {
  /**
   * Get all matches with filters
   * GET /api/v1/matches
   */
  getMatches: async (params?: GetMatchesParams) => {
    // Handle both single status and multiple statuses
    const requestParams = params?.statuses
      ? {
          ...params,
          statuses: Array.isArray(params.statuses)
            ? params.statuses.join(',')
            : params.statuses,
        }
      : params;
    return api.get<GetMatchesResponse>('/matches', { params: requestParams });
  },

  /**
   * Get match by ID
   * GET /api/v1/matches/:id
   */
  getMatchById: async (matchId: string) => {
    return api.get<Match>(`/matches/${matchId}`);
  },

  /**
   * Send match request
   * POST /api/v1/matches/:id/request
   * Transition: MATCHED → REQUESTED
   */
  sendMatchRequest: async (matchId: string, data: SendMatchRequestDto) => {
    return api.post<Match>(`/matches/${matchId}/request`, data);
  },

  /**
   * Accept match request
   * POST /api/v1/matches/:id/accept
   * Transition: REQUESTED → ACCEPTED
   */
  acceptMatchRequest: async (matchId: string) => {
    return api.post<Match>(`/matches/${matchId}/accept`);
  },

  /**
   * Decline match request
   * POST /api/v1/matches/:id/decline
   * Transition: REQUESTED → MATCHED
   */
  declineMatchRequest: async (matchId: string) => {
    return api.post<Match>(`/matches/${matchId}/decline`);
  },

  /**
   * Confirm match
   * POST /api/v1/matches/:id/confirm
   * Transition: ACCEPTED → CONFIRMED
   */
  confirmMatch: async (matchId: string, data: ConfirmMatchDto) => {
    return api.post<Match>(`/matches/${matchId}/confirm`, data);
  },

  /**
   * Finish match
   * POST /api/v1/matches/:id/finish
   * Transition: CONFIRMED → FINISHED
   */
  finishMatch: async (matchId: string, data: FinishMatchDto) => {
    return api.post<Match>(`/matches/${matchId}/finish`, data);
  },

  /**
   * Cancel match
   * POST /api/v1/matches/:id/cancel
   * Transition: Any state → CANCELLED
   */
  cancelMatch: async (matchId: string, data: CancelMatchDto) => {
    return api.post<Match>(`/matches/${matchId}/cancel`, data);
  },

  /**
   * Rematch
   * POST /api/v1/matches/:id/rematch
   * Create new match from finished match
   */
  rematch: async (matchId: string, data: RematchDto) => {
    return api.post<Match>(`/matches/${matchId}/rematch`, data);
  },

  /**
   * Get match history
   * GET /api/v1/matches/history?status=FINISHED
   */
  getMatchHistory: async (params?: { teamId?: string; page?: number; limit?: number }) => {
    return api.get<GetMatchesResponse>('/matches', { params: { ...params, status: 'FINISHED' } });
  },

  /**
   * Get match attendance (both teams)
   * GET /api/v1/matches/:matchId/attendance
   */
  getMatchAttendance: async (matchId: string) => {
    return api.get<MatchAttendance>(`/matches/${matchId}/attendance`);
  },

  /**
   * Get my attendance for a match
   * GET /api/v1/matches/:matchId/attendance/my
   */
  getMyAttendance: async (matchId: string) => {
    return api.get<Attendee | null>(`/matches/${matchId}/attendance/my`);
  },

  /**
   * Update my attendance
   * POST /api/v1/matches/:matchId/attendance
   */
  updateAttendance: async (matchId: string, data: UpdateAttendanceDto) => {
    return api.post<Attendee>(`/matches/${matchId}/attendance`, data);
  },
};
