import { ProductCard } from "@/components/core/ProductCard";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { UUID } from "@/types";
import { ProductListItemResponse } from "@/types/product";
import { SimpleGrid, Title } from "@mantine/core";

export async function RelatedProducts({ productId }: { productId: UUID }) {
  let relatedProducts: ProductListItemResponse[] = [];
  const relatedResponse = await getApiQuery(API_URL.productRelated, {
    id: productId,
    limit: 4,
  });

  if (relatedResponse.success) {
    relatedProducts = relatedResponse.data as ProductListItemResponse[];
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <Title order={6}>Sản phẩm liên quan</Title>

      <SimpleGrid
        cols={{
          base: 12,
          sm: 6,
          md: 3,
        }}
      >
        {relatedProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </SimpleGrid>
    </>
  );
}
