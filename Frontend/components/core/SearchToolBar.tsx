import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, SxProps, TextField, Theme } from '@mui/material';

interface SearchToolBarProps {
  // searchTerm: string;
  onChange: (searchTerm: string) => void;
  onSubmit?: () => void;
  sx?: SxProps<Theme>;
}

export function SearchToolBar({ onChange, onSubmit, sx }: SearchToolBarProps) {
  return (
    <TextField
      size='small'
      variant='outlined'
      placeholder='Tìm kiếm'
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <IconButton size='small' onClick={onSubmit}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={sx}
    />
  );
}
