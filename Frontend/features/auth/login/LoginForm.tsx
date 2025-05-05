"use client";

import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { userLoginSchema } from "@/schemas/userSchema";
import { UserLoginRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const LoginForm = ({ redirectTo }: { redirectTo: string }) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<UserLoginRequest>({
    resolver: zodResolver(userLoginSchema),
  });
  const onSubmit = async (data: UserLoginRequest) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        notifications.show({
          message: result.error,
          color: "red",
        });
        return;
      }
      notifications.show({
        message: "Đăng nhập thành công",
        color: "green",
      });
      router.push(redirectTo);
    } catch (err) {
      notifications.show({
        message: (err as Error).message,
        color: "red",
      });
    }
    return;
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap='md'>
      <ControlledTextInput
        id="username"
        name="username"
        autoFocus
        required
        placeholder="Nhập tài khoản"
        autoComplete="username"
        control={control}
        size="md"
        label="Tài khoản"
      />
      <Group justify="space-between" pos="relative">
        <Link
          href="/forgot-password"
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            position: "absolute",
            right: 0,
            top: 10,
            bottom: 0,
          }}
          tabIndex={-1}
        >
          Quên mật khẩu?
        </Link>
      </Group>
      <ControlledTextInput
        id="password"
        name="password"
        type="password"
        required
        placeholder="Nhập mật khẩu"
        autoComplete="current-password"
        control={control}
        size="md"
        label="Mật khẩu"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        data-umami-event="Đăng nhập"
      >
        Đăng nhập
      </Button>
    </Stack>
  );
};
