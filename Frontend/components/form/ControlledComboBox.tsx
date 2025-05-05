import { ComboBoxItem } from '@/types';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

// Only allow styling-related props for Autocomplete
type StylingProps = Pick<
  AutocompleteProps<ComboBoxItem, false, false, false>,
  | 'className'
  | 'style'
  | 'size'
  | 'fullWidth'
  | 'sx'
  | 'disableClearable'
  | 'disabled'
  | 'id'
  | 'popupIcon'
  | 'clearIcon'
  | 'open'
  | 'onOpen'
  | 'onClose'
  | 'loading'
  | 'loadingText'
  | 'PaperComponent'
  | 'ListboxComponent'
  | 'renderTags'
  | 'ChipProps'
  | 'clearOnEscape'
  | 'blurOnSelect'
  | 'openOnFocus'
  | 'autoComplete'
  | 'autoSelect'
  | 'includeInputInList'
  | 'filterSelectedOptions'
  | 'selectOnFocus'
  | 'handleHomeEndKeys'
  | 'disablePortal'
  | 'disableListWrap'
  | 'readOnly'
>;

type ControlledComboBoxProps<T extends FieldValues> = {
  items: ComboBoxItem[];
  control: Control<T>;
  label?: string;
  name: FieldPath<T>;
  required?: boolean;
  compareBy?: 'value' | 'text';
} & StylingProps;

export default function ControlledComboBox<T extends FieldValues>({
  items,
  control,
  label,
  name,
  required = false,
  compareBy = 'value',
  ...props
}: ControlledComboBoxProps<T>) {
  const compareFn = (
    option: ComboBoxItem,
    value: ComboBoxItem | string | number | null | undefined
  ) => {
    if (!value) return false;
    if (typeof value === 'object' && value !== null && 'value' in value) {
      if (compareBy === 'text') {
        return (
          String(option.text).toLowerCase() === String(value.text).toLowerCase()
        );
      } else {
        return (
          String(option.value).toLowerCase() ===
          String(value.value).toLowerCase()
        );
      }
    } else {
      // value is primitive (string/number)
      return String(option.value).toLowerCase() === String(value).toLowerCase();
    }
  };
  const getValue = (value: ComboBoxItem) => {
    return items.find((item) => compareFn(item, value)) ?? null;
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value } = field;
        return (
          <Autocomplete<ComboBoxItem>
            {...props}
            noOptionsText='Không có kết quả'
            options={items}
            getOptionLabel={(option) => option.text}
            value={getValue(value) ?? null}
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
