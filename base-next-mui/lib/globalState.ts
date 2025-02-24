import { CartItemResponse } from "@/types";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

export interface ProductFilter {
  minPrice: number;
  maxPrice: number;
  categories: string[];
  brands: string[];
}

// Deep comparison filter atom
export const filterProductAtom = atomWithStorage<ProductFilter>(
  'productFilter',
  {
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: Infinity,
  }
);

export const sortProductAtom = atom('default');

export const cartItemsAtom = atom<CartItemResponse[]>([]);

export const userProfileAtom = atom({
  familyName: '',
  givenName: '',
  email: '',
  phoneNumber: '',
  avatarUrl: '',
});

export const activeTabAtom = atom(0);