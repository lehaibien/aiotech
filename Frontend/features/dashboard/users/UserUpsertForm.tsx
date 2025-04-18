"use client";

import ControlledComboBox from "@/components/core/ControlledComboBox";
import { API_URL } from "@/constant/apiUrl";
import { EMPTY_UUID } from "@/constant/common";
import { postApi, putApi } from "@/lib/apiClient";
import { convertObjectToFormData } from "@/lib/utils";
import {
  ComboBoxItem,
  UserRequest,
  UserRequestSchema,
  UserResponse,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UserUpsertFormProps = {
  data: UserResponse;
  roleCombobox: ComboBoxItem[];
};

export function UserUpsertForm({ data, roleCombobox }: UserUpsertFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(data.avatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UserRequest>({
    defaultValues: { ...data, password: "" },
    resolver: zodResolver(UserRequestSchema),
  });
  const onSubmit = async (request: UserRequest) => {
    setIsLoading(true);
    const formData = convertObjectToFormData(request);
    try {
      if (data.id === EMPTY_UUID) {
        const response = await postApi(API_URL.user, formData);
        if (response.success) {
          enqueueSnackbar("Thêm mới tài khoản thành công", {
            variant: "success",
          });
          router.push("/dashboard/users");
        } else {
          enqueueSnackbar("Lỗi xảy ra: " + response.message, {
            variant: "error",
          });
        }
      } else {
        const response = await putApi(API_URL.user, formData);
        if (response.success) {
          enqueueSnackbar("Cập nhật tài khoản thành công", {
            variant: "success",
          });
          router.push("/dashboard/users");
        } else {
          enqueueSnackbar("Lỗi xảy ra: " + response.message, {
            variant: "error",
          });
        }
      }
    } catch (err) {
      enqueueSnackbar("Lỗi xảy ra: " + (err as Error).message, {
        variant: "error",
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        type="hidden"
        {...register("id")}
        sx={{
          display: "none",
        }}
      />
      <Box
        sx={{
          display: { sm: "block", md: "flex" },
          gap: 2,
        }}
      >
        <FormControl margin="normal" fullWidth>
          <FormLabel htmlFor="userName" required>
            Tên tài khoản
          </FormLabel>
          <TextField
            autoFocus
            required
            size="small"
            id="userName"
            {...register("userName")}
            error={errors.userName ? true : false}
            helperText={errors.userName ? errors.userName.message : undefined}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <TextField
            required
            id="email"
            size="small"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : undefined}
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          display: { sm: "block", md: "flex" },
          gap: 2,
        }}
      >
        <FormControl margin="normal" fullWidth>
          <FormLabel htmlFor="familyName" required>
            Họ
          </FormLabel>
          <TextField
            required
            id="familyName"
            size="small"
            {...register("familyName")}
            error={errors.familyName ? true : false}
            helperText={
              errors.familyName ? errors.familyName.message : undefined
            }
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <FormLabel htmlFor="givenName" required>
            Tên
          </FormLabel>
          <TextField
            required
            id="givenName"
            size="small"
            {...register("givenName")}
            error={errors.givenName ? true : false}
            helperText={errors.givenName ? errors.givenName.message : undefined}
          />
        </FormControl>
      </Box>

      <Box
        sx={{
          display: { sm: "block", md: "flex" },
          gap: 2,
        }}
      >
        <FormControl margin="normal" fullWidth>
          <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
          <TextField
            id="phoneNumber"
            size="small"
            type="tel"
            autoComplete="tel"
            {...register("phoneNumber")}
            error={errors.phoneNumber ? true : false}
            helperText={
              errors.phoneNumber ? errors.phoneNumber.message : undefined
            }
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <FormLabel htmlFor="roleId" required>
            Vai trò
          </FormLabel>
          <ControlledComboBox control={control} items={roleCombobox} name="roleId" size="small"/>
        </FormControl>
      </Box>
      <FormControl margin="normal" fullWidth>
        <FormLabel htmlFor="password">Password</FormLabel>
        <TextField
          id="password"
          {...register("password")}
          size="small"
          error={errors.password ? true : false}
          type="password"
          helperText={errors.password ? errors.password.message : undefined}
        />
      </FormControl>
      <FormControl margin="normal" fullWidth>
        <FormLabel htmlFor="avatar-upload">Hình ảnh</FormLabel>
        <Box>
          <input
            accept="image/*"
            id="avatar-upload"
            name="avatar-upload"
            type="file"
            hidden
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton disableRipple component="span">
              <Avatar
                src={avatarPreview}
                sx={{ width: 100, height: 100, mb: 1 }}
              />
              <CloudUploadIcon
                sx={{ position: "absolute", bottom: 8, right: 8 }}
              />
            </IconButton>
          </label>
        </Box>
      </FormControl>
      <FormControl
        margin="normal"
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          type="button"
          LinkComponent={Link}
          href="/dashboard/users"
          variant="contained"
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isLoading
            ? "Đang xử lý..."
            : data.id === EMPTY_UUID
            ? "Thêm mới"
            : "Cập nhật"}
        </Button>
      </FormControl>
    </Box>
  );
}
