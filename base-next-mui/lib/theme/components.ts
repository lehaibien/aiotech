import { Components, CssVarsTheme, Theme } from "@mui/material";
import { error, grey } from "./colors";

const components: Components<
  Omit<Theme, "components" | "palette"> & CssVarsTheme
> = {
  MuiPagination: {
    defaultProps: {
      variant: "outlined",
      color: "primary",
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "small",
      variant: "outlined",
    },
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        ...(ownerState.color === "info" && {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontWeight: 600,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[300],
          },
        }),
        ...(ownerState.disabled === true && {
          "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.background.paper,
          },
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      asterisk: {
        color: error[500],
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: () => ({
        minWidth: 0,
        minHeight: 0,
        fontWeight: 600,
        textTransform: "none",
      }),
      sizeLarge: {
        padding: ".6rem 2.5rem",
      },
    },
    defaultProps: {
      color: "inherit",
      "aria-label": "Button",
    },
  },
};

export default components;
