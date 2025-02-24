"use client";

import { UserLoginRequest, UserLoginSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin";

function LoginComponent({ redirectTo }: { redirectTo: string }) {
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down("xs"));
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
      padding={mediaQuery ? 20 : 0}
      width={mediaQuery ? "100%" : "30%"}
      margin="auto"
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", mb: 2 }}
      >
        Đăng nhập
      </Typography>
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
              }}
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
        <Typography sx={{ textAlign: "center" }}>
          Không có tài khoản?{" "}
          <Link
            href="/register"
            style={{
              fontWeight: 600,
            }}
          >
            Đăng ký ngay
          </Link>
        </Typography>
        <Divider>Hoặc</Divider>
        <SocialLogin redirectTo={redirectTo} />
      </Box>
    </Box>
  );
}

export default LoginComponent;
