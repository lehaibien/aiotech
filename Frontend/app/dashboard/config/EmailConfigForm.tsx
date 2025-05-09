"use client";

import { ControlledNumberInput } from "@/components/form/ControlledNumberInput";
import { ControlledTextInput } from "@/components/form/ControlledTextField";
import { API_URL } from "@/constant/apiUrl";
import { postApi } from "@/lib/apiClient";
import { EmailConfiguration } from "@/types/sys-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SimpleGrid, Title } from "@mantine/core";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  host: z.string().min(1, "Vui lòng nhập host"),
  port: z.string().min(1, "Vui lòng nhập port hợp lệ"),
});

type EmailConfigFormProps = {
  email: string;
  password: string;
  host: string;
  port: number;
};

export const EmailConfigForm = ({
  email,
  password,
  host,
  port,
}: EmailConfigFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit } = useForm<EmailConfiguration>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email,
      password,
      host,
      port,
    },
  });
  const onSubmit = async (data: EmailConfiguration) => {
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
      <Title order={6}>Cấu Hình Email</Title>
      <SimpleGrid cols={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <ControlledTextInput
          name="email"
          control={control}
          size="sm"
          required
          label="Email"
          autoComplete="email"
        />
        <ControlledTextInput
          type="password"
          name="password"
          control={control}
          size="sm"
          required
          label="Mật khẩu"
          autoComplete="current-password"
        />
        <ControlledTextInput
          name="host"
          control={control}
          size="sm"
          required
          label="Máy chủ"
        />
        <ControlledNumberInput
          name="port"
          control={control}
          size="sm"
          required
          label="Cổng"
        />
        <Button type="submit" w="50%">
          Lưu cấu hình
        </Button>
      </SimpleGrid>
    </>
  );
};
