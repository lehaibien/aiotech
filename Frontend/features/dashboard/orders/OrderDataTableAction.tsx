import { API_URL } from "@/constant/apiUrl";
import { putApi } from "@/lib/apiClient";
import { OrderCancelRequest, OrderResponse, OrderStatus } from "@/types";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Ban, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderCancelModal } from "./OrderCancelModal";
import { OrderStatusModal } from "./OrderStatusModal";

export const OrderDataTableAction = (record: OrderResponse) => {
  const router = useRouter();
  const [editStatusOpened, { open: openEditStatus, close: closeEditStatus }] =
    useDisclosure();
  const [cancelOpened, { open: openCancel, close: closeCancel }] =
    useDisclosure();
  const handleEditConfirm = async (status: string | null) => {
    if (status === null) {
      return;
    }
    const request = {
      id: record.id,
      status: status,
    };
    try {
      const response = await putApi(API_URL.orderStatus, request);
      if (!response.success) {
        notifications.show({
          title: "Hệ thống",
          message: "Cập nhật trạng thái đơn hàng thất bại: " + (response.message || "Có lỗi xảy ra"),
          color: "red",
        });
        return;
      }
      notifications.show({
        title: "Hệ thống",
        message: "Cập nhật trạng thái đơn hàng thành công",
        color: "green",
      });
      closeEditStatus();
      router.refresh();
    } catch (err) {
      notifications.show({
        title: "Thất bại",
        message: "Cập nhật trạng thái đơn hàng thất bại: " + (err as Error).message,
        color: "red",
      });
    }
  };
  const handleCancelConfirm = async (reason: string) => {
    const trimmedReason = reason.trim();
    if (trimmedReason.length === 0) {
      notifications.show({
        title: "Hệ thống",
        message: "Vui lòng nhập lý do hủy đơn hàng",
        color: "red",
      });
      return;
    }
    const request: OrderCancelRequest = {
      id: record.id,
      reason: trimmedReason,
    };
    try {
      const response = await putApi(API_URL.orderCancel, request);
      if (!response.success) {
        notifications.show({
          title: "Hệ thống",
          message: "Hủy đơn hàng thất bại: " + (response.message || "Có lỗi xảy ra"),
          color: "red",
        });
        return;
      }
      notifications.show({
        title: "Hệ thống",
        message: "Hủy đơn hàng thành công",
        color: "green",
      });
      closeCancel();
      router.refresh();
    } catch (err) {
      notifications.show({
        title: "Thất bại",
        message: "Hủy đơn hàng thất bại: " + (err as Error).message,
        color: "red",
      });
    }
  };
  return (
    <Group gap="xs" justify="center">
      <Tooltip label="Chỉnh sửa">
        <ActionIcon
          variant="subtle"
          onClick={openEditStatus}
          disabled={
            record.status.toLowerCase() ===
              OrderStatus.Cancelled.toString().toLowerCase() ||
            record.status.toLowerCase() ===
              OrderStatus.Delivered.toString().toLowerCase() ||
            record.status.toLowerCase() ===
              OrderStatus.Completed.toString().toLowerCase()
          }
        >
          <Edit size="1rem" />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Hủy">
        <ActionIcon variant="subtle" color="red" onClick={openCancel}>
          <Ban size="1rem" />
        </ActionIcon>
      </Tooltip>
      <OrderStatusModal
        status={record.status}
        isOpen={editStatusOpened}
        onClose={closeEditStatus}
        onConfirm={handleEditConfirm}
      />
      <OrderCancelModal
        isOpen={cancelOpened}
        onClose={closeCancel}
        onConfirm={handleCancelConfirm}
      />
    </Group>
  );
};
