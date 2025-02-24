"use client";

import { API_URL } from "@/constant/apiUrl";
import { postApi } from "@/lib/apiClient";
import { BannerConfiguration, EmailConfiguration } from "@/types/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Zod schemas for validation
const bannerSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  imageUrl: z.string().url("Vui lòng nhập URL hình ảnh hợp lệ"),
});

const emailSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  host: z.string().min(1, "Vui lòng nhập host"),
  port: z.string().min(1, "Vui lòng nhập port hợp lệ"),
});

export type ConfigurationFormProps = {
  banner: BannerConfiguration;
  email: EmailConfiguration;
};

export function ConfigurationForm({ banner, email }: ConfigurationFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    control: bannerControl,
    handleSubmit: handleBannerSubmit,
    formState: { errors: bannerErrors },
  } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: banner,
  });

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: email,
  });

  const onBannerSave = async (data: BannerConfiguration) => {
    const response = await postApi(API_URL.bannerConfig, data);
    console.log(banner);
    if (response.success) {
      enqueueSnackbar("Lưu cấu hình banner thành công", { variant: "success" });
    } else {
      enqueueSnackbar("Lưu cấu hình banner thất bại: " + response.message, {
        variant: "error",
      });
    }
  };

  const onEmailSave = async (data: EmailConfiguration) => {
    const response = await postApi(API_URL.emailConfig, data);
    if (response.success) {
      enqueueSnackbar("Lưu cấu hình email thành công", { variant: "success" });
    } else {
      enqueueSnackbar("Lưu cấu hình email thất bại: " + response.message, {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Cấu Hình Banner
        </Typography>
        <Box component="form" onSubmit={handleBannerSubmit(onBannerSave)}>
          <Controller
            name="title"
            control={bannerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tiêu Đề"
                fullWidth
                margin="normal"
                error={!!bannerErrors.title}
                helperText={bannerErrors.title?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={bannerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mô Tả"
                fullWidth
                margin="normal"
                error={!!bannerErrors.description}
                helperText={bannerErrors.description?.message}
              />
            )}
          />
          <Controller
            name="imageUrl"
            control={bannerControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL Hình Ảnh"
                fullWidth
                margin="normal"
                error={!!bannerErrors.imageUrl}
                helperText={bannerErrors.imageUrl?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Lưu cấu hình
          </Button>
        </Box>
      </Paper>

      {/* Email Config Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cấu Hình Email
        </Typography>
        <Box component="form" onSubmit={handleEmailSubmit(onEmailSave)}>
          <Controller
            name="email"
            control={emailControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                error={!!emailErrors.email}
                helperText={emailErrors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={emailControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mật Khẩu"
                type="password"
                fullWidth
                margin="normal"
                error={!!emailErrors.password}
                helperText={emailErrors.password?.message}
              />
            )}
          />
          <Controller
            name="host"
            control={emailControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Host"
                fullWidth
                margin="normal"
                error={!!emailErrors.host}
                helperText={emailErrors.host?.message}
              />
            )}
          />
          <Controller
            name="port"
            control={emailControl}
            render={({ field }) => (
              <TextField
                {...field}
                label="Port"
                type="number"
                fullWidth
                margin="normal"
                error={!!emailErrors.port}
                helperText={emailErrors.port?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Lưu cấu hình
          </Button>
        </Box>
      </Paper>
    </>
  );
}
