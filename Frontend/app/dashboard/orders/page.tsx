import { OrderContent } from "@/features/dashboard/orders/OrderContent";
import { Stack, Typography } from "@mui/material";

/**
 * Renders the order management page with a header and order content.
 *
 * Displays a heading and the {@link OrderContent} component within a stacked layout.
 */
export default async function Page() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Quản lý đơn hàng</Typography>
      <OrderContent />
    </Stack>
  );
}
