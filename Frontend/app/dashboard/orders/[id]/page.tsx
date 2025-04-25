import { API_URL } from "@/constant/apiUrl";
import OrderDetail from "@/features/dashboard/orders/OrderDetail";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { OrderResponse, UUID } from "@/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import Link from "next/link";

type DashboardOrderDetailParams = Promise<{
  id: string;
}>;

/**
 * Retrieves order details by UUID from the order API.
 *
 * @param id - The UUID of the order to fetch.
 * @returns The order data if found; otherwise, undefined.
 */
async function getOrderById(id: UUID) {
  const response = await getByIdApi(API_URL.order, { id });
  if (response.success) {
    return response.data as OrderResponse;
  }
  console.error(response.message);
  return undefined;
}

/**
 * Displays the order detail page for a specific order in the dashboard.
 *
 * Fetches the order data using the provided order ID and renders a back button along with the order details.
 *
 * @param params - An object containing a promise that resolves to the order ID parameter.
 */
export default async function Page({
  params,
}: {
  params: DashboardOrderDetailParams;
}) {
  const { id } = await params;
  const uuid = parseUUID(id);
  const order = await getOrderById(uuid);
  return (
    <>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        LinkComponent={Link}
        href="/dashboard/orders"
        sx={{
          fontWeight: "400",
        }}
      >
        Quay lại
      </Button>
      <OrderDetail order={order} />
    </>
  );
}
