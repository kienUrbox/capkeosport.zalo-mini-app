import { api } from './index';

/**
 * Stadium Source Type
 */
export type StadiumSource = 'database' | 'goong_places';

/**
 * Stadium Autocomplete DTO
 * Response from GET /stadiums/autocomplete
 */
export interface StadiumAutocompleteDto {
  id: string;                          // stadium UUID hoặc "goong_{placeId}"
  name: string;
  source: StadiumSource;               // Nguồn dữ liệu
  placeId?: string;                    // Goong Place ID (khi source = goong_places) hoặc database place ID
  mapUrl?: string;                     // Map URL (chỉ khi source = database)
  address?: string;
  district?: string;
  city?: string;
  lat?: number;
  lng?: number;
  matchCount?: number;                 // Số trận đã diễn ra (chỉ khi source = database)
  homeTeamCount?: number;              // Số đội chọn làm sân nhà (chỉ khi source = database)
  description: string;                 // Mô tả đầy đủ
  sessionToken?: string;               // Session token (chỉ khi source = goong_places)
}

/**
 * Goong Place Detail Response DTO
 * Response from GET /stadiums/place-detail/:placeId
 */
export interface GoongPlaceDetailDto {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
  addressComponents: any[];
  types: string[];
  district?: string;
  city?: string;
}

/**
 * Stadium Place Detail Response DTO
 * Full response from GET /stadiums/place-detail/:placeId
 */
export interface StadiumPlaceDetailResponseDto {
  result: GoongPlaceDetailDto | null;
  status: 'OK' | 'SESSION_ERROR' | 'NOT_FOUND' | 'ERROR';
  error?: string;
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

  /**
   * Get Goong Place Detail
   * GET /stadiums/place-detail/:placeId
   *
   * @param placeId - Goong Place ID
   * @param sessionToken - Optional session token from autocomplete response
   */
  getPlaceDetail: async (placeId: string, sessionToken?: string) => {
    const params = sessionToken ? { sessionToken } : undefined;
    return api.get<StadiumPlaceDetailResponseDto>(
      `/stadiums/place-detail/${placeId}`,
      params ? { params } : undefined
    );
  },

  /**
   * PHASE 2: Book stadium slot
   * POST /stadiums/:id/book
   *
   * @param stadiumId - Stadium ID
   * @param data - Booking data (date, time, duration)
   *
   * TODO: Implement when stadium booking API is available
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bookStadiumSlot: async (stadiumId: string, data: {
    date: string;
    time: string;
    duration: number;
  }) => {
    // Placeholder for Phase 2 implementation
    console.warn('Stadium booking not yet implemented');
    throw new Error('Stadium booking feature coming soon');
  },
};
