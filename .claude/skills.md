# Zalo Mini App Skills Documentation

This document describes the Agent Skills configuration for the **Capkeo Sport Zalo Mini App** - a mobile-first sports team management and match scheduling platform built on the Zalo Mini App ecosystem.

## Project Overview

**Capkeo Sport** is a comprehensive mini app for:
- Team creation and management
- Match scheduling and tracking
- Player/attendance management
- Real-time notifications
- QR code-based match check-ins
- User profiles and statistics

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18 + TypeScript | UI and type safety |
| **Platform** | ZMP SDK + ZMP UI | Zalo Mini App integration |
| **Build** | Vite 5.2 + zmp-vite-plugin | Build system |
| **State Management** | Zustand | Client-side state (12 stores) |
| **Server State** | TanStack React Query | *Installed but not yet implemented* |
| **API Client** | Axios | HTTP communication |
| **Styling** | TailwindCSS + SCSS | Component styling |
| **Routing** | React Router v7 | Navigation |
| **Utilities** | date-fns, react-qr-code | Date handling, QR generation |

### Bundle Size

- **JavaScript**: 971KB (unminified)
- **CSS**: 189KB
- **Total**: ~1.1MB
- **Target**: <500KB (Zalo platform recommendation)

---

## Platform Constraints

### Zalo Mini App Environment

This app runs within the Zalo super-app webview with specific constraints:

#### 1. Performance Constraints
- **Initial Load Budget**: 3 seconds on 3G networks
- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <3 seconds
- **Memory Limit**: ~150MB heap on typical devices
- **Bundle Size**: Platform recommends <500KB total

#### 2. Browser Limitations
- **No Service Worker Support**: Limited offline capabilities
- **Restricted IndexedDB**: Use localStorage with caution
- **Limited Geolocation**: Requires ZMP SDK wrappers
- **No Push Notifications**: Use Zalo's native notification system
- **Restricted Camera**: Must use ZMP SDK's `openBarcodeCamera` API

#### 3. Network Considerations
- **Unreliable Connections**: Mobile networks in Vietnam vary widely
- **Timeout Requirements**: API calls must complete within 10 seconds
- **Retry Strategy**: Implement exponential backoff for failed requests
- **Caching**: Aggressive caching required for core data

#### 4. Security Constraints
- **Token Storage**: localStorage is XSS vulnerable (pending fix)
- **CORS**: API must support Zalo webview origins
- **HTTPS Required**: All API calls must use HTTPS
- **Content Security**: Limited CSP support in webview

---

## Mobile Performance Priorities

### Critical Performance Metrics

```
Priority 1 - Core Web Vitals:
├── Largest Contentful Paint (LCP) < 2.5s
├── First Input Delay (FID) < 100ms
└── Cumulative Layout Shift (CLS) < 0.1

Priority 2 - Mobile Metrics:
├── First Contentful Paint (FCP) < 1.8s
├── Time to Interactive (TTI) < 3.8s
├── Total Blocking Time (TBT) < 200ms
└── Speed Index < 3.4s

Priority 3 - Platform Specific:
├── Zalo App Shell Load < 1s
├── Navigation Transitions < 300ms
└── List Rendering (1000 items) < 500ms
```

### Optimization Strategies

#### 1. Code Splitting (Not Yet Implemented)
```typescript
// Current: All screens loaded upfront
// Target: Route-based chunking

// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom'],
        'zmp': ['zmp-sdk', 'zmp-ui'],
        'state': ['zustand'],
      }
    }
  }
}
```

#### 2. Component Lazy Loading
```typescript
// Modal components should be lazy loaded
const MatchModal = lazy(() => import('@/components/ui/MatchModal'));
const ConfirmMatchModal = lazy(() => import('@/components/ui/ConfirmMatchModal'));
```

#### 3. Image Optimization
- Convert all images to WebP format
- Implement lazy loading for below-fold images
- Add responsive image sources (1x, 2x, 3x)
- Compress all team logos to <50KB

#### 4. List Virtualization
```typescript
// For long lists (team members, match history)
import { useVirtualizer } from '@tanstack/react-virtual';

// Implement in:
// - TeamDetail member list (1000+ members)
// - Match history tabs
// - Notification list
```

---

## Source Code Structure

```
src/
├── MiniApp.tsx                 # Root component with ErrorBoundary
├── app.ts                      # Entry point with ZMP SDK init
├── router.tsx                  # React Router v7 configuration
│
├── assets/                     # Static assets (images, fonts)
├── css/                        # Global styles
│   ├── app.scss                # Main SCSS file
│   └── tailwind.css            # Tailwind imports
│
├── components/                 # React components
│   ├── layout.tsx              # Main app layout wrapper
│   ├── ProtectedRoute.tsx      # Auth guard component
│   └── ui/                     # 36 reusable UI components
│       ├── MatchCards.tsx          # 24KB - Large, needs splitting
│       ├── MatchModal.tsx          # 17KB - Lazy load candidate
│       ├── MatchModal.css          # 8KB
│       ├── ConfirmMatchModal.tsx   # 9.4KB - Lazy load candidate
│       ├── FilterBottomSheet.tsx   # 8.6KB
│       ├── AttendanceBottomSheet.tsx # 15KB - Lazy load candidate
│       ├── Skeleton.tsx            # 12KB - Loading states
│       └── ... (30 more components)
│
├── contexts/                   # React contexts
│   └── ThemeContext.tsx        # Theme provider (light/dark)
│
├── hooks/                      # Custom React hooks
│   ├── useHomeData.ts          # Home data fetching (manual, should use React Query)
│   ├── useDiscovery.ts         # Discovery feature hook
│   ├── useDebounce.ts          # Debounce utility
│   └── ... (10 more hooks)
│
├── screens/                    # Feature screens
│   ├── dashboard/              # Main dashboard
│   ├── home/                   # Home screen
│   ├── inviting/               # Team invitation flow
│   ├── launching/              # Splash/loading screen
│   ├── login/                  # Authentication
│   ├── onboarding/             # First-time user flow
│   ├── profile/                # User profile (edit, view)
│   ├── swipe/                  # Match discovery/swipe
│   │
│   ├── match/                  # Match-related screens (10 screens)
│   │   ├── schedule.tsx        # Match schedule (3 tabs)
│   │   ├── find.tsx            # Find opponents
│   │   ├── rematch.tsx         # Re-match flow
│   │   ├── opponent-detail.tsx # Opponent info
│   │   └── ...
│   │
│   ├── teams/                  # Team-related screens (5 screens)
│   │   ├── create.tsx          # Create team
│   │   ├── edit.tsx            # Edit team
│   │   ├── detail/index.tsx    # Team detail (members, stats)
│   │   ├── member-profile.tsx  # Member profile
│   │   └── ...
│   │
│   └── notifications/          # Notification center
│
├── services/                   # API and business logic
│   ├── api/                    # API service layer
│   │   ├── index.ts            # Axios client + interceptors
│   │   ├── auth.service.ts     # Authentication endpoints
│   │   ├── team.service.ts     # Team CRUD operations
│   │   ├── match.service.ts    # Match operations
│   │   ├── notification.service.ts
│   │   ├── discovery.service.ts
│   │   ├── file.service.ts     # File upload
│   │   ├── phone-invite.service.ts
│   │   ├── swipe.service.ts
│   │   ├── stadium.service.ts
│   │   └── team-invite.service.ts
│   │
│   ├── launching.service.ts    # App initialization logic
│   └── zalo-three-step-auth.ts # Zalo OAuth (DEVELOPMENT MODE - needs fix)
│
├── stores/                     # Zustand state management (12 stores)
│   ├── auth.store.ts           # 470 lines - User auth, tokens (CRITICAL: localStorage vulnerability)
│   ├── team.store.ts           # 1017 lines - Largest store, needs splitting
│   ├── match.store.ts          # 957 lines - Match tabs, pagination
│   ├── notification.store.ts   # 268 lines
│   ├── discovery.store.ts      # 278 lines
│   ├── file.store.ts           # 441 lines
│   ├── phone-invite.store.ts   # 335 lines
│   ├── swipe.store.ts          # 197 lines
│   ├── ui.store.ts             # 133 lines - UI state (modals, sheets)
│   ├── toast.store.ts          # 68 lines
│   ├── home.store.ts           # 91 lines
│   └── match.store.ts          # Pagination state
│
├── types/                      # TypeScript type definitions
│   ├── api.types.ts            # API response types
│   ├── match.types.ts          # Match-related types
│   ├── team.types.ts           # Team-related types
│   └── ...
│
├── utils/                      # Utility functions
│   ├── navigation.ts           # Navigation helpers
│   ├── format.ts               # Date/currency formatting
│   ├── validation.ts           # Form validation
│   └── constants.ts            # App constants
│
└── constants/
    └── design.ts               # Design tokens (colors, spacing)
```

---

## Critical Files for Security Review

### 1. Authentication Flow

**File**: [`src/stores/auth.store.ts`](src/stores/auth.store.ts)
- **Issue**: Tokens stored in localStorage (XSS vulnerable)
- **Lines**: 1-470
- **Priority**: CRITICAL
- **Fix Required**: Migrate to secure storage or httpOnly cookies

**File**: [`src/services/api/index.ts`](src/services/api/index.ts)
- **Issue**: Direct localStorage manipulation in error handler (line 134)
- **Lines**: 130-137
- **Priority**: HIGH
- **Fix Required**: Use auth store methods

### 2. Development Mode

**File**: [`src/services/zalo-three-step-auth.ts`](src/services/zalo-three-step-auth.ts)
- **Issue**: `BYPASS_ZALO_AUTH = true` hardcoded
- **Lines**: 64
- **Priority**: CRITICAL
- **Fix Required**: Remove before production deployment

---

## Critical Files for Performance Review

### 1. Large Components (Refactoring Candidates)

| Component | Size | Action Required |
|-----------|------|-----------------|
| [MatchCards.tsx](src/components/ui/MatchCards.tsx) | 24KB | Split into sub-components |
| [MatchModal.tsx](src/components/ui/MatchModal.tsx) | 17KB | Lazy load + memoization |
| [AttendanceBottomSheet.tsx](src/components/ui/AttendanceBottomSheet.tsx) | 15KB | Lazy load |
| [Skeleton.tsx](src/components/ui/Skeleton.tsx) | 12KB | Consider library |
| [ConfirmMatchModal.tsx](src/components/ui/ConfirmMatchModal.tsx) | 9.4KB | Lazy load |

### 2. Large Stores (Splitting Candidates)

| Store | Lines | Issue | Recommendation |
|-------|-------|-------|----------------|
| [team.store.ts](src/stores/team.store.ts) | 1017 | Too many concerns | Split into: teams, teamMembers, teamInvites |
| [match.store.ts](src/stores/match.store.ts) | 957 | Multiple tabs | Split by tab domain |
| [auth.store.ts](src/stores/auth.store.ts) | 470 | Complex auth flows | Extract auth methods to service |

---

## State Management Strategy

### Current Implementation

**Zustand** is used for all client-side state with persist middleware:

```typescript
// Pattern used across all stores
export const useXxxStore = create<XxxState>()(
  persist(
    (set, get) => ({
      // State
      data: [],
      isLoading: false,

      // Actions
      fetchData: async () => { /* API call */ },
    }),
    {
      name: 'xxx-storage',
      partialize: (state) => ({
        // Only persist specific fields
        data: state.data,
      }),
    }
  )
);
```

### Issues Identified

1. **No React Query Integration**: Custom hooks handle server state
2. **Memory-Only Caches**: Team details not persisted (good pattern)
3. **Circular Dependencies**: Dynamic imports in stores
4. **Mixed Patterns**: Some useState, some Zustand

### Target Architecture

```
Server State (React Query):
├── Queries: useTeams, useMatches, useProfile
├── Mutations: createTeam, submitMatchResult
├── Cache: Automatic stale-while-revalidate
└── Invalidation: Smart refetch on mutations

Client State (Zustand):
├── UI State: modals, bottom sheets, filters
├── Form State: multi-step form data
├── Temporary State: selection, draft data
└── Navigation State: tab selection, scroll position
```

---

## API Communication

### Axios Configuration

**File**: [`src/services/api/index.ts`](src/services/api/index.ts)

```typescript
// Base Configuration
{
  baseURL: 'https://api.capkeosport.com/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
}

// Interceptors
├── Request: Adds auth token from Zustand store
└── Response: Handles 401 with token refresh queue
```

### Token Refresh Strategy

```typescript
// Current Implementation
├── isRefreshing flag prevents concurrent refreshes
├── failedQueue holds requests during refresh
└── processQueue resolves queued requests after refresh
```

---

## Installed Agent Skills

### Core Skills (Already Active)

| Skill | Purpose | Trigger |
|-------|---------|---------|
| **vercel-react-best-practices** | React performance patterns | Code reviews, refactoring |
| **accessibility-compliance** | WCAG 2.2 mobile a11y | UI component reviews |
| **typescript-react-reviewer** | React 19 + TypeScript best practices | PR reviews, type safety |
| **code-review-excellence** | Review practices for teams | PR workflow |
| **react-query-best-practices** | React Query migration | Data fetching refactors |
| **zustand-state-management** | Zustand optimization | Store refactoring |
| **mobile-developer** | Mobile-specific patterns | Touch, battery, performance |
| **typescript-expert** | Advanced TypeScript | Type system improvements |
| **webapp-testing** | Test coverage strategies | Test writing |
| **api-security-best-practices** | API security | Auth flow, token storage |
| **mobile-offline-support** | Offline strategies | Service worker, queueing |
| **zalo-mini-app** | Zalo platform patterns | ZMP SDK integration |

---

## How Skills Work Together

### Example: Building a New Feature

When implementing a new feature (e.g., "Match Chat"):

1. **typescript-expert**: Define discriminated union types for messages
2. **mobile-developer**: Design touch-optimized chat interface
3. **react-query-best-practices**: Set up real-time message polling
4. **zustand-state-management**: Manage chat UI state (open/close, unread count)
5. **accessibility-compliance**: Ensure screen reader compatibility
6. **api-security-best-practices**: Add message signing/encryption
7. **vercel-react-best-practices**: Lazy load chat component, memoize message list
8. **webapp-testing**: Write tests for critical flows

### Example: Code Review Flow

When reviewing a pull request:

1. **typescript-react-reviewer**: Check for anti-patterns
2. **api-security-best-practices**: Validate no sensitive data in logs/state
3. **mobile-developer**: Ensure mobile performance (no blocking main thread)
4. **accessibility-compliance**: Verify touch targets and ARIA labels
5. **vercel-react-best-practices**: Check for missing memoization
6. **code-review-excellence**: Provide constructive feedback

---

## Development Workflow

### Before Starting Work

1. Identify which domain(s) the work affects
2. Check relevant skills for best practices
3. Run existing tests to establish baseline

### During Development

1. Write types first (typescript-expert)
2. Implement mobile-optimized UI (mobile-developer)
3. Set up data fetching (react-query-best-practices)
4. Add error handling and loading states

### Before Committing

1. Run relevant skills for code review
2. Ensure tests pass (webapp-testing)
3. Check bundle size impact (vercel-react-best-practices)
4. Verify security (api-security-best-practices)

---

## Quick Reference

### Performance Checks

```bash
# Analyze bundle size
npm run build
# Check www/assets/ for file sizes

# Target sizes:
# - Total bundle: <500KB
# - Single route chunk: <200KB
# - Single component: <50KB
```

### Security Checks

- [ ] No tokens in localStorage
- [ ] No hardcoded secrets
- [ ] Input sanitization on all forms
- [ ] HTTPS only for API calls
- [ ] CSRF protection enabled

### Mobile Checks

- [ ] Touch targets ≥44x44px
- [ ] Passive event listeners for scroll/touch
- [ ] No 300ms click delays
- [ ] Images optimized (WebP, lazy loaded)
- [ ] Lists virtualized for >100 items

---

## Links

- **Skills Documentation**: https://skills.sh/
- **Zalo Mini App Docs**: https://developers.zalo.me/docs/mini-app/overview/introduction
- **ZMP UI Components**: https://ui.zalopay.ai/
- **React Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://zustand-demo.pmnd.rs/

---

*Generated for Capkeo Sport Zalo Mini App*
*Last Updated: 2025*
