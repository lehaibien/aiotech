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
      <Typography variant="h5" fontWeight="bold" color="error.main">
        {formatNumberWithSeperator(product.price)} VNĐ
      </Typography>
      <Box my={2}>
        {product.tags?.map((tag, index) => (
          <Chip key={index} label={tag} variant="outlined" sx={{ mr: 1 }} />
        ))}
      </Box>
      <Box display="flex" alignItems="center">
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.price}
          productImage={product.imageUrls[0]}
        />
        <Typography variant="body2" ml={2}>
          {product.stock} trong kho
        </Typography>
      </Box>
    </Stack>
  );
}
