import { Button, Modal, Textarea } from "@mantine/core";
import { useState } from "react";

type OrderCancelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export const OrderCancelModal = ({
  isOpen,
  onClose,
  onConfirm,
}: OrderCancelModalProps) => {
  const [reason, setReason] = useState<string>("");
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Thông tin đơn hàng"
      size="sm"
    >
      <Textarea
        placeholder="Lí do hủy đơn hàng"
        label="Lí do hủy"
        rows={3}
        value={reason}
        onChange={(event) => setReason(event.currentTarget.value)}
      />
      <Button mt="md" color="red" onClick={() => onConfirm(reason)}>
        Xác nhận
      </Button>
    </Modal>
  );
};
