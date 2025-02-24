import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { useState } from 'react';

interface CustomNumericFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value?: number;
  min?: number;
  max?: number;
  currency?: 'đ' | '$' | 'VND' | 'USD';
  onChange?: (value: number) => void;
}

function CustomNumericField({
  value,
  min = 0,
  max = Infinity,
  currency,
  onChange,
  ...textFieldProps
}: CustomNumericFieldProps) {
  const [currentValue, setCurrentValue] = useState(value?.toString() || '');

  const onInputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '' || /^[+-]?\d*(\.\d*)?$/.test(inputValue)) {
      setCurrentValue(inputValue);
    }
  };

  const onBlurHandle = () => {
    let numericValue = Number(currentValue);

    if (isNaN(numericValue)) {
      numericValue = min;
    } else {
      numericValue = Math.max(min, Math.min(max, Math.floor(numericValue)));
    }

    setCurrentValue(numericValue.toString());
    if (onChange) onChange(numericValue);
  };

  return (
    <TextField
      {...textFieldProps}
      type="number"
      inputMode="numeric"
      value={currentValue}
      onChange={onInputHandle}
      onBlur={onBlurHandle}
      InputProps={{
        endAdornment: currency ? (
          <InputAdornment position="end">{currency}</InputAdornment>
        ) : undefined,
      }}
    />
  );
}

export default CustomNumericField;
