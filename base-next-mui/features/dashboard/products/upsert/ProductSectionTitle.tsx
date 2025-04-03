import { Typography } from "@mui/material";

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="h6"
    sx={{
      mb: 3,
      fontWeight: 600,
      color: "primary.main",
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    {children}
  </Typography>
);
