import { api } from './index';
import {
  Team,
  TeamMember,
  TeamStats,
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  TeamQueryParams,
  ApiResponse,
  PaginatedApiResponse
} from '../../types/api.types';

export class TeamsService {
  /**
   * Create a new team
   */
  static async createTeam(data: CreateTeamDto): Promise<ApiResponse<Team>> {
    return api.post<Team>('/teams', data);
  }

  /**
   * Get all teams with pagination and filtering
   */
  static async getTeams(params?: TeamQueryParams): Promise<PaginatedApiResponse<Team>> {
    return api.get<Team>('/teams', { params });
  }

  /**
   * Get teams of current user
   */
  static async getMyTeams(): Promise<ApiResponse<Team[]>> {
    return api.get<Team[]>('/teams/my-teams');
  }

  /**
   * Get team by ID
   */
  static async getTeamById(id: string): Promise<ApiResponse<Team>> {
    return api.get<Team>(`/teams/${id}`);
  }

  /**
   * Update team information
   */
  static async updateTeam(id: string, data: UpdateTeamDto): Promise<ApiResponse<Team>> {
    return api.patch<Team>(`/teams/${id}`, data);
  }

  /**
   * Delete team (soft delete)
   */
  static async deleteTeam(id: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/teams/${id}`);
  }

  /**
   * Get team members
   */
  static async getTeamMembers(id: string): Promise<ApiResponse<TeamMember[]>> {
    return api.get<TeamMember[]>(`/teams/${id}/members`);
  }

  /**
   * Add member to team
   */
  static async addMember(id: string, data: AddMemberDto): Promise<ApiResponse<TeamMember>> {
    return api.post<TeamMember>(`/teams/${id}/members`, data);
  }

  /**
   * Remove member from team
   */
  static async removeMember(id: string, userId: string): Promise<ApiResponse<void>> {
    return api.delete<void>(`/teams/${id}/members/${userId}`);
  }

  /**
   * Get team statistics
   */
  static async getTeamStats(id: string): Promise<ApiResponse<TeamStats>> {
    return api.get<TeamStats>(`/teams/${id}/stats`);
  }

  /**
   * Upload team logo
   */
  static async uploadTeamLogo(id: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<any>(`/files/team/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Upload team banner
   */
  static async uploadTeamBanner(id: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<any>(`/files/team/${id}/banners`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Search teams by name or criteria
   */
  static async searchTeams(query: string, params?: Omit<TeamQueryParams, 'search'>): Promise<PaginatedApiResponse<Team>> {
    return api.get<Team>('/teams', {
      params: {
        search: query,
        ...params
      }
    });
  }

  /**
   * Get teams by location
   */
  static async getTeamsByLocation(lat: number, lng: number, radiusKm: number, params?: Omit<TeamQueryParams, 'search'>): Promise<PaginatedApiResponse<Team>> {
    return api.get<Team>('/teams', {
      params: {
        lat,
        lng,
        radius: radiusKm,
        ...params
      }
    });
  }

  /**
   * Get popular teams
   */
  static async getPopularTeams(limit = 10): Promise<ApiResponse<Team[]>> {
    return api.get<Team[]>('/teams', {
      params: {
        limit,
        sortBy: 'rating',
        sortOrder: 'DESC',
        status: 'active'
      }
    });
  }

  /**
   * Get nearby teams
   */
  static async getNearbyTeams(lat: number, lng: number, radiusKm = 10, limit = 20): Promise<PaginatedApiResponse<Team>> {
    return api.get<Team>('/teams', {
      params: {
        lat,
        lng,
        radius: radiusKm,
        limit,
        sortBy: 'distance',
        sortOrder: 'ASC'
      }
    });
  }

  /**
   * Filter teams by multiple criteria
   */
  static async filterTeams(filters: {
    level?: string[];
    gender?: string[];
    status?: string;
    location?: {
      lat: number;
      lng: number;
      radius: number;
    };
    minRating?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }): Promise<PaginatedApiResponse<Team>> {
    return api.get<Team>('/teams', { params: filters });
  }
}

export default TeamsService;