import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/ui';

// Screens
import LaunchingScreen from './screens/launching';
import LoginScreen from './screens/login';
import OnboardingScreen from './screens/onboarding';

// Tab screens (use MainLayout with BottomNav)
import DashboardScreen from './screens/home';
import TeamsScreen from './screens/teams';
import ProfileScreen from './screens/profile';
import MatchScheduleScreen from './screens/match/schedule';

// Other screens (no BottomNav)
import FindMatchScreen from './screens/match/find';
import CreateTeamScreen from './screens/teams/create';
import TeamDetailScreen from './screens/teams/detail';
import TeamMembersScreen from './screens/teams/members';
import EditTeamScreen from './screens/teams/edit';
import AddMemberScreen from './screens/teams/add-member';
import MemberProfileScreen from './screens/teams/member-profile';
import ShareTeamScreen from './screens/teams/share';
import MatchDetailScreen from './screens/match/detail';
import MatchFoundScreen from './screens/match/found';
import UpdateScoreScreen from './screens/match/update-score';
import RematchScreen from './screens/match/rematch';
import InviteMatchScreen from './screens/match/invite';
import OpponentDetailScreen from './screens/match/opponent-detail';
import MatchHistoryScreen from './screens/match/history';
import MatchAttendanceScreen from './screens/match/attendance';
import NotificationsScreen from './screens/notifications';
import EditProfileScreen from './screens/profile/edit';
import SwipeHistoryScreen from './screens/swipe';
import ReceivedSwipesScreen from './screens/swipe/received';
import SwipeStatsScreen from './screens/swipe/stats';

// Team Invitation Screens
import MyInvitesScreen from './screens/invites/received';

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
  // Default redirect to launching screen
  { path: '/', element: <Navigate to="/launching" replace /> },

  // Launching screen - first screen of the app
  { path: '/launching', element: <LaunchingScreen /> },

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

  // Protected routes - Main App with MainLayout (BottomNav)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Tab routes (with BottomNav)
      { path: 'dashboard', element: <DashboardScreen /> },
      { path: 'teams', element: <TeamsScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
      { path: 'match/schedule', element: <MatchScheduleScreen /> },
    ],
  },

  // Other protected routes (without BottomNav)
  {
    path: '/match/find',
    element: (
      <ProtectedRoute>
        <FindMatchScreen />
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
  {
    path: '/invites/received',
    element: (
      <ProtectedRoute>
        <MyInvitesScreen />
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
    path: '/match/:matchId',
    element: (
      <ProtectedRoute>
        <MatchDetailScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/match/:matchId/attendance',
    element: (
      <ProtectedRoute>
        <MatchAttendanceScreen />
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
    path: '/match/:matchId/rematch',
    element: (
      <ProtectedRoute>
        <RematchScreen />
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
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationsScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-invites',
    element: (
      <ProtectedRoute>
        <Navigate to="/notifications" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/swipe/history',
    element: (
      <ProtectedRoute>
        <SwipeHistoryScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/swipe/received',
    element: (
      <ProtectedRoute>
        <ReceivedSwipesScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/swipe/stats',
    element: (
      <ProtectedRoute>
        <SwipeStatsScreen />
      </ProtectedRoute>
    ),
  },

  // 404 fallback
  { path: '*', element: <NotFound /> },
]);
