import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { HEADER, ICONS } from '../../constants/design'

type StandardHeaderProps = {
  title: string
  onBack?: () => void
  rightAction?: ReactNode
  showBack?: boolean
  showHome?: boolean
}

const StandardHeader = ({ title, onBack, rightAction, showBack = true, showHome = true }: StandardHeaderProps) => {
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
    <header className={`sticky top-0 z-10 flex items-center bg-background-dark/80 backdrop-blur-sm ${HEADER.padding} justify-between`}>
      <div className={`${HEADER.iconButtonSize} shrink-0 items-center justify-center flex`}>
        {showBack && (
          <button onClick={handleBack} className="flex items-center justify-center">
            <span className={`material-symbols-outlined text-white ${HEADER.iconSize}`}>
              {ICONS.arrow_back}
            </span>
          </button>
        )}
      </div>
      <h1 className={`text-white ${HEADER.titleSize} ${HEADER.titleWeight} ${HEADER.titleTracking} flex-1 text-center`}>
        {title}
      </h1>
      <div className={`${HEADER.iconButtonSize} shrink-0 flex items-center justify-end`}>
        {rightAction || (
          showHome ? (
            <button onClick={handleHome} className="flex items-center justify-center">
              <span className={`material-symbols-outlined text-white ${HEADER.iconSize}`}>
                {ICONS.home}
              </span>
            </button>
          ) : (
            <div></div>
          )
        )}
      </div>
    </header>
  )
}

export default StandardHeader

