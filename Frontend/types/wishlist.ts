import { UUID } from "@/types";

export type WishlistItem = {
  id: string;
  productId: UUID;
  productName: string;
  productImageUrl: string;
  productPrice: number;
};

export type WishlistItemRequest = {
  userId: string;
  productId: string;
};
