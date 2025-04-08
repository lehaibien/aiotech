'use client'

// themes.ts
import { createTheme } from '@mui/material/styles';
import { background, error, grey, info, primary, secondary, success, warning } from './theme/colors';
import components from './theme/components';
import typography from './theme/typography';

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: primary,
        secondary: secondary,
        error: error,
        success: success,
        warning: warning,
        info: info,
        grey: grey,
        divider: grey[500],
        background: {
          default: background.light,
          paper: background.lightPaper,
        },
        text: {
          primary: grey[900],
          secondary: grey[800],
          disabled: grey[400],
        },
      }
    },
    dark: {
      palette: {
        primary: primary,
        secondary: secondary,
        error: error,
        success: success,
        warning: warning,
        info: info,
        grey: grey,
        divider: grey[600],
        background: {
          default: background.dark,
          paper: background.darkPaper,
        },
        text: {
          primary: grey[100],
          secondary: grey[300],
          disabled: grey[500],
        },
      }
    }
  },
  typography: typography,
  components: components,
  breakpoints: {
    values: {
      'xs': 0,
      'sm': 600,
      'md': 900,
      'lg': 1200,
      'xl': 1600
    }
  },
  cssVariables: {
    colorSchemeSelector: 'class'
  },
});

export default theme;
