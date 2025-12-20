# Cap Kéo Sport - API Implementation

This document provides a comprehensive overview of the API implementation for the Cap Kéo Sport Zalo Mini App, including all API services, state management with Zustand, and custom hooks.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [API Services](#api-services)
4. [TypeScript Types](#typescript-types)
5. [State Management with Zustand](#state-management-with-zustand)
6. [Custom Hooks](#custom-hooks)
7. [Authentication Flow](#authentication-flow)
8. [Error Handling](#error-handling)
9. [Usage Examples](#usage-examples)
10. [Testing](#testing)

## Overview

The API implementation provides a complete integration with the Cap Kéo Sport backend API, featuring:

- **Authentication**: Zalo OAuth 2.0 with 3-step verification
- **Teams Management**: Create, update, delete teams and manage members
- **Matches**: Organize and manage football matches
- **Swipes**: Tinder-like team matching system
- **Discovery**: Find teams based on location and preferences
- **Notifications**: Real-time notification system
- **File Management**: Upload and manage team logos, banners, etc.

## Project Structure

```
src/
├── services/
│   └── api/
│       ├── index.ts              # API client configuration
│       ├── auth.service.ts       # Authentication service
│       ├── teams.service.ts      # Teams management service
│       ├── matches.service.ts     # Matches service
│       ├── swipes.service.ts      # Swipes service
│       ├── discovery.service.ts   # Discovery service
│       ├── files.service.ts      # File management service
│       ├── notifications.service.ts # Notifications service
│       └── services.ts           # Export all services
├── stores/
│   ├── auth.store.ts            # Authentication state
│   ├── teams.store.ts           # Teams state
│   ├── matches.store.ts         # Matches state
│   ├── swipes.store.ts          # Swipes state
│   ├── discovery.store.ts       # Discovery state
│   ├── notifications.store.ts   # Notifications state
│   └── index.ts                # Export all stores
├── hooks/
│   ├── useAuth.ts              # Authentication hooks
│   ├── useTeams.ts             # Teams hooks
│   ├── useMatches.ts           # Matches hooks
│   ├── useSwipes.ts            # Swipes hooks
│   ├── useDiscovery.ts         # Discovery hooks
│   ├── useNotifications.ts     # Notifications hooks
│   └── index.ts               # Export all hooks
├── types/
│   └── api.types.ts           # API TypeScript types
└── components/
    └── ApiTest.tsx            # API testing component
```

## API Services

### Base API Configuration

The base API client is configured in `src/services/api/index.ts`:

- **Base URL**: `https://capkeosportnestjs-production.up.railway.app/api/v1`
- **Authentication**: Bearer token in Authorization header
- **Interceptors**: Automatic token injection and error handling
- **File Upload**: Multipart form data support

### Available Services

#### 1. AuthService (`auth.service.ts`)
- `zaloLogin(data)` - Login with Zalo OAuth
- `zaloThreeStepVerify(data)` - Enhanced 3-step verification
- `refreshToken(data)` - Refresh access token
- `logout()` - Logout user
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update user profile

#### 2. TeamsService (`teams.service.ts`)
- `createTeam(data)` - Create new team
- `getTeams(params)` - Get teams with pagination and filtering
- `getMyTeams()` - Get user's teams
- `getTeamById(id)` - Get team details
- `updateTeam(id, data)` - Update team information
- `deleteTeam(id)` - Delete team
- `getTeamMembers(id)` - Get team members
- `addMember(id, data)` - Add team member
- `removeMember(id, userId)` - Remove team member
- `uploadTeamLogo(id, file)` - Upload team logo
- `uploadTeamBanner(id, file)` - Upload team banner

#### 3. MatchesService (`matches.service.ts`)
- `getMatches(params)` - Get matches with pagination
- `getMatchById(id)` - Get match details
- `updateMatchStatus(id, status)` - Update match status
- `submitMatchResult(id, result)` - Submit match result
- `addMatchSuggestion(id, suggestion)` - Add match suggestion
- `getUpcomingMatches(teamId)` - Get upcoming matches
- `getPastMatches(teamId)` - Get past matches
- `cancelMatch(id, reason)` - Cancel match
- `rescheduleMatch(id, date, time)` - Reschedule match

#### 4. SwipesService (`swipes.service.ts`)
- `createSwipe(data)` - Create swipe (like/pass)
- `likeTeam(swiperId, targetId, metadata)` - Like a team
- `passTeam(swiperId, targetId, metadata)` - Pass on a team
- `undoSwipe(swipeId)` - Undo a swipe
- `getTeamSwipes(teamId, params)` - Get team swipe history
- `getReceivedSwipes(teamId)` - Get received likes
- `getMutualLikes(teamId)` - Get matches
- `getTeamSwipeStats(teamId)` - Get swipe statistics

#### 5. DiscoveryService (`discovery.service.ts`)
- `discoverTeams(filter)` - Discover teams based on filters
- `searchNearbyTeams(lat, lng, radius, filters)` - Search nearby teams
- `getTrendingTeams(lat, lng, radius)` - Get trending teams
- `getRecommendedTeams(teamId)` - Get recommended teams
- `getCompatibleTeams(teamId, lat, lng)` - Get compatible teams
- `saveDiscoveryPreferences(preferences)` - Save search preferences

#### 6. FilesService (`files.service.ts`)
- `uploadFile(file, onProgress)` - Upload generic file
- `uploadTeamLogo(teamId, file)` - Upload team logo
- `uploadUserAvatar(userId, file)` - Upload user avatar
- `getEntityFiles(type, id, fileType)` - Get files for entity
- `deleteFile(id)` - Delete file
- `compressImage(file, quality, maxWidth)` - Compress image

#### 7. NotificationsService (`notifications.service.ts`)
- `getUserNotifications(params)` - Get user notifications
- `getUnreadNotifications(limit)` - Get unread notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification(id)` - Delete notification
- `getNotificationStats()` - Get notification statistics

## TypeScript Types

All API types are defined in `src/types/api.types.ts`:

### Core Types
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedApiResponse<T>` - Paginated response wrapper
- `BaseEntity` - Base entity with id and timestamps

### Entity Types
- `User` - User information
- `Team` - Team information with members and stats
- `Match` - Match information with teams and status
- `Swipe` - Swipe information with metadata
- `Notification` - Notification information
- `FileEntity` - File information

### Enum Types
- `Gender` - MALE, FEMALE, MIXED
- `TeamRole` - CAPTAIN, PLAYER, SUBSTITUTE
- `MatchStatus` - MATCHED, PENDING, CONFIRMED, etc.
- `SwipeAction` - LIKE, PASS
- `NotificationType` - NEW_MATCH, MATCH_STATUS_CHANGE, etc.
- `NotificationPriority` - LOW, NORMAL, HIGH, URGENT

### DTO Types
- `CreateTeamDto` - Team creation data
- `UpdateTeamDto` - Team update data
- `ZaloLoginDto` - Zalo login data
- `DiscoveryFilterDto` - Discovery search filters

## State Management with Zustand

### Store Structure

Each store follows a consistent pattern:

```typescript
interface [Entity]State {
  // State
  [entities]: [Entity][];
  current[Entity]: [Entity] | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: FilterOptions;

  // Actions
  fetch[Entities]: (params?: any) => Promise<void>;
  fetch[Entity]ById: (id: string) => Promise<void>;
  create[Entity]: (data: CreateDto) => Promise<[Entity] | null>;
  update[Entity]: (id: string, data: UpdateDto) => Promise<[Entity] | null>;
  delete[Entity]: (id: string) => Promise<boolean>;
  // ... other actions
}
```

### Available Stores

#### 1. AuthStore
- **State**: user, tokens, isAuthenticated, loading states
- **Actions**: login, logout, updateProfile, refreshTokens, checkAuth
- **Persistence**: Stored in localStorage with zustand persist

#### 2. TeamsStore
- **State**: teams, myTeams, currentTeam, members, stats
- **Actions**: CRUD operations, member management, file uploads
- **Features**: Pagination, filtering, real-time updates

#### 3. MatchesStore
- **State**: matches, currentMatch, suggestions, upcoming/past matches
- **Actions**: Match management, status updates, result submission
- **Features**: Status tracking, suggestion handling

#### 4. SwipesStore
- **State**: swipes, receivedSwipes, mutualLikes, stats
- **Actions**: Like/pass operations, undo, eligibility checking
- **Features**: Match detection, statistics tracking

#### 5. DiscoveryStore
- **State**: discoveredTeams, trendingTeams, recommendations, filters
- **Actions**: Search operations, preference management
- **Features**: Advanced filtering, search history

#### 6. NotificationsStore
- **State**: notifications, unreadCount, preferences, muteStatus
- **Actions**: Read/unread management, preference updates
- **Features**: Type filtering, priority handling

## Custom Hooks

### Usage Pattern

```typescript
import { useAuth, useMyTeams, useTeamDiscovery } from '../hooks';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const { myTeams, createTeam } = useMyTeams();
  const { teams, searchNearbyTeams } = useTeamDiscovery();

  // Use the hooks...
};
```

### Available Hooks

#### 1. Authentication Hooks (`useAuth.ts`)
- `useAuth()` - Main auth hook with state and actions
- `useUserAuth()` - User authentication with login/logout
- `useUserProfile()` - Profile management
- `useAuthStatus()` - Authentication status checking
- `useRequireAuth()` - Protected route authentication
- `useUserPermissions()` - User permission checking
- `useSessionManagement()` - Session timeout handling

#### 2. Teams Hooks (`useTeams.ts`)
- `useTeams()` - Main teams hook
- `useMyTeams()` - User's teams management
- `useTeamDetails(teamId)` - Individual team details
- `useTeamsDiscovery()` - Teams discovery and search
- `useTeamManagement(teamId)` - Team management operations
- `useTeamStatistics(teamId)` - Team statistics and analytics
- `useTeamSearch()` - Advanced team search

#### 3. Matches Hooks (`useMatches.ts`)
- `useMatches()` - Main matches hook
- `useMatchDetails(matchId)` - Individual match details
- `useUpcomingMatches(teamId)` - Upcoming matches
- `usePastMatches(teamId)` - Past matches
- `useActiveMatches(teamId)` - Active matches
- `useMatchManagement(matchId)` - Match operations
- `useMatchesSearch()` - Match search and filtering

#### 4. Swipes Hooks (`useSwipes.ts`)
- `useSwipes()` - Main swipes hook
- `useSwipeDeck(teamId)` - Tinder-like swiping interface
- `useTeamSwipes(teamId)` - Team swipe history
- `useReceivedSwipes(teamId)` - Received likes
- `useMutualLikes(teamId)` - Matches
- `useSwipeStats(teamId)` - Swipe statistics
- `useSwipeAnalytics(teamId)` - Swipe analytics

#### 5. Discovery Hooks (`useDiscovery.ts`)
- `useDiscovery()` - Main discovery hook
- `useTeamDiscovery()` - Team discovery interface
- `useTrendingTeams(location)` - Trending teams
- `useNewTeams(location)` - New teams
- `useRecommendedTeams(teamId)` - Team recommendations
- `useSearchHistory()` - Search history management
- `useDiscoveryAnalytics()` - Discovery statistics

#### 6. Notifications Hooks (`useNotifications.ts`)
- `useNotifications()` - Main notifications hook
- `useUnreadNotifications()` - Unread notifications
- `useNotificationManagement()` - Notification operations
- `useNotificationsByType(type)` - Filter by type
- `useNotificationStatistics()` - Notification stats
- `useNotificationPreferences()` - Preference management
- `useRealTimeNotifications()` - Real-time updates

## Authentication Flow

### 1. Zalo OAuth Login
```typescript
const { zaloLogin } = useUserAuth();

const handleZaloLogin = async (zaloData) => {
  const result = await zaloLogin(zaloData);
  if (result.success) {
    // User is authenticated
    console.log('User:', result.data.user);
    console.log('Tokens:', result.data.tokens);
  }
};
```

### 2. 3-Step Verification
```typescript
const { zaloThreeStepVerify } = useUserAuth();

const handleThreeStep = async (verificationData) => {
  const result = await zaloThreeStepVerify(verificationData);
  if (result.success) {
    // Enhanced authentication completed
  }
};
```

### 3. Token Refresh
```typescript
const { refreshTokens } = useAuth();

// Automatic token refresh is handled by the store
// Manual refresh if needed
const refresh = await refreshTokens();
```

## Error Handling

### API Error Structure
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: string[];
  timestamp: string;
}
```

### Error Handling Pattern
```typescript
try {
  const result = await someApiCall(data);
  // Handle success
} catch (error) {
  // Error is already standardized by the API client
  console.error('API Error:', error.message);
  // Show user-friendly message
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Invalid or expired token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `ALREADY_SWIPED` - Team already swiped on
- `TEAM_LIMIT_EXCEEDED` - Maximum team limit reached

## Usage Examples

### 1. Creating a Team
```typescript
import { useMyTeams } from '../hooks';

const TeamCreator = () => {
  const { createTeam, isLoading } = useMyTeams();

  const handleCreateTeam = async () => {
    const teamData = {
      name: 'My Football Team',
      description: 'A friendly team looking for matches',
      gender: Gender.MALE,
      level: 'Trung bình',
      location: {
        lat: 10.7769,
        lng: 106.7009,
        address: 'Quận 1, TP.HCM'
      },
      stats: {
        attack: 70,
        defense: 65,
        technique: 68
      }
    };

    const result = await createTeam(teamData);
    if (result) {
      console.log('Team created:', result);
    }
  };

  return (
    <button onClick={handleCreateTeam} disabled={isLoading}>
      Create Team
    </button>
  );
};
```

### 2. Discovering Teams
```typescript
import { useTeamDiscovery } from '../hooks';

const TeamDiscovery = () => {
  const { teams, searchNearbyTeams, isSearching } = useTeamDiscovery();

  const handleSearch = async () => {
    const result = await searchNearbyTeams(
      10.7769,  // latitude
      106.7009, // longitude
      10,       // radius in km
      {
        level: ['Trung bình', 'Khá'],
        gender: [Gender.MALE],
        activeOnly: true
      }
    );

    if (result) {
      console.log(`Found ${result.teams.length} teams`);
    }
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={isSearching}>
        Search Nearby Teams
      </button>
      {teams.map(team => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <p>{team.description}</p>
          <span>{team.distance} km away</span>
        </div>
      ))}
    </div>
  );
};
```

### 3. Swiping on Teams
```typescript
import { useSwipeDeck } from '../hooks';

const SwipeInterface = () => {
  const { likeTeam, passTeam, isSwiping, hasNewMatch, newMatch } = useSwipeDeck();

  const handleLike = async (targetTeamId: string) => {
    const result = await likeTeam('my-team-id', targetTeamId);
    if (result?.isMatch) {
      alert('It\'s a match! 🎉');
    }
  };

  const handlePass = async (targetTeamId: string) => {
    await passTeam('my-team-id', targetTeamId);
  };

  return (
    <div>
      {hasNewMatch && newMatch && (
        <div className="match-alert">
          🎉 New match with {newMatch.teamBId}
        </div>
      )}
      {/* Team cards with like/pass buttons */}
    </div>
  );
};
```

### 4. Managing Notifications
```typescript
import { useUnreadNotifications } from '../hooks';

const NotificationCenter = () => {
  const {
    unreadNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useUnreadNotifications();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div>
      <h2>Notifications ({unreadCount})</h2>
      <button onClick={handleMarkAllAsRead}>
        Mark All as Read
      </button>
      {unreadNotifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => handleMarkAsRead(notification.id)}>
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Testing

### API Test Component

An comprehensive API test component is available at `src/components/ApiTest.tsx`. This component provides:

1. **User Information Display** - Shows current user details
2. **Quick Stats Dashboard** - Displays key metrics
3. **Team Creation Form** - Test team creation
4. **Discovery Interface** - Test team discovery
5. **Swipe Interface** - Test like/pass functionality
6. **Team Listings** - Display my teams and discovered teams
7. **Notifications Panel** - Show unread notifications

### Running Tests

To test the API implementation:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Login to the application** using Zalo OAuth

3. **Navigate to the API test component** (add to your router)

4. **Test various features**:
   - Create a new team
   - Search for nearby teams
   - Like/pass on discovered teams
   - Check for matches
   - View notifications

### Debugging Tips

1. **Check Network Requests**: Use browser dev tools to inspect API calls
2. **Console Logging**: All hooks include error logging
3. **Store DevTools**: Install Zustand devtools for state inspection
4. **API Response Format**: All responses follow the standard `ApiResponse<T>` format

## Dependencies

### Core Dependencies
- `axios` - HTTP client for API requests
- `zustand` - State management
- `@tanstack/react-query` - Server state management (optional)

### Development Dependencies
- `@types/node` - TypeScript definitions
- `typescript` - TypeScript compiler

## Next Steps

1. **Integration**: Replace mock data with real API calls in existing components
2. **Error Boundaries**: Add error boundaries for better error handling
3. **Loading States**: Implement proper loading indicators
4. **Caching**: Add query caching for better performance
5. **Real-time Updates**: Implement WebSocket for real-time notifications
6. **Testing**: Add unit and integration tests
7. **Documentation**: Add inline documentation for complex functions

## Support

For questions or issues with the API implementation:

1. Check the browser console for error messages
2. Review the API response format
3. Verify network connectivity
4. Check authentication status
5. Review the documentation above

This implementation provides a solid foundation for the Cap Kéo Sport application with all the necessary API integrations, state management, and custom hooks for a robust user experience.