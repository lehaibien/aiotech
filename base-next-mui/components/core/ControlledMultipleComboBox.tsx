import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ComboBoxItem } from '@/types';
import { Autocomplete, TextField } from '@mui/material';

type ControlledMultipleComboBoxProps<T extends FieldValues> = {
  items: ComboBoxItem[];
  control: Control<T>;
  name: Path<T>;
};

export default function ControlledMultipleComboBox<T extends FieldValues>({
  items,
  control,
  name,
}: ControlledMultipleComboBoxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value } = field;

        // Normalize the value to ensure it's always an array
        const normalizedValue: string[] = Array.isArray(value) ? value : [];

        return (
          <Autocomplete
            multiple
            autoHighlight
            noOptionsText='Không có kết quả'
            options={items}
            getOptionLabel={(option) => option.text || ''}
            isOptionEqualToValue={(option, { value }) => option.value === value}
            value={items.filter((item) =>
              normalizedValue.includes(item.value)
            )}
            onChange={(_event, newValue) => {
              onChange(newValue.map((item) => item.value));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );
      }}
    />
  );
}