import React, { useState, useEffect } from 'react';
import {
  useAuth,
  useMyTeams,
  useTeamDiscovery,
  useSwipeDeck,
  useUpcomingMatches,
  useUnreadNotifications,
} from '../hooks';
import { CreateTeamDto, DiscoveryFilter, Gender } from '../types/api.types';

const ApiTest: React.FC = () => {
  // Auth state
  const { isAuthenticated, user } = useAuth();

  // Teams management
  const { myTeams, createTeam, isLoading: teamsLoading } = useMyTeams();

  // Discovery
  const { teams: discoveredTeams, searchNearbyTeams, isSearching } = useTeamDiscovery();

  // Swipes
  const { likeTeam, passTeam, isSwiping, hasNewMatch, newMatch } = useSwipeDeck();

  // Matches
  const { matches: upcomingMatches } = useUpcomingMatches();

  // Notifications
  const { unreadNotifications, unreadCount } = useUnreadNotifications();

  // Form states
  const [newTeamForm, setNewTeamForm] = useState<Partial<CreateTeamDto>>({
    name: '',
    description: '',
    gender: Gender.MALE,
    level: 'Trung bình',
    location: {
      lat: 10.7769,
      lng: 106.7009,
      address: 'Quận 1, TP.HCM',
      district: 'Quận 1',
      city: 'TP.HCM',
    },
    stats: {
      attack: 70,
      defense: 65,
      technique: 68,
    },
  });

  const [discoveryFilters, setDiscoveryFilters] = useState<Partial<DiscoveryFilter>>({
    center: {
      lat: 10.7769,
      lng: 106.7009,
    },
    radius: 10,
  });

  // Test functions
  const testCreateTeam = async () => {
    if (!newTeamForm.name) {
      alert('Please enter team name');
      return;
    }

    const result = await createTeam(newTeamForm as CreateTeamDto);
    if (result) {
      alert('Team created successfully!');
      setNewTeamForm({ ...newTeamForm, name: '', description: '' });
    } else {
      alert('Failed to create team');
    }
  };

  const testDiscovery = async () => {
    const result = await searchNearbyTeams(
      discoveryFilters.center!.lat,
      discoveryFilters.center!.lng,
      discoveryFilters.radius,
      discoveryFilters
    );

    if (result) {
      alert(`Found ${result.teams.length} teams`);
    } else {
      alert('Discovery failed');
    }
  };

  const testLikeTeam = async (targetTeamId: string) => {
    if (!myTeams.length) {
      alert('Please create a team first');
      return;
    }

    const result = await likeTeam(myTeams[0]!.id, targetTeamId);
    if (result) {
      if (result.isMatch) {
        alert(`🎉 It's a match! with team ${result.newMatch?.teamBId || 'Unknown'}`);
      } else {
        alert('Team liked!');
      }
    } else {
      alert('Failed to like team');
    }
  };

  const testPassTeam = async (targetTeamId: string) => {
    if (!myTeams.length) {
      alert('Please create a team first');
      return;
    }

    const result = await passTeam(myTeams[0]!.id, targetTeamId);
    if (result) {
      alert('Team passed!');
    } else {
      alert('Failed to pass team');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h2>
          <p className="text-yellow-700">Please login to test the API functionality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Testing Dashboard</h1>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Zalo ID:</strong> {user?.zaloUserId}</p>
          </div>
          <div>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
            <p><strong>Verification:</strong> {user?.verificationMethod}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800">My Teams</h3>
          <p className="text-2xl font-bold text-blue-600">{myTeams.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800">Discovered Teams</h3>
          <p className="text-2xl font-bold text-green-600">{discoveredTeams.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800">Upcoming Matches</h3>
          <p className="text-2xl font-bold text-purple-600">{upcomingMatches.length}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="font-semibold text-red-800">Unread Notifications</h3>
          <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
        </div>
      </div>

      {/* New Match Alert */}
      {hasNewMatch && newMatch && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>🎉 New Match!</strong> You matched with a team! Match ID: {newMatch.id}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Create Team */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                value={newTeamForm.name || ''}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTeamForm.description || ''}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter team description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={newTeamForm.gender || Gender.MALE}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.MIXED}>Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input
                type="text"
                value={newTeamForm.level || ''}
                onChange={(e) => setNewTeamForm({ ...newTeamForm, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Trung bình, Khá, Giỏi"
              />
            </div>
            <button
              onClick={testCreateTeam}
              disabled={teamsLoading || !newTeamForm.name}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {teamsLoading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </div>

        {/* Discovery */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Team Discovery</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius (km)</label>
              <input
                type="number"
                value={discoveryFilters.radius || 10}
                onChange={(e) => setDiscoveryFilters({ ...discoveryFilters, radius: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Center (Lat, Lng)</label>
              <input
                type="text"
                value={`${discoveryFilters.center?.lat}, ${discoveryFilters.center?.lng}`}
                onChange={(e) => {
                  const [lat, lng] = e.target.value.split(',').map(s => s.trim());
                  if (lat && lng) {
                    setDiscoveryFilters({
                      ...discoveryFilters,
                      center: { lat: Number(lat), lng: Number(lng) }
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10.7769, 106.7009"
              />
            </div>
            <button
              onClick={testDiscovery}
              disabled={isSearching}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search Teams'}
            </button>
          </div>
        </div>
      </div>

      {/* My Teams */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Teams ({myTeams.length})</h2>
        <div className="space-y-3">
          {myTeams.map((team) => (
            <div key={team.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-sm text-gray-600">{team.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {team.gender}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {team.level}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  {team.membersCount || 0} members
                </span>
              </div>
            </div>
          ))}
          {myTeams.length === 0 && (
            <p className="text-gray-500 text-center py-4">No teams created yet</p>
          )}
        </div>
      </div>

      {/* Discovered Teams */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Discovered Teams ({discoveredTeams.length})</h2>
        <div className="grid grid-cols-2 gap-4">
          {discoveredTeams.slice(0, 6).map((team) => (
            <div key={team.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-sm text-gray-600">{team.description}</p>
              <div className="flex gap-2 mt-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {team.gender}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {team.level}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                  {team.distance?.toFixed(1)} km
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => testLikeTeam(team.id)}
                  disabled={isSwiping || !myTeams.length}
                  className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isSwiping ? '...' : 'Like'}
                </button>
                <button
                  onClick={() => testPassTeam(team.id)}
                  disabled={isSwiping || !myTeams.length}
                  className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isSwiping ? '...' : 'Pass'}
                </button>
              </div>
            </div>
          ))}
          {discoveredTeams.length === 0 && (
            <p className="text-gray-500 text-center py-4 col-span-2">No teams found. Try searching with different filters.</p>
          )}
        </div>
      </div>

      {/* Unread Notifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Unread Notifications ({unreadCount})</h2>
        <div className="space-y-3">
          {unreadNotifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {unreadNotifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">No unread notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;