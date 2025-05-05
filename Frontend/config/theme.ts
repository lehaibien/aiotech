import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "var(--font-beVietnamPro)",
  headings: {
    sizes: {
      h1: {
        fontSize: "2.5rem",
        lineHeight: "1.2",
        fontWeight: "600",
      },
      h2: {
        fontSize: "2rem",
        lineHeight: "1.25",
        fontWeight: "600",
      },
      h3: {
        fontSize: "1.75rem",
        lineHeight: "1.3",
        fontWeight: "600",
      },
      h4: {
        fontSize: "1.5rem",
        lineHeight: "1.5",
        fontWeight: "500",
      },
      h5: {
        fontSize: "1.25rem",
        lineHeight: "1.5",
        fontWeight: "500",
      },
      h6: {
        fontSize: "1.1rem",
        lineHeight: "1.5",
        fontWeight: "500",
      },
    },
  },
  breakpoints: {
    xs: '40em',
    sm: '48em',
    md: '64em',
    lg: '80em',
    xl: '96em',
  }
});
