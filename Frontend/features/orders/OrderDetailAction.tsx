"use client";

import AlertDialog from "@/components/core/AlertDialog";
import { API_URL } from "@/constant/apiUrl";
import { postApi, putApi } from "@/lib/apiClient";
import { UUID } from "@/types";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Ban, Check, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useOrderPrint } from "./hooks/useOrderPrint";

type OrderDetailActionProps = {
  id: UUID;
  status: string;
  trackingNumber: string;
};

export const OrderDetailAction = ({
  id,
  status,
  trackingNumber,
}: OrderDetailActionProps) => {
  const router = useRouter();
  const isCancelable = useMemo(() => {
    return (
      status.toLowerCase() === "pending" ||
      status.toLowerCase() === "paid" ||
      status.toLowerCase() === "processing"
    );
  }, [status]);
  const handleConfirm = useCallback(
    async (id: string) => {
      if (status.toLowerCase() === "delivered") {
        const response = await postApi(API_URL.orderConfirm + `/${id}`, {});
        if (response.success) {
          notifications.show({
            message: "Xác nhận đơn hàng thành công",
            color: "green",
          });
          router.refresh();
        } else {
          notifications.show({
            message: "Xác nhận đơn hàng thất bại: " + response.message,
            color: "red",
          });
        }
      }
    },
    [router, status]
  );
  const handlePrint = useOrderPrint(id, trackingNumber);
  const handleCancel = async () => {
    const request = {
      id: id,
      reason: "Người mua hủy",
    };
    const response = await putApi(API_URL.orderCancel, request);
    if (response.success) {
      notifications.show({
        message: "Hủy đơn hàng thành công",
        color: "green",
      });
      router.push("/orders");
    } else {
      notifications.show({
        message: "Hủy đơn hàng thất bại: " + response.message,
        color: "red",
      });
    }
  };
  return (
    <Group>
      <Button
        variant="transparent"
        color="green"
        leftSection={<Check size={16} />}
        disabled={status.toLowerCase() !== "delivered"}
        onClick={() => handleConfirm(id)}
        size="sm"
      >
        Đã nhận hàng
      </Button>
      <Button
        onClick={() => handlePrint(id)}
        leftSection={<Printer size={16} />}
        size="sm"
      >
        In
      </Button>

      <AlertDialog
        title="Hủy đơn hàng"
        content="Bạn có chắc chắn muốn hủy đơn hàng này không? Mọi thao tác sẽ không được hoàn lại"
        onConfirm={handleCancel}
      >
        <Button
          color="red"
          leftSection={<Ban size={16} />}
          disabled={isCancelable === false}
          size="sm"
        >
          Hủy
        </Button>
      </AlertDialog>
    </Group>
  );
};
