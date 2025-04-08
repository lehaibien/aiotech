import "server-only";

import { LoginForm } from "@/features/auth/login/LoginForm";
import SocialLogin from "@/features/auth/SocialLogin";
import { Box, Divider, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const redirect = searchParams?.redirect ?? "/";
  return (
    <Box
      padding={{ xs: 2, md: 0 }}
      width={{ xs: "100%", md: "400px" }}
      margin="auto"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Đăng nhập
      </Typography>
      <LoginForm redirectTo={redirect} />
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
      <SocialLogin redirectTo={redirect} />
    </Box>
  );
}

export default Page;
