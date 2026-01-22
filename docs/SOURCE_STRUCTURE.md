# Source Structure - Cap Kèo Sport

> Cấu trúc thư mục và file trong dự án

## 📁 Root Directory Structure

```
capkeosport.zalo-mini-app/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── app-config.json               # Zalo Mini App configuration
├── eslint.config.js              # ESLint configuration
├── hr.config.json                # Additional configuration
├── index.html                    # Entry HTML file
├── package.json                  # Dependencies & scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS customization
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── zmp-cli.json                  # ZMP CLI configuration
├── node_modules/                 # Dependencies
├── public/                       # Static assets
│   └── vite.svg
├── src/                          # Source code (xem bên dưới)
├── docs/                         # Documentation
└── www/                          # Build output
```

## 📂 Source Directory (`src/`)

```
src/
├── app.ts                        # Application entry point
├── MiniApp.tsx                   # Root component with Error Boundary
├── router.tsx                    # React Router configuration
│
├── css/                          # Stylesheets
│   ├── app.scss                  # Global styles
│   └── tailwind.scss             # Tailwind imports
│
├── assets/                       # Static assets
│   └── images/
│       └── logo.svg
│
├── components/                   # React components
│   ├── layout.tsx                # Main layout wrapper
│   ├── MainLayout.tsx            # Main app layout
│   ├── ProtectedRoute.tsx        # Auth protection wrapper
│   └── ui/                       # UI components (28 files)
│       ├── BottomNav.tsx         # Bottom navigation
│       ├── Button.tsx            # Button component
│       ├── Card.tsx              # Card component
│       ├── EmptyState.tsx        # Empty state display
│       ├── ErrorState.tsx        # Error state display
│       ├── FilterBar.tsx         # Filter bar
│       ├── Header.tsx            # Page header
│       ├── Icon.tsx              # Icon wrapper
│       ├── InviteCard.tsx        # Invite card
│       ├── MatchBadge.tsx        # Match status badge
│       ├── MatchCards.tsx        # Match cards display
│       ├── MatchModal.tsx        # Match modal
│       ├── PlayerCard.tsx        # Player card
│       ├── Skeleton.tsx          # Loading skeleton
│       ├── StatBadge.tsx         # Stat badge
│       ├── TeamAvatar.tsx        # Team avatar
│       ├── ThemeSwitch.tsx       # Theme toggle
│       ├── ToastContainer.tsx    # Toast notifications
│       └── ... (more modals/sheets)
│
├── contexts/                     # React contexts
│   ├── TeamContext.tsx           # Team selection context
│   └── ThemeContext.tsx          # Theme management
│
├── constants/
│   └── design.ts                 # Design tokens (colors, spacing)
│
├── hooks/                        # Custom React hooks
│   ├── useDiscovery.ts           # Discovery feature hook
│   ├── useHomeData.ts            # Home data hook
│   ├── useScheduleData.ts        # Schedule data hook
│   ├── useSwipe.ts               # Swipe feature hook
│   └── index.ts                  # Hooks export
│
├── screens/                      # Screen components (pages)
│   ├── dashboard/                # Dashboard/Home tab
│   │   └── index.tsx
│   ├── home/                     # Home screen
│   │   └── index.tsx
│   ├── inviting/                 # Invites screen
│   │   └── index.tsx
│   ├── launching/                # Splash screen
│   │   └── index.tsx
│   ├── login/                    # Login screen
│   │   └── index.tsx
│   ├── match/                    # Match-related screens (10 files)
│   │   ├── attendance/
│   │   │   └── index.tsx
│   │   ├── detail/
│   │   │   └── index.tsx
│   │   ├── invite.tsx
│   │   ├── schedule.tsx
│   │   ├── find.tsx
│   │   ├── history.tsx
│   │   ├── rematch.tsx
│   │   ├── update-score.tsx
│   │   └── opponent-detail.tsx
│   ├── notifications/            # Notifications screen
│   │   └── index.tsx
│   ├── onboarding/               # Onboarding flow
│   │   └── index.tsx
│   ├── profile/                  # Profile screens (2 files)
│   │   ├── index.tsx
│   │   └── edit.tsx
│   ├── swipe/                    # Swipe feature screens (3 files)
│   │   ├── index.tsx
│   │   ├── history.tsx
│   │   ├── received.tsx
│   │   └── stats.tsx
│   └── teams/                    # Team management screens (8 files)
│       ├── create.tsx
│       ├── edit.tsx
│       ├── index.tsx
│       ├── detail/
│       │   └── index.tsx
│       ├── members/
│       │   ├── index.tsx
│       │   ├── add.tsx
│       │   └── profile.tsx
│       └── share.tsx
│
├── services/                     # API & business logic
│   ├── launching.service.ts      # Launching logic
│   ├── zalo-three-step-auth.ts   # Zalo authentication
│   └── api/                      # API services (12 files)
│       ├── index.ts              # Axios client setup
│       ├── auth.service.ts       # Authentication endpoints
│       ├── discovery.service.ts  # Discovery endpoints
│       ├── file.service.ts       # File upload endpoints
│       ├── match.service.ts      # Match endpoints
│       ├── notification.service.ts # Notification endpoints
│       ├── phone-invite.service.ts # Phone invite endpoints
│       ├── swipe.service.ts      # Swipe endpoints
│       ├── team-invite.service.ts # Team invite endpoints
│       ├── team.service.ts       # Team endpoints
│       └── services.ts           # Services export
│
├── stores/                       # Zustand stores (12 files)
│   ├── auth.store.ts             # Authentication state
│   ├── discovery.store.ts        # Team discovery state
│   ├── file.store.ts             # File upload state
│   ├── home.store.ts             # Home data cache
│   ├── launching.store.ts        # Launching state
│   ├── match.store.ts            # Match state with pagination
│   ├── notification.store.ts     # Notifications state
│   ├── phone-invite.store.ts     # Phone invites state
│   ├── swipe.store.ts            # Swipe feature state
│   ├── team.store.ts             # Team state
│   ├── toast.store.ts            # Toast notifications
│   └── ui.store.ts               # UI state (theme, modals)
│
├── types/                        # TypeScript type definitions
│   ├── api.types.ts              # API response types
│   └── index.ts                  # Types export
│
└── utils/                        # Utility functions
    ├── navigation.ts             # Navigation helpers
    └── toast.ts                  # Toast helpers
```

## 📄 File Descriptions

### Entry Point

#### [app.ts](../src/app.ts)
- Main entry point of the application
- Initialize error boundary
- Setup router

#### [MiniApp.tsx](../src/MiniApp.tsx)
- Root component with Error Boundary
- Wrap entire app with error handling

#### [router.tsx](../src/router.tsx)
- React Router configuration
- Define all routes (public & protected)

### Components

#### [components/layout.tsx](../src/components/layout.tsx)
- Main layout wrapper
- Import Zalo SDK

#### [components/MainLayout.tsx](../src/components/MainLayout.tsx)
- Main app layout structure
- Include bottom navigation

#### [components/ProtectedRoute.tsx](../src/components/ProtectedRoute.tsx)
- Route protection wrapper
- Redirect to login if not authenticated

#### [components/ui/](../src/components/ui/)
- **BottomNav.tsx**: Bottom navigation bar
- **Button.tsx**: Reusable button component
- **Card.tsx**: Card component
- **EmptyState.tsx**: Empty state display
- **ErrorState.tsx**: Error state display
- **FilterBar.tsx**: Filter bar for discovery
- **Header.tsx**: Page header
- **Icon.tsx**: Icon wrapper component
- **InviteCard.tsx**: Invite card display
- **MatchBadge.tsx**: Match status badge
- **MatchCards.tsx**: Match cards display
- **MatchModal.tsx**: Match detail modal
- **PlayerCard.tsx**: Player card
- **Skeleton.tsx**: Loading skeleton
- **StatBadge.tsx**: Stat badge
- **TeamAvatar.tsx**: Team avatar component
- **ThemeSwitch.tsx**: Dark mode toggle
- **ToastContainer.tsx**: Toast notifications container

### Contexts

#### [contexts/TeamContext.tsx](../src/contexts/TeamContext.tsx)
- Team selection context
- Shared team state across components

#### [contexts/ThemeContext.tsx](../src/contexts/ThemeContext.tsx)
- Theme management context
- Dark mode support

### Hooks

#### [hooks/useDiscovery.ts](../src/hooks/useDiscovery.ts)
- Discovery feature hook
- Orchestrate Discovery, Team, UI stores

#### [hooks/useHomeData.ts](../src/hooks/useHomeData.ts)
- Home data hook
- Fetch home screen data

#### [hooks/useScheduleData.ts](../src/hooks/useScheduleData.ts)
- Schedule data hook
- Fetch match schedule data

#### [hooks/useSwipe.ts](../src/hooks/useSwipe.ts)
- Swipe feature hook
- Handle swipe logic

### Screens (Pages)

#### [screens/dashboard/](../src/screens/dashboard/)
- **index.tsx**: Dashboard/Home tab screen

#### [screens/home/](../src/screens/home/)
- **index.tsx**: Home screen with pending matches

#### [screens/launching/](../src/screens/launching/)
- **index.tsx**: Splash screen with loading states

#### [screens/login/](../src/screens/login/)
- **index.tsx**: Login screen with Zalo auth

#### [screens/match/](../src/screens/match/)
- **schedule.tsx**: Match schedule list
- **find.tsx**: Find opponents (discovery)
- **history.tsx**: Match history
- **invite.tsx**: Send match invite
- **detail/index.tsx**: Match detail
- **attendance/index.tsx**: Match attendance
- **update-score.tsx**: Update match score
- **rematch.tsx**: Rematch from history
- **opponent-detail.tsx**: Opponent team detail

#### [screens/teams/](../src/screens/teams/)
- **index.tsx**: Teams list screen
- **create.tsx**: Create new team
- **edit.tsx**: Edit team info
- **detail/index.tsx**: Team detail
- **members/index.tsx**: Team members list
- **members/add.tsx**: Add member
- **members/profile.tsx**: Member profile
- **share.tsx**: Share team invite

#### [screens/profile/](../src/screens/profile/)
- **index.tsx**: Profile screen
- **edit.tsx**: Edit profile

#### [screens/swipe/](../src/screens/swipe/)
- **index.tsx**: Swipe screen
- **history.tsx**: Swipe history
- **received.tsx**: Received swipes
- **stats.tsx**: Swipe statistics

#### [screens/notifications/](../src/screens/notifications/)
- **index.tsx**: Notifications list

#### [screens/inviting/](../src/screens/inviting/)
- **index.tsx**: Invites list

### Services

#### [services/launching.service.ts](../src/services/launching.service.ts)
- App launching logic
- Check auth, fetch initial data

#### [services/zalo-three-step-auth.ts](../src/services/zalo-three-step-auth.ts)
- Zalo 3-step authentication implementation
- Silent auth support

#### [services/api/](../src/services/api/)

| File | Description |
|------|-------------|
| **index.ts** | Axios client setup, interceptors |
| **auth.service.ts** | Authentication endpoints |
| **team.service.ts** | Team CRUD operations |
| **match.service.ts** | Match operations |
| **discovery.service.ts** | Team discovery |
| **swipe.service.ts** | Swipe operations |
| **notification.service.ts** | Notification endpoints |
| **file.service.ts** | File upload |
| **team-invite.service.ts** | Team invites |
| **phone-invite.service.ts** | Phone invites |

### Stores (Zustand)

Chi tiết xem: [ZUSTAND_STORES.md](./ZUSTAND_STORES.md)

| File | Description |
|------|-------------|
| **auth.store.ts** | Authentication state |
| **match.store.ts** | Match state with pagination |
| **team.store.ts** | Team state |
| **ui.store.ts** | UI state (theme, modals) |
| **discovery.store.ts** | Discovery state |
| **notification.store.ts** | Notifications |
| **swipe.store.ts** | Swipe feature |
| **home.store.ts** | Home cache |
| **launching.store.ts** | App launch state |
| **file.store.ts** | File uploads |
| **phone-invite.store.ts** | Phone invites |
| **toast.store.ts** | Toast notifications |

### Types

#### [types/api.types.ts](../src/types/api.types.ts)
- API response types
- Request DTO types
- Entity types (User, Team, Match, etc.)

#### [types/index.ts](../src/types/index.ts)
- Type exports

### Utils

#### [utils/navigation.ts](../src/utils/navigation.ts)
- Navigation helper functions

#### [utils/toast.ts](../src/utils/toast.ts)
- Toast helper functions

## 🔧 Configuration Files

### [vite.config.ts](../vite.config.ts)
```typescript
export default defineConfig({
  plugins: [
    react(),
    zmpVitePlugin(),
  ],
  // ... other config
});
```

### [tailwind.config.js](../tailwind.config.js)
- Tailwind CSS customization
- Custom colors, spacing

### [tsconfig.json](../tsconfig.json)
- TypeScript configuration
- Path aliases (`@/`)

### [app-config.json](../app-config.json)
- Zalo Mini App configuration

### [zmp-cli.json](../zmp-cli.json)
- ZMP CLI configuration

## 📊 File Organization Patterns

### 1. Feature-based Structure
- Screens grouped by feature (`teams/`, `match/`, `swipe/`)
- Each feature has its own components if needed

### 2. Shared Components
- Reusable UI components in `components/ui/`
- Layout components in `components/`

### 3. Services Layer
- API calls separated from components
- Each service handles specific domain

### 4. State Management
- Zustand stores for global state
- React contexts for component-level state

### 5. Type Safety
- Centralized types in `types/`
- API types separate from UI types

## 📚 Related Documentation

- [Project Requirements](./PROJECT_REQUIREMENTS.md)
- [Zustand Stores](./ZUSTAND_STORES.md)
- [API Reference](./API_REFERENCE.md)
- [Zalo Mini App Skills](./ZALO_MINI_APP_SKILLS.md)
