import { ComboBoxItem } from '@/types';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';

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

export type ComboBoxProps = {
  items: ComboBoxItem[];
  value?: string | ComboBoxItem | null;
  label?: string;
  required?: boolean;
  name?: string;
  compareBy?: 'value' | 'text';
  onChange: (value: string | ComboBoxItem | null) => void;
} & StylingProps;

export const ComboBox = ({
  items,
  value,
  label,
  required = false,
  name,
  compareBy = 'value',
  onChange,
  ...props
}: ComboBoxProps) => {
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
  const getValue = (value: ComboBoxItem | string | null | undefined) => {
    return items.find((item) => compareFn(item, value)) ?? null;
  };
  return (
    <Autocomplete
      {...props}
      autoHighlight
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
          name={name}
          {...params}
        />
      )}
      isOptionEqualToValue={(option, value) =>
        String(option.value).toLowerCase() === String(value.value).toLowerCase()
      }
    />
  );
};
