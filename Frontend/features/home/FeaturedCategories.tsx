import { HighlightTypography } from "@/components/core/HighlightTypography";
import { CategoryResponse } from "@/types";
import { Grid2 as Grid, Stack } from "@mui/material";
import { CategoryCard } from "./CategoryCard";

type FeaturedCategoriesProps = {
  categories: CategoryResponse[];
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
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
        Danh mục nổi bật
      </HighlightTypography>
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid size={{ xs: 6, md: 3, lg: 12 / 8 }} key={category.id}>
            <CategoryCard name={category.name} imageUrl={category.imageUrl} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
