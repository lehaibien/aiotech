"use client";

import { Box, Button, MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { useState } from "react";

dayjs.extend(utc);

type TopCustomerFilterProps = {
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  defaultCount?: number;
};

export default function TopCustomerFilter({
  defaultStartDate,
  defaultEndDate,
  defaultCount,
}: TopCustomerFilterProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Dayjs | null>(
    defaultStartDate ? dayjs.utc(defaultStartDate) : null
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    defaultEndDate ? dayjs.utc(defaultEndDate) : null
  );
  const [count, setCount] = useState<number>(defaultCount || 10);
  const onApplyFilter = () => {
    const start = startDate?.toJSON();
    const end = endDate?.toJSON();
    router.push(
      `/dashboard/reports/top-customer?start_date=${start}&end_date=${end}&count=${count}`
    );
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
