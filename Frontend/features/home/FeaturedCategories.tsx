import { CategoryResponse } from "@/types";
import { SimpleGrid, Stack, Title } from "@mantine/core";
import { CategoryCard } from "./CategoryCard";

type FeaturedCategoriesProps = {
  categories: CategoryResponse[];
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <Stack gap={8}>
      <Title order={3}>Danh mục nổi bật</Title>
      <SimpleGrid
        cols={{
          xs: 2,
          md: 4,
          lg: 8,
        }}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            imageUrl={category.imageUrl}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
