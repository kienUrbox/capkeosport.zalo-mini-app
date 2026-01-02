import React from 'react';

export interface TeamAvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * TeamAvatar Component
 *
 * Circular team logo avatar with multiple size options.
 *
 * @example
 * ```tsx
 * <TeamAvatar src={team.logo} size="md" />
 * <TeamAvatar src={team.logo} size="lg" className="border-primary" />
 * ```
 */
export const TeamAvatar: React.FC<TeamAvatarProps> = ({
  src,
  size = 'md',
  className = '',
}) => {
  const sizes: Record<NonNullable<TeamAvatarProps['size']>, string> = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
    xl: 'h-24 w-24',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-surface-dark border-2 border-gray-200 dark:border-white/10 p-0.5 overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt="Team"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

export default TeamAvatar;
