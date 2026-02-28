import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import MatchFeatureSection from './components/MatchFeatureSection';
import TeamManagementSection from './components/TeamManagementSection';
import MemoriesSection from './components/MemoriesSection';
import HowItWorksSection from './components/HowItWorksSection';
import LoginCTASection from './components/LoginCTASection';
import { appRoutes } from '@/utils/navigation';
import { zaloThreeStepAuthService } from '@/services/zalo-three-step-auth';
import { toast } from '@/utils/toast';

/**
 * Onboarding Screen - Long Scroll Page
 *
 * Redesigned onboarding with energetic sports theme
 * Features: Hero → Match Finding → Team Management → Memories → How It Works → CTA
 */
const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const contentSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToContent = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleZaloLogin = async () => {
    setIsLoading(true);
    try {
      const result = await zaloThreeStepAuthService.authenticateWithThreeSteps();

      if (result.success) {
        // Authentication already stored by authenticateWithThreeSteps()
        // Just navigate to dashboard
        navigate(appRoutes.dashboard);
      } else {
        console.error('Login failed:', result.error);
        toast.error(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Zalo login error:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(appRoutes.dashboard);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Skip Button - Fixed Top Right */}
      <button
        onClick={handleSkip}
        className="fixed top-4 right-4 z-50 px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full"
      >
        Bỏ qua
      </button>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section - Full viewport */}
        <HeroSection onScrollToContent={handleScrollToContent} />

        {/* Content Sections */}
        <div ref={contentSectionRef}>
          <MatchFeatureSection />
          <TeamManagementSection />
          <MemoriesSection />
          <HowItWorksSection />
        </div>

        {/* Final CTA Section */}
        <LoginCTASection onZaloLogin={handleZaloLogin} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default OnboardingScreen;
