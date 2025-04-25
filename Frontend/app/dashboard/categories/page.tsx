import { CategoryContent } from "@/features/dashboard/categories/CategoryContent";
import { Stack, Typography } from "@mui/material";

/**
 * Renders the product category management page with a heading and category content.
 */
export default function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý danh mục sản phẩm</Typography>
      <CategoryContent />
    </Stack>
  );
}
