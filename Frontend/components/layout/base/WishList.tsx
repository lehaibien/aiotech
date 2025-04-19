'use client';

import { API_URL } from '@/constant/apiUrl';
import { getApi } from '@/lib/apiClient';
import { wishlistItemsAtom } from '@/lib/globalState';
import { parseUUID } from '@/lib/utils';
import { WishlistItem } from '@/types/wishlist';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Badge, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';

export const WishList = () => {
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  const [wishlistItems, setWishlistItems] = useAtom(wishlistItemsAtom);
  useEffect(() => {
    if (!userId) return;
    const parsedUserId = parseUUID(userId);
    getApi(API_URL.wishlist + '/' + parsedUserId).then((res) => {
      if (res.success) {
        setWishlistItems(res.data as WishlistItem[]);
      }
    });
  }, [setWishlistItems, userId]);
  return (
    <IconButton
      LinkComponent={Link}
      href='/wishlist'
      aria-label='Danh sách yêu thích'
      color='inherit'
      sx={{ p: 1 }}>
      <Badge
        badgeContent={wishlistItems.length}
        color='error'>
        <FavoriteBorderOutlinedIcon fontSize='small' />
      </Badge>
    </IconButton>
  );
};
