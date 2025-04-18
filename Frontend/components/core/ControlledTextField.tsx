import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type ControlledTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<TextFieldProps, 'name'>;

export const ControlledTextField = <T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value } = field;
        return (
          <TextField
            {...field}
            name={name}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
