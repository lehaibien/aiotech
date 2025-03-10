// theme/index.ts
'use client';

import { createTheme } from '@mui/material/styles';
import {
    background,
    error,
    grey,
    info,
    primary,
    secondary,
    success,
    tertiary,
    warning
} from './colors';
import components from './components';
import typography from './typography';

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary,
        secondary,
        tertiary,
        error,
        success,
        warning,
        info,
        grey,
        divider: grey[500],
        background: {
          default: background.light,
          paper: background.lightPaper,
          gradient: background.gradientLight,
        },
        text: {
          primary: grey[900],
          secondary: grey[800],
          disabled: grey[400],
        },
      },
    },
    dark: {
      palette: {
        primary,
        secondary,
        tertiary,
        error,
        success,
        warning,
        info,
        grey,
        divider: grey[600],
        background: {
          default: background.dark,
          paper: background.darkPaper,
          gradient: background.gradientDark,
        },
        text: {
          primary: grey[100],
          secondary: grey[300],
          disabled: grey[500],
        },
      },
    },
  },
  typography,
  components,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
    },
  },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
});

export default theme;