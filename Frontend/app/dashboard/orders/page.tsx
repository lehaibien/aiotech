import { OrderContent } from "@/features/dashboard/orders/OrderContent";
import { Stack, Typography } from "@mui/material";

export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý đơn hàng</Typography>
      <OrderContent />
    </Stack>
  );
}
