import useCart from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatNumberWithSeperator } from '@/lib/utils';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { UUID } from "@/types";
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent } from 'react';

type WishlistItemCardProps = {
  productId: UUID;
  productName: string;
  productImageUrl: string;
  productPrice: number;
};

export const WishlistItemCard = ({
  productId,
  productName,
  productImageUrl,
  productPrice,
}: WishlistItemCardProps) => {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();
  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId,
      productName,
      productImage: productImageUrl,
      productPrice,
      quantity: 1,
    });
  };

  const handleRemoveFromWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(productId);
  };
  return (
    <Card
      component={Link}
      href={`/products/${productId}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <CardMedia
        sx={{
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
          src={productImageUrl}
          height={200}
          width={200}
          alt={productName}
          style={{
            objectFit: 'contain',
          }}
          placeholder='blur'
          blurDataURL={productImageUrl}
          priority={true}
        />
      </CardMedia>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
        }}>
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
          {productName}
        </Typography>
        <Typography
          variant='h6'
          fontWeight={600}
          color='error'
          noWrap>
          {formatNumberWithSeperator(productPrice)} đ
        </Typography>

        <Stack
          direction='row'
          spacing={1}
          justifyContent='space-between'
          alignItems='center'
          sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            size='small'
            onClick={handleAddToCart}
            data-umami-event='Thêm vào giỏ hàng'>
            <AddShoppingCartIcon fontSize='small' />
            Thêm vào giỏ
          </Button>
          <Button
            variant='contained'
            color='error'
            size='small'
            onClick={handleRemoveFromWishlist}
            data-umami-event='Huỷ yêu thích sản phẩm'>
            <FavoriteIcon fontSize='small' />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
