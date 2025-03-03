import { Typography, TypographyProps } from "@mui/material";

type HighlightTypographyProps = {
  children: React.ReactNode;
} & TypographyProps;

export function HighlightTypography({
  children,
  ...props
}: HighlightTypographyProps) {
  return (
    <Typography
      {...props}
      sx={{
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -8,
          left: 0,
          width: 60,
          height: 4,
          backgroundColor: "primary.main",
          borderRadius: 2,
        },
      }}
    >
      {children}
    </Typography>
  );
}
