import { ProductCard } from '@/components/core/ProductCard';
import { API_URL } from '@/constant/apiUrl';
import { getApiQuery } from '@/lib/apiClient';
import { ProductResponse } from '@/types/product';
import { Box, Grid, Typography } from '@mui/material';
import { UUID } from "@/types";

export default async function RelatedProducts({
  productId,
}: {
  productId: UUID;
}) {
  let relatedProducts: ProductResponse[] = [];
  const relatedResponse = await getApiQuery(API_URL.productRelated, {
    id: productId,
    limit: 4,
  });

  if (relatedResponse.success) {
    relatedProducts = relatedResponse.data as ProductResponse[];
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Box mt={2}>
      <Typography
        variant='h5'
        gutterBottom>
        Sản phẩm liên quan
      </Typography>

      <Grid
        container
        spacing={3}>
        {relatedProducts.map((product) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
