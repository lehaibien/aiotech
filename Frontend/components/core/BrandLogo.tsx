import { Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function BrandLogo() {
  return (
    <Stack direction="row" gap={1} alignItems='center' justifyContent={{
      xs: "center",
      md: "flex-start",
    }}>
      <Image
        src="/favicon.svg"
        alt="Logo"
        width={32}
        height={32}
        style={{
          aspectRatio: 1 / 1,
          minWidth: 32,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: "semibold",
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        AioTech
      </Typography>
    </Stack>
  );
}
