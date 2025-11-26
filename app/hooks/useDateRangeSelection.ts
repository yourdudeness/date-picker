import { useState } from 'react';
import { DateRange } from '@/lib/dateUtils';

export function useDateRangeSelection(
  initialRange?: DateRange,
  onRangeChange?: (range: DateRange) => void
) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || { start: null, end: null }
  );
  const [isSelecting, setIsSelecting] = useState(false);

  const handleClear = () => {
    setSelectedRange({ start: null, end: null });
    setIsSelecting(false);
    onRangeChange?.({ start: null, end: null });
  };

  return {
    selectedRange,
    setSelectedRange,
    isSelecting,
    setIsSelecting,
    handleClear,
  };
}