import { API_URL } from "@/constant/apiUrl";
import { deleteApi } from "@/lib/apiClient";
import { PostResponse } from "@/types";
import { ActionIcon, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const PostDataTableAction = (record: PostResponse) => {
  const router = useRouter();
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xác nhận xóa bài viết",
      children: "Bạn có chắc chắn muốn xóa bài viết này?",
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await deleteApi(API_URL.post + `/${record.id}`);
          if (!response.success) {
            notifications.show({
              title: "Hệ thống",
              message: "Xóa bài viết thất bại: " + response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Hệ thống",
            message: "Xóa bài viết thành công",
            color: "green",
          });
          router.refresh();
        } catch(err){
          notifications.show({
            title: "Thất bại",
            message: "Xóa bài viết thất bại: " + (err as Error).message,
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
        onClick={() => router.push(`/dashboard/posts/upsert?id=${record.id}`)}
      >
        <Edit size="1rem" />
      </ActionIcon>
      <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
        <Trash size="1rem" />
      </ActionIcon>
    </Group>
  );
};
