'use client';

import { LOW_STOCK_THRESHOLD } from '@/constant/common';
import useCart from '@/hooks/useCart';
import { formatNumberWithSeperator } from '@/lib/utils';
import { ProductResponse } from '@/types';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

type ProductCardProps = {
  product: ProductResponse;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id,
    name,
    imageUrls: thumbnails,
    brand,
    price,
    discountPrice,
    rating,
    stock,
  } = product;
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(thumbnails[0]);

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart({
        productId: id,
        productName: name,
        productPrice: discountPrice ?? price,
        productImage: thumbnails[0],
        quantity: 1,
      });
      enqueueSnackbar('Đã thêm sản phẩm vào giỏ hàng', { variant: 'success' });
      return;
    }
    enqueueSnackbar('Sản phẩm đã hết hàng', { variant: 'error' });
  };

  const handleMouseEnter = () => {
    if (thumbnails.length > 1) {
      setCurrentImage(thumbnails[1]);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(thumbnails[0]);
  };

  const getStockColor = () => {
    if (stock <= 0) return 'error';
    if (stock <= LOW_STOCK_THRESHOLD) return 'warning';
    return 'success';
  };

  const getStockText = () => {
    if (stock <= 0) return 'Hết hàng';
    if (stock <= LOW_STOCK_THRESHOLD) return 'Sắp hết hàng';
    return 'Còn hàng';
  };
  return (
    <Card
      component={Link}
      href={`/products/${id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {/* Stock status chip */}
      {stock <= LOW_STOCK_THRESHOLD && (
        <Chip
          label={getStockText()}
          color={getStockColor()}
          size='small'
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            fontWeight: 600,
          }}
        />
      )}
      {/* Product image */}
      <CardMedia
        sx={{
          position: 'relative',
          height: 220,
          display: 'flex',
          backgroundColor: 'background.default',
          border: '1px solid',
          borderBottom: 'none',
          borderColor: 'background.paper',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        <Image
          src={currentImage}
          height={200}
          width={200}
          alt={name}
          style={{
            objectFit: 'contain',
          }}
          placeholder='blur'
          blurDataURL={currentImage}
        />
        {product.discountPrice && (
          <Chip
            label={`-${(
              (1 - product.discountPrice / product.price) *
              100
            ).toFixed(2)}%`}
            color='error'
            size='small'
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        )}
      </CardMedia>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 1,
          p: 2,
        }}>
        {/* Brand and product name */}
        <Box>
          <Typography
            variant='overline'
            color='primary'
            noWrap>
            {brand}
          </Typography>
          <Typography
            variant='body1'
            component='h3'
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {name}
          </Typography>
        </Box>
        {/* Pricing and actions */}
        <Stack gap={0.5}>
          {/* Price display */}
          {discountPrice ? (
            <>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{
                  textDecoration: 'line-through',
                  whiteSpace: 'nowrap',
                }}>
                {formatNumberWithSeperator(price)} đ
              </Typography>
              <Typography
                variant='h6'
                fontWeight={600}
                color='error'
                noWrap>
                {formatNumberWithSeperator(discountPrice)} đ
              </Typography>
            </>
          ) : (
            <Typography
              variant='h6'
              fontWeight={600}
              color='error'
              noWrap>
              {formatNumberWithSeperator(price)} đ
            </Typography>
          )}
          {/* Rating */}
          <Stack
            direction='row'
            alignItems='center'
            spacing={0.5}>
            <Rating
              value={rating}
              precision={0.1}
              size='small'
              readOnly
              sx={{ '& .MuiRating-icon': { fontSize: '1rem' } }}
            />
            <Typography
              variant='caption'
              color='text.secondary'>
              ({rating.toFixed(1)})
            </Typography>
          </Stack>
          {/* Add to cart button */}
          <Stack
            direction='row'
            alignItems='center'
            sx={{
              mt: 'auto',
              gap: 1,
            }}>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              size='small'
              disabled={stock <= 0}
              onClick={handleAddToCartClick}
              data-umami-event='Thêm vào giỏ hàng'>
              <AddShoppingCartIcon fontSize='small' />
              Thêm vào giỏ
            </Button>
            <Button
              variant='outlined'
              color='primary'
              size='small'
              onClick={() => {}}
              data-umami-event='Yêu thích sản phẩm'>
              <FavoriteIcon fontSize='small' />
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
