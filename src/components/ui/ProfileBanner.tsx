import React from 'react';
import { JerseyPositionBadge } from './JerseyPositionBadge';

export interface ProfileBannerProps {
  bannerUrl?: string | null;
  userName?: string;
  userAvatar?: string | null;
  userPhone?: string;
  userPosition?: string;
  userJerseyNumber?: number;
  userBio?: string;
  isOnline?: boolean;
  onEditClick?: () => void;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
}

/**
 * ProfileBanner Component
 *
 * Simplified profile banner matching the reference design from stitch_home_screen_dark_mode.
 * - Fixed 192px height banner with gradient overlay
 * - Avatar (96px) overlapping banner bottom by -12px with blue border
 * - User info (name, phone, badge) centered below banner
 * - Glass morphism badge for jersey number and position
 *
 * @example
 * ```tsx
 * <ProfileBanner
 *   bannerUrl={user?.banner}
 *   userName={user?.name}
 *   userAvatar={user?.avatar}
 *   userPhone={user?.phone}
 *   userPosition={user?.position}
 *   userJerseyNumber={user?.jerseyNumber}
 *   userBio={user?.bio}
 *   onEditClick={() => navigate(appRoutes.profileEdit)}
 * />
 * ```
 */
export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  bannerUrl,
  userName,
  userAvatar,
  userPhone,
  userPosition,
  userJerseyNumber,
  userBio,
  isOnline = true,
  onEditClick,
  minHeight = 240,
  maxHeight = 400,
  defaultHeight = 280,
}) => {
  return (
    <div className="flex flex-col">
      {/* Banner Section */}
      <div className="relative w-full">
        {/* Banner Image - Fixed 192px height */}
        <div className="h-64 w-full bg-cover bg-center bg-gray-200 dark:bg-transparent" style={{ backgroundImage: bannerUrl ? `url("${bannerUrl}")` : undefined }}>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bottom-[-1px] bg-gradient-to-t from-background-dark to-transparent dark:from-background-dark dark:to-transparent" />
          <div className="absolute inset-0 bottom-[-1px] bg-gradient-to-t from-white/80 to-transparent dark:from-transparent" />

          {/* Fallback gradient if no banner */}
          {!bannerUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#006af6] via-blue-600 to-cyan-500 dark:from-[#006af6] dark:via-blue-600 dark:to-cyan-500" />
          )}
        </div>

        {/* Avatar - Overlapping banner bottom */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Background padding - matches theme */}
          <div className="p-1.5 rounded-full bg-white dark:bg-background-dark shadow-lg">
            {/* Avatar with blue border */}
            <div
              className="
                h-24 w-24
                rounded-full
                bg-cover bg-center
                border-2 border-[#006af6]
                overflow-hidden
              "
              style={{ backgroundImage: userAvatar ? `url("${userAvatar}")` : undefined }}
            >
              {/* Fallback avatar */}
              {!userAvatar && (
                <div className="w-full h-full bg-gradient-to-br from-[#006af6] to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>

          {/* Online status indicator */}
          {isOnline && (
            <div className="absolute bottom-0 right-0 bg-green-500 size-5 rounded-full border-3 border-transparent shadow-lg shadow-green-500/30" />
          )}
        </div>
      </div>

      {/* User Info Section - Below Banner */}
      <div className="mt-14 flex flex-col items-center px-4">
        {/* Name */}
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          {userName || 'Người dùng'}
        </h1>

        {/* Phone */}
        <p className="text-gray-600 dark:text-[#9aa9bc] text-base font-normal mt-1">
          {userPhone || 'Chưa cập nhật số điện thoại'}
        </p>

        {/* Jersey Number & Position Badge */}
        <JerseyPositionBadge
          jerseyNumber={userJerseyNumber}
          position={userPosition}
          className="mt-3"
        />

        {/* Bio (optional) */}
        {userBio && (
          <p className="text-xs text-gray-700 dark:text-white/80 text-center max-w-xs line-clamp-2 leading-relaxed mt-2">
            {userBio}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;
