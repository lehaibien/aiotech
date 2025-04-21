"use client";

import { ControlledTextField } from "@/components/core/ControlledTextField";
import { userLoginSchema } from "@/schemas/userSchema";
import { UserLoginRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack
} from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
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
        enqueueSnackbar(result.code, { variant: "error" });
        return;
      }
      enqueueSnackbar("Đăng nhập thành công", { variant: "success" });
      router.push(redirectTo);
    } catch (err) {
      enqueueSnackbar((err as Error).message, { variant: "error" });
    }
    return;
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      spacing={2}
      width="100%"
    >
      <FormControl>
        <FormLabel htmlFor="username" required>
          Tài khoản
        </FormLabel>
        <ControlledTextField
          id="username"
          name="username"
          autoFocus
          required
          fullWidth
          placeholder="Nhập tài khoản"
          control={control}
          size="small"
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormLabel htmlFor="password" required>
            Mật khẩu
          </FormLabel>
          <Link
            href="/forgot-password"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            tabIndex={-1}
          >
            Quên mật khẩu?
          </Link>
        </Box>
        <ControlledTextField
          id="password"
          name="password"
          required
          fullWidth
          placeholder="Nhập mật khẩu"
          control={control}
          size="small"
        />
      </FormControl>
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
}
