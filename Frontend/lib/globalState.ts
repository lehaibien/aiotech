import { CartItemResponse } from "@/types";
import { WishlistItem } from "@/types/wishlist";
import { atom } from "jotai";

export const cartItemsAtom = atom<CartItemResponse[]>([]);

export const wishlistItemsAtom = atom<WishlistItem[]>([]);