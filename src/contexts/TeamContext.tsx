import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TeamService } from '@/services/api/team.service';
import type { Team } from '@/services/api/team.service';

interface TeamContextValue {
  team: Team | null;
  isLoading: boolean;
  error: string | null;
  refreshTeam: () => Promise<void>;
}

const TeamContext = createContext<TeamContextValue | null>(null);

/**
 * Hook to access team context
 * Must be used within TeamProvider
 */
export const useTeamContext = (): TeamContextValue => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within TeamProvider');
  }
  return context;
};

/**
 * Provider component that fetches and provides team data
 * Uses Zustand store pattern for simple state management
 */
export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await TeamService.getTeamById(teamId);
      if (response.success && response.data) {
        setTeam(response.data);
      } else {
        setError('Không thể tải thông tin đội');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const refreshTeam = useCallback(async () => {
    await fetchTeam();
  }, [fetchTeam]);

  const value: TeamContextValue = {
    team,
    isLoading,
    error,
    refreshTeam,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
