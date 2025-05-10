"use client";

import { BrandLogo } from "@/components/core/BrandLogo";
import dayjs from "@/lib/extended-dayjs";
import { Grid, Group, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <Grid component="footer">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Stack gap="sm">
          <BrandLogo />
          <Text size="sm" c="gray">
            Hệ thống bán lẻ điện tử công nghệ hàng đầu Việt Nam
          </Text>

          <Text fw={600} size="sm">
            Hỗ trợ thanh toán
          </Text>
          <Group gap="sm">
            {["VnPay", "Momo"].map((text) => (
              <Group key={text} gap="xs">
                <Image
                  src={`/${text.toLowerCase()}-icon.svg`}
                  alt={text}
                  width={24}
                  height={24}
                />
                <Text size="sm">{text}</Text>
              </Group>
            ))}
          </Group>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 6, md: 3 }}>
        <Stack gap="sm">
          <Title order={6}>Hỗ trợ</Title>
          {[
            "Trung tâm hỗ trợ",
            "Hướng dẫn mua hàng",
            "Tra cứu đơn hàng",
            "Chính sách bảo hành",
          ].map((text) => (
            <UnstyledButton
              key={text}
              component={Link}
              href="#"
              c="gray"
              fz="sm"
            >
              {text}
            </UnstyledButton>
          ))}
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 6, md: 3 }}>
        <Stack gap="sm">
          <Title order={6}>Chính sách</Title>
          {["Bảo mật thông tin", "Vận chuyển", "Đổi trả", "Thanh toán"].map(
            (text) => (
              <UnstyledButton
                key={text}
                component={Link}
                href="#"
                c="gray"
                fz="sm"
                color="primary"
              >
                {text}
              </UnstyledButton>
            )
          )}
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 3 }}>
        <Stack gap="md">
          <Title order={6}>Liên hệ</Title>
          <Stack gap="sm">
            <Group gap="xs" wrap="nowrap">
              <MapPin size={18} />
              <Text size="sm" c="gray">
                Số 123, Đường Công nghệ, Q.1, TP.HCM
              </Text>
            </Group>

            <Group gap="xs">
              <Phone size={18} />
              <Text size="sm" c="gray">
                1900 123 456
              </Text>
            </Group>

            <Group gap="xs">
              <Mail size={18} />
              <UnstyledButton
                component="a"
                href="mailto:support@aiotech.cloud"
                c="gray"
                fz="sm"
                color="primary"
              >
                support@aiotech.cloud
              </UnstyledButton>
            </Group>
          </Stack>

          <Group gap="xs">
            {[
              {
                icon: Facebook,
                color: "#1877F2",
                href: "https://www.facebook.com",
              },
              { icon: Twitter, color: "#000", href: "https://x.com" },
              {
                icon: Instagram,
                color: "#E4405F",
                href: "https://instagram.com",
              },
              {
                icon: Youtube,
                color: "#CD201F",
                href: "https://youtube.com",
              },
            ].map((social, index) => {
              const Icon = social.icon;
              return (
                <UnstyledButton
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  p="xs"
                  variant="light"
                  color="primary"
                >
                  <Icon size={24} />
                </UnstyledButton>
              );
            })}
          </Group>
        </Stack>
      </Grid.Col>

      <Grid.Col span={12} py="xs" mt="md">
        <Text ta="center" size="sm" c="gray">
          © {dayjs().year()} AioTech. Bảo lưu mọi quyền.
        </Text>
      </Grid.Col>
    </Grid>
  );
};
