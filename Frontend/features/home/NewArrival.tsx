import { HighlightTypography } from "@/components/core/HighlightTypography";
import { ProductCard } from "@/components/core/ProductCard";
import { ProductListItemResponse } from "@/types";
import { Grid, Stack } from "@mui/material";

type NewArrivalProps = {
  items: ProductListItemResponse[];
};

export const NewArrival = ({ items }: NewArrivalProps) => {
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
        Sản phẩm mới
      </HighlightTypography>
      <Grid container spacing={4}>
        {items.map((product) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
