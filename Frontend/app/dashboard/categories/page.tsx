import { CategoryContent } from "@/features/dashboard/categories/CategoryContent";
import { Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý danh mục sản phẩm</Typography>
      <CategoryContent />
    </Stack>
  );
}
