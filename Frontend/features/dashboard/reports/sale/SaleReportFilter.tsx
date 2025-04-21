'use client';

import { MonthPicker } from '@/components/core/MonthPicker';
import dayjs from '@/lib/extended-dayjs';
import { Box, Button } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SaleReportFilterProps = {
  defaultStartDate: Date;
  defaultEndDate: Date;
};

export const SaleReportFilter = ({
  defaultStartDate,
  defaultEndDate,
}: SaleReportFilterProps) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs(defaultStartDate)
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(defaultEndDate));

  const onApplyFilter = () => {
    if (!startDate || !endDate || dayjs(startDate).isAfter(endDate)) {
      router.push('/dashboard/reports/sale');
      return;
    }
    const start = dayjs(startDate).toISOString();
    const end = dayjs(endDate).toISOString();
    router.push(`/dashboard/reports/sale?start_date=${start}&end_date=${end}`);
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    // Ensure endDate is exactly one year after and greater than startDate
    if (!newValue) {
      setEndDate(null);
      return;
    }
    const oneYearFromStart = newValue.add(1, 'year');
    if (endDate && endDate.isAfter(oneYearFromStart)) {
      setEndDate(oneYearFromStart);
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    // Ensure endDate is greater than startDate
    if (startDate && newValue.isBefore(startDate)) {
      setEndDate(startDate.add(1, 'day'));
      return;
    }
    setEndDate(newValue);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <MonthPicker
        label='Từ tháng'
        value={startDate}
        onChange={handleStartDateChange}
      />
      <MonthPicker
        label='Đến tháng'
        value={endDate}
        onChange={handleEndDateChange}
        minDate={dayjs(startDate).add(1, 'month')}
        maxDate={dayjs(startDate).add(1, 'year').subtract(1, 'day')}
      />
      <Button
        onClick={onApplyFilter}
        variant='contained'
        color='info'>
        Lọc
      </Button>
    </Box>
  );
};
