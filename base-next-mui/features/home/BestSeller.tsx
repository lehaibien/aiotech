import { HighlightTypography } from "@/components/core/HighlightTypography";
import ProductCard from "@/components/core/ProductCard";
import { ProductResponse } from "@/types";
import { Grid2 as Grid } from "@mui/material";

type BestSellerProps = {
  products: ProductResponse[];
};

export function BestSeller({ products }: BestSellerProps) {
  return (
    <>
      <HighlightTypography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          mb: 3,
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
    </>
  );
}
