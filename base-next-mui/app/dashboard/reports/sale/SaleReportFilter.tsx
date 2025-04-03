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
  const [startDate, setStartDate] = useState<Dayjs | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultEndDate);
  const onApplyFilter = () => {
    const start = dayjs(startDate).toJSON();
    const end = dayjs(endDate).toJSON();
    router.push(`/dashboard/reports/sale?start_date=${start}&end_date=${end}`);
  };

  const handleStartDateClose = () => {
    if (dayjs(startDate).isAfter(endDate)) {
      setStartDate(endDate);
      return;
    }
  };

  const handleEndDateClose = () => {
    const endDayjs = dayjs(endDate);
    if (endDayjs.isBefore(startDate)) {
      setEndDate(startDate);
      return;
    }
    if (
      startDate !== null &&
      endDate !== null &&
      endDayjs.diff(startDate, "months") > 12
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
      <Button onClick={onApplyFilter} variant="contained" color="info">
        Lọc
      </Button>
    </Box>
  );
}
