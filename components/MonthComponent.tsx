import { getMonthDate } from "@/app/hooks/getMonthDate";
import { DateRange, dayNames, formatDate, formatMonthYear, getDaysInMonth, getMonthStartDay, isBetween, isSameDay, isToday } from "@/lib/dateUtils";
import clsx from "clsx";
import { useCallback } from "react";

type Props = {
    monthIndex: number,
    monthRefs?: React.RefObject<Map<number, HTMLDivElement>>,
    selectedRange: DateRange,
    setIsSelecting?: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedRange: React.Dispatch<React.SetStateAction<DateRange>>;
    onRangeChange?: (range: DateRange) => void;
}

export const MonthComponent = ({
  monthIndex, 
  monthRefs, 
  selectedRange, 
  setIsSelecting,
  setSelectedRange,
  onRangeChange
}: Props) => {
  const monthDate = getMonthDate(monthIndex);
  const days = getDaysInMonth(monthDate);
  const startDay = getMonthStartDay(monthDate);

  const handleDateClick = useCallback(
    (date: Date) => {
      const newRange: DateRange = { ...selectedRange };

      if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        newRange.start = date;
        newRange.end = null;
        setIsSelecting?.(true);
      } else {
        if (date >= selectedRange.start) {
          newRange.end = date;
        } else {
          newRange.end = selectedRange.start;
          newRange.start = date;
        }
        setIsSelecting?.(false);
      }

      setSelectedRange(newRange);
      onRangeChange?.(newRange);
    },
    [selectedRange, setIsSelecting, setSelectedRange, onRangeChange]
  );

  return (
    <div
      key={monthIndex}
      ref={(el) => {
        if (el && monthRefs?.current) {
          monthRefs.current.set(monthIndex, el);
        }
      }}
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 capitalize text-gray-800">
          {formatMonthYear(monthDate)}
        </h2>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const isStart = isSameDay(day, selectedRange.start);
            const isEnd = isSameDay(day, selectedRange.end);
            const isInRange = isBetween(
              day,
              selectedRange.start,
              selectedRange.end
            );
            const isTodayDate = isToday(day);

            return (
              <button
                key={formatDate(day)}
                onClick={() => handleDateClick(day)}
                className={clsx(
                  "aspect-square rounded-lg",
                  "flex items-center justify-center",
                  "text-sm font-medium",
                  "transition-all duration-200 ease-out",
                  "active:scale-95",
                  isStart || isEnd
                    ? "bg-blue-600 text-white scale-110 shadow-lg"
                    : isInRange
                    ? "bg-blue-100 text-blue-900"
                    : isTodayDate
                    ? "bg-gray-200 text-gray-900 font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                )}
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