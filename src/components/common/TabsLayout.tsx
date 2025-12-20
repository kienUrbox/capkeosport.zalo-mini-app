import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { ICONS } from '../../constants/design'
import BottomNav from './BottomNav'

const tabs = [
  { id: 'home', label: 'Home', icon: ICONS.home, path: '/home' },
  { id: 'swipe', label: 'Cáp kèo', icon: ICONS.swords, path: '/swipe' },
  { id: 'matches', label: 'Kèo', icon: ICONS.event_upcoming, path: '/matches' },
  { id: 'teams', label: 'Đội', icon: ICONS.groups, path: '/teams' },
  { id: 'account', label: 'Tài khoản', icon: ICONS.person, path: '/account' },
]

const TabsLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <div className="flex-1">
        <Outlet />
      </div>
      <BottomNav
        items={tabs.map((tab) => ({
          ...tab,
          active: location.pathname.startsWith(tab.path),
          onClick: () => navigate(tab.path),
        }))}
      />
    </div>
  )
}

export default TabsLayout

