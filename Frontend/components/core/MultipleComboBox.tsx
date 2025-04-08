import { ComboBoxItem } from '@/types';
import { Autocomplete, TextField } from '@mui/material';

interface ComboBoxProps {
  label: string;
  items: ComboBoxItem[];
  defaultValue: string[];
  onValueChange?: (value: string[]) => void;
}

export function MultipleComboBox({
  label,
  items,
  defaultValue,
  onValueChange,
}: ComboBoxProps) {
  const normalizedValue = defaultValue.map((item) => item.toLocaleLowerCase());
  return (
    <Autocomplete
      multiple
      autoHighlight
      noOptionsText='Không có kết quả'
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
        />
      )}
      options={items}
      getOptionLabel={(option) => option.text || ''}
      isOptionEqualToValue={(option, { value }) => option.value === value}
      defaultValue={items.filter((item) =>
        normalizedValue.includes(item.value.toLocaleLowerCase())
      )}
      onChange={(_event, newValue) => {
        onValueChange?.(newValue.map((item) => item.value));
      }}
    />
  );
}
