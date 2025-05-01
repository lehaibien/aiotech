import { LoginForm } from "@/features/auth/login/LoginForm";
import {SocialLogin} from "@/features/auth/SocialLogin";
import { SearchParams } from "@/types";
import { Container, Divider, Group, Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { redirect } = await searchParams;
  return (
    <Container size="sm">
      <Stack gap={4}>
        <Title order={1}>Đăng nhập</Title>
        <LoginForm redirectTo={redirect ?? "/"} />
        <Group justify="center" align="center" gap={4}>
          Bạn chưa có tài khoản?{" "}
          <Link
            href="/register"
            style={{
              fontWeight: 600,
            }}
          >
            Đăng ký ngay
          </Link>
        </Group>
        <Divider my="xs" label="Hoặc" labelPosition="center" />
        <SocialLogin redirectTo={redirect} />
      </Stack>
    </Container>
  );
}
