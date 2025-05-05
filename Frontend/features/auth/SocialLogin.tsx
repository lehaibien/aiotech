"use client";

import { FacebookIcon, GoogleIcon } from "@/components/core/CustomIcon";
import { Button, Flex } from "@mantine/core";
import { signIn } from "next-auth/react";

type SocialLoginProps = {
  redirectTo?: string;
  isRegister?: boolean;
};

export const SocialLogin = ({ redirectTo, isRegister }: SocialLoginProps) => {
  return (
    <Flex
      direction={{
        base: "column",
        md: "row",
      }}
      gap={4}
    >
      <Button
        variant="filled"
        color="dark"
        leftSection={<GoogleIcon />}
        onClick={() => signIn("google", { redirectTo: redirectTo })}
        data-umami-event={`${isRegister ? "Đăng ký" : "Đăng nhập"} với Google`}
        flex={1}
      >
        {isRegister ? "Đăng ký" : "Đăng nhập"} với Google
      </Button>
      <Button
        variant="filled"
        color="dark"
        leftSection={<FacebookIcon />}
        onClick={() => signIn("facebook", { redirectTo: redirectTo })}
        data-umami-event={`${
          isRegister ? "Đăng ký" : "Đăng nhập"
        } với Facebook`}
        flex={1}
      >
        {isRegister ? "Đăng ký" : "Đăng nhập"} với Facebook
      </Button>
    </Flex>
  );
};
