import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { Icon } from '@/components/ui';
import { FONT_SIZES } from '@/constants/design';

interface MemoryFeature {
  icon: string;
  title: string;
  description: string;
}

const memoryFeatures: MemoryFeature[] = [
  {
    icon: 'history',
    title: 'Lịch sử đối đầu',
    description: 'Xem lại các trận đấu đã qua',
  },
  {
    icon: 'emoji_events',
    title: 'Thành tích đội bóng',
    description: 'Profile ngày càng "ngầu" hơn',
  },
  {
    icon: 'insights',
    title: 'Thống kê cầu thủ',
    description: 'Theo dõi chỉ số cá nhân',
  },
];

/**
 * Memories Section
 * Showcases memory/achievement features (tertiary importance)
 */
const MemoriesSection: React.FC = () => {
  return (
    <section className="min-h-[60vh] py-16 px-6 flex items-center bg-gradient-to-b from-background-light to-amber-50/30 dark:from-background-dark dark:to-amber-950/10">
      <div className="max-w-lg mx-auto w-full">
        {/* Section Header */}
        <AnimateOnScroll animation="slideUpFade">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 mb-3">
              <span className="material-icons text-white text-2xl">military_tech</span>
            </div>
            <h2 className={`${FONT_SIZES['2xl']} font-extrabold text-slate-900 dark:text-white mb-2`}>
              Lưu giữ kỷ niệm, xây dựng thành tích
            </h2>
            <p className={`${FONT_SIZES.small} text-gray-500 dark:text-gray-400`}>
              Ghi lại tỷ số, khoảnh khắc bàn thắng đẹp
            </p>
          </div>
        </AnimateOnScroll>

        {/* Feature Cards - Vertical Stack */}
        <div className="space-y-3">
          {memoryFeatures.map((feature, index) => (
            <AnimateOnScroll
              key={feature.title}
              animation="slideInLeft"
              delay={index * 75}
            >
              <div className="group flex items-center gap-4 p-4 bg-white/80 dark:bg-surface-dark/80 backdrop-blur rounded-xl border border-amber-200/50 dark:border-amber-900/30 hover:border-amber-400/50 dark:hover:border-amber-600/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                {/* Icon with Trophy Glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <span className="material-icons text-white">{feature.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`${FONT_SIZES.base} font-bold text-slate-900 dark:text-white mb-0.5`}>
                    {feature.title}
                  </h3>
                  <p className={`${FONT_SIZES.caption} text-gray-500 dark:text-gray-400`}>
                    {feature.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <span className="material-icons text-amber-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  chevron_right
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemoriesSection;
