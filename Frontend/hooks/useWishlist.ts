import { API_URL } from '@/constant/apiUrl';
import { deleteApi, deleteApiWithBody, postApi } from '@/lib/apiClient';
import { wishlistItemsAtom } from '@/lib/globalState';
import { parseUUID } from '@/lib/utils';
import { RemoveCartItemRequest } from '@/types';
import { WishlistItem, WishlistItemRequest } from '@/types/wishlist';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useAtom(wishlistItemsAtom);
  const { data: session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (userId) {
        const request: WishlistItemRequest = {
          userId: parseUUID(userId),
          productId: parseUUID(productId),
        };
        const response = await postApi(API_URL.wishlist, request);
        if (response.success) {
          setWishlistItems((prev) => [...prev, response.data as WishlistItem]);
          return '';
        } else {
          return response.message;
        }
      }
      return 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích';
    },
    [setWishlistItems, userId]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (userId) {
        const request: RemoveCartItemRequest = {
          userId: parseUUID(userId),
          productId: parseUUID(productId),
        };
        const response = await deleteApiWithBody(API_URL.wishlist, request);
        if (response.success) {
          setWishlistItems((prev) =>
            prev.filter((item) => item.productId !== productId)
          );
        }
      }
    },
    [setWishlistItems, userId]
  );

  const clearWishlist = useCallback(async () => {
    if (userId) {
      const response = await deleteApi(
        API_URL.wishlist + '/' + userId + '/clear'
      );
      if (response.success) {
        setWishlistItems([]);
      }
    }
  }, [setWishlistItems, userId]);
  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
}
