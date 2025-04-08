import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { CategoryContent } from "@/features/dashboard/categories/CategoryContent";
import { Stack, Typography } from "@mui/material";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý danh mục sản phẩm",
    href: "?",
  },
];

export default function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h5">Quản lý danh mục sản phẩm</Typography>
      <CategoryContent />
    </Stack>
  );
}
