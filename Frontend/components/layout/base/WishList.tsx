"use client";

import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { wishlistItemsAtom } from "@/lib/globalState";
import { parseUUID } from "@/lib/utils";
import { WishlistItem } from "@/types/wishlist";
import { ActionIcon, Badge } from "@mantine/core";
import { useAtom } from "jotai";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export const WishList = () => {
  const { data: session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);
  const [wishlistItems, setWishlistItems] = useAtom(wishlistItemsAtom);
  useEffect(() => {
    if (!userId) return;
    const parsedUserId = parseUUID(userId);
    getApi(API_URL.wishlist + "/" + parsedUserId).then((res) => {
      if (res.success) {
        setWishlistItems(res.data as WishlistItem[]);
      }
    });
  }, [setWishlistItems, userId]);
  return (
    <ActionIcon
      variant="transparent"
      color="dark"
      component={Link}
      href="/wishlist"
      aria-label="Danh sách yêu thích"
      pos="relative"
      w={40}
      h={40}
    >
      <Heart size={20} />
      {wishlistItems.length > 0 && (
        <Badge pos="absolute" top={0} right={0} circle>
          {wishlistItems.length}
        </Badge>
      )}
    </ActionIcon>
  );
};
