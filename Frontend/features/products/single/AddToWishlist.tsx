'use client';

import { Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useWishlist } from '@/hooks/useWishlist';

type AddToWishlistProps = {
  productId: string;
};

export const AddToWishlist = ({ productId }: AddToWishlistProps) => {
  const { addToWishlist } = useWishlist();
  const handleAddToWishlist = () => {
    addToWishlist(productId);
  };
  return (
    <Button
      variant='contained'
      color='secondary'
      startIcon={<FavoriteBorderIcon />}
      onClick={handleAddToWishlist}>
      Thêm vào yêu thích
    </Button>
  );
};
