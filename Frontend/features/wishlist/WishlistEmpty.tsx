import { Button, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export const WishlistEmpty = () => {
  return (
    <Stack align="center" justify="center" gap="xs">
      <Title order={3} ta="center">
        Chưa có sản phẩm nào trong danh sách yêu thích.
      </Title>

      <Text c="dimmed" size="lg" ta="center">
        Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi nhé!
      </Text>

      <Button component={Link} href="/products" size="md">
        Quay lại trang sản phẩm
      </Button>
    </Stack>
  );
};
