import { useEffect } from 'react';

/**
 * useSmoothScroll - Zero-dependency momentum wheel smoothing
 * Provides buttery smooth linear-interpolated scrolling on desktop wheel devices
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Skip on touch-only mobile devices
    const isTouchOnly = 'ontouchstart' in window && !('onmousemove' in window);
    if (isTouchOnly) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isTicking = false;
    const ease = 0.085; // Damping coefficient (luxury feel)

    const onWheel = (e) => {
      // Allow browser zoom (Ctrl+Wheel) or Alt/Meta shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Allow scroll inside nested scrollable containers (e.g. dropdowns, modal dialogs)
      let targetNode = e.target;
      while (targetNode && targetNode !== document.body && targetNode !== document.documentElement) {
        const overflowY = window.getComputedStyle(targetNode).overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          targetNode.scrollHeight > targetNode.clientHeight
        ) {
          return; // Let child element scroll natively
        }
        targetNode = targetNode.parentElement;
      }

      // Check if this is a notched mouse wheel (typically deltas >= 40 or 100)
      // or trackpad. Smooth the wheel increments for high-end luxury glide.
      e.preventDefault();

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      // Scale notched jumps smoothly
      const delta = e.deltaY;
      targetY += delta;
      targetY = Math.max(0, Math.min(targetY, maxScroll));

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    const updateScroll = () => {
      const diff = targetY - currentY;
      currentY += diff * ease;

      if (Math.abs(diff) < 0.8) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        isTicking = false;
        return;
      }

      window.scrollTo(0, currentY);
      requestAnimationFrame(updateScroll);
    };

    const onScroll = () => {
      if (!isTicking) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
};

export default useSmoothScroll;

