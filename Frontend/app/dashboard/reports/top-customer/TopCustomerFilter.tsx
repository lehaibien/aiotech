"use client";

import { MonthPicker } from "@/components/core/MonthPicker";
import dayjs from "@/lib/extended-dayjs";
import { Box, Button } from "@mui/material";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TopCustomerFilterProps = {
  defaultStartDate: Dayjs | null;
  defaultEndDate: Dayjs | null;
  defaultCount?: number;
};

export default function TopCustomerFilter({
  defaultStartDate,
  defaultEndDate,
  defaultCount,
}: TopCustomerFilterProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultEndDate);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = useState<number>(defaultCount || 10);
  const onApplyFilter = () => {
    const start = dayjs(startDate).toJSON();
    const end = dayjs(endDate).toJSON();
    router.push(
      `/dashboard/reports/top-customer?start_date=${start}&end_date=${end}&count=${count}`
    );
  };

  const handleStartDateClose = () => {
    if (dayjs(startDate).isAfter(endDate)) {
      setStartDate(endDate);
      return;
    }
  };

  const handleEndDateClose = () => {
    const startDayjs = dayjs(startDate);
    const endDayjs = dayjs(endDate);
    if (endDayjs.isBefore(startDate)) {
      setEndDate(startDate);
      return;
    }
    if (
      startDate !== null &&
      endDate !== null &&
      endDayjs.diff(startDayjs, "months") > 12
    ) {
      setEndDate(startDayjs.add(12, "month"));
      return;
    }
  };
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <MonthPicker
        label="Từ tháng"
        value={startDate}
        onChange={setStartDate}
        onClose={handleStartDateClose}
      />
      <MonthPicker
        label="Đến tháng"
        value={endDate}
        onChange={setEndDate}
        onClose={handleEndDateClose}
      />
      <Button onClick={onApplyFilter} variant="contained" color="info">
        Lọc
      </Button>
    </Box>
  );
}
