// theme/components.ts
import { Components } from "@mui/material/styles/components";
import {
    error,
    info,
    primary,
    secondary,
    success,
    warning
} from "./colors";

const components: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 4px 12px rgba(${parseInt(
            primary.main.slice(1, 3),
            16
          )}, ${parseInt(primary.main.slice(3, 5), 16)}, ${parseInt(
            primary.main.slice(5, 7),
            16
          )}, 0.3)`,
        },
      },
      containedPrimary: {
        background: `linear-gradient(45deg, ${primary.main}, ${primary.light})`,
      },
      containedSecondary: {
        background: `linear-gradient(45deg, ${secondary.main}, ${secondary.light})`,
      },
      containedSuccess: {
        background: `linear-gradient(45deg, ${success.main}, ${success.light})`,
      },
      containedWarning: {
        background: `linear-gradient(45deg, ${warning.main}, ${warning.light})`,
      },
      containedError: {
        background: `linear-gradient(45deg, ${error.main}, ${error.light})`,
      },
      containedInfo: {
        background: `linear-gradient(45deg, ${info.main}, ${info.light})`,
      },
      containedInherit: {
        "&:hover": {
          transform: "none",
          boxShadow: "none",
        },
      },
      outlined: {
        borderWidth: 2,
        "&:hover": {
          borderWidth: 2,
        },
      },
      text: {
        "&:hover": {
          transform: "none",
          boxShadow: "none",
        },
      },
    },
    defaultProps: {
      color: "inherit",
      "aria-label": "Button",
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 4,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          "&:hover fieldset": {
            borderColor: primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: primary.main,
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
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
        textTransform: "none",
        fontWeight: 600,
        "&.Mui-selected": {
          color: primary.main,
        },
      },
    },
  },
};

export default components;
