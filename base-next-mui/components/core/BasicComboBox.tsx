import { ComboBoxItem } from '@/types';
import { Autocomplete, TextField } from '@mui/material';

interface ComboBoxProps {
  items: ComboBoxItem[];
  value?: unknown;
  error?: Error | undefined;
  onChange: (value: unknown | null) => void;
}

export default function BasicComboBox({
  items,
  value,
  error,
  onChange,
}: ComboBoxProps) {
  return (
          <Autocomplete
            autoHighlight
            noOptionsText='Không có kết quả'
            options={items}
            getOptionLabel={(option) => option.text || ''}
            value={
              value
                ? items.find((item) => value === item.value) ?? null
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
          />
  );
}