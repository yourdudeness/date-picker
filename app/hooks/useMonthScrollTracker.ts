import { useCallback, useEffect, useRef } from 'react';

export function useMonthScrollTracker(
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  monthRefs: React.RefObject<Map<number, HTMLDivElement>>,
  onMonthChange: (index: number) => void
) {
  const lastScrollTime = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 50) return; // Throttle
    lastScrollTime.current = now;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollCenter = scrollTop + containerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      monthRefs.current.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const elementCenter =
          rect.top - containerRect.top + scrollTop + rect.height / 2;
        const distance = Math.abs(elementCenter - scrollCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      onMonthChange(closestIndex);
    }, 100);
  }, [scrollContainerRef, monthRefs, onMonthChange]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);
}