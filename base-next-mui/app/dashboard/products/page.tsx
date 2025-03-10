import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { ProductContent } from "@/features/dashboard/products/ProductContent";
import { Stack, Typography } from "@mui/material";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý sản phẩm",
    href: "?",
  },
];

export default async function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h5">Quản lý sản phẩm</Typography>
      <ProductContent />
    </Stack>
  );
}
