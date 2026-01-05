import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * Main Layout Component
 *
 * Wraps tab screens with persistent BottomNav to prevent remounting on navigation.
 * Only the Outlet content changes, BottomNav stays mounted.
 */
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') {
      setActiveTab('home');
    } else if (path.startsWith('/teams')) {
      setActiveTab('team');
    } else if (path.startsWith('/match')) {
      if (path.includes('/schedule')) {
        setActiveTab('schedule');
      } else {
        setActiveTab('match');
      }
    } else if (path.startsWith('/profile')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        navigate(appRoutes.dashboard, { replace: true });
        break;
      case 'schedule':
        navigate(appRoutes.matchSchedule, { replace: true });
        break;
      case 'match':
        navigate(appRoutes.matchFind, { replace: true });
        break;
      case 'team':
        navigate(appRoutes.teams, { replace: true });
        break;
      case 'profile':
        navigate(appRoutes.profile, { replace: true });
        break;
    }
  };

  return (
    <>
      <Outlet />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
};

export default MainLayout;
