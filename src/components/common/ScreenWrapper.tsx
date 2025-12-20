import type { ReactNode } from 'react'
import AppHeader from './AppHeader'

type ScreenWrapperProps = {
  title: string
  subtitle?: string
  headerRight?: ReactNode
  children: ReactNode
}

const ScreenWrapper = ({
  title,
  subtitle,
  headerRight,
  children,
}: ScreenWrapperProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-white">
      <AppHeader title={title} subtitle={subtitle} rightSlot={headerRight} />
      <div className="flex flex-1 flex-col gap-4 px-4 pb-6">{children}</div>
    </div>
  )
}

export default ScreenWrapper

