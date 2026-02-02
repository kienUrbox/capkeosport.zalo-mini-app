# Project Overview

CapKeoSport is a **Zalo Mini App** for amateur football teams in Vietnam to find and arrange friendly matches using a swipe-based matchmaking system.

**Key Architecture:**
- **Frontend:** React + TypeScript
- **State Management:** Zustand (10 stores)
- **Platform:** Zalo Mini App (WebView inside Zalo)
- **Authentication:** Zalo OAuth (2 methods)

**Critical Finding:** All permission checks are **frontend-only**. Security depends entirely on backend enforcement which cannot be verified from this codebase.

---

# User Roles & Permissions

## Role System

The application implements **two separate role systems**:

### 1. Team Permission Role (`userRole`)
**Source:** `src/stores/team.store.ts:24`
**Values:** `'admin' | 'member'`
**Purpose:** Controls access to team management features

| Role | Can Swipe | Send Proposal | Accept/Decline | Confirm Match | Submit Result | Manage Members |
|------|-----------|---------------|----------------|---------------|---------------|----------------|
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| member | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Location of Permission Checks:**
- `src/screens/match/find.tsx:108-111` - Swipe blocking
- `src/screens/match/schedule.tsx:604-612` - Match actions
- `src/components/ui/MatchCards.tsx:66-76` - UI message for members
- `src/screens/teams/detail/index.tsx:57-59` - Edit button visibility

### 2. Playing Role (`role`)
**Source:** `src/types/api.types.ts:149-153`
**Values:** `'CAPTAIN' | 'PLAYER' | 'SUBSTITUTE'`
**Purpose:** Display only - shown in team member list

**⚠️ SECURITY RISK:** No backend permission validation is visible in the frontend code. All permission checks use the `userRole` field from API responses, but there's no evidence of additional permission tokens or headers in API calls.

---

# Core Business Domains

## 1. User & Authentication

### Authentication Methods
**Location:** `src/stores/auth.store.ts:121-186`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| Zalo OAuth | `POST /auth/zalo-login` | Basic Zalo login |
| Three-Step Verify | `POST /auth/zalo-three-step-verify` | Enhanced with phone verification |

### User Profile Structure
**Location:** `src/types/api.types.ts:15-37`

```typescript
interface User {
  id: string;
  zaloUserId: string;
  name: string;
  avatar?: string;
  banner?: string;
  phone: string;
  position?: string;
  jerseyNumber?: number;
  bio?: string;
  playerStats?: {
    attack: number;    // 1-100 (UI displays 1-10)
    defense: number;   // 1-100 (UI displays 1-10)
    technique: number; // 1-100 (UI displays 1-10)
  };
}
```

**⚠️ DATA INCONSISTENCY:** Stats stored as 1-100 in API, but displayed as 1-10 in UI. Scaling happens in `src/screens/profile/edit.tsx:56-62, 198-201`.

### User-to-Team Relationship
**Location:** `src/stores/team.store.ts:206-221`

- A user can belong to **multiple teams**
- Each team membership has a `userRole` (admin/member)
- User's role is returned from `/teams/my-teams` API endpoint
- `isCaptain` field is derived from `createdBy === currentUserId`

---

## 2. Team Management

### Team CRUD Operations
**Location:** `src/services/api/team.service.ts:172-272`

| Operation | Endpoint | Method | Permission Required |
|-----------|----------|--------|---------------------|
| Create Team | `/teams` | POST | Any authenticated user |
| Get My Teams | `/teams/my-teams` | GET | Authenticated user |
| Get Team Detail | `/teams/:id` | GET | Authenticated user |
| Update Team | `/teams/:id` | PATCH | Admin only (frontend check) |
| Delete Team | `/teams/:id` | DELETE | Admin only (frontend check) |
| Archive Team | `/teams/:id/archive` | PATCH | Admin only (frontend check) |

### Team Data Structure
**Location:** `src/types/api.types.ts:93-116`

```typescript
interface Team {
  id: string;
  name: string;                    // 3-100 chars
  logo?: string;
  banner?: string;
  gender: Gender;                  // MALE/FEMALE/MIXED or Nam/Nữ/Mixed
  level: string;                   // Free text, no enum constraint
  location: Location;
  stats?: TeamStats;               // attack, defense, technique (1-100)
  pitch?: string[];                // ["Sân 5", "Sân 7", "Sân 11"]
  userRole?: 'admin' | 'member';  // From /teams/my-teams
  recentMatches?: Match[];          // When includeRecentMatches=true
}
```

### Team Constants
**Location:** `src/constants/design.ts:356-407`

| Constant | Values | Notes |
|----------|--------|-------|
| PITCH_TYPES | `"Sân 5"`, `"Sân 7"`, `"Sân 11"` | Vietnamese strings |
| TEAM_LEVELS | `"Mới chơi"`, `"Trung bình"`, `"Nghiệp dư"`, `"Bán chuyên"`, `"Chuyên nghiệp"` | 5 levels |
| TEAM_GENDER | `"Nam"`, `"Nữ"`, `"Mixed"` | Vietnamese format |

**⚠️ TYPE MISMATCH:** API types define `Gender` enum with `MALE/FEMALE/MIXED` but the actual implementation uses Vietnamese strings `Nam/Nữ/Mixed`. Helper functions exist to convert between formats.

### Member Management
**Location:** `src/services/api/team.service.ts:221-264`

| Operation | Endpoint | Who Can Perform |
|-----------|----------|-----------------|
| Get Members | `GET /teams/:id/members` | Anyone |
| Add Member | `POST /teams/:id/members` | Admin |
| Remove Member | `DELETE /teams/:id/members/:memberId` | Admin |
| Update Playing Role | `PATCH /teams/:id/members/:memberId` | Admin |
| Update Admin Role | `PUT /teams/:id/members/:memberId/role` | Admin |

---

## 3. Matchmaking (Swipe System)

### Swipe Flow
**Location:** `src/hooks/useDiscovery.ts:218-257`

```typescript
// Swipe Actions
direction === 'right' → action = 'like'
direction === 'left'  → action = 'pass'

// Match Creation
Both teams like each other → Backend returns { isMatch: true, newMatch: Match }
```

### Discovery Filters
**Location:** `src/components/ui/FilterBottomSheet.tsx:124-224`

| Filter | Type | Default | Range |
|--------|------|---------|-------|
| Radius | Slider | 15km | 5-50km |
| Level | Multi-select | First 3 levels | All 5 levels |
| Gender | Multi-select | All | Nam, Nữ, Mixed |
| Sort By | Single | distance | distance, quality, activity |

**⚠️ FILTER IMPLEMENTATION:** Filters are sent to backend via `/discovery` endpoint. No client-side filtering is done.

### Swipe Eligibility
**Location:** `src/services/api/swipe.service.ts:103-110`

- Endpoint: `POST /swipes/check/:swiperTeamId/:targetTeamId`
- Backend determines if teams can swipe (compatible levels, gender, pitch types, distance)
- Frontend only displays results

### Swipe Actions
**Location:** `src/services/api/swipe.service.ts:33-123`

| Action | Endpoint | Undo Window |
|--------|----------|-------------|
| Create Swipe | `POST /swipes` | 5 minutes |
| Get History | `GET /swipes/team/:teamId` | - |
| Get Received | `GET /swipes/team/:teamId/received` | - |
| Undo Swipe | `POST /swipes/:swipeId/undo` | 5 minutes |

---

## 4. Match State Machine

### Match Status States
**Location:** `src/services/api/match.service.ts:4` and `src/stores/match.store.ts:19`

**API Status (6 states):**
```typescript
type MatchStatus = 'MATCHED' | 'REQUESTED' | 'ACCEPTED' | 'CONFIRMED' | 'FINISHED' | 'CANCELLED';
```

**UI Status Mapping:**
**Location:** `src/stores/match.store.ts:78-93`

| API Status | UI Status | Tab | Display |
|------------|-----------|-----|---------|
| MATCHED | pending | Chờ kèo | "Đã match" |
| REQUESTED | pending | Chờ kèo | "Đã gửi" / "Lời mời mới" |
| ACCEPTED | pending | Chờ kèo | "Đã đồng ý" |
| CONFIRMED | upcoming/live/finished | Lịch đấu | Dynamic based on time |
| FINISHED | finished | Lịch sử | - |
| CANCELLED | finished | Lịch sử | - |

### Match Type Sub-states
**Location:** `src/stores/match.store.ts:144-172`

For `pending` matches, there are additional `type` values:
- `matched` - System matched, no proposal yet
- `received` - Received proposal from opponent
- `sent` - Sent proposal, waiting for response
- `accepted` - Proposal accepted, needs confirmation

### State Transitions
**Location:** `src/services/api/match.service.ts:260-334`

| From | To | Action | Endpoint | Who Can Perform |
|------|-----|--------|----------|-----------------|
| MATCHED | REQUESTED | Send request | `POST /matches/:id/request` | Admin |
| REQUESTED | ACCEPTED | Accept request | `POST /matches/:id/accept` | Admin |
| REQUESTED | MATCHED | Decline request | `POST /matches/:id/decline` | Admin |
| REQUESTED | REQUESTED | Update request | `PATCH /matches/:id/request` | Sender admin only |
| ACCEPTED | CONFIRMED | Confirm match | `POST /matches/:id/confirm` | Either admin |
| CONFIRMED | FINISHED | Finish match | `POST /matches/:id/finish` | Admin |
| Any | CANCELLED | Cancel match | `POST /matches/:id/cancel` | Admin |

### Match Stage Logic (CONFIRMED matches)
**Location:** `src/stores/match.store.ts:106-137`

```typescript
const getMatchStage = (date: string, time: string): 'upcoming' | 'live' | 'finished' => {
  const matchDuration = 2 hours; // Hardcoded

  if (currentTime < matchTime) return 'upcoming';
  if (currentTime >= matchTime && currentTime < matchTime + 2h) return 'live';
  if (currentTime >= matchTime + 2h) return 'finished';
};
```

---

## 5. Match Proposal System

### Proposal Fields
**Location:** `src/services/api/match.service.ts:91-112`

**SendMatchRequestDto:**
```typescript
{
  proposedDate: string;   // YYYY-MM-DD
  proposedTime: string;   // HH:mm
  proposedPitch: string;  // Pitch type
  notes?: string;         // Optional message
}
```

**ConfirmMatchDto:**
```typescript
{
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm
  stadiumName: string;
  mapUrl: string;      // Google Maps link
  lat?: number;
  lng?: number;
}
```

### Proposal Actions
**Location:** `src/stores/match.store.ts:720-756`

| Action | Store Method | Trigger |
|--------|--------------|---------|
| Send | `sendMatchRequest()` | MATCHED → REQUESTED |
| Update | `updateMatchRequest()` | REQUESTED (sender only) |
| Accept | `acceptMatch()` | REQUESTED → ACCEPTED |
| Decline | `declineMatch()` | REQUESTED → MATCHED |
| Confirm | `confirmMatch()` | ACCEPTED → CONFIRMED |

---

## 6. Match Result System

### Result Submission
**Location:** `src/screens/match/update-score.tsx` and `src/stores/match.store.ts:803-838`

**SubmitResultDto:**
```typescript
{
  teamAScore: number;
  teamBScore: number;
  notes?: string;
  fileIds?: string[];  // Photo evidence (max 5)
}
```

### Result Confirmation Flow
**Location:** `src/stores/match.store.ts:840-878`

1. Either team submits result
2. Other team can confirm or edit
3. When both teams confirm → `resultLocked: true`
4. Locked results cannot be edited

**Result Confirmation State:**
```typescript
resultConfirmations: {
  teamA: { confirmed: boolean; confirmedBy?: string; confirmedAt?: string };
  teamB: { confirmed: boolean; confirmedBy?: string; confirmedAt?: string };
};
```

---

## 7. Venue System (MVP)

### Venue Data Structure
**Location:** Confirmed match stores full location details:

```typescript
location: {
  name: string;       // "San Bong Thanh Long"
  address: string;    // "123 Huynh Tan Phat, HCMC"
  mapLink: string;    // Google Maps URL
};
```

**⚠️ NO LAT/LNG VALIDATION:** Location coordinates are optional and not validated client-side.

### Google Maps Integration
**Location:** `src/components/ui/MatchCards.tsx:453-464`

```typescript
// Opens Google Maps with deep link fallback
const deepLinkUrl = 'comgooglemaps://';
window.location.href = deepLinkUrl;  // Try iOS deep link
setTimeout(() => {
  if (failed) window.location.href = mapsUrl;  // Fallback to web
}, 500);
```

---

## 8. Player Card (Viral Feature)

**Status:** ⚠️ **NOT IMPLEMENTED**

The player card feature mentioned in requirements does not exist in the codebase. No card generation or sharing functionality was found.

---

# Key User Flows

## Home Screen Flow
**Location:** `src/screens/home/index.tsx`

**State Machine:**

| State | Condition | Primary Action |
|-------|-----------|----------------|
| Has invitations | `pendingInvites.length > 0` | Show invitation cards |
| No team | `myTeams.length === 0` | "Tạo đội bóng" button |
| Has teams | `myTeams.length > 0` | "Cáp kèo ngay" button |
| Has matches | `upcomingMatches.length > 0` | Show upcoming matches |

**Navigation:**
- Find Match → `/match/find` (with team selector)
- Create Team → `/teams/create`
- Team Detail → `/teams/:id`
- Match Detail → `/match/:id`

---

## Match Flow

### 1. Discovery & Swipe
**Location:** `src/screens/match/find.tsx`

**States:**
1. `no-teams` - User has 0 teams
2. `has-teams-not-admin` - User not admin of any team
3. `single-admin-team` - Auto-select and swipe
4. `multiple-admin-teams` - Show team selector

**Swipe Actions:**
- Right swipe → Like
- Left swipe → Pass
- Match → Show celebration modal

### 2. Match Schedule
**Location:** `src/screens/match/schedule.tsx`

**Tabs:**
1. **Chờ kèo** - MATCHED, REQUESTED, ACCEPTED
2. **Lịch đấu** - CONFIRMED (upcoming, live, finished based on time)
3. **Lịch sử** - FINISHED, CANCELLED

**Pagination:** Infinite scroll with `IntersectionObserver`

### 3. Match Actions Flow
**Location:** `src/components/ui/MatchCards.tsx`

```
MATCHED → Send Proposal → REQUESTED
REQUESTED (receiver) → Accept → ACCEPTED
REQUESTED (sender) → Update → REQUESTED
ACCEPTED → Confirm → CONFIRMED
CONFIRMED → (time passes) → live
live → Finish → FINISHED
FINISHED → Submit Result → (await confirmation)
```

---

## Team Management Flow

### Create Team
**Location:** `src/screens/teams/create.tsx`

**Flow:**
1. Upload logo/banner (immediate upload to FileService)
2. Fill in form fields
3. Validation: name 3-100 chars
4. Submit to API
5. Navigate to team detail

### Edit Team
**Location:** `src/screens/teams/edit.tsx`

**Features:**
- "Tính từ thành viên" button to auto-calculate stats from members
- Same form as create
- Permission check: admin only

### Member Management
**Location:** `src/screens/teams/members/index.tsx`

**Admin Actions:**
- View member detail
- Promote to admin
- Demote to member
- Remove from team (cannot remove self)

**Add Member Methods:**
1. Add by phone → `/teams/:teamId/add`
2. Share link → `/teams/:teamId/share` (QR code invite)

---

# Business Rules & Constraints

## Validation Rules Summary

| Field | Rule | Location |
|-------|------|----------|
| Team name | 3-100 characters | `src/screens/teams/create.tsx:159-166` |
| Email | ❌ No validation | - |
| Phone | ❌ No validation | - |
| Jersey number | ❌ No validation | - |
| Player stats | ❌ No validation | - |
| Location lat/lng | ❌ No validation | - |
| File size | Max 5MB | `src/screens/profile/edit.tsx:80-93` |
| File type | Images only | `src/screens/profile/edit.tsx:80-93` |

**⚠️ CRITICAL:** Most validation is UI-only. Backend validation status unknown.

---

## Gender Level Compatibility

**Documented Rule:**
```
A ↔ A/B
B ↔ A/B/C
C ↔ B/C
```

**Implementation:** ⚠️ **NOT FOUND IN CODE**

The compatibility matrix is not implemented client-side. All filtering is done by the backend `/discovery` endpoint. Frontend sends selected filters and displays results.

---

## Chat Feature

**Status:** ❌ **NOT IMPLEMENTED**

**Location:** `src/components/ui/MatchCards.tsx:156-177`

```typescript
onClick={() => {
  /* TODO: Open chat */
}}
```

Chat button is shown in `accepted` state but functionality is not implemented.

---

# API & Data Contracts

## API Endpoints Summary

### Authentication
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/zalo-login` | POST | Zalo OAuth login |
| `/auth/zalo-three-step-verify` | POST | Enhanced verification |
| `/auth/refresh` | POST | Refresh tokens |
| `/auth/profile` | GET/PUT | Get/update profile |

### Teams
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/teams` | POST | Create team |
| `/teams/my-teams` | GET | Get user's teams with roles |
| `/teams/:id` | GET/PATCH/DELETE | Team CRUD |
| `/teams/:id/members` | GET/POST | Member list/add |
| `/teams/:id/members/:memberId` | DELETE/PATCH | Remove/update member |
| `/teams/:id/members/:memberId/role` | PUT | Update admin role |

### Matches
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/matches` | GET | Get matches with filters |
| `/matches/:id` | GET | Get match detail |
| `/matches/:id/request` | POST/PATCH | Send/update request |
| `/matches/:id/accept` | POST | Accept request |
| `/matches/:id/decline` | POST | Decline request |
| `/matches/:id/confirm` | POST | Confirm match |
| `/matches/:id/finish` | POST | Finish match |
| `/matches/:id/cancel` | POST | Cancel match |
| `/matches/:id/rematch` | POST | Create rematch |
| `/matches/:id/result` | POST/GET | Submit/get result |
| `/matches/:id/result/confirm` | POST | Confirm result |

### Swipe & Discovery
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/swipes` | POST | Create swipe |
| `/swipes/team/:teamId` | GET | Get swipe history |
| `/swipes/:swipeId/undo` | POST | Undo swipe |
| `/discovery` | POST | Discover teams |

---

## Type System Issues

### Duplicate Type Definitions

**Match Status:**
- `src/types/api.types.ts:207-214` defines 6 values
- `src/types/index.ts:4-11` defines different values

**Gender:**
- Enum: `MALE | FEMALE | MIXED`
- Vietnamese: `Nam | Nữ | Mixed`
- API accepts both but no consistent usage

### Stats Scaling
**UI ↔ API Mismatch:**
- API expects 1-100
- UI displays 1-10
- Scaling done in multiple places (not centralized)

---

# Mismatches & Gaps

## Feature Comparison

| Feature | Intended | Implemented | Status |
|---------|----------|-------------|--------|
| Zalo login | ✅ | ✅ | Implemented |
| User profile (3 stats) | ✅ | ✅ | Implemented |
| User belongs to multiple teams | ✅ | ✅ | Implemented |
| Team create/edit/delete | ✅ | ✅ | Implemented |
| Admin/member roles | ✅ | ✅ | Implemented |
| Swipe matchmaking | ✅ | ✅ | Implemented |
| Level compatibility matrix | ✅ | ❌ | Backend only |
| Gender filter | ✅ | ✅ | Implemented |
| Pitch type filter | ✅ | ✅ | Implemented |
| Distance filter | ✅ | ✅ | Implemented |
| Match state machine | ✅ | ✅ | Implemented |
| Match proposal (snapshot) | ✅ | ✅ | Implemented |
| Venue with Google Maps | ✅ | ✅ | Implemented (no lat/lng) |
| Chat after ACCEPTED | ✅ | ❌ | UI only, TODO |
| Player card (viral) | ✅ | ❌ | Not found |
| Home screen next action | ✅ | ⚠️ | Partial (no full state machine) |

## Critical Gaps

### 1. Permission Enforcement
**Risk:** HIGH
- All permission checks are frontend-only
- No evidence of backend permission validation in API client
- `userRole` from API response is the only gatekeeper

### 2. Input Validation
**Risk:** HIGH
- No schema validation library (Zod, Yup, Joi)
- Most validation is UI-only
- Email, phone, coordinates have no regex validation

### 3. Chat Feature
**Risk:** MEDIUM
- Button exists but marked as TODO
- No chat implementation found
- Critical feature for match coordination

### 4. Type System Inconsistencies
**Risk:** MEDIUM
- Duplicate type definitions
- Gender format confusion
- Stats scaling not centralized

---

# Risk Areas & Testing Priorities

## Critical Security Risks

### 1. Frontend-Only Permission Checks
**Files:** All screens with `isAdmin` prop
**Risk:** Users can bypass by modifying frontend state
**Test:** Try API calls with different user roles
**Fix Required:** Backend permission enforcement

### 2. No Input Validation
**Files:** All form submissions
**Risk:** XSS, SQL injection potential
**Test:** Submit malicious payloads
**Fix Required:** Schema validation (Zod) + backend sanitization

### 3. Stats Scaling Inconsistency
**Files:** Profile and team screens
**Risk:** Data corruption
**Test:** Edit stats multiple times
**Fix Required:** Centralized scaling layer

## High Priority Testing

### Permission Matrix
| Role | Action | Test Case |
|------|--------|-----------|
| Member | Swipe | Should be blocked |
| Member | Send proposal | Should be blocked |
| Member | Accept/decline | Should be blocked |
| Member | Submit result | Should be blocked |
| Admin | All actions | Should work |

### State Transitions
| From | To | Valid? |
|------|-----|-------|
| MATCHED | REQUESTED | ✅ |
| REQUESTED | CONFIRMED | ❌ (must go through ACCEPTED) |
| ACCEPTED | FINISHED | ❌ (must go through CONFIRMED) |

### Edge Cases
- Swipe when not admin
- Edit request when not sender
- Confirm before both accept
- Submit result without finishing match

---

## File Index

### Key Type Files
- `src/types/api.types.ts` - Primary API types
- `src/types/index.ts` - UI types (duplicates)
- `src/constants/design.ts` - Constants and helpers

### Key Store Files
- `src/stores/auth.store.ts` - Authentication
- `src/stores/team.store.ts` - Team management
- `src/stores/match.store.ts` - Match state machine
- `src/stores/discovery.store.ts` - Swipe filters
- `src/stores/notification.store.ts` - Notifications

### Key Service Files
- `src/services/api/auth.service.ts` - Auth endpoints
- `src/services/api/team.service.ts` - Team endpoints
- `src/services/api/match.service.ts` - Match endpoints
- `src/services/api/swipe.service.ts` - Swipe endpoints
- `src/services/api/discovery.service.ts` - Discovery endpoints
- `src/services/api/index.ts` - API client with interceptors

### Key Screen Files
- `src/screens/home/index.tsx` - Home screen
- `src/screens/match/find.tsx` - Swipe interface
- `src/screens/match/schedule.tsx` - Match tabs
- `src/screens/teams/create.tsx` - Create team
- `src/screens/teams/detail/index.tsx` - Team detail
- `src/screens/profile/edit.tsx` - Edit profile

### Key Component Files
- `src/components/ui/MatchCards.tsx` - Match cards with actions
- `src/components/ui/MatchRequestModal.tsx` - Proposal form
- `src/components/ui/FilterBottomSheet.tsx` - Discovery filters

---

---

# Trust Boundaries & Security Model

## Trust Boundaries

### Frontend (Zalo Mini App WebView)
- **Trust Level:** Untrusted
- **Control:** User-controlled environment
- **UI Permission Checks:** Advisory only
- **State:** Can be modified by user (browser DevTools, etc.)

### Backend
- **Trust Level:** Trusted
- **Responsibilities:** Source of truth for all business rules
  - Team roles and permissions
  - Match state transitions
  - Result locking mechanism
  - Member management operations

## Golden Rule

> **No business rule is valid unless enforced server-side.**

The frontend UI may hide or disable controls based on user role, but all security-critical operations **must** be validated by the backend before execution.

---

# Venue Data Legal Model

## Data Classification

| Data Element | Source | Storage | Legal Notes |
|--------------|--------|---------|-------------|
| Venue name | User-provided | As entered | User input, no scraping |
| Map link (URL) | User-provided | As entered | User input, no scraping |
| Coordinates (lat/lng) | Optional, user-confirmed | As provided | User must confirm |

## Legal Constraints

1. **No Structured Data Extraction:** The system does not extract or store structured data from Google Maps API responses
2. **User-Provided Data:** Venue names and map links are entered by users, not scraped
3. **Optional Coordinates:** Lat/lng fields are optional and must be explicitly confirmed by user
4. **Attribution Required:** When displaying maps, proper attribution must be shown per Google Maps Terms of Service

**Location:** `src/components/ui/MatchCards.tsx:453-464` (Google Maps integration)
**Location:** `src/services/api/match.service.ts:105-112` (ConfirmMatchDto with optional lat/lng)

---

# Architecture Risk Areas

## 1. Concurrent State Changes

**Risk Area:** Both teams acting on the same match simultaneously

**Scenarios:**
- Both teams send proposals at the same time
- Both teams try to confirm simultaneously
- Both teams submit results concurrently

**Backend Requirements:**
- Transactional locking on match state updates
- Optimistic concurrency control or versioning
- Clear error messages for conflicting operations

**Status:** ⚠️ **Cannot verify from frontend code** - depends on backend implementation

---

## 2. Result Confirmation Race Condition

**Risk Area:** Conflicting result submissions without transactional locking

**Scenarios:**
- Team A submits result (3-1)
- Team B submits result (2-1) before seeing Team A's submission
- Which result should be displayed?

**Backend Requirements:**
- First submission wins, or
- Merge/conflict detection, or
- Optimistic locking with version field

**Status:** ⚠️ **Cannot verify from frontend code** - depends on backend implementation

---

## 3. Swipe Undo Window Time Sync

**Risk Area:** 5-minute undo window depends on server time vs client time

**Current Implementation:**
**Location:** `src/services/api/swipe.service.ts:119-123`

```typescript
// Undo Swipe
// Endpoint: POST /swipes/:swipeId/undo
// Undo Window: 5 minutes
```

**Risk:** If client clock is significantly off from server time:
- User may think they can undo but server rejects
- User may think undo window expired but server accepts

**Backend Requirements:**
- Use server timestamp for all time-based validations
- Return remaining undo time in API response

**Status:** ⚠️ **Cannot verify from frontend code** - depends on backend implementation

---

## 4. Notification Delivery

**Risk Area:** No retry or delivery guarantee mechanism documented

**Current Implementation:**
**Location:** `src/stores/notification.store.ts` and `src/services/api/notification.service.ts`

- Fetch-based model (polling)
- No push notification mechanism visible
- No delivery confirmation or retry logic

**Failure Scenarios:**
- User offline when notification sent
- Network timeout during fetch
- Notification service temporarily unavailable

**Backend Requirements:**
- Persistent notification queue
- Retry mechanism with exponential backoff
- Delivery status tracking
- Push notifications for critical events (optional)

**Status:** ⚠️ **Cannot verify from frontend code** - depends on backend implementation

---

# Business Invariants

## Core Invariants

These rules **must never be violated**. The backend is responsible for enforcing all of them.

### Team Invariants

| Invariant | Description | Enforcement Point |
|-----------|-------------|-------------------|
| **Admin Minimum** | A team must always have at least one admin | Backend: Prevent demoting/removing last admin |
| **Membership Boundaries** | A user cannot act on a team they are not a member of | Backend: Verify membership before all team operations |
| **Creator is Admin** | Team creator automatically becomes admin | Backend: Set during team creation |

**Frontend Evidence:**
- `src/screens/teams/members/index.tsx` - Cannot remove self from team
- `src/stores/team.store.ts:47-55` - `isAdmin()` and `hasAdminPermission()` helpers

### Match Invariants

| Invariant | Description | Enforcement Point |
|-----------|-------------|-------------------|
| **Two Distinct Teams** | A match must always have exactly two distinct teams | Backend: Validate teamA.id !== teamB.id |
| **Sequential State** | A match cannot be CONFIRMED unless it has been ACCEPTED | Backend: State transition validation |
| **Result Locking** | A match result cannot be locked unless both teams confirm | Backend: Check both confirmations before locking |

**Frontend Evidence:**
- `src/stores/match.store.ts:78-93` - State mapping follows sequential pattern
- `src/stores/match.store.ts:840-878` - Result confirmation logic
- `src/services/api/match.service.ts:260-334` - State transition endpoints

### Swipe Invariants

| Invariant | Description | Enforcement Point |
|-----------|-------------|-------------------|
| **Unique Swipes** | A swipe between two teams must be unique per direction | Backend: Prevent duplicate swipes in same direction |
| **Mutual Match** | Match is created only when both teams swipe right | Backend: Check for reciprocal likes |

**Frontend Evidence:**
- `src/services/api/swipe.service.ts:33-35` - Create swipe endpoint
- `src/hooks/useDiscovery.ts:218-257` - Match creation on mutual like

### Member Invariants

| Invariant | Description | Enforcement Point |
|-----------|-------------|-------------------|
| **Self-Protection** | A user cannot remove themselves from a team | Backend: Block DELETE when memberId === currentUserId |
| **Role Change** | User can be promoted/demoted but cannot become admin of team they're not in | Backend: Verify membership before role change |

**Frontend Evidence:**
- UI hides self-removal option
- `src/screens/teams/members/index.tsx` - Member actions

---

**END OF DOCUMENTATION**

Generated: 2026-02-03
Updated: 2026-02-03 (Added Trust Boundaries, Legal Model, Architecture Risks, Business Invariants)
Total Files Analyzed: 50+
Lines of Code Reviewed: ~15,000+
