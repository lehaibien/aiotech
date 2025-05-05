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
        return (
          <TextInput
            {...restField}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            error={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};
