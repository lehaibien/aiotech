import { Card, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { Check, RefreshCw, Shield, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giới thiệu - Công ty Công nghệ A-Tech",
  description:
    "Giới thiệu về công ty chuyên cung cấp linh kiện điện tử, PC, Laptop và phụ kiện gaming chất lượng cao",
};

export default function AboutPage() {
  return (
    <>
      <Title order={1} ta="center" mb="xl">
        Giới thiệu về AioTech
      </Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <div>
          <Title order={2} c="primary" mb="md">
            Chào mừng đến với AioTech
          </Title>
          <Text mb="lg" size="lg">
            Chúng tôi đam mê cung cấp những sản phẩm mới nhất và tốt nhất về PC,
            linh kiện PC, laptop, và thiết bị chơi game. Sứ mệnh của chúng tôi
            là đảm bảo rằng mỗi khách hàng đều tìm thấy chính xác những gì họ
            cần để nâng cao trải nghiệm công nghệ của mình.
          </Text>

          <Title order={2} c="primary" mb="md">
            Chất lượng và dịch vụ khách hàng
          </Title>
          <Text mb="lg" size="lg">
            Tại AioTech, chúng tôi tin tưởng vào chất lượng và sự hài lòng của
            khách hàng. Chính vì vậy, chúng tôi chọn lọc kỹ lưỡng các sản phẩm
            và cung cấp dịch vụ xuất sắc để đảm bảo bạn có một trải nghiệm mua
            sắm suôn sẻ.
          </Text>
        </div>

        <div>
          <Title order={2} c="primary" mb="md">
            Blog công nghệ
          </Title>
          <Text mb="lg" size="lg">
            Khám phá thế giới công nghệ qua{" "}
            <Text component={Link} href="/blogs" fw={600} span inherit>
              blog chuyên sâu
            </Text>{" "}
            của chúng tôi - nơi cập nhật những xu hướng mới nhất, đánh giá chi
            tiết sản phẩm, và bí kíp tối ưu hóa thiết bị. Chúng tôi mong muốn
            trở thành nguồn tham khảo đáng tin cậy cho mọi tín đồ công nghệ.
          </Text>

          <Title order={2} c="primary" mb="md">
            Dành cho mọi người
          </Title>
          <Text mb="lg" size="lg">
            Dù bạn là người đam mê công nghệ, game thủ chuyên nghiệp hay chỉ cần
            nâng cấp thiết bị làm việc, AioTech luôn có giải pháp phù hợp. Chúng
            tôi tự hào mang đến trải nghiệm mua sắm khác biệt dành riêng cho
            bạn.
          </Text>
        </div>
      </SimpleGrid>

      <Title order={2} ta="center" c="primary" mb="xl">
        Giá trị cốt lõi
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {[
          {
            icon: <Check size={40} strokeWidth={1.5} />,
            title: "Chất lượng",
            content: "Sản phẩm chính hãng, đảm bảo nguồn gốc xuất xứ rõ ràng",
          },
          {
            icon: <Shield size={40} strokeWidth={1.5} />,
            title: "Tin cậy",
            content: "Chính sách bảo hành lên đến 3 năm, hỗ trợ 24/7",
          },
          {
            icon: <RefreshCw size={40} strokeWidth={1.5} />,
            title: "Đổi mới",
            content: "Cập nhật công nghệ mới nhất, đáp ứng mọi nhu cầu",
          },
          {
            icon: <Users size={40} strokeWidth={1.5} />,
            title: "Cộng đồng",
            content: "Đồng hành cùng các giải đấu và sự kiện gaming lớn",
          },
        ].map((value, index) => (
          <Card key={index} p="lg" radius="md" withBorder>
            <Group justify="center" mb="md">
              {value.icon}
            </Group>
            <Text ta="center" fw={600} size="lg" mb="xs">
              {value.title}
            </Text>
            <Text ta="center" c="dimmed">
              {value.content}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
