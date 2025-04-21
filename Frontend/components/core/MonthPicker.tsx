import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

type MonthPickerProps = DatePickerProps;

export const MonthPicker = ({ ...props }: MonthPickerProps) => {
  return (
    <DatePicker
      {...props}
      views={['year', 'month']}
      format='MM/YYYY'
      slotProps={{ textField: { variant: 'outlined', size: 'small' } }}
    />
  );
};
