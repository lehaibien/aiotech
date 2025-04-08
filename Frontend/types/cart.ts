import { UUID } from "crypto";
import { ProductDetailResponse } from "./product";

export type CartItemRequest = {
  userId: UUID;
  productId: UUID;
  quantity?: number;
}

export type RemoveCartItemRequest = {
  userId: UUID;
  productId: UUID;
}

export type CartItem = {
  productId: UUID;
  quantity: number;
  product: ProductDetailResponse;
}

export type CartItemResponse = {
  productId: UUID;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}