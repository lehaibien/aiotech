"use client";

import { ControlledCombobox } from "@/components/form/ControlledMantineCombobox";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import { userRequestSchema } from "@/schemas/userSchema";
import { ComboBoxItem, UserRequest, UserResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Grid, Group, Input, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CloudUpload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UserUpsertFormProps = {
  data: UserResponse;
  roleCombobox: ComboBoxItem[];
};

export function UserUpsertForm({ data, roleCombobox }: UserUpsertFormProps) {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(data.avatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, control } = useForm<UserRequest>({
    defaultValues: { ...data, password: "" },
    resolver: zodResolver(userRequestSchema),
  });
  const onSubmit = async (request: UserRequest) => {
    setIsLoading(true);
    const formData = convertObjectToFormData(request);
    try {
      const action = data.id === EMPTY_UUID ? postApi : putApi;
      const actionMessage = data.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật";
      const response = await action(API_URL.user, formData);
      if (response.success) {
        notifications.show({
          title: "Thông báo",
          message: `${actionMessage} tài khoản thành công`,
          color: "green",
        });
        router.push("/dashboard/users");
      } else {
        notifications.show({
          title: "Thông báo",
          message: `${actionMessage} tài khoản thất bại`,
          color: "red",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Thông báo",
        message: "Lỗi xảy ra: " + (err as Error).message,
        color: "red",
      });
    }
    setIsLoading(false);
  };
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextInput type="hidden" {...register("id")} display="none" />
      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledTextInput
          control={control}
          name="userName"
          size="sm"
          autoFocus
          label="Tên tài khoản"
          required
        />
      </Grid.Col>

      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledTextInput
          control={control}
          name="email"
          size="sm"
          type="email"
          autoComplete="email"
          label="Email"
          required
        />
      </Grid.Col>
      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledTextInput
          control={control}
          name="familyName"
          size="sm"
          label="Họ"
        />
      </Grid.Col>
      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledTextInput
          control={control}
          name="givenName"
          size="sm"
          label="Tên"
          required
        />
      </Grid.Col>
      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledTextInput
          control={control}
          name="phoneNumber"
          size="sm"
          type="tel"
          autoComplete="tel"
          label="Số điện thoại"
        />
      </Grid.Col>
      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledCombobox
          control={control}
          options={roleCombobox}
          name="roleId"
          label="Vai trò"
          required
        />
      </Grid.Col>
      <Grid.Col
        span={{
          base: 12,
          md: 6,
        }}
      >
        <ControlledTextInput
          control={control}
          name="password"
          size="sm"
          type="password"
          autoComplete="current-password"
          label="Mật khẩu"
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Input.Label htmlFor="avatar-upload">Hình ảnh</Input.Label>
        <div>
          <input
            accept="image/*"
            id="avatar-upload"
            name="avatar-upload"
            type="file"
            hidden
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="transparent"
              color="gray"
              h="100%"
              component="span"
              pos="relative"
            >
              <Avatar src={avatarPreview} h={100} w={100} radius="50%" />
              <CloudUpload
                style={{ position: "absolute", bottom: 0, right: 8 }}
              />
            </Button>
          </label>
        </div>
      </Grid.Col>
      <Grid.Col
        span={{
          base: 12,
          md: 12,
        }}
      >
        <Group justify="flex-end">
          <Button
            type="button"
            component={Link}
            href="/dashboard/users"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading} loading={isLoading}>
            {data.id === EMPTY_UUID ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Group>
      </Grid.Col>
    </Grid>
  );
}
