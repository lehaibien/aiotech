import { ProductCard } from "@/components/core/ProductCard";
import { ProductListItemResponse } from "@/types";
import { SimpleGrid, Stack, Title } from "@mantine/core";

type BestSellerProps = {
  items: ProductListItemResponse[];
};

export const BestSeller = ({ items }: BestSellerProps) => {
  return (
    <Stack gap={8}>
      <Title order={3}>Sản phẩm bán chạy</Title>
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
