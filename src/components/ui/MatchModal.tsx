import React from 'react';
import { Icon } from './Icon';
import { TeamAvatar } from './TeamAvatar';
import type { DiscoveredTeam } from '@/services/api/discovery.service';

export interface MatchModalProps {
  isOpen: boolean;
  matchedTeam: DiscoveredTeam | null;
  myTeamLogo?: string;
  myTeamName?: string;
  onViewMatch: (matchId: string) => void;
  onKeepSwiping: () => void;
}

/**
 * MatchModal Component
 *
 * Celebration modal shown when both teams like each other:
 * - "It's a Match!" header with animation
 * - Both teams' logos facing each other
 * - View match / Keep swiping buttons
 */
export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  matchedTeam,
  myTeamLogo,
  myTeamName,
  onViewMatch,
  onKeepSwiping,
}) => {
  if (!isOpen || !matchedTeam) return null;

  // Get match ID from response data
  const matchId = matchedTeam.id; // This would normally come from the match object in swipe response

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Match Animation Container */}
        <div className="relative mb-8">
          {/* Animated hearts */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" style={{ animationDuration: '1s' }} />
              <div className="absolute inset-4 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
            </div>
          </div>

          {/* Match Badge */}
          <div className="relative bg-gradient-to-br from-primary to-green-600 text-white px-8 py-4 rounded-full shadow-2xl">
            <div className="flex items-center gap-2">
              <Icon name="favorite" className="text-2xl animate-pulse" filled />
              <span className="text-2xl font-black tracking-wide">It's a Match!</span>
              <Icon name="favorite" className="text-2xl animate-pulse" filled />
            </div>
          </div>
        </div>

        {/* Teams Display */}
        <div className="flex items-center justify-center gap-6 mb-10 w-full">
          {/* My Team */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="size-24 rounded-full border-4 border-primary shadow-lg overflow-hidden bg-surface-dark">
                {myTeamLogo ? (
                  <img src={myTeamLogo} alt={myTeamName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                    {myTeamName?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full">
                Đội của bạn
              </div>
            </div>
          </div>

          {/* VS Icon */}
          <div className="flex flex-col items-center">
            <div className="size-12 rounded-full bg-surface-dark border-2 border-primary/50 flex items-center justify-center">
              <Icon name="sports_soccer" className="text-primary text-xl" />
            </div>
          </div>

          {/* Matched Team */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="size-24 rounded-full border-4 border-primary shadow-lg overflow-hidden bg-surface-dark">
                {matchedTeam.logo ? (
                  <img src={matchedTeam.logo} alt={matchedTeam.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                    {matchedTeam.name?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                {matchedTeam.name}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-white text-center text-lg font-medium mb-8 px-4">
          {myTeamName} và {matchedTeam.name} đã match với nhau!
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => onViewMatch(matchId)}
            className="w-full py-4 rounded-2xl bg-primary text-background-dark font-bold text-base shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
          >
            Xem kèo
          </button>
          <button
            onClick={onKeepSwiping}
            className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-bold text-base border border-white/20 hover:bg-white/20 active:scale-95 transition-all"
          >
            Tiếp tục swipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
