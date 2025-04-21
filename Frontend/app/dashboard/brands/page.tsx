import { Stack, Typography } from "@mui/material";
import { BrandContent } from "@/features/dashboard/brands/BrandContent";

export default async function Page() {
  return (
    <Stack gap={2}>
      <Typography variant="h5">Quản lý thương hiệu</Typography>
      <BrandContent />
    </Stack>
  );
}
