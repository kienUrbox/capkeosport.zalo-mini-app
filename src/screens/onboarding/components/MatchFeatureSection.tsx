import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { Icon } from '@/components/ui';
import { FONT_SIZES, ONBOARDING_COLORS } from '@/constants/design';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    icon: 'target',
    title: 'Tìm đối thủ cùng trình độ',
    description: 'Hệ thống phân tích trình độ đội bóng để ghép cặp hợp lý',
    color: ONBOARDING_COLORS.match.text,
  },
  {
    icon: 'location_on',
    title: 'Gần bạn - Sân quen',
    description: 'Tìm kèo theo khu vực, sân bóng yêu thích của bạn',
    color: ONBOARDING_COLORS.team.text,
  },
  {
    icon: 'schedule',
    title: 'Lịch rảnh tự động',
    description: 'Đồng bộ thời gian rảnh để tìm kèo phù hợp nhất',
    color: ONBOARDING_COLORS.match.text,
  },
];

/**
 * Match Finding Feature Section
 * Showcases the core "ghép kèo" functionality in detail
 */
const MatchFeatureSection: React.FC = () => {
  return (
    <section className="min-h-screen py-20 px-6 flex items-center bg-background-light dark:bg-background-dark">
      <div className="max-w-lg mx-auto w-full">
        {/* Section Header */}
        <AnimateOnScroll animation="slideUpFade">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 mb-4">
              <span className="material-icons text-white text-3xl">sports_soccer</span>
            </div>
            <h2 className={`${FONT_SIZES['3xl']} font-extrabold text-slate-900 dark:text-white mb-3`}>
              Ghép kèo thông minh
            </h2>
            <p className={`${FONT_SIZES.base} text-gray-500 dark:text-gray-400`}>
              Tìm đối thủ phù hợp chỉ trong vài giây
            </p>
          </div>
        </AnimateOnScroll>

        {/* Feature Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <AnimateOnScroll
              key={feature.title}
              animation="slideUpFade"
              delay={index * 100}
            >
              <div className="group relative p-5 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                {/* Icon Container */}
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.color.replace('text-', 'bg-').replace('-500', '/10')} ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="material-icons text-xl">{feature.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`${FONT_SIZES.lg} font-bold text-slate-900 dark:text-white mb-1`}>
                      {feature.title}
                    </h3>
                    <p className={`${FONT_SIZES.small} text-gray-500 dark:text-gray-400 leading-relaxed`}>
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Interactive Demo Hint */}
        <AnimateOnScroll animation="fadeIn" delay={300}>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full">
              <span className="material-icons text-gray-400 text-sm">swipe</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Quẹt trái/phải để tìm kèo</span>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default MatchFeatureSection;
