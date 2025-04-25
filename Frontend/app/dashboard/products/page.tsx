import { ProductContent } from "@/features/dashboard/products/ProductContent";
import { Stack, Typography } from "@mui/material";

export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý sản phẩm</Typography>
      <ProductContent />
    </Stack>
  );
}
