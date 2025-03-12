import { DEFAULT_TIMEZONE } from "@/constant/common";
import dayjs from "@/lib/extended-dayjs";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useMemo } from "react";

type ReportMonthFilterProps = {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
} & DatePickerProps<Dayjs>;

export function ReportMonthFilter({
  value,
  onChange,
  ...props
}: ReportMonthFilterProps) {
  const actualValue = useMemo(() => {
    if (value === null) {
      return null;
    }
    return dayjs(value).tz(DEFAULT_TIMEZONE);
  }, [value]);
  const handleOnChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      return;
    }
    onChange(dayjs(newValue));
  };
  return (
    <DatePicker
      {...props}
      value={actualValue}
      onChange={handleOnChange}
      views={["year", "month"]}
      format="MM/YYYY"
      //Remove this line: renderInput={(params) => (<TextField {...params} />)}
      slotProps={{ textField: { variant: "outlined" } }} // optional styling. Choose variant as per your need.
    />
  );
}
