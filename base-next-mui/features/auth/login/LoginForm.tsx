"use client";

import { UserLoginRequest, UserLoginSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
} from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginRequest>({ resolver: zodResolver(UserLoginSchema) });
  const onSubmit = async (data: UserLoginRequest) => {
    try {
      await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirectTo: redirectTo,
      });
      enqueueSnackbar("Đăng nhập thành công", { variant: "success" });
    } catch {
      enqueueSnackbar("Đăng nhập thất bại", { variant: "error" });
    }
    return;
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <FormControl>
        <FormLabel htmlFor="username">Tài khoản</FormLabel>
        <TextField
          autoFocus
          required
          fullWidth
          variant="outlined"
          color="primary"
          {...register("username")}
          error={errors.username ? true : false}
          helperText={errors.username ? errors.username.message : undefined}
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormLabel htmlFor="password">Mật khẩu</FormLabel>
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
        <TextField
          required
          fullWidth
          type="password"
          placeholder="••••••"
          variant="outlined"
          color="primary"
          {...register("password")}
          error={errors.password ? true : false}
          helperText={errors.password ? errors.password.message : undefined}
        />
      </FormControl>
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Ghi nhớ tôi"
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Đăng nhập
      </Button>
    </Box>
  );
}
