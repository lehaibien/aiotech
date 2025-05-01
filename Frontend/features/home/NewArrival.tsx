import { ProductCard } from "@/components/core/ProductCard";
import { ProductListItemResponse } from "@/types";
import { SimpleGrid, Stack, Title } from "@mantine/core";

type NewArrivalProps = {
  items: ProductListItemResponse[];
};

export const NewArrival = ({ items }: NewArrivalProps) => {
  return (
    <Stack gap={8}>
      <Title order={3}>Sản phẩm mới</Title>
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
