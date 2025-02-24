import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, useColorScheme } from '@mui/material';

function ColorSchemeSwitch() {
  const { mode, setMode } = useColorScheme();
  function toggleMode() {
    setMode(mode === 'light' ? 'dark' : 'light');
  }
  return (
    <IconButton color='inherit' onClick={toggleMode} aria-label='Dark mode'>
      {mode === 'light' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}

export default ColorSchemeSwitch;
