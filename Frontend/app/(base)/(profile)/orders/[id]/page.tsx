import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { OrderDetail } from "@/features/orders/OrderDetail";
import { OrderDetailAction } from "@/features/orders/OrderDetailAction";
import { getByIdApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { OrderResponse, UUID } from "@/types";
import { Button, Group } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ id: string }>;

async function getOrderDetail(id: UUID) {
  const response = await getByIdApi(API_URL.order, { id });
  if (response.success) {
    return response.data as OrderResponse;
  }
  console.error(response.message);
  return undefined;
}

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const uuid = parseUUID(id);
  const order = await getOrderDetail(uuid);
  return (
    <>
      <Group justify="space-between" align="center">
        <Button
          variant="transparent"
          color="dark"
          leftSection={<ArrowLeft />}
          component={Link}
          href="/profile?tab=2"
        >
          Quay lại
        </Button>
        <OrderDetailAction
          id={order?.id || EMPTY_UUID}
          status={order?.status || ""}
          trackingNumber={order?.trackingNumber || ""}
        />
      </Group>
      <OrderDetail order={order} />
    </>
  );
}
