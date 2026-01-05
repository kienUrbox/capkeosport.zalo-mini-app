import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeamService } from '@/services/api/team.service';
import type { Team as ApiTeam } from '@/types/api.types';

// Using simplified types for now - should be updated to match api.types.ts
export interface Team {
  id: string;
  name: string;
  logo: string;
  level?: string;
  gender?: string;
  description?: string;
  memberCount: number;
  isCaptain: boolean;
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
  isLoading: boolean;
  error: string | null;

  // Actions
  setMyTeams: (teams: Team[]) => void;
  setSelectedTeam: (team: Team | null) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  removeTeam: (teamId: string) => void;
  addMember: (member: TeamMember) => void;
  removeMember: (memberId: string) => void;
  updateMember: (memberId: string, updates: Partial<TeamMember>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  fetchMyTeams: (forceRefresh?: boolean) => Promise<void>;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      // Initial state
      myTeams: [],
      selectedTeam: null,
      teamMembers: [],
      isLoading: false,
      error: null,

      // Actions
      setMyTeams: (teams) => set({ myTeams: teams }),

      setSelectedTeam: (team) => set({ selectedTeam: team }),

      setTeamMembers: (members) => set({ teamMembers: members }),

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
          const response = await TeamService.getMyTeams();

          if (response.success && response.data) {
            const teams = Array.isArray(response.data) ? response.data : [];

            // Transform API response to store format
            const transformedTeams: Team[] = teams.map((apiTeam: any) => ({
              id: apiTeam.id,
              name: apiTeam.name,
              logo: apiTeam.logo || '',
              level: apiTeam.level,
              gender: apiTeam.gender,
              description: apiTeam.description,
              memberCount: apiTeam.membersCount || 0,
              isCaptain: apiTeam.createdBy === apiTeam.currentUserId, // Will be determined from auth context
            }));

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
    }),
    {
      name: 'team-storage',
      partialize: (state) => ({
        myTeams: state.myTeams,
        selectedTeam: state.selectedTeam,
      }),
    }
  )
);

// Selectors
export const useMyTeams = () => useTeamStore((state) => state.myTeams);

export const useSelectedTeam = () => useTeamStore((state) => state.selectedTeam);

export const useTeamMembers = () => useTeamStore((state) => state.teamMembers);

export const useTeamActions = () => {
  const store = useTeamStore();
  return {
    setMyTeams: store.setMyTeams,
    setSelectedTeam: store.setSelectedTeam,
    setTeamMembers: store.setTeamMembers,
    addTeam: store.addTeam,
    updateTeam: store.updateTeam,
    removeTeam: store.removeTeam,
    addMember: store.addMember,
    removeMember: store.removeMember,
    updateMember: store.updateMember,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
    fetchMyTeams: store.fetchMyTeams,
  };
};

export default useTeamStore;
