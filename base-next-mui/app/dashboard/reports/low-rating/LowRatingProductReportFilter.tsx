"use client";

import { Box, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type LowRatingProductReportFilterProps = {
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
};

export default function LowRatingProductReportFilter({
  defaultStartDate,
  defaultEndDate,
}: LowRatingProductReportFilterProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs.utc(defaultStartDate)
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs.utc(defaultEndDate)
  );
  const onApplyFilter = () => {
    const start = startDate?.toJSON();
    const end = endDate?.toJSON();
    router.push(`/dashboard/reports/order?start_date=${start}&end_date=${end}`);
  };

  const handleEndDateChange = () => {
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
        value={startDate}
        onChange={setStartDate}
        views={["year", "month"]}
        format="MM/YYYY"
        //Remove this line: renderInput={(params) => (<TextField {...params} />)}
        slotProps={{ textField: { variant: "outlined" } }} // optional styling. Choose variant as per your need.
      />
      <DatePicker
        label="Đến tháng"
        value={endDate}
        onChange={setEndDate}
        onClose={handleEndDateChange}
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
