import { WishlistGrid } from "@/features/wishlist/WishlistGrid";
import { Divider, Stack, Text, Title } from "@mantine/core";

export default function Page() {
  return (
    <Stack gap='xs'>
      <Title order={4}>Danh sách yêu thích</Title>
      <Text c="gray">
        Danh sách yêu thích của bạn sẽ giúp bạn theo dõi những sản phẩm mà bạn
        quan tâm nhất.
      </Text>
      <Divider />
      <WishlistGrid />
    </Stack>
  );
}
