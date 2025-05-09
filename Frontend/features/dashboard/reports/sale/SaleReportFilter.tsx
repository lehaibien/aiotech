"use client";

import dayjs from "@/lib/extended-dayjs";
import { Button, SimpleGrid } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SaleReportFilterProps = {
  defaultStartDate: Date;
  defaultEndDate: Date;
};

export const SaleReportFilter = ({
  defaultStartDate,
  defaultEndDate,
}: SaleReportFilterProps) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);

  const onApplyFilter = () => {
    if (!startDate || !endDate || dayjs(startDate).isAfter(endDate)) {
      router.push("/dashboard/reports/sale");
      return;
    }
    const start = dayjs(startDate).toISOString();
    const end = dayjs(endDate).toISOString();
    router.push(`/dashboard/reports/sale?start_date=${start}&end_date=${end}`);
  };

  const handleStartDateChange = (newValue: Date | null) => {
    setStartDate(newValue);
    if (!newValue) {
      setEndDate(null);
      return;
    }
    if(endDate && dayjs(endDate).isBefore(newValue)) {
      setEndDate(dayjs(newValue).add(1, "day").toDate());
      return;
    }
    const oneYearFromStart = dayjs(newValue).add(1, "year");
    if (endDate && dayjs(endDate).isAfter(oneYearFromStart)) {
      setEndDate(oneYearFromStart.toDate());
    }
  };

  const handleEndDateChange = (newValue: Date | null) => {
    if (!newValue) {
    }
    if (startDate && dayjs(newValue).isBefore(startDate)) {
      setEndDate(dayjs(startDate).add(1, "day").toDate());
      return;
    }
    setEndDate(newValue);
  };

  return (
    <SimpleGrid
      cols={{
        base: 1,
        md: 6,
      }}
      w="100%"
      style={{
        alignItems: "flex-end",
      }}
    >
      <MonthPickerInput
        label="Từ tháng"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <MonthPickerInput
        label="Đến tháng"
        value={endDate}
        onChange={handleEndDateChange}
        minDate={dayjs(startDate).add(1, "day").toDate()}
        maxDate={dayjs(startDate).add(1, "year").subtract(1, "day").toDate()}
      />
      <Button onClick={onApplyFilter} variant="filled" color="cyan">
        Lọc
      </Button>
    </SimpleGrid>
  );
};
