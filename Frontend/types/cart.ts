import { UUID } from "crypto";

export type CartItemRequest = {
  userId: UUID;
  productId: UUID;
  quantity?: number;
}

export type RemoveCartItemRequest = {
  userId: UUID;
  productId: UUID;
}

export type CartItemResponse = {
  productId: UUID;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}