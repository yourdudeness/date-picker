'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  DateRange,
  getDaysInMonth,
  getMonthStartDay,
  formatDate,
  isSameDay,
  isBetween,
  formatMonthYear,
  dayNames,
  isToday,
} from '@/lib/dateUtils';

interface DateRangePickerProps {
  onRangeChange?: (range: DateRange) => void;
  initialRange?: DateRange;
}

interface MonthData {
  date: Date;
  index: number;
}

export default function DateRangePicker({ onRangeChange, initialRange }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || { start: null, end: null }
  );
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const lastScrollTime = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Generate months array (24 months: 12 past + current + 11 future)
  const totalMonths = 24;
  const centerIndex = 12; // Current month index

  const getMonthDate = useCallback((index: number): Date => {
    const today = new Date();
    const offset = index - centerIndex;
    return new Date(today.getFullYear(), today.getMonth() + offset, 1);
  }, []);

  // Handle date selection
  const handleDateClick = useCallback(
    (date: Date) => {
      const newRange: DateRange = { ...selectedRange };

      if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        // Start new selection
        newRange.start = date;
        newRange.end = null;
        setIsSelecting(true);
      } else {
        // Complete selection
        if (date >= selectedRange.start) {
          newRange.end = date;
        } else {
          newRange.end = selectedRange.start;
          newRange.start = date;
        }
        setIsSelecting(false);
      }

      setSelectedRange(newRange);
      onRangeChange?.(newRange);
    },
    [selectedRange, onRangeChange]
  );

  // Handle scroll to update current month indicator
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

      // Find which month is in the center of the viewport
      let closestIndex = 0;
      let closestDistance = Infinity;

      monthRefs.current.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const elementCenter = rect.top - containerRect.top + scrollTop + rect.height / 2;
        const distance = Math.abs(elementCenter - scrollCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentMonthIndex(closestIndex);
    }, 100);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  // Scroll to current month on mount
  useEffect(() => {
    const centerElement = monthRefs.current.get(centerIndex);
    if (centerElement && scrollContainerRef.current) {
      centerElement.scrollIntoView({ block: 'center', behavior: 'instant' });
      setCurrentMonthIndex(centerIndex);
    }
  }, []);

  // Clear selection
  const handleClear = () => {
    setSelectedRange({ start: null, end: null });
    setIsSelecting(false);
    onRangeChange?.({ start: null, end: null });
  };

  // Render a single month
  const renderMonth = (monthIndex: number) => {
    const monthDate = getMonthDate(monthIndex);
    const days = getDaysInMonth(monthDate);
    const startDay = getMonthStartDay(monthDate);

    return (
      <div
        key={monthIndex}
        ref={(el) => {
          if (el) monthRefs.current.set(monthIndex, el);
        }}
        className="min-h-screen flex items-center justify-center px-4 py-8"
      >
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 capitalize">
            {formatMonthYear(monthDate)}
          </h2>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {days.map((day) => {
              const isStart = isSameDay(day, selectedRange.start);
              const isEnd = isSameDay(day, selectedRange.end);
              const isInRange = isBetween(day, selectedRange.start, selectedRange.end);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={formatDate(day)}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    transition-all duration-200 ease-out
                    active:scale-95
                    ${
                      isStart || isEnd
                        ? 'bg-blue-600 text-white scale-110 shadow-lg'
                        : isInRange
                        ? 'bg-blue-100 text-blue-900'
                        : isTodayDate
                        ? 'bg-gray-200 text-gray-900 font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-gray-900">Выберите даты</h1>
            {(selectedRange.start || selectedRange.end) && (
              <button
                onClick={handleClear}
                className="text-sm text-blue-600 font-medium active:scale-95 transition-transform"
              >
                Очистить
              </button>
            )}
          </div>

          {/* Selected range display */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-1 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Начало</div>
              <div className="font-semibold text-gray-900">
                {selectedRange.start
                  ? selectedRange.start.toLocaleDateString('ru-RU')
                  : '—'}
              </div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex-1 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Конец</div>
              <div className="font-semibold text-gray-900">
                {selectedRange.end ? selectedRange.end.toLocaleDateString('ru-RU') : '—'}
              </div>
            </div>
          </div>

          {isSelecting && (
            <div className="mt-3 text-xs text-center text-gray-500">
              Выберите дату окончания
            </div>
          )}
        </div>
      </div>

      {/* Scrollable months */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {Array.from({ length: totalMonths }).map((_, i) => (
          <div
            key={i}
            style={{
              scrollSnapAlign: 'center',
              scrollSnapStop: 'normal',
            }}
          >
            {renderMonth(i)}
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-600">
          {formatMonthYear(getMonthDate(currentMonthIndex))}
        </div>
      </div>
    </div>
  );
}
