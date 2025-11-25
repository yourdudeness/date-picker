'use client';

import DateRangePicker from '@/components/DateRangePicker';
import { DateRange } from '@/lib/dateUtils';
import { useState } from 'react';

export default function Home() {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  const handleRangeChange = (range: DateRange) => {
    setSelectedRange(range);
    console.log('Selected range:', range);
  };

  return (
    <main className="w-full h-screen">
      <DateRangePicker onRangeChange={handleRangeChange} initialRange={selectedRange} />
    </main>
  );
}
