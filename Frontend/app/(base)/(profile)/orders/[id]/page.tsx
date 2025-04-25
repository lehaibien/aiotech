import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import OrderDetail from "@/features/orders/OrderDetail";
import { OrderDetailAction } from "@/features/orders/OrderDetailAction";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { OrderResponse } from "@/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button } from "@mui/material";
import { UUID } from "@/types";
import Link from "next/link";

type OrderDetailParams = Promise<{
  id: string;
}>;

async function getOrderDetail(id: UUID) {
  const response = await getByIdApi(API_URL.order, { id });
  if (response.success) {
    return response.data as OrderResponse;
  }
  console.error(response.message);
  return undefined;
}

export default async function OrderDetailPage({
  params,
}: {
  params: OrderDetailParams;
}) {
  const { id } = await params;
  const uuid = parseUUID(id);
  const order = await getOrderDetail(uuid);
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
