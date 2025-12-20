import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from './IconButton'
import Typography from './Typography'
import { HEADER, ICONS } from '../../constants/design'

type AppHeaderProps = {
  title: string
  subtitle?: string
  leftIcon?: ReactNode
  rightSlot?: ReactNode
  onBack?: () => void
  showBack?: boolean
  showHome?: boolean
}

const AppHeader = ({
  title,
  subtitle,
  leftIcon,
  rightSlot,
  onBack,
  showBack = true,
  showHome = true,
}: AppHeaderProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const handleHome = () => {
    navigate('/home')
  }

  return (
    <header className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3">
        {leftIcon ? (
          leftIcon
        ) : showBack ? (
          <button onClick={handleBack} className="flex items-center justify-center">
            <span className={`material-symbols-outlined text-white ${HEADER.iconSize}`}>
              {ICONS.arrow_back}
            </span>
          </button>
        ) : null}
        <div>
          <Typography variant="title">{title}</Typography>
          {subtitle ? (
            <Typography variant="body-sm" className="text-muted">
              {subtitle}
            </Typography>
          ) : null}
        </div>
      </div>
      {rightSlot || (
        showHome ? (
          <button onClick={handleHome} className="flex items-center justify-center">
            <span className={`material-symbols-outlined text-white ${HEADER.iconSize}`}>
              {ICONS.home}
            </span>
          </button>
        ) : null
      )}
    </header>
  )
}

export default AppHeader

