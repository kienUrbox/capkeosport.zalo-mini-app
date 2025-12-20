import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import MatchCard from '../../components/ui/MatchCard'
import { LoadingSpinner, SkeletonList } from '../../components/ui/LoadingStates'
import { ICONS } from '../../constants/design'
import type { Match } from '../../types'
import useUnreadCount from '../../hooks/useUnreadCount'

type MatchedTabProps = {
  matches: Match[]
  loading?: boolean
}

const MatchedTabUpdated = ({ matches, loading = false }: MatchedTabProps) => {
  const navigate = useNavigate()
  const { markAsRead, getMatchActionRequired } = useUnreadCount()

  const handleMatchAction = (action: string, match: Match) => {
    switch (action) {
      case 'confirm':
        navigate(`/match/${match.id}/accept`)
        break
      case 'reject':
        navigate(`/match/${match.id}/decline`)
        break
      case 'chat':
        if (match.zaloChatLink) {
          window.open(match.zaloChatLink, '_blank')
        } else {
          navigate(`/match-room/${match.id}`)
        }
        break
      case 'rematch':
        navigate(`/request-match/${match.teamB.id}`)
        break
      case 'rate':
        navigate(`/match/${match.id}/rate`)
        break
      default:
        navigate(`/team/${match.teamB.id}`)
    }
  }

  const handleMatchClick = (match: Match) => {
    navigate(`/match/${match.id}`)
  }

  if (loading) {
    return (
      <div className="p-4">
        <SkeletonList items={3} type="match" />
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<span className={`material-symbols-outlined text-[64px] text-[#A0A0A0]`}>{ICONSS.favorite}</span>}
        title="Chưa có kèo nào đã match"
        description="Swipe để tìm đội phù hợp và match với họ nhé!"
        actionLabel="Đi cáp kèo"
        onAction={() => navigate('/swipe')}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {matches.map((match) => {
        // Determine priority based on urgency and status
        const getPriority = (): 'high' | 'medium' | 'low' => {
          if (match.status === 'PENDING' && match.isReceived) {
            return 'high' // Received invitation needs attention
          }
          if (match.status === 'MATCHED' && !match.isReceived) {
            return 'medium' // User needs to send invitation
          }
          return 'low'
        }

        const priority = getPriority()

        return (
          <MatchCard
            key={match.id}
            match={match}
            variant="matched"
            priority={priority}
            showRequiredAction={true}
            showCountdown={match.status === 'PENDING' && match.isReceived}
            onClick={() => handleMatchClick(match)}
            onActionClick={(action) => handleMatchAction(action, match)}
          />
        )
      })}

      {/* Floating action button for new matches */}
      {matches.some(m => m.status === 'MATCHED' && !m.isReceived) && (
        <button
          onClick={() => {
            // Mark all matched as read and navigate to swipe
            markAsRead('matches')
            navigate('/swipe')
          }}
          className="fixed bottom-20 right-4 z-10 flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Tìm trận đấu mới"
        >
          <span className="material-symbols-outlined text-white text-2xl">
            {ICONSS.add}
          </span>
        </button>
      )}
    </div>
  )
}

export default MatchedTabUpdated