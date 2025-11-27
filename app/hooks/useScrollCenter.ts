import { useEffect } from 'react';

export function useScrollToCenter(
  monthRefs: React.MutableRefObject<Map<number, HTMLDivElement>>,
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  centerIndex: number
) {
  useEffect(() => {
    const centerElement = monthRefs.current.get(centerIndex);
    if (centerElement && scrollContainerRef.current) {
      centerElement.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [centerIndex, monthRefs, scrollContainerRef]);
}