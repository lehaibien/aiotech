"use client";

import { ReportMonthFilter } from "@/features/dashboard/reports/ReportMonthFilter";
import { Box, Button, MenuItem, Select } from "@mui/material";
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
  const [count, setCount] = useState<number>(defaultCount || 10);
  const onApplyFilter = () => {
    const start = startDate?.toJSON();
    const end = endDate?.toJSON();
    router.push(
      `/dashboard/reports/top-customer?start_date=${start}&end_date=${end}&count=${count}`
    );
  };

  const handleStartDateClose = () => {
    if (startDate?.isAfter(endDate)) {
      setStartDate(endDate);
      return;
    }
  };

  const handleEndDateClose = () => {
    if (endDate?.isBefore(startDate)) {
      setEndDate(startDate);
      return;
    }
    if (
      startDate !== null &&
      endDate !== null &&
      endDate.diff(startDate, "months") > 12
    ) {
      setEndDate(startDate.add(12, "month"));
      return;
    }
  };
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <ReportMonthFilter
        label="Từ tháng"
        value={startDate}
        onChange={setStartDate}
        onClose={handleStartDateClose}
        />
      <ReportMonthFilter
        label="Đến tháng"
        value={endDate}
        onChange={setEndDate}
        onClose={handleEndDateClose}
      />
      <Select
        label="Số lượng"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        size="small"
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </Select>
      <Button onClick={onApplyFilter} variant="contained" color="info">
        Lọc
      </Button>
    </Box>
  );
}
