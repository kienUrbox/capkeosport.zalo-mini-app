import { useEffect, useState } from 'react'
import { CountdownData } from '../../types'

interface CountdownTimerProps {
  countdown?: CountdownData
  targetDate?: Date
  isUrgent?: boolean
  size?: 'sm' | 'md' | 'lg'
  showDays?: boolean
  showLabels?: boolean
  format?: 'full' | 'short' | 'compact'
  onComplete?: () => void
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countdown,
  targetDate,
  isUrgent = false,
  size = 'md',
  showDays = true,
  showLabels = true,
  format = 'full',
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState<CountdownData>(countdown || { days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  // Calculate countdown from targetDate if countdown is not provided
  useEffect(() => {
    const calculateCountdown = () => {
      let countdownData: CountdownData

      if (countdown) {
        countdownData = countdown
      } else if (targetDate) {
        const now = new Date().getTime()
        const target = targetDate.getTime()
        const difference = target - now

        if (difference <= 0) {
          countdownData = { days: 0, hours: 0, minutes: 0, seconds: 0 }
          if (!isExpired) {
            setIsExpired(true)
            onComplete?.()
          }
          return
        }

        countdownData = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        }
      } else {
        countdownData = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      setTimeLeft(countdownData)
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [countdown, targetDate, onComplete, isExpired])

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs font-medium'
      case 'md':
        return 'text-sm font-medium'
      case 'lg':
        return 'text-base font-medium'
      default:
        return 'text-sm font-medium'
    }
  }

  const formatTime = (value: number, label: string) => {
    switch (format) {
      case 'short':
        return {
          value: value.toString().padStart(2, '0'),
          label: label.charAt(0).toUpperCase()
        }
      case 'compact':
        return {
          value: value.toString().padStart(2, '0'),
          label: ''
        }
      default:
        return {
          value: value.toString().padStart(2, '0'),
          label
        }
    }
  }

  const getUrgentClasses = () => {
    if (isExpired) {
      return 'text-red-400 bg-red-500/10 border-red-500/20'
    }
    if (isUrgent || (timeLeft.days <= 0 && timeLeft.hours <= 1)) {
      return 'text-orange-400 bg-orange-500/10 border-orange-500/20 animate-pulse'
    }
    return 'text-primary bg-primary/5 border-primary/20'
  }

  // Vietnamese format for inline display
  if (format === 'compact') {
    const { days, hours, minutes } = timeLeft

    let timeText = ''
    if (days > 0) {
      timeText = `Còn ${days} ngày ${hours} giờ`
    } else if (hours > 0) {
      timeText = `Còn ${hours} giờ ${minutes} phút`
    } else if (minutes > 0) {
      timeText = `Còn ${minutes} phút`
    } else {
      timeText = `Còn ${timeLeft.seconds} giây`
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full border ${getSizeClasses()} ${getUrgentClasses()}`}>
        {isExpired ? 'Hết hạn' : timeText}
      </span>
    )
  }

  const timeSections = []

  if (showDays && timeLeft.days > 0) {
    const { value, label } = formatTime(timeLeft.days, 'ngày')
    timeSections.push(
      <div key="days" className="flex flex-col items-center">
        <span className="font-bold text-lg">{value}</span>
        {showLabels && <span className="text-xs opacity-75">{label}</span>}
      </div>
    )
  }

  if (timeLeft.hours > 0 || timeLeft.days > 0) {
    const { value, label } = formatTime(timeLeft.hours, 'giờ')
    timeSections.push(
      <div key="hours" className="flex flex-col items-center">
        <span className="font-bold text-lg">{value}</span>
        {showLabels && <span className="text-xs opacity-75">{label}</span>}
      </div>
    )
  }

  if (timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0) {
    const { value, label } = formatTime(timeLeft.minutes, 'phút')
    timeSections.push(
      <div key="minutes" className="flex flex-col items-center">
        <span className="font-bold text-lg">{value}</span>
        {showLabels && <span className="text-xs opacity-75">{label}</span>}
      </div>
    )
  }

  // Always show seconds for time-sensitive actions
  if (!isExpired) {
    const { value, label } = formatTime(timeLeft.seconds, 'giây')
    timeSections.push(
      <div key="seconds" className="flex flex-col items-center">
        <span className="font-bold text-lg">{value}</span>
        {showLabels && <span className="text-xs opacity-75">{label}</span>}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-full border ${getUrgentClasses()}`}>
      {isExpired ? (
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined !text-base">timer_off</span>
          <span>Hết hạn</span>
        </span>
      ) : (
        <>
          {timeSections.map((section, index) => (
            <React.Fragment key={index}>
              {section}
              {index < timeSections.length - 1 && (
                <span className="text-lg font-bold opacity-50">:</span>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  )
}

export default CountdownTimer

