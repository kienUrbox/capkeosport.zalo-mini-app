import SwipeCard from './SwipeCard'

type SwipeProfile = {
  id: string
  name: string
  location: string
  skillLevel: string
  distance: string
}

type SwipeDeckProps = {
  profiles: SwipeProfile[]
}

const SwipeDeck = ({ profiles }: SwipeDeckProps) => {
  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <SwipeCard key={profile.id} {...profile} />
      ))}
    </div>
  )
}

export default SwipeDeck

