import { DateRange } from "@/lib/dateUtils";

type Props = {
  selectedRange: DateRange;
  handleClear: () => void;
  isSelecting: boolean;
};

export const Header = ({ selectedRange, handleClear, isSelecting }: Props) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
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

        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Начало</div>
            <div className="font-semibold text-gray-900">
              {selectedRange.start
                ? selectedRange.start.toLocaleDateString("ru-RU")
                : "—"}
            </div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Конец</div>
            <div className="font-semibold text-gray-900">
              {selectedRange.end
                ? selectedRange.end.toLocaleDateString("ru-RU")
                : "—"}
            </div>
          </div>
        </div>

        {isSelecting && (
          <div className="mt-3 text-xs text-center text-gray-500">
            Выберите дату окончания
          </div>
        )}
      </div>
    </header>
  );
};
