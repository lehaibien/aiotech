import { ProductContent } from "@/features/dashboard/products/ProductContent";
import { Stack, Typography } from "@mui/material";

/**
 * Renders the product management page with a heading and product content.
 *
 * Displays a heading labeled "Quản lý sản phẩm" and the main product content within a vertically spaced stack layout.
 */
export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý sản phẩm</Typography>
      <ProductContent />
    </Stack>
  );
}
