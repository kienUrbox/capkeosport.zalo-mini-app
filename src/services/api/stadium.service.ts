import { api } from './index';

/**
 * Stadium Autocomplete DTO
 * Response from GET /stadiums/autocomplete
 */
export interface StadiumAutocompleteDto {
  id: string;
  name: string;
  mapUrl: string;
  address?: string;
  district?: string;
  city?: string;
  matchCount: number;
}

/**
 * Stadium Response DTO
 * Response from GET /stadiums/:id
 */
export interface StadiumResponseDto {
  id: string;
  name: string;
  mapUrl: string;
  source: 'user_provided' | 'admin_provided' | 'api_imported' | 'verified';
  lat?: number;
  lng?: number;
  locationVerified: boolean;
  address?: string;
  district?: string;
  city?: string;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stadium Service
 * Handles stadium-related API calls
 */
export const StadiumService = {
  /**
   * Autocomplete stadiums for dropdown search
   * GET /stadiums/autocomplete?q={query}&limit={limit}
   *
   * @param query - Search string (minimum 2 characters recommended)
   * @param limit - Maximum number of results (default: 10)
   */
  autocompleteStadiums: async (query: string, limit: number = 10) => {
    const response = await api.get<StadiumAutocompleteDto[]>('/stadiums/autocomplete', {
      params: { q: query, limit },
    });
    return response;
  },

  /**
   * Get stadium detail by ID
   * GET /stadiums/:id
   *
   * @param stadiumId - Stadium ID
   */
  getStadiumById: async (stadiumId: string) => {
    const response = await api.get<StadiumResponseDto>(`/stadiums/${stadiumId}`);
    return response;
  },
};
