import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Icon, TeamAvatar } from '@/components/ui';

/**
 * ShareTeam Screen
 *
 * Share team via QR code and link with native share.
 */
const ShareTeamScreen: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [copied, setCopied] = useState(false);

  // Mock Data
  const teamName = "FC Sài Gòn";
  const inviteLink = "https://footballconnect.app/join/fc-sai-gon-8892";
  const teamLogo = "https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9";

  // Quick QR Code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inviteLink)}&color=102219`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mời tham gia đội ${teamName}`,
          text: `Tham gia đội bóng ${teamName} trên Football Connect nhé!`,
          url: inviteLink,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-safe">
      <Header title="Chia sẻ đội bóng" onBack={() => navigate(-1)} />

      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8 animate-fade-in">

        {/* Card Container */}
        <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center relative overflow-hidden">
          {/* Decorative Top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-dark via-primary to-primary-dark"></div>

          {/* Team Info */}
          <div className="mt-4 mb-6 text-center">
            <TeamAvatar src={teamLogo} size="xl" className="mx-auto mb-3 shadow-lg" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{teamName}</h2>
            <p className="text-sm text-gray-500">Quét mã để tham gia đội</p>
          </div>

          {/* QR Code */}
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100 mb-6">
            <img src={qrCodeUrl} alt="Team QR Code" className="size-48 object-contain mix-blend-multiply" />
          </div>

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
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{inviteLink}</p>
            </div>
            <div className="text-gray-400">
              <Icon name="content_copy" className="text-lg" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <Button fullWidth onClick={handleShareNative} icon="share">
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
