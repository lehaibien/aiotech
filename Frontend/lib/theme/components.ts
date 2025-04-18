// theme/components.ts
import { Components } from '@mui/material/styles/components';
import { error, primary } from './colors';

const components: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        transition: 'all 0.3s ease-in-out',
        boxShadow: 'none',
        '&:hover': {
          transform: 'none',
          boxShadow: 'none',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
    },
    defaultProps: {
      color: 'inherit',
      'aria-label': 'Button',
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '&:hover fieldset': {
            borderColor: primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: primary.main,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: primary.main,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      asterisk: {
        color: error.main,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        '&.Mui-selected': {
          color: primary.main,
        },
      },
    },
  },
};

export default components;
