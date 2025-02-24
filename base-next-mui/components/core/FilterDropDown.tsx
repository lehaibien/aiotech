'use client';

import { ComboBoxItem } from '@/types';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

interface DropDownCheckboxProps {
  title?: string;
  items: ComboBoxItem[];
  size: 'small' | 'medium';
  width?: string | number;
  dropDownHeight?: string | number;
  ariaLabel?: string;
  onValueChange: (value: string[]) => void;
  initialValue?: string[];
  initialKey?: "label" | "value";
}

export default function FilterDropdown({
  title,
  items,
  ariaLabel,
  size = 'medium',
  width = '100%',
  dropDownHeight = 48 * 4.5 + 8,
  onValueChange,
  initialValue = [],
  initialKey = "value"
}: DropDownCheckboxProps) {
  const initValue = initialKey == "value" ? initialValue : items.filter(x => initialValue.includes(x.text)).map(x => x.value);
  const [currentValues, setcurrentValues] = useState<string[]>(initValue);
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<typeof currentValues>) => {
    const value = event.target.value;
    setcurrentValues(typeof value === 'string' ? value.split(',') : value);
    onValueChange(value as string[]);
  };

  const renderValue = (selected: string[]) => {
    let renderText = items
      .filter((x) => selected.includes(x.value))
      .map((x) => x.text)
      .join(',');
    const maxRender = renderText.length * 10;
    if (renderText.length > maxRender) {
      renderText = renderText.substring(0, maxRender - 3) + '...';
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip label={renderText} size='small' />
      </Box>
    );
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <FormControl sx={{ width: width }}>
      {title && (
        <InputLabel
          id={ariaLabel ?? undefined}
          size={size == 'medium' ? 'normal' : 'small'}
        >
          {title}
        </InputLabel>
      )}
      <Select
        size={size}
        labelId={ariaLabel ?? undefined}
        multiple
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={currentValues}
        label={title ?? undefined}
        onChange={handleChange}
        renderValue={renderValue}
        endAdornment={
          currentValues.length > 0 && (
            <InputAdornment
              sx={{ position: 'absolute', right: 24 }}
              position='end'
            >
              <IconButton
                onClick={() => {
                  setcurrentValues([]);
                  onValueChange([]);
                }}
              >
                <ClearIcon></ClearIcon>
              </IconButton>
            </InputAdornment>
          )
        }
        IconComponent={ExpandMoreIcon}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: dropDownHeight,
              width: 250,
            },
          },
        }}
      >
        {items.map((range) => (
          <MenuItem key={range.value} value={range.value}>
            <Checkbox checked={currentValues.indexOf(range.value) > -1} />
            <ListItemText primary={range.text} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
