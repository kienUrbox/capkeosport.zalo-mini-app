# API Reference

> Tài liệu tham khảo API endpoints cho Cap Kèo Sport

## 🔧 API Client Setup

**File:** [src/services/api/index.ts](../src/services/api/index.ts)

### Configuration

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  'https://api.capkeosport.com/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor

Tự động thêm `Authorization` header từ access token:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken(); // From auth store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Xử lý token refresh khi 401:

```typescript
// 1. Detect 401 error
// 2. Check if already refreshing
// 3. If not, refresh token
// 4. Update auth store with new tokens
// 5. Retry original request
// 6. Process queued requests
```

### HTTP Helpers

```typescript
api.get<T>(url, config?)      // GET request
api.post<T>(url, data, config?) // POST request
api.put<T>(url, data, config?)  // PUT request
api.patch<T>(url, data, config?) // PATCH request
api.delete<T>(url, config?)    // DELETE request
```

### File Upload

```typescript
uploadFile(url, file, onProgress?) // Upload with progress callback
```

## 📡 API Services

### 1. Auth Service

**File:** [src/services/api/auth.service.ts](../src/services/api/auth.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `zaloLogin(data)` | `POST /auth/zalo-login` | Login with Zalo OAuth |
| `zaloThreeStepVerify(data)` | `POST /auth/zalo-three-step-verify` | Verify 3-step auth |
| `refreshToken(data)` | `POST /auth/refresh` | Refresh access token |
| `logout()` | `POST /auth/logout` | Logout user |
| `getProfile()` | `GET /auth/profile` | Get user profile |
| `updateProfile(data)` | `PUT /auth/profile` | Update profile |
| `healthCheck()` | `GET /auth/zalo-three-step` | Health check |

**Request Types:**
```typescript
interface ZaloLoginDto {
  accessToken: string;
  userId: string;
}

interface ZaloThreeStepDto {
  userAccessToken: string;
  userId: string;
  phoneNumber: string;
  deviceInfo?: string;
  sessionId: string;
  timestamp: number;
}

interface RefreshTokenDto {
  refreshToken: string;
}

interface UpdateProfileDto {
  name?: string;
  avatar?: string;
  phone?: string;
}
```

**Response Types:**
```typescript
interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RefreshTokenResponse {
  user: User;
  tokens: AuthTokens;
}
```

---

### 2. Team Service

**File:** [src/services/api/team.service.ts](../src/services/api/team.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getMyTeams()` | `GET /teams/my-teams` | Get user's teams |
| `getTeamById(id)` | `GET /teams/:id` | Get team detail |
| `createTeam(data)` | `POST /teams` | Create new team |
| `updateTeam(id, data)` | `PATCH /teams/:id` | Update team |
| `deleteTeam(id)` | `DELETE /teams/:id` | Delete team |
| `getTeamMembers(id)` | `GET /teams/:id/members` | Get members |
| `addMember(id, data)` | `POST /teams/:id/members` | Add member |
| `removeMember(id, memberId)` | `DELETE /teams/:id/members/:memberId` | Remove member |
| `updateMemberRole(id, memberId, data)` | `PATCH /teams/:id/members/:memberId` | Update role |
| `updateMemberAdminRole(id, memberId, data)` | `PATCH /teams/:id/members/:memberId/admin` | Update admin role |

**Request Types:**
```typescript
interface CreateTeamDto {
  name: string;
  logo?: string;
  level?: string;
  gender?: string;
  description?: string;
}

interface UpdateTeamDto {
  name?: string;
  logo?: string;
  level?: string;
  gender?: string;
  description?: string;
}

interface AddMemberDto {
  userId: string;
  role?: 'captain' | 'player' | 'substitute';
  jerseyNumber?: string;
}
```

---

### 3. Match Service

**File:** [src/services/api/match.service.ts](../src/services/api/match.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getMatches(params?)` | `GET /matches` | Get matches with filters |
| `getMatchById(id)` | `GET /matches/:id` | Get match detail |
| `sendMatchRequest(id, data)` | `POST /matches/:id/request` | Send match request |
| `updateMatchRequest(id, data)` | `PATCH /matches/:id/request` | Update request |
| `acceptMatchRequest(id)` | `POST /matches/:id/accept` | Accept request |
| `declineMatchRequest(id)` | `POST /matches/:id/decline` | Decline request |
| `confirmMatch(id, data)` | `POST /matches/:id/confirm` | Confirm match |
| `finishMatch(id, data)` | `POST /matches/:id/finish` | Finish match |
| `cancelMatch(id, data)` | `POST /matches/:id/cancel` | Cancel match |
| `rematch(id, data)` | `POST /matches/:id/rematch` | Rematch |
| `getMatchAttendance(matchId)` | `GET /matches/:matchId/attendance` | Get attendance |
| `getMyAttendance(matchId)` | `GET /matches/:matchId/attendance/my` | Get my attendance |
| `updateAttendance(matchId, data)` | `POST /matches/:matchId/attendance` | Update attendance |

**Request Types:**
```typescript
interface SendMatchRequestDto {
  proposedDate: string;
  proposedTime: string;
  proposedPitch: string;
  notes?: string;
}

interface ConfirmMatchDto {
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    mapLink?: string;
  };
}

interface FinishMatchDto {
  score: {
    teamA: number;
    teamB: number;
  };
  notes?: string;
}

interface CancelMatchDto {
  reason: string;
}

interface RematchDto {
  proposedDate: string;
  proposedTime: string;
  proposedPitch: string;
  notes?: string;
}
```

**Match Status Flow:**
```
MATCHED → REQUESTED → ACCEPTED → CONFIRMED → FINISHED
                ↓           ↓
             CANCELLED   CANCELLED
```

---

### 4. Discovery Service

**File:** [src/services/api/discovery.service.ts](../src/services/api/discovery.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `discoverTeams(filters)` | `POST /discovery/teams` | Find teams nearby |
| `getStats()` | `GET /discovery/stats` | Get discovery stats |
| `getRecommendations()` | `GET /discovery/recommendations` | Get recommendations |

**Filter Types:**
```typescript
interface DiscoveryFilters {
  location: {
    lat: number;
    lng: number;
  };
  radius?: number; // km
  level?: string;
  gender?: string;
  pitchType?: string; // '5', '7', '11'
}
```

---

### 5. Swipe Service

**File:** [src/services/api/swipe.service.ts](../src/services/api/swipe.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `swipe(data)` | `POST /swipe` | Swipe on team |
| `getHistory(params?)` | `GET /swipe/history` | Get swipe history |
| `getReceived(params?)` | `GET /swipe/received` | Get received swipes |
| `getStats()` | `GET /swipe/stats` | Get swipe stats |
| `undoSwipe(swipeId)` | `POST /swipe/:swipeId/undo` | Undo swipe |

**Request Types:**
```typescript
interface SwipeDto {
  targetTeamId: string;
  action: 'LIKE' | 'PASS';
}
```

---

### 6. Notification Service

**File:** [src/services/api/notification.service.ts](../src/services/api/notification.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getNotifications(params?)` | `GET /notifications` | Get notifications |
| `markAsRead(id)` | `POST /notifications/:id/read` | Mark as read |
| `markAllAsRead()` | `POST /notifications/read-all` | Mark all as read |
| `getStats()` | `GET /notifications/stats` | Get notification stats |

---

### 7. File Service

**File:** [src/services/api/file.service.ts](../src/services/api/file.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `uploadFile(file)` | `POST /files/upload` | Upload file |
| `uploadTeamLogo(teamId, file)` | `POST /teams/:id/logo` | Upload team logo |
| `uploadTeamBanner(teamId, file)` | `POST /teams/:id/banner` | Upload team banner |
| `uploadUserAvatar(file)` | `POST /users/me/avatar` | Upload user avatar |
| `uploadUserBanner(file)` | `POST /users/me/banner` | Upload user banner |
| `getEntityFiles(entityId)` | `GET /files/entity/:entityId` | Get entity files |
| `deleteFile(fileId)` | `DELETE /files/:fileId` | Delete file |

---

### 8. Team Invite Service

**File:** [src/services/api/team-invite.service.ts](../src/services/api/team-invite.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `createInviteToken(teamId, options?)` | `POST /teams/:id/invite-token` | Create invite token |
| `getInviteByToken(token)` | `GET /invites/:token` | Get invite by token |
| `acceptInvite(token, data?)` | `POST /invites/:token/accept` | Accept invite |
| `getSentInvites(teamId, params?)` | `GET /teams/:id/invites/sent` | Get sent invites |
| `getMyInvites(params?)` | `GET /invites/my` | Get my invites |
| `respondToInvite(data)` | `POST /invites/:inviteId/respond` | Respond to invite |
| `cancelInvite(inviteId)` | `DELETE /invites/:inviteId` | Cancel invite |
| `resendInvite(inviteId)` | `POST /invites/:inviteId/resend` | Resend invite |

---

### 9. Phone Invite Service

**File:** [src/services/api/phone-invite.service.ts](../src/services/api/phone-invite.service.ts)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getMyInvites(params?)` | `GET /phone-invites/my` | Get my invites |
| `getInviteDetails(inviteId)` | `GET /phone-invites/:inviteId` | Get invite details |
| `sendPhoneInvite(data)` | `POST /phone-invites` | Send phone invite |
| `respondInvite(inviteId, data)` | `POST /phone-invites/:inviteId/respond` | Respond |
| `cancelInvite(inviteId)` | `DELETE /phone-invites/:inviteId` | Cancel invite |
| `resendInvite(inviteId)` | `POST /phone-invites/:inviteId/resend` | Resend invite |

## 📦 API Response Types

### Success Response

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}
```

### Error Response

```typescript
interface ApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp: string;
}
```

### Pagination Response

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🔐 Authentication Flow

### Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Refresh Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. API Request with expired token                           │
│     ↓                                                        │
│  2. Server returns 401                                       │
│     ↓                                                        │
│  3. Client checks if already refreshing                      │
│     ├─ YES → Add request to queue                           │
│     └─ NO → Start refresh process                           │
│           ↓                                                  │
│  4. Call POST /auth/refresh with refreshToken               │
│     ↓                                                        │
│  5. Update auth store with new tokens                        │
│     ↓                                                        │
│  6. Process queued requests with new token                   │
│     ↓                                                        │
│  7. Retry original request                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Using Auth Store with API

```typescript
// In component
import { useAuthActions, useAccessToken } from '@/stores/auth.store';

function MyComponent() {
  const { refreshTokens } = useAuthActions();

  const makeRequest = async () => {
    try {
      // API call automatically adds token from store
      const response = await api.get('/endpoint');
    } catch (error) {
      if (error.response?.status === 401) {
        // Token refresh is automatic via interceptor
        // But you can manually trigger:
        await refreshTokens();
      }
    }
  };
}
```

## 📚 Related Documentation

- [Project Requirements](./PROJECT_REQUIREMENTS.md)
- [Source Structure](./SOURCE_STRUCTURE.md)
- [Zustand Stores](./ZUSTAND_STORES.md)
- [Zalo Mini App Skills](./ZALO_MINI_APP_SKILLS.md)
