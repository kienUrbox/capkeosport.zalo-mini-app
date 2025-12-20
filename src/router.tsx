import { createBrowserRouter, Navigate } from 'react-router-dom'

import { TabsLayout } from './components/common'
import { ProtectedRoute } from './components/ProtectedRoute'

// Simple 404 component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-2">404</h1>
    <p className="text-gray-400 mb-4">Trang không tồn tại</p>
    <Navigate to="/login" replace />
  </div>
)
// Tạm ẩn onboarding screens
// import OnboardingStepOneScreen from './screens/onboardingStepOne'
// import OnboardingStepTwoScreen from './screens/onboardingStepTwo'
// import OnboardingStepThreeScreen from './screens/onboardingStepThree'
import LoginScreen from './screens/login'
import LoginSuccessScreen from './screens/loginSuccess'
import HomeScreen from './screens/home'
import MyTeamsScreen from './screens/myTeams'
import MatchesScreen from './screens/matches'
import SwipeDeckScreen from './screens/swipeDeck'
import AccountScreen from './screens/account'
import TeamDetailScreen from './screens/teamDetail'
import MyTeamDetailScreen from './screens/myTeamDetail'
import CreateTeamScreen from './screens/teamCreate'
import ProfileScreen from './screens/profile'
import EditProfileScreen from './screens/profileEdit'
import SettingsScreen from './screens/settings'
import IncomingRequestsScreen from './screens/incomingRequests'
import MatchRoomScreen from './screens/matchRoom'
import MatchDetailScreen from './screens/matchDetail'
import SubmitMatchResultScreen from './screens/submitMatchResult'
import MatchHistoryScreen from './screens/matchHistory'
import RematchRequestScreen from './screens/rematchRequest'
import UpcomingMatchesScreen from './screens/upcomingMatches'
import ConfirmMatchInfoScreen from './screens/confirmMatchInfo'
import FinishedMatchDetailScreen from './screens/finishedMatchDetail'
import RequestMatchScreen from './screens/requestMatch'
import PlayerDetailScreen from './screens/playerDetail'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: (
      <ProtectedRoute>
        <TabsLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/home', element: <HomeScreen /> },
      { path: '/swipe', element: <SwipeDeckScreen /> },
      { path: '/matches', element: <MatchesScreen /> },
      { path: '/teams', element: <MyTeamsScreen /> },
      { path: '/account', element: <AccountScreen /> },
    ],
  },
  // Login flow
  { path: '/login', element: <LoginScreen /> },
  { path: '/login/success', element: <LoginSuccessScreen /> },

  // Protected routes
  { path: '/team/:teamId', element: <ProtectedRoute><TeamDetailScreen /></ProtectedRoute> }, // Opponent team detail
  { path: '/my-team/:teamId', element: <ProtectedRoute><MyTeamDetailScreen /></ProtectedRoute> }, // User's own team detail
  { path: '/team/create', element: <ProtectedRoute><CreateTeamScreen /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><ProfileScreen /></ProtectedRoute> },
  { path: '/profile/edit', element: <ProtectedRoute><EditProfileScreen /></ProtectedRoute> },
  { path: '/settings', element: <ProtectedRoute><SettingsScreen /></ProtectedRoute> },
  { path: '/incoming-requests', element: <ProtectedRoute><IncomingRequestsScreen /></ProtectedRoute> },
  { path: '/match-room/:id', element: <ProtectedRoute><MatchRoomScreen /></ProtectedRoute> },
  { path: '/match/:id', element: <ProtectedRoute><MatchDetailScreen /></ProtectedRoute> },
  { path: '/match/:id/result', element: <ProtectedRoute><SubmitMatchResultScreen /></ProtectedRoute> },
  { path: '/match-history', element: <ProtectedRoute><MatchHistoryScreen /></ProtectedRoute> },
  { path: '/match/:id/rematch', element: <ProtectedRoute><RematchRequestScreen /></ProtectedRoute> },
  { path: '/matches/upcoming', element: <ProtectedRoute><UpcomingMatchesScreen /></ProtectedRoute> },
  { path: '/match/:id/confirm', element: <ProtectedRoute><ConfirmMatchInfoScreen /></ProtectedRoute> },
  { path: '/match/:id/finished', element: <ProtectedRoute><FinishedMatchDetailScreen /></ProtectedRoute> },
  { path: '/player/:playerId', element: <ProtectedRoute><PlayerDetailScreen /></ProtectedRoute> },
  { path: '/request-match/:teamId', element: <ProtectedRoute><RequestMatchScreen /></ProtectedRoute> },
  // 404 fallback route
  { path: '*', element: <NotFound /> },
])

