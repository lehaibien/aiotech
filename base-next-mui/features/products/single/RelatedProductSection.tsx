import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductResponse } from "@/types/product";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid2 as Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import Image from "next/image";
import Link from "next/link";

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
            <Link
              href={`/products/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
                elevation={1}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    sx={{
                      position: "relative",
                      height: 220,
                      bgcolor: "background.paper",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={product.imageUrls[0]}
                      height={200}
                      width={200}
                      alt={product.name}
                      style={{
                        objectFit: "contain",
                      }}
                      placeholder="blur"
                      blurDataURL={product.imageUrls[0]}
                    />
                    {product.discountPrice && (
                      <Chip
                        label={`-${Math.round(
                          (1 - product.discountPrice / product.price) * 100
                        )}%`}
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                        }}
                      />
                    )}
                  </CardMedia>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Stack spacing={1}>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Box display="flex" alignItems="center">
                      <Rating
                        value={product.rating}
                        readOnly
                        size="small"
                        sx={{ color: "warning.main" }}
                      />
                      <Typography variant="body2" color="text.secondary" ml={1}>
                        ({product.rating.toFixed(1)})
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <Typography
                        variant="h6"
                        color="error.main"
                        sx={{ fontWeight: 600 }}
                      >
                        {formatNumberWithSeperator(
                          product.discountPrice || product.price
                        )}{" "}
                        đ
                      </Typography>
                      {product.discountPrice && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {formatNumberWithSeperator(product.price)} đ
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
