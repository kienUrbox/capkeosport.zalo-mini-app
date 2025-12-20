import { useState, useEffect, useCallback } from 'react'
import { MatchStatus } from '../types'

interface UnreadCounts {
  matches: number
  teams: number
  profile: number
  total: number
}

interface UnreadConfig {
  refreshInterval?: number
  enableAutoRefresh?: boolean
}

const useUnreadCount = (config: UnreadConfig = {}) => {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    matches: 0,
    teams: 0,
    profile: 0,
    total: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Simulate API call to get unread counts
  const fetchUnreadCounts = useCallback(async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock data - replace with actual API call
      const mockCounts: UnreadCounts = {
        matches: Math.floor(Math.random() * 5), // Pending matches
        teams: Math.floor(Math.random() * 3), // Team invitations
        profile: Math.floor(Math.random() * 2), // Profile notifications
        total: 0 // Will be calculated below
      }

      mockCounts.total = mockCounts.matches + mockCounts.teams + mockCounts.profile

      setUnreadCounts(mockCounts)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch unread counts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get urgency level for navigation items
  const getUrgencyLevel = useCallback((tab: 'matches' | 'teams' | 'profile'): 'high' | 'medium' | 'low' => {
    const count = unreadCounts[tab]

    if (tab === 'matches') {
      // High urgency for pending matches that need confirmation
      return count > 0 ? 'high' : 'low'
    }

    if (tab === 'teams') {
      // Medium urgency for team-related notifications
      return count > 0 ? 'medium' : 'low'
    }

    // Low urgency for profile notifications
    return count > 0 ? 'medium' : 'low'
  }, [unreadCounts])

  // Get specific action needed for matches tab
  const getMatchActionRequired = useCallback(() => {
    if (unreadCounts.matches > 0) {
      if (unreadCounts.matches === 1) {
        return '1 trận chờ phản hồi'
      }
      return `${unreadCounts.matches} trận chờ phản hồi`
    }
    return undefined
  }, [unreadCounts.matches])

  // Get specific action needed for teams tab
  const getTeamActionRequired = useCallback(() => {
    if (unreadCounts.teams > 0) {
      if (unreadCounts.teams === 1) {
        return '1 lời mời mới'
      }
      return `${unreadCounts.teams} lời mời mới`
    }
    return undefined
  }, [unreadCounts.teams])

  // Mark items as read
  const markAsRead = useCallback(async (tab: 'matches' | 'teams' | 'profile' | 'all') => {
    setIsLoading(true)

    try {
      // Simulate API call to mark as read
      await new Promise(resolve => setTimeout(resolve, 300))

      setUnreadCounts(prev => {
        const newCounts = { ...prev }

        if (tab === 'all') {
          newCounts.matches = 0
          newCounts.teams = 0
          newCounts.profile = 0
        } else {
          newCounts[tab] = 0
        }

        newCounts.total = newCounts.matches + newCounts.teams + newCounts.profile
        return newCounts
      })

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Simulate real-time updates
  const simulateNewNotification = useCallback((type: 'match' | 'team' | 'profile') => {
    setUnreadCounts(prev => {
      const newCounts = { ...prev }

      switch (type) {
        case 'match':
          newCounts.matches += 1
          break
        case 'team':
          newCounts.teams += 1
          break
        case 'profile':
          newCounts.profile += 1
          break
      }

      newCounts.total = newCounts.matches + newCounts.teams + newCounts.profile
      return newCounts
    })

    setLastUpdate(new Date())
  }, [])

  // Auto refresh counts
  useEffect(() => {
    if (!config.enableAutoRefresh) return

    const interval = setInterval(() => {
      fetchUnreadCounts()
    }, config.refreshInterval || 30000) // Refresh every 30 seconds by default

    return () => clearInterval(interval)
  }, [config.enableAutoRefresh, config.refreshInterval, fetchUnreadCounts])

  // Initial fetch
  useEffect(() => {
    fetchUnreadCounts()
  }, [fetchUnreadCounts])

  return {
    unreadCounts,
    isLoading,
    lastUpdate,
    getUrgencyLevel,
    getMatchActionRequired,
    getTeamActionRequired,
    markAsRead,
    simulateNewNotification,
    refresh: fetchUnreadCounts
  }
}

export default useUnreadCount