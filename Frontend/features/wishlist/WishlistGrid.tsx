'use client';

import { wishlistItemsAtom } from '@/lib/globalState';
import { Grid } from '@mui/material';
import { useAtomValue } from 'jotai';
import { WishlistEmpty } from './WishlistEmpty';
import { WishlistItemCard } from './WishlistItemCard';

export const WishlistGrid = () => {
  const wishlist = useAtomValue(wishlistItemsAtom);

  return (
    <Grid
      container
      spacing={2}>
      {wishlist.length > 0 ? (
        wishlist.map((item) => (
          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3,
            }}
            key={item.id}>
            <WishlistItemCard
              productId={item.productId}
              productName={item.productName}
              productImageUrl={item.productImageUrl}
              productPrice={item.productPrice}
            />
          </Grid>
        ))
      ) : (
        <WishlistEmpty />
      )}
    </Grid>
  );
};
