import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Header,
  ThemeSwitch,
  ProfileBanner,
  StatsSection,
  SettingsSection,
  SettingsMenuItem,
  Icon,
} from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { useUser, useAuthActions, useAuthStore } from '@/stores/auth.store';

/**
 * Profile Screen
 *
 * User profile with integrated banner showing all user info.
 * - Transparent header overlaying the banner
 * - Pull-to-refresh to reload profile
 * - All user info (avatar, name, phone, position, bio) grouped on banner
 * - Stats display with progress bars and indicator dots
 * - Enhanced settings menu with grouped sections
 */
const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const { getProfile } = useAuthActions();
  const authStore = useAuthStore();

  // Pull-to-refresh state
  const [pullState, setPullState] = useState({
    isPulling: false,
    pullDistance: 0,
    shouldRefresh: false,
  });

  // Refs for pull-to-refresh
  const touchStartY = useRef(0);
  const currentScrollTop = useRef(0);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    currentScrollTop.current = e.currentTarget.scrollTop;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only allow pull when at the top
    if (currentScrollTop.current > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    // Only respond to downward pull
    if (diff > 0) {
      setPullState({
        isPulling: true,
        pullDistance: Math.min(diff * 0.5, 120), // Damping effect
        shouldRefresh: diff > 100,
      });
    }
  };

  const handleTouchEnd = async () => {
    if (pullState.shouldRefresh) {
      // Force refresh profile from API
      await handleRefresh();
    }

    setPullState({
      isPulling: false,
      pullDistance: 0,
      shouldRefresh: false,
    });
  };

  // Refresh handler
  const handleRefresh = async () => {
    try {
      await getProfile(true); // forceRefresh = true
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Default stats values (DB stores max 100)
  const defaultStats = { attack: 75, defense: 70, technique: 75 };
  const stats = user?.playerStats || defaultStats;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Transparent Header overlaying banner - no back or settings button */}
      <Header
        title=""
        showBack={false}
        transparent={true}
      />

      {/* Pull-to-refresh indicator */}
      {pullState.isPulling && (
        <div
          className="flex items-center justify-center transition-all duration-150 overflow-hidden"
          style={{ height: pullState.pullDistance, opacity: pullState.pullDistance / 120 }}
        >
          <Icon
            name="refresh"
            className={`text-primary ${pullState.shouldRefresh ? 'animate-spin' : ''}`}
          />
        </div>
      )}

      {/* Refresh indicator */}
      {authStore.isLoading && !pullState.isPulling && user && (
        <div className="flex items-center justify-center py-2">
          <Icon name="refresh" className="animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
        </div>
      )}

      <div
        className="overflow-y-auto pb-safe-with-nav"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Hero Banner with ALL user info integrated */}
        <ProfileBanner
          bannerUrl={user?.banner}
          userName={user?.name}
          userAvatar={user?.avatar}
          userPhone={user?.phone}
          userPosition={user?.position}
          userJerseyNumber={user?.jerseyNumber}
          userBio={user?.bio}
          isOnline={true}
        />

        {/* Content sections - now directly below banner */}
        <div className="flex flex-col gap-6 px-4 pt-6 pb-4">
          {/* Player Stats - Using new StatsSection component */}
          <StatsSection
            stats={stats}
            maxValue={100}
            showInfo={true}
          />

          {/* Settings Menu - Unified section */}
          <SettingsSection title="Cài đặt">
            <ThemeSwitch />
            <SettingsMenuItem
              icon="notifications"
              label="Thông báo"
              badge="3"
              onClick={() => navigate(appRoutes.notifications)}
            />
            <SettingsMenuItem
              icon="edit"
              label="Chỉnh sửa hồ sơ"
              onClick={() => navigate(appRoutes.profileEdit)}
            />
            <SettingsMenuItem
              icon="help"
              label="Trợ giúp & Hỗ trợ"
              onClick={() => console.log('Help')}
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
