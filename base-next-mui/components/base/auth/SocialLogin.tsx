"use client";

import { FacebookIcon, GoogleIcon } from "@/components/core/CustomIcon";
import { Box, Button, styled } from "@mui/material";
import { signIn } from "next-auth/react";

type SocialLoginProps = {
  redirectTo?: string;
  isRegister?: boolean;
};

const SocialMediaButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  boxShadow: "none",
  color: theme.palette.text.primary,
}));

function SocialLogin({ redirectTo, isRegister }: SocialLoginProps) {
  const loginSocial = async (provider: "facebook" | "google") => {
    signIn(provider, { redirectTo: redirectTo });
  };
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <SocialMediaButton
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={() => loginSocial("google")}
      >
        {isRegister ? "Đăng ký" : "Đăng nhập"} với Google
      </SocialMediaButton>
      <SocialMediaButton
        variant="contained"
        startIcon={<FacebookIcon />}
        onClick={() => loginSocial("facebook")}
      >
        {isRegister ? "Đăng ký" : "Đăng nhập"} với Facebook
      </SocialMediaButton>
    </Box>
  );
}

export default SocialLogin;
