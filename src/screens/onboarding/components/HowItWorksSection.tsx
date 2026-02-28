import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { Icon } from '@/components/ui';
import { FONT_SIZES } from '@/constants/design';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Tạo đội bóng',
    description: 'Thêm thông tin đội, logo, và trình độ',
    icon: 'group_add',
  },
  {
    number: 2,
    title: 'Thiết lập lịch',
    description: 'Đặt thời gian rảnh và khu vực ưa thích',
    icon: 'schedule',
  },
  {
    number: 3,
    title: 'Ghép kèo & Chốt',
    description: 'Tìm đối thủ và xác nhận trận đấu',
    icon: 'check_circle',
  },
];

/**
 * How It Works Section
 * Timeline-style process explanation
 */
const HowItWorksSection: React.FC = () => {
  return (
    <section className="min-h-screen py-20 px-6 flex items-center bg-background-light dark:bg-background-dark">
      <div className="max-w-lg mx-auto w-full">
        {/* Section Header */}
        <AnimateOnScroll animation="slideUpFade">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 mb-3">
              <span className="material-icons text-white text-2xl">rocket_launch</span>
            </div>
            <h2 className={`${FONT_SIZES['3xl']} font-extrabold text-slate-900 dark:text-white mb-2`}>
              Chỉ 3 bước để có kèo
            </h2>
            <p className={`${FONT_SIZES.base} text-gray-500 dark:text-gray-400`}>
              Bắt đầu trận giao lưu ngay hôm nay
            </p>
          </div>
        </AnimateOnScroll>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <AnimateOnScroll
                key={step.number}
                animation="slideInLeft"
                delay={index * 100}
              >
                <div className="relative flex items-start gap-4">
                  {/* Step Number Badge */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/30">
                      <span className="material-icons text-white text-lg">
                        {step.icon}
                      </span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`${FONT_SIZES.lg} font-bold text-primary`}>
                        Bước {step.number}
                      </span>
                      <span className={`${FONT_SIZES.base} font-semibold text-slate-900 dark:text-white`}>
                        {step.title}
                      </span>
                    </div>
                    <p className={`${FONT_SIZES.small} text-gray-500 dark:text-gray-400`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        <AnimateOnScroll animation="fadeIn" delay={300}>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-emerald-400/10 rounded-full border border-primary/20">
              <span className="material-icons text-primary text-sm">celebration</span>
              <span className={`${FONT_SIZES.small} font-medium text-primary`}>
                Giao lưu ngay - Học hỏi - Kết nối
              </span>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default HowItWorksSection;
