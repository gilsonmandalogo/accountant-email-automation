'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SelectMonth() {
  const currentMonth = new Date().getMonth() + 1;
  const defaultMonth = (currentMonth - 1).toString();
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="month">Month</Label>
      <Select name="month" value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger>
          <SelectValue placeholder="Select a month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name="month" value={selectedMonth} />
    </div>
  );
}
