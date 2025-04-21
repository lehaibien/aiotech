import { CategoryContent } from "@/features/dashboard/categories/CategoryContent";
import { Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <Stack gap={2}>
      <Typography variant="h5">Quản lý danh mục sản phẩm</Typography>
      <CategoryContent />
    </Stack>
  );
}
