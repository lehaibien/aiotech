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

/**
 * Fetches order details for the specified UUID.
 *
 * @param id - The UUID of the order to retrieve.
 * @returns The order details as an {@link OrderResponse}, or `undefined` if the fetch fails.
 */
async function getOrderDetail(id: UUID) {
  const response = await getByIdApi(API_URL.order, { id });
  if (response.success) {
    return response.data as OrderResponse;
  }
  console.error(response.message);
  return undefined;
}

/**
 * Server component that displays the details and actions for a specific order.
 *
 * @param params - A promise resolving to an object containing the order ID as a string.
 * @returns The order detail page UI for the specified order.
 */
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
