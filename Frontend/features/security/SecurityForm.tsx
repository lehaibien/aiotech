"use client";

import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { useUserId } from "@/hooks/useUserId";
import { postApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { changePasswordSchema } from "@/schemas/userSchema";
import { ChangePasswordRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";

export const SecurityForm = () => {
  const userId = useUserId();
  const { control, handleSubmit } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
  });
  const onSubmit = async (data: ChangePasswordRequest) => {
    const parsedId = parseUUID(userId || "");
    const obj = {
      id: parsedId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    const response = await postApi(API_URL.changePassword, obj);
    if (response.success) {
      notifications.show({
        message: "Cập nhật mật khẩu thành công",
        color: "green",
      });
      if (window) {
        window.location.reload();
      }
    } else {
      notifications.show({
        message: response.message,
        color: "red",
      });
    }
  };

  return (
    <Container size="sm">
      <Stack gap={8} component="form" onSubmit={handleSubmit(onSubmit)}>
        <ControlledTextInput
          control={control}
          name="oldPassword"
          type="password"
          autoComplete="current-password"
          size="sm"
          label="Mật khẩu cũ"
          required
        />
        <ControlledTextInput
          control={control}
          name="newPassword"
          type="password"
          autoComplete="new-password"
          size="sm"
          label="Mật khẩu mới"
          required
        />
        <ControlledTextInput
          control={control}
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          size="sm"
          label="Xác nhận mật khẩu"
          required
        />
        <Button w="50%" type="submit" variant="filled">
          Lưu
        </Button>
      </Stack>
    </Container>
  );
};
