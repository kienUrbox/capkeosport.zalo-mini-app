import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Screens - Existing
import LoginScreen from './screens/login';

// Screens - Core (implemented)
import OnboardingScreen from './screens/onboarding';
import DashboardScreen from './screens/dashboard';
import ProfileScreen from './screens/profile';
import TeamsScreen from './screens/teams';
import CreateTeamScreen from './screens/teams/create';
import TeamDetailScreen from './screens/teams/detail';
import TeamMembersScreen from './screens/teams/members';
import EditTeamScreen from './screens/teams/edit';
import AddMemberScreen from './screens/teams/add-member';
import MemberProfileScreen from './screens/teams/member-profile';
import ShareTeamScreen from './screens/teams/share';
import MatchScheduleScreen from './screens/match/schedule';
import FindMatchScreen from './screens/match/find';
import MatchDetailScreen from './screens/match/detail';
import MatchFoundScreen from './screens/match/found';
import UpdateScoreScreen from './screens/match/update-score';
import InviteMatchScreen from './screens/match/invite';
import OpponentDetailScreen from './screens/match/opponent-detail';
import MatchHistoryScreen from './screens/match/history';
import NotificationsScreen from './screens/notifications';
import EditProfileScreen from './screens/profile/edit';

// Simple 404 component
const NotFound = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5',
    }}
  >
    <h1
      style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}
    >
      404
    </h1>
    <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
      Trang không tồn tại
    </p>
    <Navigate to="/login" replace />
  </div>
);

export const router = createBrowserRouter([
  // Default redirect to dashboard after auth
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Public routes
  { path: '/login', element: <LoginScreen /> },

  // Protected routes - Onboarding (shows after login)
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingScreen />
      </ProtectedRoute>
    ),
  },

  // Protected routes - Main App
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardScreen />
      </ProtectedRoute>
    ),
  },

  // Profile routes
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfileScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <EditProfileScreen />
      </ProtectedRoute>
    ),
  },

  // Team routes
  {
    path: '/teams',
    element: (
      <ProtectedRoute>
        <TeamsScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/create',
    element: (
      <ProtectedRoute>
        <CreateTeamScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/:teamId',
    element: (
      <ProtectedRoute>
        <TeamDetailScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/:teamId/edit',
    element: (
      <ProtectedRoute>
        <EditTeamScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/:teamId/members',
    element: (
      <ProtectedRoute>
        <TeamMembersScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/:teamId/members/add',
    element: (
      <ProtectedRoute>
        <AddMemberScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/:teamId/members/:memberId',
    element: (
      <ProtectedRoute>
        <MemberProfileScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teams/:teamId/share',
    element: (
      <ProtectedRoute>
        <ShareTeamScreen />
      </ProtectedRoute>
    ),
  },

  // Match routes
  {
    path: '/match/find',
    element: (
      <ProtectedRoute>
        <FindMatchScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/found',
    element: (
      <ProtectedRoute>
        <MatchFoundScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/schedule',
    element: (
      <ProtectedRoute>
        <MatchScheduleScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/:matchId',
    element: (
      <ProtectedRoute>
        <MatchDetailScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/:matchId/update-score',
    element: (
      <ProtectedRoute>
        <UpdateScoreScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/invite',
    element: (
      <ProtectedRoute>
        <InviteMatchScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/opponent/:teamId',
    element: (
      <ProtectedRoute>
        <OpponentDetailScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/history',
    element: (
      <ProtectedRoute>
        <MatchHistoryScreen />
      </ProtectedRoute>
    ),
  },

  // Notifications
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationsScreen />
      </ProtectedRoute>
    ),
  },

  // 404 fallback
  { path: '*', element: <NotFound /> },
]);
