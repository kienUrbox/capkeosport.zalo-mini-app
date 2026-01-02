import { api } from './index';
import { Team, TeamMember } from '@/stores/team.store';

// Request/Response types
export interface CreateTeamDto {
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  level?: string;
  gender?: 'male' | 'female' | 'mixed';
  pitchType?: '5' | '7';
  stats?: {
    attack: number;
    defense: number;
    technique: number;
  };
  location?: {
    address: string;
    lat?: number;
    lng?: number;
  };
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {}

export interface AddMemberDto {
  userId: string;
  role?: 'captain' | 'player' | 'substitute';
}

/**
 * Team Service
 *
 * API methods for team management
 */
export const TeamService = {
  /**
   * Get all teams for the current user
   */
  getMyTeams: async () => {
    return api.get<Team[]>('/teams/my');
  },

  /**
   * Get team by ID
   */
  getTeamById: async (teamId: string) => {
    return api.get<Team>(`/teams/${teamId}`);
  },

  /**
   * Create a new team
   */
  createTeam: async (teamData: CreateTeamDto) => {
    return api.post<Team>('/teams', teamData);
  },

  /**
   * Update team information
   */
  updateTeam: async (teamId: string, teamData: UpdateTeamDto) => {
    return api.patch<Team>(`/teams/${teamId}`, teamData);
  },

  /**
   * Delete team
   */
  deleteTeam: async (teamId: string) => {
    return api.delete(`/teams/${teamId}`);
  },

  /**
   * Get team members
   */
  getTeamMembers: async (teamId: string) => {
    return api.get<TeamMember[]>(`/teams/${teamId}/members`);
  },

  /**
   * Add member to team
   */
  addMember: async (teamId: string, memberData: AddMemberDto) => {
    return api.post<TeamMember>(`/teams/${teamId}/members`, memberData);
  },

  /**
   * Remove member from team
   */
  removeMember: async (teamId: string, memberId: string) => {
    return api.delete(`/teams/${teamId}/members/${memberId}`);
  },

  /**
   * Update member role
   */
  updateMemberRole: async (
    teamId: string,
    memberId: string,
    role: 'captain' | 'player' | 'substitute'
  ) => {
    return api.patch<TeamMember>(`/teams/${teamId}/members/${memberId}`, { role });
  },

  /**
   * Archive team
   */
  archiveTeam: async (teamId: string) => {
    return api.patch(`/teams/${teamId}/archive`);
  },
};
