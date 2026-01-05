import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';
import { FONT_SIZES, SPACE_Y, SPACING, ICON_SIZES, PADDING, SECTION } from '@/constants/design';
import { zaloThreeStepAuthService } from '@/services/zalo-three-step-auth';

interface OnboardingStep {
  id: number;
  title: string;
  desc: string;
  icon: string;
  image: string;
  color: string;
  bgColor: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Tìm kèo cực nhanh',
    desc: "Chỉ cần quẹt trái, quẹt phải! Hệ thống tự động ghép kèo 'bắt cặp' dựa trên trình độ, khu vực và thời gian rảnh của đội bạn.",
    icon: 'flash_on',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeKRp8PNX06N8qLy6aBysvvgnzY-M6lgYIfjhgqTodyPAi2wEW2ob_i9EdMrg8MfmRcDkKx4X1otwpwsJuurICNxkC_6NKoRY36WfdJ2kDRuocVwGO1wPOFcfF1ylENUtxowUKtSAjmJSMgVAVR05f7ZjvDYTy67BitLR1YGQHDW26ppWzT6L3bGi3pAN6Ywt84Rl87aEm2sulKC-OEey-aMiAqZFBuNCeqdpuKa6C_mCcF6VXAvavSend-1KFuh3Iqg6Ft1dnFLRE',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 2,
    title: 'Quản lý đội bóng',
    desc: 'Điểm danh, thu quỹ, sắp xếp đội hình dễ dàng. Mọi thông tin thành viên và chỉ số kỹ năng đều được số hóa chuyên nghiệp.',
    icon: 'groups',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgMiy1WmLO4CLqqm08LykjhNM_VUb8V7nJx8NNcKoNfLzmRWdsXEY_yV2U8cG0uLrYD5laTf2l7i5hxH15lGifO4dHiHKSnIBF8xOwAetdY2Ph1wP9lUYUr_y8p5zqgbC1osTFvvawVoHAHSc4TnIGOasCaFPaLTNNT0RG42RZc638OH_blB4k8j2K5Wy6oshulBAF96Y0pK-ZEtM8PzpbYc6wAcqMfliTLkZ87SXPQrX6d-idB1W5RkrQMu7ekYTrs0E0UJARtEq9',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 3,
    title: 'Lưu giữ kỷ niệm',
    desc: 'Ghi lại tỷ số, khoảnh khắc bàn thắng đẹp và lịch sử đối đầu. Xây dựng profile thành tích để đội bóng ngày càng "ngầu" hơn.',
    icon: 'emoji_events',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxBAaJQou-skfFZH5ACWZ-qpEWdiR7OC1Ed1HCHOREyVUCtHmKYJGQoYC_UPMXGDEoSsU1p4tKlT0V4O1ROjwVxJaHO-xN6R7H-6b9U5j_4n47evOpJOrLBTseQ-vBpPT1DoR5gIISwy_i5KqGzMuHbLw5yuB5wSsdt0hkXXz32EfnKqFH933RZnWk5JsZ9Shpst4HVWLru7fZ_PKYR4qvSBh3_fOxfHYyHSzrOMtfQtTbuV4gR064mquc2XNzjS07DUl8OA1r18W',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
];

/**
 * Onboarding Screen
 *
 * 3-step carousel introducing app features.
 */
const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    navigate(appRoutes.dashboard);
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
        alert(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Zalo login error:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const content = steps[currentStep];

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark relative overflow-hidden transition-all duration-300">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleFinish}
          className={`px-4 py-2 font-bold text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors ${FONT_SIZES.small}`}
        >
          Bỏ qua
        </button>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col items-center justify-center ${SECTION.padding} text-center mt-8`}>
        {/* Visual */}
        <div className={`relative mb-12 w-full max-w-xs aspect-square flex items-center justify-center`}>
          {/* Background Blob Animation */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse ${content.bgColor.replace(
              '/10',
              '/30'
            )}`}
          ></div>

          {/* Main Image Container */}
          <div className="relative w-64 h-64">
            {/* Circle Decorations */}
            <div
              className={`absolute -top-4 -right-4 size-20 rounded-full ${content.bgColor} flex items-center justify-center animate-bounce delay-100`}
            >
              <Icon name={content.icon} className={`${ICON_SIZES.xl} ${content.color}`} />
            </div>
            <div className="absolute -bottom-4 -left-4 size-14 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center animate-bounce delay-300">
              <Icon name="star" className={`${ICON_SIZES.lg} text-yellow-400`} filled />
            </div>

            {/* Main Image */}
            <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-white dark:border-white/10 shadow-2xl rotate-3 transition-transform duration-500 ease-out hover:rotate-0">
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="max-w-xs mx-auto animate-fade-in" key={currentStep}>
          <h2 className={`font-extrabold text-slate-900 dark:text-white mb-4 leading-tight ${FONT_SIZES.xl}`}>
            {content.title}
          </h2>
          <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${FONT_SIZES.base}`}>{content.desc}</p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className={`${PADDING.md} pb-safe w-full`}>
        <div className={`flex items-center justify-between mb-8`}>
          {/* Dots */}
          <div className={`flex ${SPACING.sm}`}>
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Zalo Login Button */}
        <button
          onClick={handleZaloLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#0068FF] hover:bg-[#0056CC] text-white h-14 rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2.59-11.41L12 10l-2.59 1.41L8 11l2.59-1.41L12 8l1.41 1.59L16 11l-2.59 1.41L12 14l-1.41-1.59L8 13l2.59-1.41L12 10z"/>
              </svg>
              <span>Đăng nhập bằng Zalo</span>
            </>
          )}
        </button>

        <Button
          fullWidth
          onClick={handleNext}
          className="h-14 text-lg shadow-xl shadow-primary/20"
          variant="secondary"
          icon={currentStep === steps.length - 1 ? 'rocket_launch' : 'arrow_forward'}
        >
          {currentStep === steps.length - 1 ? 'Khám phá ngay' : 'Bỏ qua'}
        </Button>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingScreen;
