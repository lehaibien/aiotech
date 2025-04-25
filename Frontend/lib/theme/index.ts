"use client";

import { viVN as coreviVN } from "@mui/material/locale";
import { viVN as dateGridviVN } from "@mui/x-data-grid/locales";
import { viVN as datePickerviVN } from "@mui/x-date-pickers/locales";

import { createTheme } from "@mui/material/styles";
import {
  background,
  error,
  grey,
  info,
  primary,
  secondary,
  success,
  warning,
} from "./colors";
import components from "./components";
import typography from "./typography";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary,
        secondary,
        error,
        success,
        warning,
        info,
        grey,
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
      },
    },
    dark: {
      palette: {
        primary,
        secondary,
        error,
        success,
        warning,
        info,
        grey,
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
      },
    },
  },
  typography,
  components: {
    ...coreviVN,
    ...datePickerviVN,
    ...dateGridviVN,
    ...components,
  },
  breakpoints: {
    values: {
      xs: 0,      // Mobile portrait
      sm: 600,    // Mobile landscape
      md: 900,    // Tablet
      lg: 1200,   // Laptop
      xl: 1536,   // Large desktop [[Material default]]
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});

export default theme;
