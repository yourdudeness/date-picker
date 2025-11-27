import { getMonthDate } from "@/app/hooks/getMonthDate";
import { formatMonthYear } from "@/lib/dateUtils";
import clsx from "clsx";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentMonthIndex: number;
  totalMonths: number;
  onMonthSelect: (monthIndex: number) => void;
};

export const MonthSelector = ({
  isOpen,
  onClose,
  currentMonthIndex,
  totalMonths,
  onMonthSelect,
}: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="max-h-[70vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Выберите месяц
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Month List */}
          <div className="overflow-y-auto px-4 py-2">
            {Array.from({ length: totalMonths }).map((_, index) => {
              const monthDate = getMonthDate(index);
              const isCurrentMonth = index === currentMonthIndex;

              return (
                <button
                  key={index}
                  onClick={() => onMonthSelect(index)}
                  className={clsx(
                    "w-full text-left px-6 py-4 rounded-xl mb-2",
                    "transition-all duration-200",
                    "active:scale-98",
                    isCurrentMonth
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">
                      {formatMonthYear(monthDate)}
                    </span>
                    {isCurrentMonth && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};