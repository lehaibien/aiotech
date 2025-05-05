import { TextInput, TextInputProps } from '@mantine/core';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type ControlledTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<TextInputProps, 'name' | 'onChange' | 'value' | 'error' | 'helperText'>;

export const ControlledTextInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledTextInputProps<T>) => {
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
          <TextInput
            {...restField}
            name={name}
            value={value ?? ''}
            onChange={handleChange}
            error={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
