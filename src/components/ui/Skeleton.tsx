import React from 'react';

interface SkeletonBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SkeletonBase: React.FC<SkeletonBaseProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      {...props}
    />
  );
};

// Dashboard Skeleton - Full page loading
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex flex-col gap-6 pb-safe-with-nav">
        {/* Header Skeleton */}
        <div className="pt-8 px-5 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <SkeletonBase className="h-4 w-24 mb-1" />
            <SkeletonBase className="h-8 w-48" />
            <SkeletonBase className="h-4 w-36" />
          </div>
          <SkeletonBase className="h-11 w-11 rounded-full" />
        </div>

        {/* Invitation Skeleton */}
        <div className="px-5">
          <div className="flex items-center gap-2 mb-3">
            <SkeletonBase className="h-2 w-2 rounded-full" />
            <SkeletonBase className="h-6 w-32" />
          </div>
          <SkeletonBase className="h-32 w-full rounded-2xl" />
        </div>

        {/* Main Actions Skeleton */}
        <div className="px-5 flex flex-col gap-4">
          <SkeletonBase className="h-20 w-full rounded-2xl" />
          <SkeletonBase className="h-20 w-full rounded-2xl" />
        </div>

        {/* Match Card Skeleton */}
        <div className="px-5">
          <SkeletonBase className="h-6 w-28 mb-4" />
          <SkeletonBase className="h-44 w-full rounded-2xl" />
        </div>

        {/* Nearby Teams Skeleton */}
        <div className="pl-5 pb-4">
          <div className="flex items-center justify-between mb-3 pr-5">
            <SkeletonBase className="h-6 w-32" />
            <SkeletonBase className="h-6 w-6" />
          </div>
          <div className="flex gap-3 pb-4 pr-5">
            {[1, 2, 3].map((i) => (
              <SkeletonBase key={i} className="min-w-[140px] h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Invitation Card Skeleton
export const InvitationSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-surface-dark border-l-4 border-gray-300 dark:border-gray-600 rounded-r-2xl p-4 shadow-md">
      <div className="flex items-center gap-3">
        <SkeletonBase className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <SkeletonBase className="h-4 w-48 mb-2" />
          <SkeletonBase className="h-5 w-36 mb-1" />
          <SkeletonBase className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <SkeletonBase className="h-9 flex-1 rounded-lg" />
        <SkeletonBase className="h-9 flex-1 rounded-lg" />
        <SkeletonBase className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
};

// Match Card Skeleton
export const MatchCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 p-5 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <SkeletonBase className="h-7 w-28 rounded-full" />
        <SkeletonBase className="h-10 w-10 rounded-lg" />
      </div>

      <div className="flex gap-4 items-start mb-5">
        <SkeletonBase className="w-16 h-16 rounded-xl" />
        <div className="flex flex-col gap-2">
          <SkeletonBase className="h-6 w-56" />
          <SkeletonBase className="h-5 w-40" />
          <SkeletonBase className="h-4 w-48" />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
        <SkeletonBase className="flex-1 h-10 rounded-lg" />
        <SkeletonBase className="flex-1 h-10 rounded-lg" />
      </div>
    </div>
  );
};

// Team Card Skeleton (for nearby teams)
export const TeamCardSkeleton: React.FC = () => {
  return (
    <div className="min-w-[140px] flex flex-col items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5">
      <SkeletonBase className="h-14 w-14 rounded-full mb-3" />
      <SkeletonBase className="h-4 w-24 mb-2" />
      <SkeletonBase className="h-5 w-16 rounded-full" />
    </div>
  );
};

// Schedule Screen Skeletons

export const SchedulePendingSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <SkeletonBase className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-32 mb-2" />
        <SkeletonBase className="h-6 w-24 rounded-full" />
      </div>
    </div>
    <SkeletonBase className="h-16 w-full rounded-lg mb-3" />
    <div className="flex gap-3">
      <SkeletonBase className="flex-1 h-10 rounded-lg" />
      <SkeletonBase className="flex-1 h-10 rounded-lg" />
    </div>
  </div>
);

export const ScheduleUpcomingSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <SkeletonBase className="h-7 w-28 rounded-full" />
      <SkeletonBase className="h-5 w-20" />
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-col items-center gap-2 w-1/3">
        <SkeletonBase className="h-14 w-14 rounded-full" />
        <SkeletonBase className="h-4 w-20" />
      </div>
      <div className="flex flex-col items-center justify-center w-1/3">
        <SkeletonBase className="h-8 w-16" />
        <SkeletonBase className="h-4 w-12 mt-1" />
      </div>
      <div className="flex flex-col items-center gap-2 w-1/3">
        <SkeletonBase className="h-14 w-14 rounded-full" />
        <SkeletonBase className="h-4 w-20" />
      </div>
    </div>
    <SkeletonBase className="h-10 w-full rounded-lg" />
  </div>
);

export const ScheduleHistorySkeleton: React.FC = () => (
  <div className="bg-white dark:bg-surface-dark p-0 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden animate-pulse">
    <SkeletonBase className="h-1.5 w-full" />
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <SkeletonBase className="h-4 w-16" />
        <SkeletonBase className="h-4 w-24" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <SkeletonBase className="h-14 w-14 rounded-full" />
        <SkeletonBase className="h-8 w-16" />
        <SkeletonBase className="h-14 w-14 rounded-full" />
      </div>
      <div className="flex gap-3">
        <SkeletonBase className="flex-1 h-9 rounded-lg" />
        <SkeletonBase className="flex-1 h-9 rounded-lg" />
      </div>
    </div>
  </div>
);

// Teams Screen Skeleton
export const TeamsCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <SkeletonBase className="h-16 w-16 rounded-full shrink-0" />
      <div className="flex-1">
        <SkeletonBase className="h-5 w-40 mb-2 rounded" />
        <SkeletonBase className="h-4 w-24 rounded" />
      </div>
    </div>
    <div className="pt-3 border-t border-gray-100 dark:border-white/5">
      <SkeletonBase className="h-16 w-full rounded-lg" />
    </div>
  </div>
);

// Team Detail Skeleton
export const TeamDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Cover & Logo Skeleton */}
      <div className="relative">
        <SkeletonBase className="h-40 w-full" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <SkeletonBase className="size-24 rounded-full border-4 border-background-light dark:border-background-dark" />
        </div>
      </div>

      {/* Title & Tags Skeleton */}
      <div className="mt-12 text-center px-4">
        <SkeletonBase className="h-8 w-48 mx-auto mb-3 rounded" />
        <div className="flex justify-center gap-2">
          <SkeletonBase className="h-8 w-20 rounded-full" />
          <SkeletonBase className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Info Card Skeleton */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5 space-y-4 shadow-sm">
          <div className="flex gap-3">
            <SkeletonBase className="size-8 rounded-full shrink-0" />
            <div className="flex-1">
              <SkeletonBase className="h-3 w-16 mb-2 rounded" />
              <SkeletonBase className="h-4 w-48 rounded" />
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>
          <div className="flex gap-3">
            <SkeletonBase className="size-8 rounded-full shrink-0" />
            <div className="flex-1">
              <SkeletonBase className="h-3 w-16 mb-2 rounded" />
              <SkeletonBase className="h-4 w-32 rounded" />
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>
          <div className="flex gap-3">
            <SkeletonBase className="size-8 rounded-full shrink-0" />
            <div className="flex-1">
              <SkeletonBase className="h-3 w-16 mb-2 rounded" />
              <SkeletonBase className="h-4 w-full rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="px-4 mt-6">
        <SkeletonBase className="h-6 w-28 mb-3 rounded" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-2">
              <SkeletonBase className="size-10 rounded-full" />
              <SkeletonBase className="h-3 w-12 rounded" />
              <SkeletonBase className="h-6 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Members Skeleton */}
      <div className="px-4 mt-6">
        <SkeletonBase className="h-6 w-40 mb-3 rounded" />
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <SkeletonBase key={i} className="size-10 rounded-full border-2 border-white dark:border-surface-dark" />
              ))}
              <SkeletonBase className="size-10 rounded-full border-2 border-white dark:border-surface-dark" />
            </div>
            <div className="flex flex-col">
              <SkeletonBase className="h-4 w-20 mb-1 rounded" />
              <SkeletonBase className="h-3 w-24 rounded" />
            </div>
          </div>
          <SkeletonBase className="size-8 rounded-full" />
        </div>
      </div>

      {/* Floating Action Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 z-40">
        <div className="flex gap-3 max-w-md mx-auto">
          <SkeletonBase className="flex-1 h-11 rounded-lg" />
          <SkeletonBase className="flex-[1.5] h-11 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// Find Match Screen Skeleton (Tinder-style swipe interface)
export const FindMatchSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />

      {/* Header Skeleton */}
      <div className="relative z-50 pt-12 pb-2 px-4 flex justify-center shrink-0">
        {/* Team Selector Skeleton - Centered */}
        <div className="flex items-center gap-2 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md pl-4 pr-5 py-2 rounded-full shadow-lg border border-white/5">
          <SkeletonBase className="h-6 w-6 rounded-full" />
          <SkeletonBase className="h-4 w-32" />
          <SkeletonBase className="h-4 w-4" />
        </div>

        {/* Back Button Skeleton - Absolute Left */}
        <SkeletonBase className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" />

        {/* Filter Button Skeleton - Absolute Right */}
        <SkeletonBase className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" />
      </div>

      {/* Card Stack Skeleton */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 relative overflow-visible">
        {/* Decorative Stack Layers */}
        <SkeletonBase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)] w-[82%] h-[calc(100%-24px)] rounded-[2.5rem] border opacity-40" />
        <SkeletonBase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)] w-[82%] h-[calc(100%-24px)] rounded-[2.5rem] border opacity-70" />

        {/* Main Card Skeleton */}
        <div className="relative w-full max-w-[360px] h-[72vh] max-h-[660px] bg-surface-light dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
          {/* Image Area Skeleton - 35% height */}
          <div className="relative h-[35%] w-full bg-surface-light overflow-hidden shrink-0">
            <SkeletonBase className="w-full h-full" />
            <div className="absolute inset-0 bg-surface-light/60 dark:bg-surface-dark/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-light dark:from-surface-dark via-transparent to-transparent" />

            {/* Compatibility Badge Skeleton - Top Left */}
            <SkeletonBase className="absolute top-4 left-4 h-7 w-24 rounded-lg" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 flex flex-col pt-16 px-6 pb-6 items-center bg-surface-light dark:bg-surface-dark">
            {/* Circular Logo Skeleton - positioned at top-[22%] */}
            <div className="absolute top-[22%] left-1/2 -translate-x-1/2 z-10">
              <SkeletonBase className="w-28 h-28 rounded-full border-4 border-surface-light dark:border-surface-dark" />
            </div>

            {/* Team Name + Verified Badge Skeleton */}
            <div className="flex items-center gap-2 mb-1">
              <SkeletonBase className="h-7 w-40" />
              <SkeletonBase className="h-6 w-6 rounded-full" />
            </div>

            {/* Online Status Skeleton */}
            <SkeletonBase className="h-4 w-28 mb-1" />

            {/* Location Skeleton */}
            <SkeletonBase className="h-4 w-32 mb-4" />

            {/* Badges: Level + Members Skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <SkeletonBase className="h-4 w-4 rounded-full" />
                <SkeletonBase className="h-4 w-12" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <SkeletonBase className="h-4 w-4 rounded-full" />
                <SkeletonBase className="h-4 w-20" />
              </div>
            </div>

            {/* Description Skeleton */}
            <SkeletonBase className="h-10 w-full rounded-lg mb-6" />

            {/* Stats Grid Skeleton - 3 cols with progress bars */}
            <div className="grid grid-cols-3 gap-3 w-full mb-auto">
              <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-2xl p-3 flex flex-col items-center gap-1 border border-gray-200 dark:border-white/5">
                <SkeletonBase className="h-3 w-12 mb-1" />
                <SkeletonBase className="h-6 w-8" />
                <SkeletonBase className="w-full h-1.5 rounded-full" />
              </div>
              <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-2xl p-3 flex flex-col items-center gap-1 border border-gray-200 dark:border-white/5">
                <SkeletonBase className="h-3 w-12 mb-1" />
                <SkeletonBase className="h-6 w-8" />
                <SkeletonBase className="w-full h-1.5 rounded-full" />
              </div>
              <div className="bg-surface-light/50 dark:bg-surface-dark/50 rounded-2xl p-3 flex flex-col items-center gap-1 border border-gray-200 dark:border-white/5">
                <SkeletonBase className="h-3 w-12 mb-1" />
                <SkeletonBase className="h-6 w-8" />
                <SkeletonBase className="w-full h-1.5 rounded-full" />
              </div>
            </div>

            {/* Info Grid Skeleton - 2 cols: Sân bóng, Cách xa */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/5">
                <SkeletonBase className="h-5 w-5 rounded-full" />
                <div className="flex flex-col items-start gap-1">
                  <SkeletonBase className="h-2 w-12" />
                  <SkeletonBase className="h-4 w-16" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/5">
                <SkeletonBase className="h-5 w-5 rounded-full" />
                <div className="flex flex-col items-start gap-1">
                  <SkeletonBase className="h-2 w-12" />
                  <SkeletonBase className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Card Skeleton (smaller, behind) */}
        <div className="absolute w-full max-w-[360px] h-[72vh] max-h-[660px] bg-surface-light dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-white/10 scale-95 translate-y-2 opacity-60" />
      </div>

      {/* Swipe Actions Skeleton - Only 2 buttons */}
      <div className="relative z-20 w-full flex items-center justify-center gap-10 pb-12 pt-4 px-6 shrink-0">
        <SkeletonBase className="w-[72px] h-[72px] rounded-full" />
        <SkeletonBase className="w-[84px] h-[84px] rounded-full" />
      </div>
    </div>
  );
};

// Profile Screen Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Banner Skeleton */}
      <div className="h-32 bg-gray-200 dark:bg-gray-700" />

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Avatar Skeleton */}
        <div className="flex flex-col items-center -mt-16 mb-6">
          <SkeletonBase className="size-28 rounded-full border-4 border-white dark:border-surface-dark" />
          <SkeletonBase className="h-6 w-32 mt-3 rounded" />
          <SkeletonBase className="h-4 w-40 mt-2 rounded" />
        </div>

        {/* Stats Skeleton */}
        <div>
          <SkeletonBase className="h-5 w-28 mb-3 rounded" />
          <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <SkeletonBase className="h-4 w-20 rounded" />
                  <SkeletonBase className="h-4 w-8 rounded" />
                </div>
                <SkeletonBase className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Teams Skeleton */}
        <div>
          <SkeletonBase className="h-5 w-32 mb-3 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <SkeletonBase className="h-12 w-12 rounded-full" />
                  <div>
                    <SkeletonBase className="h-4 w-32 mb-2 rounded" />
                    <SkeletonBase className="h-3 w-20 rounded" />
                  </div>
                </div>
                <SkeletonBase className="h-5 w-5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SkeletonBase as Skeleton };
export default SkeletonBase;
