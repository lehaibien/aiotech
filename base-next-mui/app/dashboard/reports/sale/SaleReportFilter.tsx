"use client";

import { ReportMonthFilter } from "@/features/dashboard/reports/ReportMonthFilter";
import { Box, Button } from "@mui/material";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "@/lib/extended-dayjs";

type SaleReportFilterProps = {
  defaultStartDate: Dayjs | null;
  defaultEndDate: Dayjs | null;
};

export default function SaleReportFilter({
  defaultStartDate,
  defaultEndDate,
}: SaleReportFilterProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(
    defaultStartDate || dayjs().startOf("year")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    defaultEndDate || dayjs().startOf("year").add(1, "year").subtract(1, "day")
  );

  const onApplyFilter = () => {
    if (!startDate || !endDate || dayjs(startDate).isAfter(endDate)) return;
    const start = dayjs(startDate).toJSON();
    const end = dayjs(endDate).toJSON();
    router.push(`/dashboard/reports/sale?start_date=${start}&end_date=${end}`);
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    setStartDate(newValue);
    // Ensure endDate is exactly one year after and greater than startDate
    const newEndDate = newValue.add(1, "year");
    setEndDate(
      newEndDate.isAfter(newValue) ? newEndDate : newValue.add(1, "day")
    );
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (!newValue) return;
    // Ensure endDate is greater than startDate
    if (startDate && newValue.isBefore(startDate)) {
      setEndDate(startDate.add(1, "day"));
      return;
    }
    setEndDate(newValue);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <ReportMonthFilter
        label="Từ tháng"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <ReportMonthFilter
        label="Đến tháng"
        value={endDate}
        onChange={handleEndDateChange}
        minDate={startDate ? dayjs(startDate).add(1, "month") : undefined}
        maxDate={startDate? dayjs(startDate).add(1, "year").subtract(1, "day") : undefined}
      />
      <Button onClick={onApplyFilter} variant="contained" color="info">
        Lọc
      </Button>
    </Box>
  );
}
