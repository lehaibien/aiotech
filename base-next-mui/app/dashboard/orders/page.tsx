import { Stack, Typography } from "@mui/material";
import { OrderPage } from "./OrderPage";

export default async function Page() {
  return (
    <Stack gap={2}>
      <Typography variant="h5">Quản lý đơn hàng</Typography>
      <OrderPage />
    </Stack>
  );
}
