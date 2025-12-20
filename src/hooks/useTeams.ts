import { useCallback, useEffect } from 'react';
import { CreateTeamDto, UpdateTeamDto, TeamQueryParams } from '../types/api.types';
import {
  useTeamsStore,
  useMyTeams,
  useCurrentTeam,
  useTeamMembers,
  useTeamStats,
  useTeamsLoading,
  useTeamsError,
  useTeamsPagination,
  useTeamsFilters,
  useTeamsActions
} from '../stores';

// Main teams hook that provides both state and actions
export const useTeams = () => {
  const teamsStore = useTeamsStore();

  return {
    ...teamsStore,
  };
};

// My teams hook
export const useMyTeams = () => {
  const myTeams = useMyTeams();
  const { isLoading } = useTeamsLoading();
  const { error } = useTeamsError();
  const { fetchMyTeams, createTeam, updateTeam, deleteTeam } = useTeamsActions();

  // Initialize my teams
  const initializeMyTeams = useCallback(async () => {
    await fetchMyTeams();
  }, [fetchMyTeams]);

  // Create new team
  const handleCreateTeam = useCallback(async (data: CreateTeamDto) => {
    const result = await createTeam(data);
    return result;
  }, [createTeam]);

  // Update team
  const handleUpdateTeam = useCallback(async (id: string, data: UpdateTeamDto) => {
    const result = await updateTeam(id, data);
    return result;
  }, [updateTeam]);

  // Delete team
  const handleDeleteTeam = useCallback(async (id: string) => {
    const success = await deleteTeam(id);
    return success;
  }, [deleteTeam]);

  return {
    myTeams,
    isLoading,
    error,
    initializeMyTeams,
    createTeam: handleCreateTeam,
    updateTeam: handleUpdateTeam,
    deleteTeam: handleDeleteTeam,
  };
};

// Team details hook
export const useTeamDetails = (teamId?: string) => {
  const currentTeam = useCurrentTeam();
  const teamMembers = useTeamMembers();
  const teamStats = useTeamStats();
  const { isLoading } = useTeamsLoading();
  const { error } = useTeamsError();
  const { fetchTeamById, fetchTeamMembers, fetchTeamStats, updateTeam, addTeamMember, removeTeamMember } = useTeamsActions();

  // Load team details
  const loadTeamDetails = useCallback(async (id: string) => {
    await Promise.all([
      fetchTeamById(id),
      fetchTeamMembers(id),
      fetchTeamStats(id),
    ]);
  }, [fetchTeamById, fetchTeamMembers, fetchTeamStats]);

  // Update team
  const handleUpdateTeam = useCallback(async (data: UpdateTeamDto) => {
    if (!teamId) return null;
    return await updateTeam(teamId, data);
  }, [teamId, updateTeam]);

  // Add team member
  const handleAddTeamMember = useCallback(async (data: { userId: string; role: string }) => {
    if (!teamId) return null;
    return await addTeamMember(teamId, data);
  }, [teamId, addTeamMember]);

  // Remove team member
  const handleRemoveTeamMember = useCallback(async (userId: string) => {
    if (!teamId) return false;
    return await removeTeamMember(teamId, userId);
  }, [teamId, removeTeamMember]);

  // Auto-load team when teamId changes
  useEffect(() => {
    if (teamId) {
      loadTeamDetails(teamId);
    }
  }, [teamId, loadTeamDetails]);

  return {
    team: currentTeam,
    members: teamMembers,
    stats: teamStats,
    isLoading,
    error,
    loadTeamDetails,
    updateTeam: handleUpdateTeam,
    addMember: handleAddTeamMember,
    removeMember: handleRemoveTeamMember,
  };
};

// Teams discovery hook
export const useTeamsDiscovery = () => {
  const teams = useTeams();
  const { isLoading } = useTeamsLoading();
  const { error } = useTeamsError();
  const pagination = useTeamsPagination();
  const filters = useTeamsFilters();
  const { fetchTeams, setFilters } = useTeamsActions();

  // Search teams
  const searchTeams = useCallback(async (params: TeamQueryParams) => {
    await fetchTeams(params);
  }, [fetchTeams]);

  // Filter teams
  const filterTeams = useCallback((newFilters: Partial<TeamQueryParams>) => {
    setFilters(newFilters);
    searchTeams({ ...filters, ...newFilters });
  }, [filters, setFilters, searchTeams]);

  // Load more teams (pagination)
  const loadMoreTeams = useCallback(async () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      await fetchTeams({ ...filters, page: nextPage });
    }
  }, [pagination, filters, fetchTeams]);

  // Refresh teams
  const refreshTeams = useCallback(() => {
    return fetchTeams(filters);
  }, [filters, fetchTeams]);

  return {
    teams: teams,
    isLoading,
    error,
    pagination,
    filters,
    searchTeams,
    filterTeams,
    loadMoreTeams,
    refreshTeams,
    hasMore: pagination.page < pagination.totalPages,
  };
};

// Team management hook
export const useTeamManagement = (teamId?: string) => {
  const currentTeam = useCurrentTeam();
  const teamMembers = useTeamMembers();
  const { isLoading } = useTeamsLoading();
  const { updateTeam, addTeamMember, removeTeamMember } = useTeamsActions();

  // Update team information
  const updateTeamInfo = useCallback(async (data: UpdateTeamDto) => {
    if (!teamId) return null;
    return await updateTeam(teamId, data);
  }, [teamId, updateTeam]);

  // Add member to team
  const addMember = useCallback(async (userId: string, role: string = 'PLAYER') => {
    if (!teamId) return null;
    return await addTeamMember(teamId, { userId, role });
  }, [teamId, addTeamMember]);

  // Remove member from team
  const removeMember = useCallback(async (userId: string) => {
    if (!teamId) return false;
    return await removeTeamMember(teamId, userId);
  }, [teamId, removeTeamMember]);

  // Check if user is team captain
  const isTeamCaptain = useCallback((userId?: string) => {
    const captain = teamMembers.find(member => member.role === 'CAPTAIN');
    if (!userId) return false;
    return captain?.userId === userId;
  }, [teamMembers]);

  // Get member role
  const getMemberRole = useCallback((userId: string) => {
    const member = teamMembers.find(m => m.userId === userId);
    return member?.role;
  }, [teamMembers]);

  // Check if user is member
  const isTeamMember = useCallback((userId: string) => {
    return teamMembers.some(member => member.userId === userId);
  }, [teamMembers]);

  return {
    team: currentTeam,
    members: teamMembers,
    isLoading,
    updateTeamInfo,
    addMember,
    removeMember,
    isTeamCaptain,
    getMemberRole,
    isTeamMember,
  };
};

// Team statistics hook
export const useTeamStatistics = (teamId?: string) => {
  const teamStats = useTeamStats();
  const { isLoading } = useTeamsLoading();
  const { fetchTeamStats } = useTeamsActions();

  // Refresh team statistics
  const refreshStats = useCallback(async () => {
    if (teamId) {
      await fetchTeamStats(teamId);
    }
  }, [teamId, fetchTeamStats]);

  // Get overall rating
  const getOverallRating = useCallback(() => {
    if (!teamStats) return 0;
    const { attack, defense, technique } = teamStats;
    return Math.round((attack + defense + technique) / 3);
  }, [teamStats]);

  // Get stat label
  const getStatLabel = useCallback((statType: 'attack' | 'defense' | 'technique', value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Average';
    if (value >= 50) return 'Below Average';
    return 'Poor';
  }, []);

  // Get stat color
  const getStatColor = useCallback((value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 70) return 'text-blue-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 50) return 'text-orange-600';
    return 'text-red-600';
  }, []);

  return {
    stats: teamStats,
    isLoading,
    refreshStats,
    getOverallRating,
    getStatLabel,
    getStatColor,
  };
};

// Team search hook
export const useTeamSearch = () => {
  const teams = useTeams();
  const { isLoading } = useTeamsLoading();
  const { error } = useTeamsError();
  const { fetchTeams, setFilters } = useTeamsActions();

  // Search teams by name
  const searchTeamsByName = useCallback(async (query: string, filters?: TeamQueryParams) => {
    const searchParams = {
      search: query,
      ...filters,
    };
    await fetchTeams(searchParams);
  }, [fetchTeams]);

  // Search teams by location
  const searchTeamsByLocation = useCallback(async (lat: number, lng: number, radiusKm: number, filters?: TeamQueryParams) => {
    const searchParams = {
      ...filters,
    };
    // This would be implemented in the API service
    await fetchTeams(searchParams);
  }, [fetchTeams]);

  // Search teams by level
  const searchTeamsByLevel = useCallback(async (levels: string[], filters?: TeamQueryParams) => {
    const searchParams = {
      level: levels,
      ...filters,
    };
    await fetchTeams(searchParams);
  }, [fetchTeams]);

  // Search teams by gender
  const searchTeamsByGender = useCallback(async (genders: string[], filters?: TeamQueryParams) => {
    const searchParams = {
      gender: genders,
      ...filters,
    };
    await fetchTeams(searchParams);
  }, [fetchTeams]);

  // Clear search
  const clearSearch = useCallback(() => {
    setFilters({ search: '' });
    fetchTeams({});
  }, [setFilters, fetchTeams]);

  return {
    teams,
    isLoading,
    error,
    searchTeamsByName,
    searchTeamsByLocation,
    searchTeamsByLevel,
    searchTeamsByGender,
    clearSearch,
  };
};

export default useTeams;