import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type ControlledTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<TextFieldProps, 'name' | 'onChange' | 'value' | 'error' | 'helperText'>;

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
        const { onChange, value, ...restField } = field;
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (props.type === 'number') {
            // Convert empty string to undefined, otherwise to number
            const val = e.target.value;
            onChange(val === '' ? undefined : Number(val));
          } else {
            onChange(e);
          }
        };
        return (
          <TextField
            {...restField}
            name={name}
            value={value ?? ''}
            onChange={handleChange}
            error={!!error}
            helperText={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
