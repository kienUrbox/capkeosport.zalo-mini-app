import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasAnimated: boolean;
}

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param options - Configuration options
 * @returns Object containing ref, isVisible, and hasAnimated states
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}): UseScrollAnimationReturn => {
  const {
    threshold = 0.2,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);

          // Unobserve after first animation if triggerOnce is true
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible, hasAnimated };
};

/**
 * Animation variants for use with useScrollAnimation
 */
export const ANIMATION_VARIANTS = {
  slideUp: 'animate-slide-up',
  slideUpFade: 'animate-slide-up-fade',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  fadeIn: 'animate-fade-in',
  bounce: 'animate-bounce-in',
} as const;

export type AnimationVariant = keyof typeof ANIMATION_VARIANTS;
