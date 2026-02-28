import React from 'react';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { Icon } from '@/components/ui';
import { FONT_SIZES, ONBOARDING_COLORS } from '@/constants/design';

interface TeamFeature {
  icon: string;
  title: string;
  description: string;
}

const teamFeatures: TeamFeature[] = [
  {
    icon: 'how_to_reg',
    title: 'Điểm danh thành viên',
    description: 'Theo dõi attendance dễ dàng',
  },
  {
    icon: 'payments',
    title: 'Thu quỹ đội bóng',
    description: 'Quản lý tài chính minh bạch',
  },
  {
    icon: 'format_list_numbered',
    title: 'Sắp xếp đội hình',
    description: 'Xếp đặt chiến thuật nhanh chóng',
  },
  {
    icon: 'analytics',
    title: 'Thống kê chỉ số',
    description: 'Theo dõi performance cầu thủ',
  },
];

/**
 * Team Management Section
 * Showcases team management features (secondary to match finding)
 */
const TeamManagementSection: React.FC = () => {
  return (
    <section className="min-h-[70vh] py-16 px-6 flex items-center bg-background-light dark:bg-background-dark">
      <div className="max-w-lg mx-auto w-full">
        {/* Section Header */}
        <AnimateOnScroll animation="slideUpFade">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-3">
              <span className="material-icons text-white text-2xl">groups</span>
            </div>
            <h2 className={`${FONT_SIZES['2xl']} font-extrabold text-slate-900 dark:text-white mb-2`}>
              Quản lý đội bóng chuyên nghiệp
            </h2>
            <p className={`${FONT_SIZES.small} text-gray-500 dark:text-gray-400`}>
              Mọi thông tin thành viên và chỉ số kỹ năng đều được số hóa
            </p>
          </div>
        </AnimateOnScroll>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3">
          {teamFeatures.map((feature, index) => (
            <AnimateOnScroll
              key={feature.title}
              animation="scaleIn"
              delay={index * 75}
            >
              <div className="group p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-lg">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-icons">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className={`${FONT_SIZES.base} font-bold text-slate-900 dark:text-white mb-1`}>
                  {feature.title}
                </h3>
                <p className={`${FONT_SIZES.caption} text-gray-500 dark:text-gray-400 leading-snug`}>
                  {feature.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamManagementSection;
