import "server-only";
import { parseUUID } from "@/lib/utils";
import { EMPTY_UUID } from "@/constant/common";
import { getByIdApi } from "@/lib/apiClient";
import { OrderResponse } from "@/types";
import { API_URL } from "@/constant/apiUrl";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { OrderDetailAction } from "@/features/orders/OrderDetailAction";
import OrderDetail from "@/features/orders/OrderDetail";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let order: OrderResponse | undefined = undefined;
  const uuid = parseUUID(params.id);
  if (uuid !== EMPTY_UUID) {
    const response = await getByIdApi(API_URL.order, { id: uuid });
    if (response.success) {
      order = response.data as OrderResponse;
    } else {
      console.error(response.message);
    }
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          LinkComponent={Link}
          href="/profile?tab=2"
          sx={{
            fontWeight: "400",
          }}
        >
          Quay lại
        </Button>
        <OrderDetailAction
          id={order?.id || EMPTY_UUID}
          status={order?.status || ""}
          trackingNumber={order?.trackingNumber || ""}
        />
      </Box>
      <OrderDetail order={order} />
    </>
  );
}
