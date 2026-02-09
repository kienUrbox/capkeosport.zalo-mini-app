import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { STAT_COLORS, STAT_ICONS } from '@/constants/design';

export type StatType = 'attack' | 'defense' | 'technique';

export interface StatBarAnimatedProps {
  type: StatType;
  value: number;
  maxValue?: number;
  delay?: number;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * StatBarAnimated Component
 *
 * Animated stat progress bar with number counter animation.
 * Features progressive fill animation, glowing edge effect, and pulsing glow.
 *
 * @example
 * ```tsx
 * <StatBarAnimated
 *   type="attack"
 *   value={7.5}
 *   maxValue={10}
 *   delay={0}
 *   showNumber={true}
 *   size="md"
 * />
 * ```
 */
export const StatBarAnimated: React.FC<StatBarAnimatedProps> = ({
  type,
  value,
  maxValue = 10,
  delay = 0,
  showNumber = true,
  size = 'md',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [animate, setAnimate] = useState(false);
  const hasAnimated = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = STAT_COLORS[type];
  const iconName = STAT_ICONS[type];
  const percentage = Math.min((value / maxValue) * 100, 100);

  // Size variants
  const sizeClasses = {
    sm: {
      barHeight: 'h-2',
      iconSize: 'text-xs',
      textSize: 'text-sm',
      labelGap: 'gap-1.5',
      barGap: 'mb-1.5',
    },
    md: {
      barHeight: 'h-2.5',
      iconSize: 'text-sm',
      textSize: 'text-base',
      labelGap: 'gap-2',
      barGap: 'mb-2',
    },
    lg: {
      barHeight: 'h-3',
      iconSize: 'text-base',
      textSize: 'text-lg',
      labelGap: 'gap-2.5',
      barGap: 'mb-2.5',
    },
  };

  const sizeConfig = sizeClasses[size];

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            // Start animation after delay
            setTimeout(() => {
              setAnimate(true);
            }, delay);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  // Number counter animation
  useEffect(() => {
    if (!animate) return;

    const duration = 1000; // 1 second
    const steps = 30; // 30 steps for smooth animation
    const stepDuration = duration / steps;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayValue(Math.round(increment * currentStep * 10) / 10);
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [animate, value]);

  return (
    <div ref={containerRef} className={sizeConfig.barGap}>
      {/* Label Row */}
      <div className={`flex items-center justify-between ${sizeConfig.labelGap}`}>
        {/* Icon + Label */}
        <div className={`flex items-center ${sizeConfig.labelGap} ${colors.main} font-bold ${sizeConfig.iconSize}`}>
          <div className={`p-1 ${colors.bg} rounded`}>
            <Icon name={iconName} className={sizeConfig.iconSize} />
          </div>
          <span className="capitalize">
            {type === 'attack' && 'Tấn công'}
            {type === 'defense' && 'Phòng thủ'}
            {type === 'technique' && 'Kỹ thuật'}
          </span>
        </div>

        {/* Value */}
        {showNumber && (
          <span
            className={`font-bold text-slate-900 dark:text-white ${sizeConfig.textSize} ${
              animate ? 'animate-number-counter' : 'opacity-0'
            }`}
            style={{ animationDelay: `${delay + 200}ms` }}
          >
            {displayValue.toFixed(1)}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`w-full bg-gray-100 dark:bg-black/20 rounded-full overflow-hidden ${sizeConfig.barHeight}`}>
        <div
          className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full shadow-[0_0_10px_currentColor] ${
            animate ? 'animate-stat-fill animate-glow-pulse' : ''
          }`}
          style={{
            width: animate ? `${percentage}%` : '0%',
            color: type === 'attack' ? '#ef4444' : type === 'defense' ? '#3b82f6' : '#3b82f6',
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

export default StatBarAnimated;
