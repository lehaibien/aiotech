import { HighlightTypography } from "@/components/core/HighlightTypography";
import ProductCard from "@/components/core/ProductCard";
import { ProductResponse } from "@/types";
import { Grid2 as Grid, Stack } from "@mui/material";

type BestSellerProps = {
  products: ProductResponse[];
};

export function BestSeller({ products }: BestSellerProps) {
  return (
    <Stack spacing={2}>
      <HighlightTypography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
        }}
      >
        Sản phẩm bán chạy
      </HighlightTypography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
