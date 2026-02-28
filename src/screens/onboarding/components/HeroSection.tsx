import React from 'react';
import { Icon } from '@/components/ui';
import { FONT_SIZES } from '@/constants/design';

interface HeroSectionProps {
  onScrollToContent: () => void;
}

/**
 * Hero Section - Full viewport height, focusing on "Ghép kèo" feature
 * First section of onboarding, most visually prominent
 */
const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToContent }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-cyan-500 animate-hero-gradient" />

      {/* Animated Soccer Ball Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-soccer-ball opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + i}s`,
            }}
          >
            <span className="material-icons text-white text-4xl">
              sports_soccer
            </span>
          </div>
        ))}
      </div>

      {/* Speed Lines Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-speed-lines"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Main Badge */}
        <div className="mb-6 animate-bounce-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="material-icons text-yellow-300 text-xl">flash_on</span>
            <span className="text-white font-semibold text-sm">Tìm kèo cực nhanh</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className={`${FONT_SIZES['4xl']} font-extrabold text-white mb-4 leading-tight animate-fade-in onboarding-delay-100`}>
          Tìm kèo đá bóng
          <br />
          <span className="text-yellow-300">Cực nhanh, cực chất</span>
        </h1>

        {/* Subheadline */}
        <p className={`${FONT_SIZES.base} text-white/90 mb-8 leading-relaxed animate-fade-in onboarding-delay-200`}>
          Quẹt trái, quẹt phải. Hệ thống tự động ghép kèo dựa trên trình độ, khu vực và thời gian của bạn.
        </p>

        {/* Visual Element - Animated Card Preview */}
        <div className="relative w-64 h-40 mb-10 animate-scale-in onboarding-delay-300">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-neon-pulse" />

          {/* Card */}
          <div className="relative h-full bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center">
            <div className="text-center">
              <span className="material-icons text-white/60 text-5xl mb-2">sports</span>
              <p className="text-white/80 text-sm">VS</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onScrollToContent}
          className="group relative px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 animate-fade-in onboarding-delay-400"
        >
          <span className="flex items-center gap-2">
            Bắt đầu tìm kèo ngay
            <span className="material-icons group-hover:translate-x-1 transition-transform">
              arrow_downward
            </span>
          </span>
        </button>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-background-light dark:text-background-dark"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
