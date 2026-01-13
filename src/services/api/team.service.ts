import { api } from './index';

// Team Gender Enum - Matches API documentation
// Supports both enum values (MALE, FEMALE, MIXED) and Vietnamese strings (Nam, Nữ, Mixed)
export type TeamGender = 'MALE' | 'FEMALE' | 'MIXED' | 'Nam' | 'Nữ' | 'Mixed';

// Team Location
export interface TeamLocation {
  lat: number; // -90 to 90
  lng: number; // -180 to 180
  address: string; // min 5 chars
  district?: string;
  city?: string;
}

// Team Stats
export interface TeamStats {
  attack?: number; // 1-100
  defense?: number; // 1-100
  technique?: number; // 1-100
}

// Create Team Request DTO - Matches API documentation
export interface CreateTeamDto {
  name: string; // 3-100 chars, required
  logo?: string; // URL
  banner?: string; // URL
  gender: TeamGender; // MALE | FEMALE | MIXED, required
  level: string; // 2-50 chars, required (e.g., "Người mới", "Trung bình", "Khá", "Giỏi")
  location: TeamLocation; // required
  stats?: TeamStats;
  pitch?: string[]; // Preferred pitch types e.g., ["Sân 7", "Sân 11"]
  description?: string;
}

// Update Team Request DTO
export interface UpdateTeamDto {
  name?: string;
  logo?: string;
  banner?: string;
  gender?: TeamGender;
  level?: string;
  location?: TeamLocation;
  stats?: TeamStats;
  pitch?: string[];
  description?: string;
  isActive?: boolean;
}

// Team Response - Matches API documentation
export interface Team {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  gender: TeamGender;
  level: string;
  location: TeamLocation;
  stats?: TeamStats;
  pitch?: string[];
  description?: string;
  membersCount?: number;
  status?: 'active' | 'archived';
  isActive?: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  members?: TeamMemberDetail[];
}

// Team Member Detail (from team detail API response)
export interface TeamMemberDetail {
  id: string;
  role: 'admin' | 'member';
  position?: string;
  jerseyNumber?: number;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Team Member (from members list API)
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'admin' | 'member' | 'CAPTAIN' | 'PLAYER' | 'SUBSTITUTE';
  position?: string; // e.g., "Captain", "Forward", "Midfielder", etc.
  jerseyNumber?: number;
  permissions?: Record<string, any>;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    banner?: string;
    phone?: string;
    position?: string;
    jerseyNumber?: number;
    bio?: string;
    playerStats?: {
      attack: number;
      defense: number;
      technique: number;
    };
  };
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

// Add Member DTO
export interface AddMemberDto {
  userId: string;
  role?: 'CAPTAIN' | 'PLAYER' | 'SUBSTITUTE';
}

// Update Member Role DTO
export interface UpdateMemberRoleDto {
  role: 'CAPTAIN' | 'PLAYER' | 'SUBSTITUTE';
}

/**
 * Team Service
 *
 * API methods for team management
 */
export const TeamService = {
  /**
   * Create a new team
   * POST /teams
   */
  createTeam: async (teamData: CreateTeamDto) => {
    return api.post<Team>('/teams', teamData);
  },

  /**
   * Get all teams for the current user
   * GET /teams/my-teams
   */
  getMyTeams: async () => {
    return api.get<Team[]>('/teams/my-teams');
  },

  /**
   * Get team by ID
   * GET /teams/:id
   */
  getTeamById: async (teamId: string) => {
    return api.get<Team>(`/teams/${teamId}`);
  },

  /**
   * Update team information
   * PATCH /teams/:id
   */
  updateTeam: async (teamId: string, teamData: UpdateTeamDto) => {
    return api.patch<Team>(`/teams/${teamId}`, teamData);
  },

  /**
   * Delete team
   * DELETE /teams/:id
   */
  deleteTeam: async (teamId: string) => {
    return api.delete(`/teams/${teamId}`);
  },

  /**
   * Get team members
   * GET /teams/:id/members
   */
  getTeamMembers: async (teamId: string) => {
    return api.get<TeamMember[]>(`/teams/${teamId}/members`);
  },

  /**
   * Add member to team
   * POST /teams/:id/members
   */
  addMember: async (teamId: string, memberData: AddMemberDto) => {
    return api.post<TeamMember>(`/teams/${teamId}/members`, memberData);
  },

  /**
   * Remove member from team
   * DELETE /teams/:id/members/:memberId
   */
  removeMember: async (teamId: string, memberId: string) => {
    return api.delete(`/teams/${teamId}/members/${memberId}`);
  },

  /**
   * Update member role
   * PATCH /teams/:id/members/:memberId
   */
  updateMemberRole: async (
    teamId: string,
    memberId: string,
    roleDto: UpdateMemberRoleDto
  ) => {
    return api.patch<TeamMember>(`/teams/${teamId}/members/${memberId}`, roleDto);
  },

  /**
   * Archive team
   * PATCH /teams/:id/archive
   */
  archiveTeam: async (teamId: string) => {
    return api.patch(`/teams/${teamId}/archive`);
  },
};
