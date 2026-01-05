// Base API Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// User Preferences
export interface UserPreferences {
  notification: boolean;
  language: string;
}

// User & Authentication Types
export interface User {
  id: string;
  zaloUserId: string;
  name: string;
  avatar?: string;
  phone: string;
  email?: string;
  status?: 'active' | 'suspended';
  preferences?: UserPreferences;
  verificationMethod?: 'OAUTH' | 'THREE_STEP' | 'PHONE';
  isActive?: boolean; // Deprecated: use status instead
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  isNewUser: boolean;
}

// Auth DTOs
export interface ZaloLoginDto {
  accessToken: string;
  zaloUserId: string;
  timestamp: number;
  signature: string;
}

export interface ZaloThreeStepDto {
  accessToken: string;
  zaloUserId: string;
  phoneNumberToken: string;
  timestamp: number;
  signature: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  user: User;
  tokens: AuthTokens;
}

export interface UpdateProfileDto {
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

// Team Types
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  gender: Gender;
  level: string;
  location: Location;
  stats?: TeamStats;
  avatar?: string;
  logo?: string;
  banner?: string;
  pitch?: string[]; // Preferred pitch types e.g., ["Sân 7", "Sân 11"]
  isActive: boolean;
  isArchived: boolean;
  status?: 'active' | 'archived';
  createdBy: string;
  members?: TeamMember[];
  membersCount?: number;
  matchesCount?: number;
  winsCount?: number;
  lossesCount?: number;
  rating?: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  user?: User; // Optional for list views
  joinedAt: string;
  isActive: boolean;
}

export interface TeamStats {
  attack: number; // 1-100
  defense: number; // 1-100
  technique: number; // 1-100
  overall?: number;
}

export interface Location {
  lat: number; // -90 to 90
  lng: number; // -180 to 180
  address: string; // min 5 chars
  district?: string;
  city?: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  MIXED = 'MIXED'
}

export enum TeamRole {
  CAPTAIN = 'CAPTAIN',
  PLAYER = 'PLAYER',
  SUBSTITUTE = 'SUBSTITUTE'
}

// Team DTOs - Matches API documentation
export interface CreateTeamDto {
  name: string; // 3-100 chars, required
  description?: string;
  gender: Gender | string; // MALE | FEMALE | MIXED | 'Nam' | 'Nữ' | 'Mixed', required
  level: string; // 2-50 chars, required
  location: Location; // required
  stats?: TeamStats;
  avatar?: string; // URL
  logo?: string; // URL
  banner?: string; // URL
  pitch?: string[]; // Preferred pitch types e.g., ["Sân 7", "Sân 11"]
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  gender?: Gender;
  level?: string;
  location?: Location;
  stats?: TeamStats;
  avatar?: string;
  logo?: string;
  banner?: string;
  pitch?: string[];
  isActive?: boolean;
}

export interface AddMemberDto {
  userId: string;
  role: TeamRole;
}

// Match Types
export interface Match extends BaseEntity {
  teamAId: string;
  teamBId: string;
  status: MatchStatus;
  date: string;
  time: string;
  location: Location;
  teamA?: Team;
  teamB?: Team;
  createdBy: string;
  confirmedBy?: string;
  suggestions?: MatchSuggestion[];
  result?: MatchResult;
  scoreA?: number;
  scoreB?: number;
  notes?: string;
}

export enum MatchStatus {
  MATCHED = 'MATCHED',      // Chờ kèo
  REQUESTED = 'REQUESTED',  // Chờ kèo
  ACCEPTED = 'ACCEPTED',    // Lịch đấu
  CONFIRMED = 'CONFIRMED',  // Lịch đấu
  FINISHED = 'FINISHED',    // Lịch sử
  CANCELLED = 'CANCELLED'   // Lịch sử
}

export interface MatchSuggestion {
  id: string;
  matchId: string;
  userId: string;
  type: SuggestionType;
  content: string;
  status: SuggestionStatus;
  createdAt: string;
  user?: User;
}

export enum SuggestionType {
  TIME_CHANGE = 'TIME_CHANGE',
  LOCATION_CHANGE = 'LOCATION_CHANGE',
  OTHER = 'OTHER'
}

export enum SuggestionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface MatchResult {
  winnerTeamId: string;
  scoreA: number;
  scoreB: number;
  mvp?: string;
  notes?: string;
  confirmedBy: string[];
}

// Attendance Types
export enum AttendanceStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED'
}

export interface Attendee extends BaseEntity {
  id: string;
  userId: string;
  teamId: string;
  status: AttendanceStatus;
  responseTime?: string;
  reason?: string;
  fullName: string;
  avatar?: string;
  phone?: string;
}

export interface TeamAttendance {
  teamId: string;
  attendance: Attendee[];
  summary: AttendanceSummary;
}

export interface AttendanceSummary {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  confirmedPercentage: number;
}

export interface MatchAttendance {
  matchId: string;
  teamA: TeamAttendance;
  teamB: TeamAttendance;
}

export interface UpdateAttendanceDto {
  status: AttendanceStatus;
  reason?: string;
}

// Swipe Types
export interface Swipe extends BaseEntity {
  swiperTeamId: string;
  targetTeamId: string;
  action: SwipeAction;
  swipeMetadata?: SwipeMetadata;
  createdBy: string;
  swiperTeam?: Team;
  targetTeam?: Team;
}

export enum SwipeAction {
  LIKE = 'LIKE',
  PASS = 'PASS'
}

export interface SwipeMetadata {
  timeSpentViewing?: number; // milliseconds
  locationPreferenceMatch?: boolean;
  levelPreferenceMatch?: boolean;
  genderPreferenceMatch?: boolean;
}

export interface CreateSwipeDto {
  swiperTeamId: string;
  targetTeamId: string;
  action: 'like' | 'pass';  // API expects lowercase values
  swipeMetadata?: SwipeMetadata;
}

export interface SwipeResponse {
  swipe: Swipe;
  isMatch: boolean;
  newMatch?: Match;
}

// Swipe History with undo capability
export interface SwipeHistoryItem extends Swipe {
  canUndo: boolean;
  timeSinceSwipe: number;
}

// Received swipes (who liked my team)
export interface ReceivedSwipe {
  id: string;
  swiperTeamId: string;
  swiperTeam: Team;
  swipedAt: string;
  isMatch: boolean;
  matchId?: string;
}

// Swipe eligibility check response
export interface SwipeCheckResponse {
  canSwipe: boolean;
  reason?: string;
}

// Undo swipe response
export interface UndoSwipeResponse {
  success: boolean;
  message?: string;
}

// Extended analytics
export interface SwipeAnalytics {
  totalLikesGiven: number;
  totalPassesGiven: number;
  totalLikesReceived: number;
  totalMatches: number;
  averageResponseTime: number;
  mostSwipedDay: string;
  mostSwipedTime: string;
  recentActivity: Swipe[];
}

// Paginated responses
export interface SwipeHistoryResponse {
  swipes: SwipeHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReceivedSwipesResponse {
  receivedSwipes: ReceivedSwipe[];
  total: number;
  unreadCount: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SwipeStats {
  totalSwipes: number;
  likes: number;
  passes: number;
  matches: number;
  likeRate: number; // percentage
  matchRate: number; // percentage
  likeToMatchRate: number; // percentage
}

// Discovery Types
export interface DiscoveryFilter {
  center: {
    lat: number;
    lng: number;
  };
  radius: number; // kilometers
  level?: string[];
  gender?: Gender[];
  minRating?: number;
  minPlayers?: number;
  maxPlayers?: number;
  activeOnly?: boolean;
  excludeIds?: string[];
  sortBy?: 'distance' | 'rating' | 'createdAt' | 'lastActive';
  sortOrder?: 'ASC' | 'DESC';
}

export interface DiscoveryFilterDto {
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  level?: string[];
  gender?: Gender[];
  minRating?: number;
  minPlayers?: number;
  maxPlayers?: number;
  activeOnly?: boolean;
  excludeIds?: string[];
  sortBy?: 'distance' | 'rating' | 'createdAt' | 'lastActive';
  sortOrder?: 'ASC' | 'DESC';
}

export interface DiscoveredTeam extends Team {
  distance: number; // kilometers
  compatibilityScore: number; // 0-1
  qualityScore: number; // 0-1
  activityScore: number; // 0-1
  lastActive?: string;
  mutualFriends?: string[];
  commonInterests?: string[];
}

export interface DiscoveryResponse {
  teams: DiscoveredTeam[];
  total: number;
  searchInfo: {
    center: {
      lat: number;
      lng: number;
    };
    radius: number;
    filters: Partial<DiscoveryFilter>;
  };
}

export interface DiscoveryStats {
  totalSearches: number;
  averageSearchTime: number;
  averageMatchesPerSearch: number;
  popularLocations: {
    district: string;
    count: number;
  }[];
  popularFilters: {
    filter: string;
    count: number;
  }[];
}

// File Types
export interface FileEntity extends BaseEntity {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  entityType: 'team' | 'user' | 'match';
  entityId: string;
  fileType: 'avatar' | 'logo' | 'banner' | 'document' | 'image' | 'video';
  uploadedBy: string;
  isActive: boolean;
}

export interface UploadResponse {
  file: FileEntity;
  url: string;
}

// Notification Types
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: NotificationPriority;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
}

export enum NotificationType {
  NEW_MATCH = 'new_match',
  MATCH_STATUS_CHANGE = 'match_status_change',
  TEAM_INVITATION = 'team_invitation',
  TEAM_REMOVAL = 'team_removal',
  MATCH_REMINDER = 'match_reminder',
  MATCH_RESULT = 'match_result',
  NEW_LIKE = 'new_like',
  NEW_FOLLOWER = 'new_follower',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationStats {
  total: number;
  unread: number;
  unreadByType: Record<NotificationType, number>;
  notificationsByType: Record<NotificationType, number>;
  recentNotifications: Notification[];
}

// Pagination & Query Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortingParams {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TeamQueryParams extends PaginationParams, SortingParams {
  search?: string;
  level?: string[];
  gender?: Gender;
  status?: 'active' | 'inactive' | 'archived';
  createdBy?: string;
}

export interface MatchQueryParams extends PaginationParams {
  teamId?: string;
  status?: MatchStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface SwipeQueryParams extends PaginationParams {
  teamId?: string;
  action?: SwipeAction;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationQueryParams extends PaginationParams {
  unreadOnly?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
  message?: string;
  timestamp?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  timestamp?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: string[];
  timestamp: string;
}

// Common Error Codes
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TEAM_LIMIT_EXCEEDED = 'TEAM_LIMIT_EXCEEDED',
  ALREADY_SWIPED = 'ALREADY_SWIPED',
  INVALID_SWIPE_ACTION = 'INVALID_SWIPE_ACTION',
  MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
  TEAM_NOT_FOUND = 'TEAM_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE'
}