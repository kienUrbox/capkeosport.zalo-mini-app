# Zustand Stores Documentation

> State management với Zustand trong Cap Kèo Sport

## 📚 Overview

Dự án sử dụng **Zustand 5.0.8** làm state management chính với **persist middleware** để lưu state vào localStorage.

### Số lượng Stores: 12

| Store | File | Description |
|-------|------|-------------|
| Auth | [auth.store.ts](../src/stores/auth.store.ts) | Authentication & user data |
| Match | [match.store.ts](../src/stores/match.store.ts) | Match management with pagination |
| Team | [team.store.ts](../src/stores/team.store.ts) | Team management |
| UI | [ui.store.ts](../src/stores/ui.store.ts) | UI state (theme, modals) |
| Discovery | [discovery.store.ts](../src/stores/discovery.store.ts) | Team discovery |
| Notification | [notification.store.ts](../src/stores/notification.store.ts) | Notifications |
| Swipe | [swipe.store.ts](../src/stores/swipe.store.ts) | Swipe feature |
| Home | [home.store.ts](../src/stores/home.store.ts) | Home data cache |
| Launching | [launching.store.ts](../src/stores/launching.store.ts) | App launch state |
| File | [file.store.ts](../src/stores/file.store.ts) | File uploads |
| Phone Invite | [phone-invite.store.ts](../src/stores/phone-invite.store.ts) | Phone invites |
| Toast | [toast.store.ts](../src/stores/toast.store.ts) | Toast notifications |

## 🏗️ Store Pattern

Tất cả stores đều遵循 theo pattern này:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. State Interface
interface MyState {
  // State properties
  data: any[];
  isLoading: boolean;
  error: string | null;

  // 2. State Management Actions
  setData: (data: any[]) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;

  // 3. API Methods
  fetchData: () => Promise<void>;
}

// 4. Create Store with Persist
export const useMyStore = create<MyState>()(
  persist(
    (set, get) => ({
      // Initial state
      data: [],
      isLoading: false,
      error: null,

      // Actions
      setData: (data) => set({ data }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),

      // API Methods
      fetchData: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/endpoint');
          set({ data: response.data, error: null });
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'my-storage', // localStorage key
      partialize: (state) => ({ data: state.data }), // chỉ persist data
    }
  )
);

// 5. Custom Selectors
export const useData = () => useMyStore((state) => state.data);
export const useActions = () => {
  const store = useMyStore();
  return {
    setData: store.setData,
    setError: store.setError,
    fetchData: store.fetchData,
  };
};
```

## 📦 Store Details

### 1. Auth Store

**File:** [src/stores/auth.store.ts](../src/stores/auth.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user data |
| `tokens` | `AuthTokens \| null` | Access & refresh tokens |
| `isAuthenticated` | `boolean` | Auth status |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `metadata` | `AuthMetadata` | Auth tracking info |

**API Methods:**
- `zaloLogin(data)` - Login with Zalo OAuth
- `zaloThreeStepVerify(data)` - Verify 3-step auth
- `refreshTokens()` - Refresh access token
- `checkAuth()` - Check authentication status
- `getProfile(forceRefresh?)` - Get user profile
- `updateProfile(data)` - Update user profile

**Persist Key:** `auth-storage`

**Persisted Fields:**
```typescript
{
  user: state.user,
  tokens: state.tokens,
  isAuthenticated: state.isAuthenticated,
  metadata: state.metadata,
}
```

**Selectors:**
```typescript
useAuth()              // Combined auth state
useUser()              // User data
useTokens()            // Auth tokens
useAuthMetadata()      // Auth metadata
useIsAuthenticated()   // Auth status
useUserId()            // User ID
useAccessToken()       // Access token
useRefreshToken()      // Refresh token
```

**Usage Example:**
```typescript
// In component
function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { zaloLogin, logout } = useAuthActions();

  if (!isAuthenticated) {
    return <button onClick={() => zaloLogin({...})}>Login</button>;
  }

  return <div>Welcome {user?.name}</div>;
}
```

---

### 2. Match Store

**File:** [src/stores/match.store.ts](../src/stores/match.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `pendingMatches` | `Match[]` | Chờ kèo |
| `upcomingMatches` | `Match[]` | Lịch đấu |
| `liveMatches` | `Match[]` | Live matches |
| `historyMatches` | `Match[]` | Lịch sử |
| `selectedMatch` | `Match \| null` | Selected match |
| `pagination` | `PaginationState` | Per-tab pagination |
| `isLoadingMore` | `object` | Per-tab loading state |
| `_fetchedTabs` | `object` | Track fetched tabs per team |

**API Methods:**
- `fetchUpcomingMatches(teamId?, page?, forceRefresh?)` - Fetch upcoming matches
- `fetchPendingMatches(teamId?, page?, forceRefresh?)` - Fetch pending matches
- `fetchHistoryMatches(teamId?, page?, forceRefresh?)` - Fetch history
- `acceptMatch(matchId)` - Accept match request
- `declineMatch(matchId)` - Decline match request
- `confirmMatch(matchId, data)` - Confirm match
- `finishMatch(matchId, data)` - Finish match
- `cancelMatch(matchId, data)` - Cancel match
- `rematch(matchId, data)` - Rematch

**Persist Key:** `match-storage`

**Persisted Fields:** Chỉ `selectedMatch` (không persist large arrays)

**Pagination Support:**
```typescript
pagination: {
  pending: { page, limit, total, totalPages, hasMore },
  upcoming: { page, limit, total, totalPages, hasMore },
  history: { page, limit, total, totalPages, hasMore },
}
```

**Fetch Guards:**
- Skip if already loading
- Skip if already fetched (unless forceRefresh)
- Track fetched state per team

---

### 3. Team Store

**File:** [src/stores/team.store.ts](../src/stores/team.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `myTeams` | `Team[]` | User's teams |
| `selectedTeam` | `Team \| null` | Active team |
| `teamMembers` | `TeamMember[]` | Team members |
| `teamDetailsCache` | `Record<string, ApiTeam>` | Team cache |
| `sentInvites` | `TeamInvite[]` | Sent invites |
| `receivedInvites` | `TeamInvite[]` | Received invites |
| `inviteToken` | `InviteTokenResponse \| null` | Generated token |

**API Methods:**
- `fetchMyTeams(forceRefresh?)` - Fetch user's teams
- `getTeamById(teamId)` - Get team detail
- `createTeam(data)` - Create new team
- `updateTeamById(teamId, data)` - Update team
- `deleteTeam(teamId)` - Delete team
- `getTeamMembers(teamId)` - Get members
- `addMemberToTeam(teamId, data)` - Add member
- `removeMemberFromTeam(teamId, memberId)` - Remove member
- `updateMemberRole(teamId, memberId, role)` - Update role
- `updateMemberAdminRole(teamId, memberId, role)` - Update admin role
- `fetchSentInvites(teamId, params?)` - Fetch sent invites
- `fetchReceivedInvites(params?)` - Fetch received invites
- `respondInvite(inviteId, action, message?)` - Respond to invite
- `cancelInvite(inviteId)` - Cancel invite
- `resendInvite(inviteId)` - Resend invite
- `createInviteToken(teamId, options?)` - Create invite token

**Persist Key:** `team-storage`

**Persisted Fields:**
```typescript
{
  myTeams: state.myTeams,
  selectedTeam: state.selectedTeam,
}
```

**Helper Functions:**
```typescript
isAdmin(team)              // Check if user is admin
hasAdminPermission(userRole) // Check admin permission
```

---

### 4. UI Store

**File:** [src/stores/ui.store.ts](../src/stores/ui.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `activeTab` | `string` | Active bottom nav tab |
| `theme` | `'light' \| 'dark' \| 'system'` | Theme setting |
| `effectiveTheme` | `'light' \| 'dark'` | Resolved theme |
| `isModalOpen` | `boolean` | Modal state |
| `modalContent` | `ReactNode \| null` | Modal content |
| `globalLoading` | `boolean` | Global loading |
| `toast` | `object \| null` | Toast state |
| `isBottomSheetOpen` | `boolean` | Bottom sheet state |
| `bottomSheetContent` | `ReactNode \| null` | Bottom sheet content |

**Actions:**
- `setActiveTab(tab)` - Set active tab
- `setTheme(theme)` - Set theme
- `updateEffectiveTheme()` - Update effective theme
- `openModal(content)` - Open modal
- `closeModal()` - Close modal
- `setGlobalLoading(loading)` - Set global loading
- `showToast(message, type)` - Show toast
- `hideToast()` - Hide toast
- `openBottomSheet(content)` - Open bottom sheet
- `closeBottomSheet()` - Close bottom sheet

**Persist Key:** `ui-storage`

**Persisted Fields:**
```typescript
{
  theme: state.theme,
  activeTab: state.activeTab,
}
```

---

### 5. Discovery Store

**File:** [src/stores/discovery.store.ts](../src/stores/discovery.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `filters` | `DiscoveryFilters` | Search filters |
| `teams` | `DiscoveredTeam[]` | Discovered teams |
| `currentIndex` | `number` | Current card index |
| `totalAvailable` | `number` | Total available |
| `matchedTeam` | `DiscoveredTeam \| null` | Matched team |
| `matchedMatch` | `Match \| null` | Match created |
| `stats` | `DiscoveryStats \| null` | Statistics |

**API Methods:**
- `discoverTeams(filters?)` - Discover teams
- `getStats()` - Get statistics
- `getRecommendations()` - Get recommendations

**Persist Key:** `discovery-storage`

**Persisted Fields:** `filters`

---

### 6. Notification Store

**File:** [src/stores/notification.store.ts](../src/stores/notification.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `notifications` | `Notification[]` | Notifications list |
| `stats` | `NotificationStats \| null` | Stats |
| `unreadCount` | `number` | Unread count |

**API Methods:**
- `fetchNotifications()` - Fetch notifications
- `markAsRead(id)` - Mark as read
- `markAllAsRead()` - Mark all as read
- `fetchStats()` - Fetch stats

---

### 7. Swipe Store

**File:** [src/stores/swipe.store.ts](../src/stores/swipe.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `swipeHistory` | `SwipeHistoryItem[]` | Swipe history |
| `receivedSwipes` | `ReceivedSwipe[]` | Received swipes |
| `swipeStats` | `SwipeStats \| null` | Statistics |
| `historyPagination` | `PaginationState` | History pagination |
| `receivedPagination` | `PaginationState` | Received pagination |
| `historyFilter` | `'all' \| 'LIKE' \| 'PASS'` | History filter |

**API Methods:**
- `fetchSwipeHistory(params?)` - Fetch history
- `fetchReceivedSwipes(params?)` - Fetch received
- `fetchSwipeStats()` - Fetch stats
- `undoSwipe(swipeId)` - Undo swipe

**Persist Key:** `swipe-storage`

**Persisted Fields:** `historyFilter`

---

### 8. Home Store

**File:** [src/stores/home.store.ts](../src/stores/home.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `pendingInvitations` | `Notification[]` | Pending invites |
| `nearbyTeams` | `DiscoveredTeam[]` | Nearby teams |
| `lastFetched` | `number` | Last fetch timestamp |

**Methods:**
- `setHomeData(data)` - Set home data
- `clearHomeData()` - Clear data
- `isDataStale(staleTimeMs?)` - Check if stale

**Persist Key:** `home-storage`

**Default Stale Time:** 5 minutes

---

### 9. Launching Store

**File:** [src/stores/launching.store.ts](../src/stores/launching.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `status` | `LaunchingStatus` | Launch status |
| `error` | `string \| null` | Error |
| `retryCount` | `number` | Retry count |
| `profileLoaded` | `boolean` | Profile loaded |
| `teamsLoaded` | `boolean` | Teams loaded |
| `fontsLoaded` | `boolean` | Fonts loaded |
| `profile` | `User \| null` | Cached profile |
| `teams` | `Team[] \| null` | Cached teams |

**LaunchingStatus:**
```typescript
type LaunchingStatus =
  | 'idle'
  | 'loading'
  | 'auth_checking'
  | 'loading_data'
  | 'error'
  | 'ready';
```

---

### 10. File Store

**File:** [src/stores/file.store.ts](../src/stores/file.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `uploadedFiles` | `Map<string, FileEntity>` | Entity ID → files |
| `uploadProgress` | `Map<string, UploadProgress>` | Upload progress |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error |

**API Methods:**
- `uploadFile(file, entityType, entityId)` - Upload file
- `uploadTeamLogo(teamId, file)` - Upload team logo
- `uploadTeamBanner(teamId, file)` - Upload team banner
- `uploadUserAvatar(file)` - Upload user avatar
- `uploadUserBanner(file)` - Upload user banner
- `getEntityFiles(entityId)` - Get entity files
- `deleteFile(fileId)` - Delete file

---

### 11. Phone Invite Store

**File:** [src/stores/phone-invite.store.ts](../src/stores/phone-invite.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `myInvites` | `PhoneInvite[]` | User's invites |
| `inviteDetails` | `Map<string, PhoneInvite>` | Details cache |
| `isLoading` | `boolean` | Loading state |
| `isLoadingDetails` | `boolean` | Details loading |

**API Methods:**
- `fetchMyInvites(params?)` - Fetch invites
- `getInviteDetails(inviteId)` - Get details
- `respondInvite(inviteId, action, message?)` - Respond
- `sendPhoneInvite(data)` - Send invite
- `cancelInvite(inviteId)` - Cancel invite
- `resendInvite(inviteId)` - Resend invite

---

### 12. Toast Store

**File:** [src/stores/toast.store.ts](../src/stores/toast.store.ts)

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `toasts` | `Toast[]` | Toasts array |

**Methods:**
- `addToast(type, message)` - Add toast
- `removeToast(id)` - Remove toast

**No persist** - transient state only

## 🎯 State Management Patterns

### 1. Fetch Guards

Ngăn chặn duplicate requests:

```typescript
fetchData: async (forceRefresh = false) => {
  const currentState = get();

  // Skip if already loading
  if (currentState.isLoading) return;

  // Skip if already has data (unless forceRefresh)
  if (!forceRefresh && currentState.data.length > 0) return;

  // ... fetch logic
}
```

### 2. Pagination

Per-tab pagination với fetch guards:

```typescript
fetchData: async (page = 1) => {
  const currentState = get();

  if (page === 1 && currentState.isLoading) return;
  if (page > 1 && currentState.isLoadingMore) return;

  if (page === 1) {
    set({ isLoading: true });
  } else {
    set((state) => ({
      isLoadingMore: { ...state.isLoadingMore, [tab]: true }
    }));
  }

  // ... fetch with append logic
}
```

### 3. Persist Strategy

Chọn lọc fields để persist:

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'storage-key',
    partialize: (state) => ({
      // Chỉ persist quan trọng, không persist large arrays
      importantField: state.importantField,
    }),
  }
)
```

### 4. Error Handling

Pattern nhất quán:

```typescript
try {
  set({ isLoading: true, error: null });
  // API call
  set({ error: null });
} catch (error: any) {
  set({ error: error.message || 'Lỗi' });
} finally {
  set({ isLoading: false });
}
```

### 5. Cross-store Communication

Stores có thể reference nhau:

```typescript
import { useAuthStore } from '@/stores/auth.store';

const getCurrentUserId = (): string | undefined => {
  return useAuthStore.getState().user?.id;
};
```

## 📚 Related Documentation

- [Project Requirements](./PROJECT_REQUIREMENTS.md)
- [Source Structure](./SOURCE_STRUCTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Zalo Mini App Skills](./ZALO_MINI_APP_SKILLS.md)
