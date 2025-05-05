import { ProductCard } from "@/components/core/ProductCard";
import { ProductListItemResponse } from "@/types";
import { Button, Group, SimpleGrid, Stack, Title } from "@mantine/core";
import Link from "next/link";

type NewArrivalProps = {
  items: ProductListItemResponse[];
};

export const NewArrival = ({ items }: NewArrivalProps) => {
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Sản phẩm mới</Title>
        <Button
          component={Link}
          href="/products?sort=newest"
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
          <ProductCard product={product} key={product.id} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
