import React, { ReactNode } from 'react';
import { useScrollAnimation, AnimationVariant } from '@/hooks/useScrollAnimation';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: AnimationVariant;
  delay?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Wrapper component for scroll-triggered animations
 * Usage: <AnimateOnScroll animation="slideUpFade" delay={100}>Content</AnimateOnScroll>
 */
export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  animation = 'slideUpFade',
  delay = 0,
  className = '',
  threshold = 0.2,
  triggerOnce = true,
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

  const animationClass = isVisible ? animation : '';
  const delayStyle = delay > 0 ? { animationDelay: `${delay}ms` } : {};

  return (
    <div
      ref={ref}
      className={`scroll-animate ${animationClass} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
