"use client";

import { ControlledTextField } from "@/components/core/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { postApi } from "@/lib/apiClient";
import { userRegisterSchema } from "@/schemas/userSchema";
import { UserRegisterRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin";

export const RegisterForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
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
      enqueueSnackbar("Đăng ký thành công!", { variant: "success" });
      router.push("/login");
    } else {
      enqueueSnackbar("Đăng ký thất bại: " + response.message, {
        variant: "error",
      });
    }
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
          name="userName"
          autoFocus
          required
          fullWidth
          placeholder="Nhập tài khoản"
          control={control}
          size="small"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password" required>
          Mật khẩu
        </FormLabel>
        <ControlledTextField
          id="password"
          name="password"
          required
          fullWidth
          placeholder="*********"
          control={control}
          size="small"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="fullname">Họ và tên</FormLabel>
        <TextField
          autoFocus
          required
          fullWidth
          name="fullName"
          value={fullname}
          onChange={(event) => {
            setFullname(event.target.value);
          }}
          placeholder="Nhập họ và tên"
          size="small"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="email" required>
          Email
        </FormLabel>
        <ControlledTextField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          fullWidth
          placeholder="Nhập email"
          control={control}
          size="small"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="phonenumber">Số điện thoại</FormLabel>
        <ControlledTextField
          id="phonenumber"
          name="phoneNumber"
          autoFocus
          required
          fullWidth
          placeholder="Nhập số điện thoại"
          control={control}
          size="small"
        />
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        data-umami-event="Đăng ký"
      >
        Đăng ký
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        Đã có tài khoản?{" "}
        <span>
          <Link
            href="/login"
            style={{
              fontWeight: 600,
            }}
          >
            Đăng nhập ngay
          </Link>
        </span>
      </Typography>
      <Divider>Hoặc</Divider>
      <SocialLogin isRegister />
    </Stack>
  );
};
