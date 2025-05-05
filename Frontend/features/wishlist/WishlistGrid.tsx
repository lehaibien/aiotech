"use client";

import { wishlistItemsAtom } from "@/lib/globalState";
import { SimpleGrid } from "@mantine/core";
import { useAtomValue } from "jotai";
import { WishlistEmpty } from "./WishlistEmpty";
import { WishlistItemCard } from "./WishlistItemCard";

export const WishlistGrid = () => {
  const wishlist = useAtomValue(wishlistItemsAtom);
  return wishlist.length > 0 ? (
    <SimpleGrid
      cols={{
        xs: 2,
        sm: 3,
        md: 4,
      }}
    >
      {wishlist.map((item) => (
        <WishlistItemCard
          key={item.id}
          productId={item.productId}
          productName={item.productName}
          productImageUrl={item.productImageUrl}
          productPrice={item.productPrice}
        />
      ))}
    </SimpleGrid>
  ) : (
    <WishlistEmpty />
  );
};
