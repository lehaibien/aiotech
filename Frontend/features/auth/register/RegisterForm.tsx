"use client";

import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { postApi } from "@/lib/apiClient";
import { userRegisterSchema } from "@/schemas/userSchema";
import { UserRegisterRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const RegisterForm = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState<string>("");
  const { control, handleSubmit } = useForm<UserRegisterRequest>({
    resolver: zodResolver(userRegisterSchema),
  });
  const onSubmit = async (data: UserRegisterRequest) => {
    const trimmedName = fullname.trim().split(" ");
    data.givenName = trimmedName.pop();
    data.familyName = trimmedName.join(" ");
    const response = await postApi(API_URL.register, data);
    if (response.success) {
      notifications.show({
        title: "Hoàn tất",
        message: "Đăng ký thành công!",
        color: "green",
      });
      router.push("/login");
    } else {
      notifications.show({
        title: "Lỗi đăng ký",
        message: response.message,
        color: "red",
      });
    }
  };
  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap="md">
      <ControlledTextInput
        id="username"
        name="userName"
        autoFocus
        required
        placeholder="Nhập tài khoản"
        autoComplete="username"
        control={control}
        size="sm"
        label="Tài khoản"
      />
      <ControlledTextInput
        id="password"
        name="password"
        type="password"
        required
        placeholder="*********"
        autoComplete="current-password"
        control={control}
        size="sm"
        label="Mật khẩu"
      />
      <TextInput
        id="fullName"
        name="fullName"
        required
        placeholder="Nhập họ và tên"
        autoComplete="name"
        size="sm"
        label="Họ và tên"
        value={fullname}
        onChange={(event) => {
          setFullname(event.target.value);
        }}
      />
      <ControlledTextInput
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Nhập email"
        control={control}
        size="sm"
        label="Email"
      />
      <ControlledTextInput
        id="phonenumber"
        name="phoneNumber"
        placeholder="Nhập số điện thoại"
        autoComplete="tel"
        control={control}
        size="sm"
        label="Số điện thoại"
      />
      <Button
        type="submit"
        fullWidth
        variant="filled"
        data-umami-event="Đăng ký"
      >
        Đăng ký
      </Button>
    </Stack>
  );
};
