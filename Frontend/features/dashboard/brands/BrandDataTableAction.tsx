import { API_URL } from "@/constant/apiUrl";
import { deleteApi } from "@/lib/apiClient";
import { BrandResponse } from "@/types";
import { ActionIcon, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const BrandDataTableAction = (record: BrandResponse) => {
  const router = useRouter();

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xác nhận xóa thương hiệu",
      children: "Bạn có chắc chắn muốn xóa thương hiệu này?",
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await deleteApi(API_URL.brand + `/${record.id}`);
          if (!response.success) {
            notifications.show({
              title: "Hệ thống",
              message: "Xóa thương hiệu thất bại: " + response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Hệ thống",
            message: "Xóa thương hiệu thành công",
            color: "green",
          });
          router.refresh();
        } catch(err){
          notifications.show({
            title: "Thất bại",
            message: "Xóa thương hiệu thất bại: " + (err as Error).message,
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Group gap="xs" justify="center">
      <ActionIcon
        variant="subtle"
        color="blue"
        onClick={() => router.push(`/dashboard/brands/upsert?id=${record.id}`)}
      >
        <Edit size="1rem" />
      </ActionIcon>
      <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
        <Trash size="1rem" />
      </ActionIcon>
    </Group>
  );
};
