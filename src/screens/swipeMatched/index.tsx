import { useNavigate } from 'react-router-dom'

import { PrimaryButton, SecondaryButton } from '../../components/ui'
import { ICONS } from '../../constants/design'
import type { Team } from '../../types'

type SwipeMatchedProps = {
  yourTeam: Team
  matchedTeam: Team
  onSendMessage?: () => void
  onKeepSwiping?: () => void
}

const SwipeMatchedScreen = ({ yourTeam, matchedTeam, onSendMessage, onKeepSwiping }: SwipeMatchedProps) => {
  const navigate = useNavigate()

  const handleSendMessage = () => {
    onSendMessage?.()
    navigate(`/team/${matchedTeam.id}`)
  }

  const handleKeepSwiping = () => {
    onKeepSwiping?.()
    navigate('/swipe')
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-8 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        <h2 className="text-6xl font-bold text-primary" style={{ textShadow: '0 0 15px rgba(0, 106, 245, 0.7)' }}>
          Có Kèo!
        </h2>
        <p className="mt-2 text-lg text-zinc-300">
          You and {matchedTeam.name} have liked each other.
        </p>
        <div className="my-10 flex items-center justify-center gap-4">
          <img
            alt="User's team avatar"
            className="size-28 rounded-full border-4 border-primary object-cover shadow-lg"
            src={yourTeam.logo}
          />
          <span className={`material-symbols-outlined text-5xl font-bold text-white`}>{ICONS.sync}</span>
          <img
            alt="Matched team logo"
            className="size-28 rounded-full border-4 border-white object-cover shadow-lg"
            src={matchedTeam.logo}
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <PrimaryButton className="w-full" onClick={handleSendMessage}>
            Send a Message
          </PrimaryButton>
          <SecondaryButton className="w-full" onClick={handleKeepSwiping}>
            Keep Swiping
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default SwipeMatchedScreen

