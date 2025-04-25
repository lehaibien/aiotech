import { formatNumberWithSeperator } from '@/lib/utils';
import { ProductDetailResponse } from '@/types/product';
import { Box, Chip, Rating, Stack, Typography } from '@mui/material';
import { AddToCartButton } from './AddToCartButton';
import { AddToWishlist } from './AddToWishlist';

interface ProductInfoProps {
  product: ProductDetailResponse;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <Stack spacing={1}>
      <Typography variant='h4'>{product.name}</Typography>
      <Stack
        direction='row'
        alignItems='center'
        gap={2}>
        <Typography variant='subtitle2'>Mã hàng: {product.sku}</Typography>
        <Typography
          variant='subtitle2'
          color='textSecondary'>
          Thương hiệu: {product.brand}
        </Typography>
      </Stack>

      <Box
        display='flex'
        alignItems='center'>
        <Rating
          value={product.rating}
          readOnly
          precision={0.5}
          size='large'
        />
        <Typography
          variant='body2'
          ml={1}>
          ({product.rating.toFixed(1)})
        </Typography>
      </Box>
      {product.discountPrice ? (
        <Stack
          direction='row'
          gap={1}
          alignItems='center'>
          <Typography
            variant='h3'
            color='error'>
            {formatNumberWithSeperator(product.discountPrice)} VNĐ
          </Typography>
          <Typography
            variant='h6'
            color='textSecondary'
            sx={{ textDecoration: 'line-through' }}>
            {formatNumberWithSeperator(product.price)} VNĐ
          </Typography>
          <Chip
            label={`-${(
              ((product.price - product.discountPrice) / product.price) *
              100
            ).toFixed(2)}%`}
            color='error'
            size='small'
            variant='outlined'
          />
        </Stack>
      ) : (
        <Typography
          variant='h3'
          color='error'>
          {formatNumberWithSeperator(product.price)} VNĐ
        </Typography>
      )}
      <Stack
        direction='row'
        gap={2}
        alignItems='center'>
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.discountPrice ?? product.price}
          productImage={product.imageUrls[0]}
        />
        <AddToWishlist productId={product.id} />
        <Typography
          variant='body2'
          ml={2}>
          {product.stock} trong kho
        </Typography>
      </Stack>
    </Stack>
  );
}
