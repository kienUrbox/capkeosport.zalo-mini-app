import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Using simplified types for now - should be updated to match api.types.ts
export interface Team {
  id: string;
  name: string;
  logo: string;
  level?: string;
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
  };
};

export default useTeamStore;
