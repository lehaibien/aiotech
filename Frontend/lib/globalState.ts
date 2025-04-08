import { CartItemResponse } from "@/types";
import { atom } from "jotai";

export const cartItemsAtom = atom<CartItemResponse[]>([]);