import { mapOrderStatus } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { Button, Modal, Select } from "@mantine/core";
import { useState } from "react";

type OrderStatusModalProps = {
  status: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string | null) => void;
};

export const OrderStatusModal = ({
  status,
  isOpen,
  onClose,
  onConfirm,
}: OrderStatusModalProps) => {
  const [orderStatus, setOrderStatus] = useState<string | null>(status);
  const statusOptions = Object.keys(OrderStatus)
    .filter((key) => isNaN(Number(key)))
    .filter((key) => key !== "Completed" && key !== "Cancelled")
    .map((status) => ({
      label: mapOrderStatus(status),
      value: status,
    }));
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Thông tin đơn hàng"
      size="sm"
    >
      <Select
        value={orderStatus}
        label="Trạng thái"
        onChange={setOrderStatus}
        size="sm"
        data={statusOptions}
      />
      <Button mt="md" onClick={() => onConfirm(orderStatus)}>
        Xác nhận
      </Button>
    </Modal>
  );
};
