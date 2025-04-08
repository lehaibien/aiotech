import { formatNumberWithSeperator } from "@/lib/utils";
import { ProductDetailResponse } from "@/types/product";
import { Box, Chip, Rating, Stack, Typography } from "@mui/material";
import { AddToCartButton } from "./AddToCartButton";

interface ProductInfoProps {
  product: ProductDetailResponse;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="h4">{product.name}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          gap: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Typography variant="caption">Mã hàng: {product.sku}</Typography>
        <Typography variant="caption" color="textSecondary">
          Thương hiệu: {product.brand}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center">
        <Rating value={product.rating} readOnly precision={0.5} />
        <Typography variant="body2" ml={1}>
          ({product.rating.toFixed(1)})
        </Typography>
      </Box>
      {product.discountPrice ? (
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="h5" fontWeight="bold" color="error">
            {formatNumberWithSeperator(product.discountPrice)} VNĐ
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textDecoration: "line-through" }}
          >
            {formatNumberWithSeperator(product.price)} VNĐ
          </Typography>
          <Chip
            label={`-${(
              ((product.price - product.discountPrice) / product.price) *
              100
            ).toFixed(2)}%`}
            color="error"
            size="small"
            variant="outlined"
          />
        </Stack>
      ) : (
        <Typography variant="h5" fontWeight="bold" color="error">
          {formatNumberWithSeperator(product.price)} VNĐ
        </Typography>
      )}
      <Box display="flex" alignItems="center">
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.discountPrice ?? product.price}
          productImage={product.imageUrls[0]}
        />
        <Typography variant="body2" ml={2}>
          {product.stock} trong kho
        </Typography>
      </Box>
    </Stack>
  );
}
