import { Stack, Typography } from "@mui/material";
import { OrderPage } from "./OrderPage";
import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";

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
      <OrderPage />
    </Stack>
  );
}
