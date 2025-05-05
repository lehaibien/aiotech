import { RegisterForm } from "@/features/auth/register/RegisterForm";
import { SocialLogin } from "@/features/auth/SocialLogin";
import { Container, Divider, Group, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function Page() {
  return (
    <Container size="sm">
      <Stack gap='sm'>
        <Title order={1}>Đăng ký</Title>
        <RegisterForm />
        <Group justify="center" align="center" gap='sm'>
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            style={{
              fontWeight: 600,
            }}
          >
            Đăng nhập ngay
          </Link>
        </Group>
        <Divider my="xs" label="Hoặc" labelPosition="center" />
        <SocialLogin isRegister />
      </Stack>
    </Container>
  );
}
