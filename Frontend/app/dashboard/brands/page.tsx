import { Stack, Typography } from "@mui/material";
import { BrandContent } from "@/features/dashboard/brands/BrandContent";

/**
 * Renders the brand management page with a heading and brand content.
 *
 * Displays a header labeled "Quản lý thương hiệu" and the {@link BrandContent} component within a vertical stack layout.
 */
export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý thương hiệu</Typography>
      <BrandContent />
    </Stack>
  );
}
