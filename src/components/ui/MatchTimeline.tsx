type TimelineEvent = {
  id: string
  title: string
  timestamp: string
  icon?: string
}

type MatchTimelineProps = {
  events: TimelineEvent[]
}

const MatchTimeline = ({ events }: MatchTimelineProps) => {
  return (
    <div className="bg-[#1a2431] rounded-lg p-4">
      <h3 className="text-white font-bold text-lg mb-4">Lịch sử trận đấu</h3>
      <div className="relative space-y-6 pl-8 border-l border-dashed border-gray-600">
        {events.map((event, index) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-[#1a2431]"></div>
            <p className="text-white text-base">{event.title}</p>
            <p className="text-sm text-[#9aa9bc]">{event.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchTimeline

