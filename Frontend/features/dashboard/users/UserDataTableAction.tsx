import { API_URL } from "@/constant/apiUrl";
import { deleteApi, postApi } from "@/lib/apiClient";
import { UserResponse } from "@/types";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Edit, Lock, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserDataTableAction = (record: UserResponse) => {
  const router = useRouter();
  const handleLock = () => {
    modals.openConfirmModal({
      title: "Xác nhận khóa tài khoản",
      children: "Bạn có chắc chắn muốn khóa tài khoản này?",
      labels: { confirm: "Khóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await postApi(
            API_URL.userLock + `/${record.id}`,
            {}
          );
          if (!response.success) {
            notifications.show({
              title: "Hệ thống",
              message: "Khóa tài khoản thất bại: " + response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Hệ thống",
            message: "Khóa tài khoản thành công",
            color: "green",
          });
        } catch (err) {
          notifications.show({
            title: "Thất bại",
            message: "Khóa tài khoản thất bại: " + (err as Error).message,
            color: "red",
          });
        }
      },
    });
  };
  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Xác nhận xóa tài khoản",
      children: "Bạn có chắc chắn muốn xóa tài khoản này?",
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          const response = await deleteApi(API_URL.user + `/${record.id}`);
          if (!response.success) {
            notifications.show({
              title: "Hệ thống",
              message: "Xóa tài khoản thất bại: " + response.message,
              color: "red",
            });
            return;
          }
          notifications.show({
            title: "Hệ thống",
            message: "Xóa tài khoản thành công",
            color: "green",
          });
          router.refresh();
        } catch (err) {
          notifications.show({
            title: "Thất bại",
            message:
              "Xóa tài khoản thất bại: " + (err as Error).message,
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Group gap="xs" justify="center">
      <Tooltip label="Chỉnh sửa">
        <ActionIcon
          variant="subtle"
          onClick={() => router.push(`/dashboard/users/upsert?id=${record.id}`)}
        >
          <Edit size="1rem" />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Khóa">
        <ActionIcon variant="subtle" color="red" onClick={handleLock}>
          <Lock size="1rem" />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Xóa">
        <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
          <Trash size="1rem" />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
