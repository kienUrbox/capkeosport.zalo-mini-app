/**
 * Navigation utilities and route definitions
 */

export const appRoutes = {
  // Auth
  login: '/login',

  // Onboarding
  onboarding: '/onboarding',

  // Main App
  dashboard: '/dashboard',

  // Profile
  profile: '/profile',
  profileEdit: '/profile/edit',

  // Teams
  teams: '/teams',
  teamsCreate: '/teams/create',
  teamDetail: (id: string) => `/teams/${id}`,
  teamEdit: (id: string) => `/teams/${id}/edit`,
  teamMembers: (id: string) => `/teams/${id}/members`,
  memberAdd: (teamId: string) => `/teams/${teamId}/members/add`,
  memberProfile: (teamId: string, memberId: string) =>
    `/teams/${teamId}/members/${memberId}`,
  teamShare: (id: string) => `/teams/${id}/share`,

  // Matches
  matchFind: '/match/find',
  matchFound: '/match/found',
  matchSchedule: '/match/schedule',
  matchDetail: (id: string) => `/match/${id}`,
  matchUpdateScore: (id: string) => `/match/${id}/update-score`,
  matchInvite: '/match/invite',
  opponentDetail: (id: string) => `/match/opponent/${id}`,
  matchHistory: '/match/history',

  // Notifications
  notifications: '/notifications',
} as const;

export type AppRoute = typeof appRoutes;
