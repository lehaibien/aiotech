import { API_URL } from "@/constant/apiUrl";
import { deleteApi } from "@/lib/apiClient";
import { ReviewResponse } from "@/types";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const ReviewDataTableAction = (record: ReviewResponse) => {
  const router = useRouter();
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xác nhận xóa đánh giá",
      children: "Bạn có chắc chắn muốn xóa đánh giá này?",
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await deleteApi(API_URL.review + `/${record.id}`);
          if (!response.success) {
            notifications.show({
              title: "Hệ thống",
              message: "Xóa đánh giá thất bại: " + response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Hệ thống",
            message: "Xóa đánh giá thành công",
            color: "green",
          });
          router.refresh();
        } catch (err) {
          notifications.show({
            title: "Thất bại",
            message:
              "Xóa đánh giá thất bại: " + (err as Error).message,
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Group gap="xs" justify="center">
      <Tooltip label="Xóa">
        <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
          <Trash size="1rem" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
