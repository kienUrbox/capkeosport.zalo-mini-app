import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Team as ApiTeam,
  TeamInvite,
  InviteTokenResponse,
  InviteStatus,
  CreateInviteTokenDto,
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  TeamRole,
} from '@/types/api.types';
import { api } from '@/services/api/index';

// User's role in a team - simplified from API types for UI usage
// Maps from API TeamRole: CAPTAIN/PLAYER/SUBSTITUTE → admin/captain/member
export type UserRole = 'admin' | 'captain' | 'member';

export interface Team {
  id: string;
  name: string;
  logo: string;
  level?: string;
  gender?: string;
  description?: string;
  memberCount: number;
  isCaptain: boolean;
  userRole?: UserRole; // User's role in this team for permission checks
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'captain' | 'player' | 'substitute';
  number?: string;
}

interface TeamState {
  // State
  myTeams: Team[];
  selectedTeam: Team | null;
  teamMembers: TeamMember[];

  // Team details cache (for quick lookup)
  teamDetailsCache: Record<string, ApiTeam | undefined>;

  // Invite state
  sentInvites: TeamInvite[];
  receivedInvites: TeamInvite[];
  inviteToken: InviteTokenResponse | null;

  isLoading: boolean;
  error: string | null;

  // ========== State Management Actions ==========
  setMyTeams: (teams: Team[]) => void;
  setSelectedTeam: (team: Team | null) => void;
  setTeamMembers: (members: TeamMember[]) => void;

  // Invite state setters
  setSentInvites: (invites: TeamInvite[]) => void;
  setReceivedInvites: (invites: TeamInvite[]) => void;
  setInviteToken: (token: InviteTokenResponse | null) => void;

  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  removeTeam: (teamId: string) => void;
  addMember: (member: TeamMember) => void;
  removeMember: (memberId: string) => void;
  updateMember: (memberId: string, updates: Partial<TeamMember>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;

  // ========== API Methods ==========

  /**
   * Fetch user's teams
   * GET /teams/my-teams
   */
  fetchMyTeams: (forceRefresh?: boolean) => Promise<void>;

  /**
   * Get team by ID
   * GET /teams/:id
   */
  getTeamById: (teamId: string) => Promise<ApiTeam>;

  /**
   * Create new team
   * POST /teams
   */
  createTeam: (teamData: CreateTeamDto) => Promise<Team>;

  /**
   * Update team
   * PATCH /teams/:id
   */
  updateTeamById: (teamId: string, teamData: UpdateTeamDto) => Promise<void>;

  /**
   * Delete team
   * DELETE /teams/:id
   */
  deleteTeam: (teamId: string) => Promise<void>;

  /**
   * Get team members
   * GET /teams/:id/members
   */
  getTeamMembers: (teamId: string) => Promise<TeamMember[]>;

  /**
   * Add member to team
   * POST /teams/:id/members
   */
  addMemberToTeam: (teamId: string, memberData: AddMemberDto) => Promise<void>;

  /**
   * Remove member from team
   * DELETE /teams/:id/members/:memberId
   */
  removeMemberFromTeam: (teamId: string, memberId: string) => Promise<void>;

  /**
   * Update member role
   * PATCH /teams/:id/members/:memberId
   */
  updateMemberRole: (teamId: string, memberId: string, role: TeamRole) => Promise<void>;

  // ========== Invite Actions ==========
  fetchSentInvites: (teamId: string, params?: { page?: number; limit?: number; status?: InviteStatus }) => Promise<void>;
  fetchReceivedInvites: (params?: { page?: number; limit?: number; status?: InviteStatus }) => Promise<void>;
  respondInvite: (inviteId: string, action: 'accept' | 'decline', message?: string) => Promise<void>;
  cancelInvite: (inviteId: string) => Promise<void>;
  resendInvite: (inviteId: string) => Promise<void>;
  createInviteToken: (teamId: string, options?: CreateInviteTokenDto) => Promise<InviteTokenResponse | undefined>;
}

// Transform API team to store team format
const transformApiTeam = (apiTeam: ApiTeam, currentUserId?: string): Team => ({
  id: apiTeam.id,
  name: apiTeam.name,
  logo: apiTeam.logo || apiTeam.avatar || '',
  level: apiTeam.level,
  gender: apiTeam.gender,
  description: apiTeam.description,
  memberCount: apiTeam.membersCount || apiTeam.members?.length || 0,
  isCaptain: currentUserId ? apiTeam.createdBy === currentUserId : false,
  userRole: 'member', // Will be determined by the caller
});

// Transform API team member to store member format
const transformApiMember = (apiMember: any): TeamMember => ({
  id: apiMember.id,
  name: apiMember.user?.name || apiMember.name || 'Unknown',
  avatar: apiMember.user?.avatar || apiMember.avatar || '',
  role: apiMember.role?.toLowerCase() || 'player',
  number: apiMember.jerseyNumber || apiMember.number,
});

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      // Initial state
      myTeams: [],
      selectedTeam: null,
      teamMembers: [],
      teamDetailsCache: {},
      sentInvites: [],
      receivedInvites: [],
      inviteToken: null,
      isLoading: false,
      error: null,

      // ========== State Management Actions ==========

      setMyTeams: (teams) => set({ myTeams: teams }),

      setSelectedTeam: (team) => set({ selectedTeam: team }),

      setTeamMembers: (members) => set({ teamMembers: members }),

      setSentInvites: (invites) => set({ sentInvites: invites }),

      setReceivedInvites: (invites) => set({ receivedInvites: invites }),

      setInviteToken: (token) => set({ inviteToken: token }),

      addTeam: (team) =>
        set((state) => ({
          myTeams: [...state.myTeams, team],
        })),

      updateTeam: (teamId, updates) =>
        set((state) => ({
          myTeams: state.myTeams.map((team) =>
            team.id === teamId ? { ...team, ...updates } : team
          ),
          selectedTeam:
            state.selectedTeam?.id === teamId
              ? { ...state.selectedTeam, ...updates }
              : state.selectedTeam,
        })),

      removeTeam: (teamId) =>
        set((state) => ({
          myTeams: state.myTeams.filter((team) => team.id !== teamId),
          selectedTeam:
            state.selectedTeam?.id === teamId ? null : state.selectedTeam,
        })),

      addMember: (member) =>
        set((state) => ({
          teamMembers: [...state.teamMembers, member],
        })),

      removeMember: (memberId) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== memberId),
        })),

      updateMember: (memberId, updates) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === memberId ? { ...member, ...updates } : member
          ),
        })),

      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // ========== API Methods ==========

      /**
       * Fetch user's teams
       * GET /teams/my-teams
       */
      fetchMyTeams: async (forceRefresh: boolean = false) => {
        try {
          const currentState = get();

          // Skip if already loading
          if (currentState.isLoading) {
            console.log('[TeamStore] Skipping fetchMyTeams - already loading');
            return;
          }

          // Skip if already has teams UNLESS forceRefresh is true
          if (!forceRefresh && currentState.myTeams.length > 0) {
            console.log('[TeamStore] Skipping fetchMyTeams - already has teams (use forceRefresh=true to refresh)');
            return;
          }

          set({ isLoading: true, error: null });
          const response = await api.get('/teams/my-teams');

          if (response.success && response.data) {
            const teams = Array.isArray(response.data) ? response.data : [];

            // Transform API response to store format
            const transformedTeams: Team[] = teams.map((apiTeam: ApiTeam) => transformApiTeam(apiTeam));

            set({ myTeams: transformedTeams, error: null });

            // Auto-select first team if no team is selected
            const newState = get();
            if (!newState.selectedTeam && transformedTeams.length > 0) {
              set({ selectedTeam: transformedTeams[0] });
            }

            console.log('[TeamStore] Successfully fetched my teams:', transformedTeams.length);
          }
        } catch (error: any) {
          console.error('[TeamStore] Fetch my teams error:', error);
          set({ error: error.message || 'Không thể tải danh sách đội' });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get team by ID
       * GET /teams/:id
       */
      getTeamById: async (teamId: string): Promise<ApiTeam> => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get<ApiTeam>(`/teams/${teamId}`);

          if (response.success && response.data) {
            // Cache the team details
            set((state) => ({
              teamDetailsCache: {
                ...state.teamDetailsCache,
                [teamId]: response.data,
              },
              isLoading: false,
            }));

            return response.data;
          } else {
            throw new Error(response.error?.message || 'Failed to fetch team');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể tải thông tin đội';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Create new team
       * POST /teams
       */
      createTeam: async (teamData: CreateTeamDto): Promise<Team> => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.post<ApiTeam>('/teams', teamData);

          if (response.success && response.data) {
            const transformedTeam = transformApiTeam(response.data);

            // Add to my teams list
            set((state) => ({
              myTeams: [...state.myTeams, transformedTeam],
              error: null,
            }));

            return transformedTeam;
          } else {
            throw new Error(response.error?.message || 'Failed to create team');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể tạo đội';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update team
       * PATCH /teams/:id
       */
      updateTeamById: async (teamId: string, teamData: UpdateTeamDto) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.patch<ApiTeam>(`/teams/${teamId}`, teamData);

          if (response.success && response.data) {
            const transformedTeam = transformApiTeam(response.data);

            // Update in my teams list
            get().updateTeam(teamId, transformedTeam);

            // Update cache
            set((state) => ({
              teamDetailsCache: {
                ...state.teamDetailsCache,
                [teamId]: response.data,
              },
              error: null,
            }));
          } else {
            throw new Error(response.error?.message || 'Failed to update team');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể cập nhật đội';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Delete team
       * DELETE /teams/:id
       */
      deleteTeam: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.delete(`/teams/${teamId}`);

          if (response.success) {
            // Remove from my teams list
            get().removeTeam(teamId);

            // Remove from cache
            set((state) => {
              const newCache = { ...state.teamDetailsCache };
              delete newCache[teamId];
              return { teamDetailsCache: newCache };
            });
          } else {
            throw new Error(response.error?.message || 'Failed to delete team');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể xóa đội';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get team members
       * GET /teams/:id/members
       */
      getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get(`/teams/${teamId}/members`);

          if (response.success && response.data) {
            const members = Array.isArray(response.data) ? response.data : [];

            // Transform API response to store format
            const transformedMembers: TeamMember[] = members.map((member: any) => transformApiMember(member));

            set({ teamMembers: transformedMembers, error: null });

            return transformedMembers;
          } else {
            throw new Error(response.error?.message || 'Failed to fetch team members');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể tải danh sách thành viên';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Add member to team
       * POST /teams/:id/members
       */
      addMemberToTeam: async (teamId: string, memberData: AddMemberDto) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.post(`/teams/${teamId}/members`, memberData);

          if (response.success && response.data) {
            const transformedMember = transformApiMember(response.data);

            // Add to team members list
            get().addMember(transformedMember);
          } else {
            throw new Error(response.error?.message || 'Failed to add member');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể thêm thành viên';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Remove member from team
       * DELETE /teams/:id/members/:memberId
       */
      removeMemberFromTeam: async (teamId: string, memberId: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.delete(`/teams/${teamId}/members/${memberId}`);

          if (response.success) {
            // Remove from team members list
            get().removeMember(memberId);
          } else {
            throw new Error(response.error?.message || 'Failed to remove member');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể xóa thành viên';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update member role
       * PATCH /teams/:id/members/:memberId
       */
      updateMemberRole: async (teamId: string, memberId: string, role: TeamRole) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.patch(`/teams/${teamId}/members/${memberId}`, { role });

          if (response.success && response.data) {
            const transformedMember = transformApiMember(response.data);

            // Update in team members list
            get().updateMember(memberId, transformedMember);
          } else {
            throw new Error(response.error?.message || 'Failed to update member role');
          }
        } catch (error: any) {
          const errorMessage = error.error?.message || error.message || 'Không thể cập nhật vai trò';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ========== Invite Actions ==========
      fetchSentInvites: async (teamId, params) => {
        try {
          set({ isLoading: true, error: null });

          // Dynamic import to avoid circular dependency
          const teamInviteModule = await import('@/services/api/team-invite.service');
          const TeamInviteService = teamInviteModule.default;
          const response = await TeamInviteService.getSentInvites(teamId, params);

          if (response.success && response.data) {
            set({ sentInvites: response.data.invites, isLoading: false });
          }
        } catch (error: any) {
          console.error('[TeamStore] Fetch sent invites error:', error);
          set({ error: error.message || 'Không thể tải lời mời đã gửi', isLoading: false });
        }
      },

      fetchReceivedInvites: async (params) => {
        try {
          set({ isLoading: true, error: null });

          // Dynamic import to avoid circular dependency
          const teamInviteModule = await import('@/services/api/team-invite.service');
          const TeamInviteService = teamInviteModule.default;
          const response = await TeamInviteService.getMyInvites(params);

          if (response.success && response.data) {
            set({ receivedInvites: response.data.invites, isLoading: false });
          }
        } catch (error: any) {
          console.error('[TeamStore] Fetch received invites error:', error);
          set({ error: error.message || 'Không thể tải lời mời', isLoading: false });
        }
      },

      respondInvite: async (inviteId, action, message) => {
        try {
          set({ isLoading: true, error: null });

          // Dynamic import to avoid circular dependency
          const teamInviteModule = await import('@/services/api/team-invite.service');
          const TeamInviteService = teamInviteModule.default;
          const response = await TeamInviteService.respondToInvite({ inviteId, action, declineMessage: message });

          if (response.success) {
            // Refresh invites list
            await get().fetchReceivedInvites();
          }
        } catch (error: any) {
          console.error('[TeamStore] Respond invite error:', error);
          set({ error: error.message || 'Không thể phản hồi lời mời', isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      cancelInvite: async (inviteId) => {
        try {
          set({ isLoading: true, error: null });

          // Dynamic import to avoid circular dependency
          const teamInviteModule = await import('@/services/api/team-invite.service');
          const TeamInviteService = teamInviteModule.default;
          const response = await TeamInviteService.cancelInvite(inviteId);

          if (response.success) {
            // Refresh sent invites
            const currentState = get();
            if (currentState.selectedTeam?.id) {
              await get().fetchSentInvites(currentState.selectedTeam.id);
            }
          }
        } catch (error: any) {
          console.error('[TeamStore] Cancel invite error:', error);
          set({ error: error.message || 'Không thể hủy lời mời', isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      resendInvite: async (inviteId) => {
        try {
          set({ isLoading: true, error: null });

          // Dynamic import to avoid circular dependency
          const teamInviteModule = await import('@/services/api/team-invite.service');
          const TeamInviteService = teamInviteModule.default;
          const response = await TeamInviteService.resendInvite(inviteId);

          if (response.success) {
            // Refresh sent invites
            const currentState = get();
            if (currentState.selectedTeam?.id) {
              await get().fetchSentInvites(currentState.selectedTeam.id);
            }
          }
        } catch (error: any) {
          console.error('[TeamStore] Resend invite error:', error);
          set({ error: error.message || 'Không thể gửi lại lời mời', isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      createInviteToken: async (teamId, options) => {
        try {
          set({ isLoading: true, error: null });

          // Dynamic import to avoid circular dependency
          const teamInviteModule = await import('@/services/api/team-invite.service');
          const TeamInviteService = teamInviteModule.default;
          const response = await TeamInviteService.createInviteToken(teamId, options);

          if (response.success && response.data) {
            set({ inviteToken: response.data, isLoading: false });
            return response.data;
          }
          set({ isLoading: false });
        } catch (error: any) {
          console.error('[TeamStore] Create invite token error:', error);
          set({ error: error.message || 'Không thể tạo mã mời', isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'team-storage',
      partialize: (state) => ({
        myTeams: state.myTeams,
        selectedTeam: state.selectedTeam,
        // Don't persist large cache or invite data
      }),
    }
  )
);

// Selectors
export const useMyTeams = () => useTeamStore((state) => state.myTeams);

export const useSelectedTeam = () => useTeamStore((state) => state.selectedTeam);

export const useTeamMembers = () => useTeamStore((state) => state.teamMembers);

// Invite selectors
export const useSentInvites = () => useTeamStore((state) => state.sentInvites);

export const useReceivedInvites = () => useTeamStore((state) => state.receivedInvites);

export const useInviteToken = () => useTeamStore((state) => state.inviteToken);

export const useTeamActions = () => {
  const store = useTeamStore();
  return {
    setMyTeams: store.setMyTeams,
    setSelectedTeam: store.setSelectedTeam,
    setTeamMembers: store.setTeamMembers,
    setSentInvites: store.setSentInvites,
    setReceivedInvites: store.setReceivedInvites,
    setInviteToken: store.setInviteToken,
    addTeam: store.addTeam,
    updateTeam: store.updateTeam,
    removeTeam: store.removeTeam,
    addMember: store.addMember,
    removeMember: store.removeMember,
    updateMember: store.updateMember,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    // API methods
    fetchMyTeams: store.fetchMyTeams,
    getTeamById: store.getTeamById,
    createTeam: store.createTeam,
    updateTeamById: store.updateTeamById,
    deleteTeam: store.deleteTeam,
    getTeamMembers: store.getTeamMembers,
    addMemberToTeam: store.addMemberToTeam,
    removeMemberFromTeam: store.removeMemberFromTeam,
    updateMemberRole: store.updateMemberRole,
    // Invite methods
    fetchSentInvites: store.fetchSentInvites,
    fetchReceivedInvites: store.fetchReceivedInvites,
    respondInvite: store.respondInvite,
    cancelInvite: store.cancelInvite,
    resendInvite: store.resendInvite,
    createInviteToken: store.createInviteToken,
  };
};

export default useTeamStore;
