'use client'

import { HighlightTypography } from "@/components/core/HighlightTypography";
import { CategoryResponse } from "@/types";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid2 as Grid,
  Link,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import Image from "next/image";

type FeaturedCategoriesProps = {
  categories: CategoryResponse[];
};

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const theme = useTheme();

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
        Danh mục nổi bật
      </HighlightTypography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {categories.map((category) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 12 / 8 }} key={category.id}>
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                height: 200,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                boxShadow: "none",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                  "& .category-image": {
                    transform: "scale(1.05)",
                  },
                  "& .category-content": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  },
                },
              }}
            >
              <CardActionArea
                LinkComponent={Link}
                href={`products/?category=${category.name}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  sx={{
                    position: "relative",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  }}
                >
                  <Image
                    src={category.imageUrl}
                    width={300}
                    height={300}
                    alt={category.name}
                    className="category-image"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    priority
                  />
                </CardMedia>
                <CardContent
                  className="category-content"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    backgroundColor: alpha(theme.palette.background.paper, 0.85),
                    transition: "background-color 0.2s ease-in-out",
                    p: 1.5,
                    minHeight: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    sx={{
                      fontWeight: 500,
                      textAlign: "center",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      color: theme.palette.text.primary,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.2,
                    }}
                  >
                    {category.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
