import { Stack, Typography } from "@mui/material";
import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { OrderContent } from "@/features/dashboard/orders/OrderContent";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Quản lý đơn hàng",
    href: "?",
  },
];

export default async function Page() {
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h5">Quản lý đơn hàng</Typography>
      <OrderContent />
    </Stack>
  );
}
