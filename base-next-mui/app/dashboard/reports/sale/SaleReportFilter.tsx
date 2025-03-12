"use client";

import { DEFAULT_TIMEZONE } from "@/constant/common";
import dayjs from "@/lib/extended-dayjs";
import { Box, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const localStartDate = useMemo(() => {
    if (startDate === null) {
      return null;
    }
    return startDate.tz(DEFAULT_TIMEZONE);
  }, [startDate]);
  const localEndDate = useMemo(() => {
    if (endDate === null) {
      return null;
    }
    return endDate.tz(DEFAULT_TIMEZONE);
  }, [endDate]);
  const onApplyFilter = () => {
    const start = startDate?.toISOString();
    const end = endDate?.toISOString();
    router.push(`/dashboard/reports/sale?start_date=${start}&end_date=${end}`);
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }
    setStartDate(dayjs(newValue));
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }
    setEndDate(dayjs(newValue));
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
      <DatePicker
        label="Từ tháng"
        value={localStartDate}
        onChange={handleStartDateChange}
        onClose={handleStartDateClose}
        views={["year", "month"]}
        format="MM/YYYY"
        //Remove this line: renderInput={(params) => (<TextField {...params} />)}
        slotProps={{ textField: { variant: "outlined" } }} // optional styling. Choose variant as per your need.
      />
      <DatePicker
        label="Đến tháng"
        value={localEndDate}
        onChange={handleEndDateChange}
        onClose={handleEndDateClose}
        views={["year", "month"]}
        format="MM/YYYY"
        //Remove this line: renderInput={(params) => (<TextField {...params} />)}
        slotProps={{ textField: { variant: "outlined" } }} // optional styling. Choose variant as per your need.
      />
      <Button onClick={onApplyFilter} variant="contained" color="info">
        Lọc
      </Button>
    </Box>
  );
}
