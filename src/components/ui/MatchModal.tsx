import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { MatchRequestModal, type OpponentTeamInfo } from './MatchRequestModal';
import type { DiscoveredTeam } from '@/services/api/discovery.service';
import './MatchModal.css';

export interface MatchModalProps {
  isOpen: boolean;
  matchedTeam: DiscoveredTeam | null;
  myTeamLogo?: string;
  myTeamName?: string;
  myTeamId?: string;
  matchId?: string; // Match ID from API response
  onKeepSwiping: () => void;
}

interface ConfettiParticle {
  id: number;
  color: string;
  size: number;
  left: string;
  delay: string;
  drift: string;
}

const CONFETTI_COLORS = [
  '#11d473', // primary green
  '#facc15', // gold/yellow
  '#3b82f6', // blue
  '#ef4444', // red
  '#ffffff', // white
  '#fbbf24', // amber
  '#10b981', // emerald
];

const generateConfetti = (): ConfettiParticle[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 10 + 6,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    drift: `${(Math.random() - 0.5) * 200}px`,
  }));
};

/**
 * MatchModal Component - FOOTBALL SPORTS STYLE
 *
 * Shown IMMEDIATELY when match happens:
 * - Sports celebration with energy
 * - Stadium light effects
 * - Confetti particles
 * - Scoreboard-style VS display
 * - Two buttons: "Gửi lời mời" + "Tiếp tục swipe"
 */
export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  matchedTeam,
  myTeamLogo,
  myTeamName,
  myTeamId,
  matchId,
  onKeepSwiping,
}) => {
  const [showMatchRequestModal, setShowMatchRequestModal] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (isOpen) {
      setConfettiParticles(generateConfetti());

      // Haptic feedback - sports celebration pattern
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80, 40, 120]);
      }
    } else {
      setTimeout(() => setConfettiParticles([]), 500);
    }
  }, [isOpen]);

  if (!isOpen || !matchedTeam) return null;

  const opponentTeamInfo: OpponentTeamInfo = {
    id: matchedTeam.id,
    name: matchedTeam.name,
    logo: matchedTeam.logo,
    level: matchedTeam.level,
  };

  const myTeamInfo: OpponentTeamInfo = {
    id: myTeamId || '',
    name: myTeamName || 'Đội của bạn',
    logo: myTeamLogo,
  };

  // Use matchId from prop if available (from API response), otherwise fallback to team id
  const actualMatchId = matchId || matchedTeam.id;

  const handleSendInvite = () => {
    setShowMatchRequestModal(true);
  };

  const handleInviteSuccess = () => {
    setShowMatchRequestModal(false);
    onKeepSwiping();
  };

  const handleInviteClose = () => {
    setShowMatchRequestModal(false);
  };

  return (
    <div className="match-modal-overlay">
      {/* Backdrop */}
      <div className="match-modal-backdrop" />

      {/* Match Modal Content */}
      <div className="match-modal-content">

        {/* Football Field Grid Background */}
        <div className="football-field-bg" />

        {/* Energy Rings - Stadium Light Effect */}
        <div className="energy-ring" />
        <div className="energy-ring" />
        <div className="energy-ring" />

        {/* Sparkle Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${20 + (i * 6)}%`,
              top: `${20 + ((i % 4) * 20)}%`,
              animationDelay: `${i * 0.2}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Confetti Container */}
        <div className="confetti-container">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="confetti-particle"
              style={{
                '--drift': particle.drift,
                left: particle.left,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                animationDelay: particle.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Header */}
        <div className="match-header">
          <div className="match-badge">
            <Icon name="sports_soccer" className="match-icon" filled />
          </div>
          <h2 className="match-title">MATCH KÈO!</h2>
          <p className="match-subtitle">
            <span className="team-names">{myTeamName}</span> và <span className="team-names">{matchedTeam.name}</span> đã tìm thấy nhau!
          </p>
        </div>

        {/* Scoreboard / VS Section */}
        <div className="scoreboard">
          {/* My Team */}
          <div className="team-score team-score-left">
            <div className="team-avatar-container">
              <div className="team-avatar">
                {myTeamLogo ? (
                  <img src={myTeamLogo} alt={myTeamName} className="team-avatar-image" />
                ) : (
                  <div className="team-avatar-placeholder team-avatar-placeholder-my">
                    {myTeamName?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="team-avatar-glow" />
            </div>
            <p className="team-name">{myTeamName || 'Đội của bạn'}</p>
          </div>

          {/* VS Badge */}
          <div className="vs-section">
            <div className="vs-badge">
              <span className="vs-text">VS</span>
            </div>
            <span className="match-label">ĐỐI THỦ</span>
          </div>

          {/* Opponent Team */}
          <div className="team-score team-score-right">
            <div className="team-avatar-container">
              <div className="team-avatar">
                {matchedTeam.logo ? (
                  <img src={matchedTeam.logo} alt={matchedTeam.name} className="team-avatar-image" />
                ) : (
                  <div className="team-avatar-placeholder team-avatar-placeholder-opponent">
                    {matchedTeam.name?.charAt(0) || 'T'}
                  </div>
                )}
              </div>
              <div className="team-avatar-glow" />
            </div>
            <p className="team-name">{matchedTeam.name}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`actions-section${showMatchRequestModal ? ' actions-section-hidden' : ''}`}>
          <button
            onClick={handleSendInvite}
            className="action-button action-button-primary"
          >
            <span className="button-icon">
              <Icon name="send" filled />
            </span>
            <span className="button-text">Gửi lời mời giao lưu</span>
          </button>

          <button
            onClick={onKeepSwiping}
            className="action-button action-button-secondary"
          >
            <span className="button-icon">
              <Icon name="refresh" />
            </span>
            <span className="button-text">Tiếp tục tìm kèo</span>
          </button>
        </div>

        {/* Dim overlay when MatchRequestModal is open */}
        {showMatchRequestModal && (
          <div className="match-dim-overlay" />
        )}

        {/* MatchRequestModal - Nested */}
        {showMatchRequestModal && (
          <div className="match-request-modal-wrapper">
            <MatchRequestModal
              isOpen={showMatchRequestModal}
              mode="send"
              matchId={actualMatchId}
              myTeam={myTeamInfo}
              opponentTeam={opponentTeamInfo}
              onClose={handleInviteClose}
              onSuccess={handleInviteSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchModal;
