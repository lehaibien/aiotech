import { API_URL } from "@/constant/apiUrl";
import { deleteApi } from "@/lib/apiClient";
import { CategoryResponse } from "@/types";
import { ActionIcon, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const CategoryDataTableAction = (record: CategoryResponse) => {
  const router = useRouter();
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xác nhận xóa danh mục sản phẩm",
      children: "Bạn có chắc chắn muốn xóa danh mục sản phẩm này?",
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await deleteApi(API_URL.category + `/${record.id}`);
          if (!response.success) {
            notifications.show({
              title: "Hệ thống",
              message: "Xóa danh mục sản phẩm thất bại: " + response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Hệ thống",
            message: "Xóa danh mục sản phẩm thành công",
            color: "green",
          });
          router.refresh();
        } catch(err){
          notifications.show({
            title: "Thất bại",
            message: "Xóa danh mục sản phẩm thất bại: " + (err as Error).message,
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
        onClick={() => router.push(`/dashboard/categories/upsert?id=${record.id}`)}
      >
        <Edit size="1rem" />
      </ActionIcon>
      <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
        <Trash size="1rem" />
      </ActionIcon>
    </Group>
  );
};
