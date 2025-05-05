import { ProductCard } from "@/components/core/ProductCard";
import { ProductListItemResponse } from "@/types";
import { Button, Group, SimpleGrid, Stack, Title } from "@mantine/core";
import Link from "next/link";

type BestSellerProps = {
  items: ProductListItemResponse[];
};

export const BestSeller = ({ items }: BestSellerProps) => {
  return (
    <Stack gap={8}>
      <Group justify="space-between">
        <Title order={3}>Sản phẩm bán chạy</Title>
        <Button
          component={Link}
          href="/products"
          variant="transparent"
          color="dark"
        >
          Xem thêm
        </Button>
      </Group>
      <SimpleGrid
        cols={{
          xs: 2,
          sm: 3,
          lg: 4,
        }}
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
