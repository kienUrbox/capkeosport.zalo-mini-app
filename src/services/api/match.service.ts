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
  requestedByTeam?: string;
  requestedAt?: string;
  acceptedBy?: string;
  acceptedByTeam?: string;
  acceptedAt?: string;
  createdAt?: string;
  notes?: string;
  // Result data (when includeResult=true)
  result?: {
    teamAScore: number;
    teamBScore: number;
    notes?: string;
    fileIds?: string[];
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    files?: MatchResultFile[];
    confirmations?: {
      teamA: { confirmed: boolean; confirmedBy?: string; confirmedAt?: string };
      teamB: { confirmed: boolean; confirmedBy?: string; confirmedAt?: string };
    };
    locked: boolean;
    canEdit: boolean;
  };
}

export interface GetMatchesParams {
  teamId?: string;
  status?: MatchStatus;
  statuses?: MatchStatus | MatchStatus[];
  page?: number;
  limit?: number;
  includeResult?: boolean;
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
  notes?: string;
}

export interface UpdateMatchRequestDto {
  proposedDate?: string;
  proposedTime?: string;
  proposedPitch?: string;
  notes?: string;
}

export interface ConfirmMatchDto {
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm
  // Option 1: Stadium from database
  stadiumId?: string;
  // Option 2: Goong Place
  goongPlaceId?: string;
  stadiumName?: string;
  stadiumLat?: number;
  stadiumLng?: number;
  stadiumAddress?: string;
  stadiumDistrict?: string;
  stadiumCity?: string;
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
  id: string;
  name: string;
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

// Match Result types
export interface MatchResult {
  teamAScore: number;
  teamBScore: number;
  notes?: string;
  fileIds?: string[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface MatchResultFile {
  id: string;
  filename: string;
  publicUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
}

export interface MatchResultConfirmation {
  confirmed: boolean;
  confirmedBy: string | null;
  confirmedAt: string | null;
}

export interface MatchResultData {
  id: string;
  matchId: string;
  result: MatchResult | null;
  confirmations: {
    teamA: MatchResultConfirmation;
    teamB: MatchResultConfirmation;
  };
  canEdit: boolean;
  locked: boolean;
}

export interface SubmitResultDto {
  teamAScore: number;
  teamBScore: number;
  notes?: string;
  fileIds?: string[];
}

export interface ConfirmResultResponse {
  matchStatus: string;
  teamAConfirmed: boolean;
  teamBConfirmed: boolean;
  locked: boolean;
  message?: string;
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
   * Send invitation for a match
   * POST /api/v1/matches/:id/invite
   * Used when inviting opponent team to schedule a matched game
   */
  sendInvitation: async (matchId: string, data: { message?: string }) => {
    return api.post<{ match: Match; message: string }>(`/matches/${matchId}/invite`, data);
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
   * Update match request
   * PATCH /api/v1/matches/:id/request
   * Only team who sent the request can update
   */
  updateMatchRequest: async (matchId: string, data: UpdateMatchRequestDto) => {
    return api.patch<Match>(`/matches/${matchId}/request`, data);
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

  /**
   * Submit/Update match result
   * POST /api/v1/matches/:id/result
   */
  submitResult: async (matchId: string, data: SubmitResultDto) => {
    return api.post<{ data: MatchResultData }>(`/matches/${matchId}/result`, data);
  },

  /**
   * Confirm match result
   * POST /api/v1/matches/:id/result/confirm
   */
  confirmResult: async (matchId: string) => {
    return api.post<{ data: ConfirmResultResponse }>(`/matches/${matchId}/result/confirm`);
  },

  /**
   * Get match result
   * GET /api/v1/matches/:id/result
   */
  getResult: async (matchId: string) => {
    return api.get<{ data: MatchResultData }>(`/matches/${matchId}/result`);
  },

  /**
   * Upload result files
   * POST /api/v1/matches/:id/result/files
   */
  uploadResultFiles: async (matchId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post<{ data: { files: MatchResultFile[] } }>(`/matches/${matchId}/result/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
