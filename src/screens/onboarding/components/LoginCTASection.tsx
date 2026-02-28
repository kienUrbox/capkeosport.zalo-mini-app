import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { Icon } from '@/components/ui';
import { FONT_SIZES } from '@/constants/design';

interface LoginCTASectionProps {
  onZaloLogin: () => void;
  isLoading: boolean;
}

/**
 * Final CTA Section with Zalo Login
 * Last section before bottom, highest conversion focus
 */
const LoginCTASection: React.FC<LoginCTASectionProps> = ({ onZaloLogin, isLoading }) => {
  return (
    <section className="min-h-[60vh] py-20 px-6 flex items-center bg-gradient-to-b from-background-light to-primary/5 dark:from-background-dark dark:to-primary/10">
      <div className="max-w-lg mx-auto w-full text-center">
        {/* Section Header */}
        <AnimateOnScroll animation="slideUpFade">
          <div className="mb-8">
            {/* Trophy Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-emerald-400 mb-6 animate-floating-bob">
              <span className="material-icons text-white text-4xl">sports_soccer</span>
            </div>

            <h2 className={`${FONT_SIZES['3xl']} font-extrabold text-slate-900 dark:text-white mb-3`}>
              Sẵn sàng tìm kèo hôm nay?
            </h2>
            <p className={`${FONT_SIZES.base} text-gray-500 dark:text-gray-400`}>
              Tham gia cộng đồng đá bóng lớn nhất
            </p>
          </div>
        </AnimateOnScroll>

        {/* Zalo Login Button - Enhanced */}
        <AnimateOnScroll animation="bounceIn" delay={100}>
          <button
            onClick={onZaloLogin}
            disabled={isLoading}
            className="group relative w-full h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-[#0068FF] to-[#0056CC] hover:from-[#0056CC] hover:to-[#004599] text-white rounded-2xl shadow-[0_8px_24px_rgba(0,104,255,0.4)] hover:shadow-[0_12px_32px_rgba(0,104,255,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-subtle-pulse overflow-hidden"
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            {/* Content */}
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className={`${FONT_SIZES.lg} font-bold`}>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                {/* Zalo Icon */}
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2.59-11.41L12 10l-2.59 1.41L8 11l2.59-1.41L12 8l1.41 1.59L16 11l-2.59 1.41L12 14l-1.41-1.59L8 13l2.59-1.41L12 10z"/>
                </svg>
                <span className={`${FONT_SIZES.lg} font-bold`}>Đăng nhập bằng Zalo</span>
              </>
            )}
          </button>
        </AnimateOnScroll>

        {/* Trust Badges */}
        <AnimateOnScroll animation="fadeIn" delay={200}>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="material-icons text-sm">lock</span>
              <span className={`${FONT_SIZES.caption}`}>Bảo mật</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="material-icons text-sm">verified_user</span>
              <span className={`${FONT_SIZES.caption}`}>An toàn</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="material-icons text-sm">bolt</span>
              <span className={`${FONT_SIZES.caption}`}>Nhanh chóng</span>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Terms Notice */}
        <AnimateOnScroll animation="fadeIn" delay={300}>
          <p className={`${FONT_SIZES.caption} text-gray-400 mt-6`}>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <a href="#" className="text-primary hover:underline">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary hover:underline">
              Chính sách bảo mật
            </a>
          </p>
        </AnimateOnScroll>
      </div>

      {/* Bottom Curve Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 0V60C60 75 120 90 180 90C240 90 300 75 360 67.5C420 60 480 60 540 60C600 60 660 60 720 60C780 60 840 60 900 60C960 60 1020 60 1080 67.5C1140 75 1200 90 1260 90C1320 90 1380 75 1440 60V0H0Z"
            fill="currentColor"
            className="text-background-light dark:text-background-dark"
          />
        </svg>
      </div>
    </section>
  );
};

export default LoginCTASection;
