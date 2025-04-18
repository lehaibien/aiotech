import { ComboBoxItem } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface ControlledComboBoxProps<T extends FieldValues> {
  items: ComboBoxItem[];
  control: Control<T>;
  label?: string;
  name: FieldPath<T>;
  clearable?: boolean;
  required?: boolean;
  size?: 'small' | 'medium';
}

export default function ControlledComboBox<T extends FieldValues>({
  items,
  control,
  label,
  name,
  clearable = true,
  required = false,
  size = 'medium',
}: ControlledComboBoxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value } = field;
        return (
          <Autocomplete
            autoHighlight
            noOptionsText='Không có kết quả'
            options={items}
            size={size}
            getOptionLabel={(option) => option.text || ''}
            value={
              value
                ? items.find(
                    (item) =>
                      String(value).toLowerCase() ===
                      String(item.value).toLowerCase()
                  ) ?? null
                : null
            }
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : null);
            }}
            renderInput={(params) => (
              <TextField
                label={label}
                required={required}
                {...params}
                error={!!error}
                helperText={error?.message}
              />
            )}
            disableClearable={!clearable}
            isOptionEqualToValue={(option, value) =>
              String(option.value).toLowerCase() ===
              String(value.value).toLowerCase()
            }
          />
        );
      }}
    />
  );
}
