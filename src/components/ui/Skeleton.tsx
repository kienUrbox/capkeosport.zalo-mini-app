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
      <div className="relative z-50 pt-4 px-4 flex justify-between items-center safe-area-top">
        <SkeletonBase className="h-10 w-10 rounded-full" />

        {/* Team Selector Skeleton */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 mx-2">
          <div className="relative flex h-2 w-2 shrink-0">
            <SkeletonBase className="absolute inline-flex h-full w-full rounded-full" />
          </div>
          <SkeletonBase className="h-3 w-24" />
          <SkeletonBase className="h-4 w-4" />
        </div>

        {/* Filter Button Skeleton */}
        <SkeletonBase className="h-10 w-10 rounded-full" />
      </div>

      {/* Card Stack Skeleton */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 relative mt-4">
        {/* Main Card Skeleton */}
        <div className="absolute w-full max-w-sm aspect-[3/4] max-h-[65vh] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
          {/* Image Area Skeleton */}
          <div className="relative h-[55%] w-full">
            <SkeletonBase className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {/* Match Badge Skeleton */}
            <div className="absolute top-4 right-4">
              <SkeletonBase className="h-8 w-16 rounded-lg" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 px-5 pb-5 flex flex-col items-center -mt-16 relative z-20">
            {/* Logo Skeleton */}
            <SkeletonBase className="size-16 rounded-full border-4 border-white dark:border-surface-dark mb-1" />

            {/* Team Name Skeleton */}
            <SkeletonBase className="h-7 w-40 mb-1 mt-2" />

            {/* Location & Level Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <SkeletonBase className="h-4 w-16" />
              <SkeletonBase className="h-4 w-1" />
              <SkeletonBase className="h-4 w-12" />
            </div>

            {/* Members Skeleton */}
            <SkeletonBase className="h-10 w-full rounded-xl mb-4" />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="flex flex-col items-center p-2 rounded-xl border border-gray-100 dark:border-white/5">
                <SkeletonBase className="h-5 w-5 rounded-full mb-1" />
                <SkeletonBase className="h-4 w-6" />
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl border border-gray-100 dark:border-white/5">
                <SkeletonBase className="h-5 w-5 rounded-full mb-1" />
                <SkeletonBase className="h-4 w-6" />
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl border border-gray-100 dark:border-white/5">
                <SkeletonBase className="h-5 w-5 rounded-full mb-1" />
                <SkeletonBase className="h-4 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Next Card Skeleton (smaller, behind) */}
        <div className="absolute w-full max-w-sm aspect-[3/4] max-h-[65vh] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden scale-95 translate-y-2 opacity-60">
          <SkeletonBase className="w-full h-full" />
        </div>
      </div>

      {/* Swipe Actions Skeleton */}
      <div className="pb-8 pt-2 px-4 flex items-center justify-center gap-8 z-20">
        <SkeletonBase className="size-16 rounded-full" />
        <SkeletonBase className="size-12 rounded-full" />
        <SkeletonBase className="size-16 rounded-full" />
      </div>
    </div>
  );
};

export { SkeletonBase as Skeleton };
export default SkeletonBase;
