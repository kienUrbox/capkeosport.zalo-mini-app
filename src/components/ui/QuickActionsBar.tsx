import React, { useState } from 'react';
import { QuickActionButton } from './QuickActionButton';
import { Icon } from './Icon';
import { QUICK_ACTIONS, STAGGER_DELAY } from '@/constants/design';

export interface QuickActionsBarProps {
  profileUrl?: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  onShare?: () => void;
  onQRCode?: () => void;
  onContact?: () => void;
  onAddContact?: () => void;
  onCopyLink?: () => void;
  visible?: boolean;
}

/**
 * QuickActionsBar Component
 *
 * Floating quick actions bar for the profile page.
 * Fixed at bottom with glass morphism effect.
 * Features staggered entrance animations and haptic feedback.
 *
 * @example
 * ```tsx
 * <QuickActionsBar
 *   userName={user?.name}
 *   profileUrl={shareUrl}
 *   onShare={() => handleShare()}
 *   onQRCode={() => setShowQR(true)}
 *   onContact={() => navigate(appRoutes.chat)}
 *   onCopyLink={() => handleCopyLink()}
 *   visible={!scrolling}
 * />
 * ```
 */
export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  profileUrl,
  userId,
  userName,
  userPhone,
  onShare,
  onQRCode,
  onContact,
  onAddContact,
  onCopyLink,
  visible = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!profileUrl) return;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }

    onCopyLink?.();
  };

  const handleShare = async () => {
    if (navigator.share && profileUrl && userName) {
      try {
        await navigator.share({
          title: `Hồ sơ của ${userName}`,
          text: `Xem hồ sơ của ${userName} trên SportHub`,
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled or failed:', err);
      }
    } else {
      onShare?.();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe animate-slide-up">
      {/* Glass morphism container */}
      <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl rounded-t-3xl border-t border-gray-200/50 dark:border-white/10 shadow-lg">
        {/* Top gradient accent line */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-gradient-to-r from-primary via-green-400 to-primary rounded-full" />
        </div>

        {/* Actions grid */}
        <div className="grid grid-cols-5 gap-1 px-2 pb-4">
          {/* Share - Primary action */}
          <QuickActionButton
            type={QUICK_ACTIONS.SHARE}
            onPress={handleShare}
            delay={STAGGER_DELAY.xs}
            variant="primary"
          />

          {/* QR Code */}
          <QuickActionButton
            type={QUICK_ACTIONS.QR_CODE}
            onPress={onQRCode}
            delay={STAGGER_DELAY.sm}
            variant="glass"
          />

          {/* Contact */}
          <QuickActionButton
            type={QUICK_ACTIONS.CONTACT}
            onPress={onContact}
            delay={STAGGER_DELAY.md}
            variant="glass"
            disabled={!onContact}
          />

          {/* Add Contact */}
          <QuickActionButton
            type={QUICK_ACTIONS.ADD_CONTACT}
            onPress={onAddContact}
            delay={STAGGER_DELAY.lg}
            variant="glass"
            disabled={!userPhone}
          />

          {/* Copy Link */}
          <div className="relative">
            <QuickActionButton
              type={QUICK_ACTIONS.COPY_LINK}
              onPress={handleCopyLink}
              delay={STAGGER_DELAY.xl}
              variant="glass"
            />
            {/* Copied indicator */}
            {copied && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 animate-icon-bounce">
                <Icon name="check" className="text-xs" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;
