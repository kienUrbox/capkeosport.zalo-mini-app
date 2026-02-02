import { useEffect } from 'react';

/**
 * useKeyboardAvoidance Hook
 *
 * Handles keyboard avoidance for modals and bottom sheets on iOS/Android.
 * Uses the visualViewport API to adjust document height when keyboard opens.
 *
 * This prevents the keyboard from covering input fields on mobile devices.
 *
 * @example
 * ```tsx
 * function MyModal() {
 *   useKeyboardAvoidance();
 *   return <div><textarea /></div>;
 * }
 * ```
 */
export const useKeyboardAvoidance = () => {
  useEffect(() => {
    const viewport = window.visualViewport;

    // Skip if visualViewport API is not supported
    if (!viewport) {
      return;
    }

    let originalHeight: string | undefined;

    const handleResize = () => {
      // When keyboard opens, adjust body height to viewport height
      // This allows the modal to scroll properly and inputs remain visible
      document.body.style.height = `${viewport.height}px`;

      // Also update document height for proper scrolling
      document.documentElement.style.height = `${viewport.height}px`;
    };

    const handleViewportChange = () => {
      requestAnimationFrame(handleResize);
    };

    // Store original height
    originalHeight = document.body.style.height;

    // Listen for viewport resize (keyboard open/close)
    viewport.addEventListener('resize', handleViewportChange);

    // Also listen for scroll to handle cases where viewport resizes during scroll
    viewport.addEventListener('scroll', handleViewportChange);

    // Cleanup
    return () => {
      viewport.removeEventListener('resize', handleViewportChange);
      viewport.removeEventListener('scroll', handleViewportChange);

      // Restore original height
      if (originalHeight !== undefined) {
        document.body.style.height = originalHeight;
        document.documentElement.style.height = originalHeight;
      } else {
        document.body.style.height = '';
        document.documentElement.style.height = '';
      }
    };
  }, []);
};

export default useKeyboardAvoidance;
