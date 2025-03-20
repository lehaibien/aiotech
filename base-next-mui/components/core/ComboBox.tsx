import { ComboBoxItem } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface ComboBoxProps<T extends FieldValues> {
  items: ComboBoxItem[];
  control: Control<T>;
  name: Path<T>;
  clearable?: boolean;
}

export default function ComboBox<T extends FieldValues>({
  items,
  control,
  name,
  clearable = true,
}: ComboBoxProps<T>) {
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
            getOptionLabel={(option) => option.text || ''}
            value={
              value
                ? items.find(
                    (item) => String(value).toLowerCase() === String(item.value).toLowerCase()
                  ) ?? null
                : null
            }
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error?.message}
              />
            )}
            disableClearable={!clearable}
            isOptionEqualToValue={(option, value) => 
              String(option.value).toLowerCase() === String(value.value).toLowerCase()
            }
          />
        );
      }}
    />
  );
}
