"use client";

import { useRef, useState } from "react";
import { DateRange, formatMonthYear } from "@/lib/dateUtils";
import { Header } from "./Header";
import { getMonthDate } from "@/app/hooks/getMonthDate";
import { MonthComponent } from "./MonthComponent";
import { MonthSelector } from "./MonthSelector";

import { useMonthScrollTracker } from "@/app/hooks/useMonthScrollTracker";
import { useDateRangeSelection } from "@/app/hooks/useDateRangeSelection";
import { useScrollToCenter } from "@/app/hooks/useScrollCenter";

interface DateRangePickerProps {
  onRangeChange?: (range: DateRange) => void;
  initialRange?: DateRange;
}

export default function DateRangePicker({
  onRangeChange,
  initialRange,
}: DateRangePickerProps) {
  const centerIndex = 12;
  const totalMonths = 24;
  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(centerIndex);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const monthRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const {
    selectedRange,
    setSelectedRange,
    isSelecting,
    setIsSelecting,
    handleClear,
  } = useDateRangeSelection(initialRange, onRangeChange);

  useMonthScrollTracker(
    scrollContainerRef,
    monthRefs,
    setCurrentMonthIndex
  );

  useScrollToCenter(monthRefs, scrollContainerRef, centerIndex);

  const handleMonthSelect = (monthIndex: number) => {
    const monthElement = monthRefs.current.get(monthIndex);
    if (monthElement && scrollContainerRef.current) {
      monthElement.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    setIsMonthSelectorOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header
        selectedRange={selectedRange}
        handleClear={handleClear}
        isSelecting={isSelecting}
      />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {Array.from({ length: totalMonths }).map((_, i) => (
          <div
            key={i}
            style={{
              scrollSnapAlign: "center",
              scrollSnapStop: "normal",
            }}
          >
            <MonthComponent
              monthIndex={i}
              monthRefs={monthRefs}
              selectedRange={selectedRange}
              setIsSelecting={setIsSelecting}
              setSelectedRange={setSelectedRange}
              onRangeChange={onRangeChange}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsMonthSelectorOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 active:scale-95 transition-transform"
      >
        <div className="text-xs font-medium text-gray-600">
          {formatMonthYear(getMonthDate(currentMonthIndex))}
        </div>
      </button>

      <MonthSelector
        isOpen={isMonthSelectorOpen}
        onClose={() => setIsMonthSelectorOpen(false)}
        currentMonthIndex={currentMonthIndex}
        totalMonths={totalMonths}
        onMonthSelect={handleMonthSelect}
      />
    </div>
  );
}