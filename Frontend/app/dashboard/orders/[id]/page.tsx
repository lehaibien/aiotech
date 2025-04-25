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

async function getOrderById(id: UUID) {
  const response = await getByIdApi(API_URL.order, { id });
  if (response.success) {
    return response.data as OrderResponse;
  }
  console.error(response.message);
  return undefined;
}

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
