import {
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với AioTech - Hệ thống bán lẻ điện tử công nghệ hàng đầu Việt Nam",
};

const ContactPage = () => (
  <Stack gap="sm">
    <Title order={2} size="h1">
      Trò chuyện với đội ngũ hỗ trợ
    </Title>
    <Text size="lg" maw={600}>
      Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng điền vào mẫu
      dưới đây hoặc liên hệ trực tiếp với chúng tôi.
    </Text>

    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl">
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Stack gap="xs">
          <Group gap="xs">
            <Mail size={24} />
            <Title order={3} size="h4">
              Email
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn.
          </Text>
          <Link href="mailto:support@aiotech.cloud" style={{ fontWeight: 500 }}>
            support@aiotech.cloud
          </Link>
        </Stack>

        <Stack gap="xs">
          <Group gap="xs">
            <MessageCircle size={24} />
            <Title order={3} size="h4">
              Chat trực tuyến
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Trò chuyện trực tiếp với đội ngũ hỗ trợ.
          </Text>
          <Link href="#" style={{ fontWeight: 500 }}>
            Bắt đầu chat
          </Link>
        </Stack>

        <Stack gap="xs">
          <Group gap="xs">
            <MapPin size={24} />
            <Title order={3} size="h4">
              Văn phòng
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Ghé thăm văn phòng của chúng tôi.
          </Text>
          <Link
            href="https://maps.google.com"
            target="_blank"
            style={{ fontWeight: 500 }}
          >
            Số 123, Đường Công nghệ
            <br />
            Q.1, TP.HCM
          </Link>
        </Stack>

        <Stack gap="xs">
          <Group gap="xs">
            <Phone size={24} />
            <Title order={3} size="h4">
              Điện thoại
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            Thứ 2 - Thứ 6 từ 8h đến 17h.
          </Text>
          <Link href="tel:1900123456" style={{ fontWeight: 500 }}>
            1900 123 456
          </Link>
        </Stack>
      </SimpleGrid>

      <Card withBorder radius="md" p="xl">
        <form>
          <Stack gap="md">
            <SimpleGrid cols={2}>
              <TextInput
                label="Họ"
                placeholder="Nhập họ của bạn"
                required
                radius="md"
              />
              <TextInput
                label="Tên"
                placeholder="Nhập tên của bạn"
                required
                radius="md"
              />
            </SimpleGrid>

            <TextInput
              label="Email"
              placeholder="email@example.com"
              required
              type="email"
              radius="md"
            />

            <Textarea
              label="Tin nhắn"
              placeholder="Nội dung tin nhắn của bạn"
              required
              minRows={4}
              radius="md"
            />

            <Button type="submit" fullWidth size="sm" radius="md">
              Gửi tin nhắn
            </Button>
          </Stack>
        </form>
      </Card>
    </SimpleGrid>
  </Stack>
);

export default ContactPage;
