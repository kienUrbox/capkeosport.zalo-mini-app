import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Team, TeamMember, TeamStats, CreateTeamDto, UpdateTeamDto } from '../types/api.types';
import { TeamsService } from '../services/api/services';

interface TeamsState {
  // State
  teams: Team[];
  myTeams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  teamStats: TeamStats | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    level: string[];
    gender: string[];
    status: string;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  };

  // Actions
  fetchTeams: (params?: any) => Promise<void>;
  fetchMyTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  createTeam: (data: CreateTeamDto) => Promise<Team | null>;
  updateTeam: (id: string, data: UpdateTeamDto) => Promise<Team | null>;
  deleteTeam: (id: string) => Promise<boolean>;
  fetchTeamMembers: (id: string) => Promise<void>;
  addTeamMember: (id: string, data: { userId: string; role: string }) => Promise<TeamMember | null>;
  removeTeamMember: (id: string, userId: string) => Promise<boolean>;
  fetchTeamStats: (id: string) => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  updateTeamInList: (updatedTeam: Team) => void;
  removeTeamFromList: (id: string) => void;
  setFilters: (filters: Partial<TeamsState['filters']>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useTeamsStore = create<TeamsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      teams: [],
      myTeams: [],
      currentTeam: null,
      teamMembers: [],
      teamStats: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: '',
        level: [],
        gender: [],
        status: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      },

      // Actions
      fetchTeams: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });

          const currentFilters = get().filters;
          const queryParams = {
            page: 1,
            limit: 20,
            ...currentFilters,
            ...params,
          };

          const response = await TeamsService.getTeams(queryParams);

          if (response.success && response.data) {
            set({
              teams: response.data.items,
              pagination: {
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.total,
                totalPages: response.data.totalPages,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch teams error:', error);
          set({
            error: error.message || 'Failed to fetch teams',
            isLoading: false,
          });
        }
      },

      fetchMyTeams: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await TeamsService.getMyTeams();

          if (response.success && response.data) {
            set({
              myTeams: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch my teams error:', error);
          set({
            error: error.message || 'Failed to fetch your teams',
            isLoading: false,
          });
        }
      },

      fetchTeamById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await TeamsService.getTeamById(id);

          if (response.success && response.data) {
            set({
              currentTeam: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch team by ID error:', error);
          set({
            error: error.message || 'Failed to fetch team details',
            isLoading: false,
          });
        }
      },

      createTeam: async (data: CreateTeamDto) => {
        try {
          set({ isCreating: true, error: null });

          const response = await TeamsService.createTeam(data);

          if (response.success && response.data) {
            const newTeam = response.data;
            const { myTeams } = get();

            set({
              myTeams: [newTeam, ...myTeams],
              isCreating: false,
            });

            return newTeam;
          }

          return null;
        } catch (error: any) {
          console.error('Create team error:', error);
          set({
            error: error.message || 'Failed to create team',
            isCreating: false,
          });
          return null;
        }
      },

      updateTeam: async (id: string, data: UpdateTeamDto) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await TeamsService.updateTeam(id, data);

          if (response.success && response.data) {
            const updatedTeam = response.data;
            get().updateTeamInList(updatedTeam);

            if (get().currentTeam?.id === id) {
              set({ currentTeam: updatedTeam });
            }

            set({ isUpdating: false });
            return updatedTeam;
          }

          return null;
        } catch (error: any) {
          console.error('Update team error:', error);
          set({
            error: error.message || 'Failed to update team',
            isUpdating: false,
          });
          return null;
        }
      },

      deleteTeam: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          await TeamsService.deleteTeam(id);

          get().removeTeamFromList(id);

          if (get().currentTeam?.id === id) {
            set({ currentTeam: null });
          }

          set({ isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Delete team error:', error);
          set({
            error: error.message || 'Failed to delete team',
            isLoading: false,
          });
          return false;
        }
      },

      fetchTeamMembers: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await TeamsService.getTeamMembers(id);

          if (response.success && response.data) {
            set({
              teamMembers: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch team members error:', error);
          set({
            error: error.message || 'Failed to fetch team members',
            isLoading: false,
          });
        }
      },

      addTeamMember: async (id: string, data: { userId: string; role: string }) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await TeamsService.addMember(id, data);

          if (response.success && response.data) {
            const newMember = response.data;
            const { teamMembers } = get();

            set({
              teamMembers: [...teamMembers, newMember],
              isUpdating: false,
            });

            return newMember;
          }

          return null;
        } catch (error: any) {
          console.error('Add team member error:', error);
          set({
            error: error.message || 'Failed to add team member',
            isUpdating: false,
          });
          return null;
        }
      },

      removeTeamMember: async (id: string, userId: string) => {
        try {
          set({ isLoading: true, error: null });

          await TeamsService.removeMember(id, userId);

          const { teamMembers } = get();
          const updatedMembers = teamMembers.filter(
            member => !(member.teamId === id && member.userId === userId)
          );

          set({
            teamMembers: updatedMembers,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          console.error('Remove team member error:', error);
          set({
            error: error.message || 'Failed to remove team member',
            isLoading: false,
          });
          return false;
        }
      },

      fetchTeamStats: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await TeamsService.getTeamStats(id);

          if (response.success && response.data) {
            set({
              teamStats: response.data,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Fetch team stats error:', error);
          set({
            error: error.message || 'Failed to fetch team statistics',
            isLoading: false,
          });
        }
      },

      setCurrentTeam: (team: Team | null) => {
        set({ currentTeam: team });
      },

      updateTeamInList: (updatedTeam: Team) => {
        const { teams, myTeams } = get();

        set({
          teams: teams.map(team =>
            team.id === updatedTeam.id ? updatedTeam : team
          ),
          myTeams: myTeams.map(team =>
            team.id === updatedTeam.id ? updatedTeam : team
          ),
        });
      },

      removeTeamFromList: (id: string) => {
        const { teams, myTeams } = get();

        set({
          teams: teams.filter(team => team.id !== id),
          myTeams: myTeams.filter(team => team.id !== id),
        });
      },

      setFilters: (filters: Partial<TeamsState['filters']>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...filters },
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        });
      },

      clearError: () => set({ error: null }),

      reset: () => set({
        teams: [],
        myTeams: [],
        currentTeam: null,
        teamMembers: [],
        teamStats: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        filters: {
          search: '',
          level: [],
          gender: [],
          status: '',
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        },
      }),
    }),
    { name: 'teams-store' }
  )
);

// Selectors
export const useTeams = () => useTeamsStore((state) => state.teams);

export const useMyTeams = () => useTeamsStore((state) => state.myTeams);

export const useCurrentTeam = () => useTeamsStore((state) => state.currentTeam);

export const useTeamMembers = () => useTeamsStore((state) => state.teamMembers);

export const useTeamStats = () => useTeamsStore((state) => state.teamStats);

export const useTeamsLoading = () => useTeamsStore((state) => ({
  isLoading: state.isLoading,
  isCreating: state.isCreating,
  isUpdating: state.isUpdating,
}));

export const useTeamsError = () => useTeamsStore((state) => state.error);

export const useTeamsPagination = () => useTeamsStore((state) => state.pagination);

export const useTeamsFilters = () => useTeamsStore((state) => state.filters);

// Action selectors
export const useTeamsActions = () => useTeamsStore((state) => ({
  fetchTeams: state.fetchTeams,
  fetchMyTeams: state.fetchMyTeams,
  fetchTeamById: state.fetchTeamById,
  createTeam: state.createTeam,
  updateTeam: state.updateTeam,
  deleteTeam: state.deleteTeam,
  fetchTeamMembers: state.fetchTeamMembers,
  addTeamMember: state.addTeamMember,
  removeTeamMember: state.removeTeamMember,
  fetchTeamStats: state.fetchTeamStats,
  setCurrentTeam: state.setCurrentTeam,
  updateTeamInList: state.updateTeamInList,
  removeTeamFromList: state.removeTeamFromList,
  setFilters: state.setFilters,
  clearError: state.clearError,
  reset: state.reset,
}));

export default useTeamsStore;