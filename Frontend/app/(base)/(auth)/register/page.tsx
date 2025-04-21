import { RegisterForm } from "@/features/auth/register/RegisterForm";
import { Stack, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function Page() {
  return (
    <Stack width={{ xs: "100%", md: "400px" }} margin="auto" gap={2}>
      <Typography component="h1" variant="h4">
        Đăng ký
      </Typography>
      <RegisterForm />
    </Stack>
  );
}
