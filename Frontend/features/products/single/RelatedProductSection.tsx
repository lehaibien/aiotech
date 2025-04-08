import ProductCard from "@/components/core/ProductCard";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { ProductResponse } from "@/types/product";
import {
  Box,
  Grid2 as Grid,
  Typography
} from "@mui/material";
import { UUID } from "crypto";

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
    <Box mt={4}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            bgcolor: "primary.main",
            borderRadius: 1,
          },
        }}
      >
        Sản phẩm liên quan
      </Typography>

      <Grid container spacing={3} mt={1}>
        {relatedProducts.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
