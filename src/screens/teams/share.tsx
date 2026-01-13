import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCodeSVG from 'react-qr-code';
import { Button, Header, Icon, TeamAvatar } from '@/components/ui';
import { useTeamActions, useTeamStore } from '@/stores/team.store';
// import type { InviteTokenResponse } from '@/types/api.types';

/**
 * ShareTeam Screen
 *
 * Share team via QR code and link with native share.
 * Uses client-side QR generation with invite token from API.
 */
const ShareTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { createInviteToken } = useTeamActions();
  const inviteToken = useTeamStore((state) => state.inviteToken);

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load invite token on mount
  useEffect(() => {
    loadInviteToken();
  }, [teamId]);

  // Update tokenData when inviteToken changes in store
  useEffect(() => {
    if (inviteToken) {
      console.log('[ShareTeamScreen] Token data from store:', inviteToken);
    }
  }, [inviteToken]);

  // Countdown timer
  useEffect(() => {
    if (!inviteToken?.expiresAt) return;

    const updateRemaining = () => {
      const remaining = new Date(inviteToken.expiresAt).getTime() - Date.now();
      setTimeRemaining(remaining > 0 ? remaining : 0);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [inviteToken]);

  const loadInviteToken = async () => {
    if (!teamId) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('[ShareTeamScreen] Creating invite token for team:', teamId);

      const data = await createInviteToken(teamId, { expiryMinutes: 15 });

      console.log('[ShareTeamScreen] Received token data:', data);

      if (data) {
        // Token is already set in store by createInviteToken
        console.log('[ShareTeamScreen] Token created successfully');
      } else {
        console.warn('[ShareTeamScreen] No data returned from createInviteToken');
      }
    } catch (error: any) {
      console.error('[ShareTeamScreen] Failed to load invite token:', error);
      setError(error.message || 'Không thể tạo mã mời');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => loadInviteToken();

  const handleCopy = () => {
    if (inviteToken?.deepLink) {
      navigator.clipboard.writeText(inviteToken.deepLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareNative = async () => {
    if (navigator.share && inviteToken) {
      try {
        await navigator.share({
          title: `Mời tham gia đội`,
          text: `Tham gia đội bóng của chúng tôi trên Cap Kèo Sport nhé!`,
          url: inviteToken.deepLink,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleCopy();
    }
  };

  // Format remaining time as MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isExpired = timeRemaining <= 0;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Chia sẻ đội bóng" onBack={() => navigate(-1)} />

      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8 animate-fade-in">

        {/* Error message */}
        {error && (
          <div className="w-full max-w-sm p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <p className="text-sm text-center">{error}</p>
          </div>
        )}

        {/* Card Container */}
        <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center relative overflow-hidden">
          {/* Decorative Top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-dark via-primary to-primary-dark"></div>

          {/* Team Info */}
          <div className="mt-4 mb-6 text-center">
            <TeamAvatar src={inviteToken?.teamId ? '' : ''} size="xl" className="mx-auto mb-3 shadow-lg" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mời tham gia đội</h2>
            <p className="text-sm text-gray-500">Quét mã để tham gia đội</p>
          </div>

          {/* QR Code */}
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100 mb-4">
            {isLoading ? (
              <div className="size-48 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 rounded-lg size-full" />
              </div>
            ) : inviteToken ? (
              <QRCodeSVG
                value={inviteToken.deepLink || inviteToken.token}
                size={192}
                level="M"
                className="mix-blend-multiply"
              />
            ) : (
              <div className="size-48 flex items-center justify-center text-gray-400 text-sm text-center">
                Không thể tải mã QR
              </div>
            )}
          </div>

          {/* Expiry Timer */}
          {inviteToken && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <Icon name="schedule" className={isExpired ? 'text-red-500' : 'text-gray-400'} />
              <span className={isExpired ? 'text-red-500 font-medium' : 'text-gray-500'}>
                {isExpired ? 'Đã hết hạn' : `Hết hạn sau: ${formatTime(timeRemaining)}`}
              </span>
              <button
                onClick={handleRefresh}
                className="ml-2 text-primary hover:text-primary-dark transition-colors"
                title="Làm mới mã"
              >
                <Icon name="refresh" />
              </button>
            </div>
          )}

          {/* Link Box */}
          <div
            onClick={handleCopy}
            className="w-full flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer active:scale-95 transition-transform group"
          >
            <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon name={copied ? "check" : "link"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 uppercase font-bold">Liên kết mời</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {inviteToken?.deepLink || 'Đang tải...'}
              </p>
            </div>
            <div className="text-gray-400">
              <Icon name="content_copy" className="text-lg" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <Button fullWidth onClick={handleShareNative} icon="share" disabled={!inviteToken || isLoading}>
            Chia sẻ ngay
          </Button>
          <Button fullWidth variant="secondary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ShareTeamScreen;
