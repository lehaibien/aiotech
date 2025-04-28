import { productRequestSchema } from "@/schemas/productSchema";
import { UUID } from "@/types";
import { z } from "zod";
import { BaseGetListRequest } from "./base";

export type ProductResponse = {
  id: UUID;
  sku: string;
  name: string;
  costPrice: number;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  imageUrls: string[];
  rating: number;
  stock: number;
  createdDate: Date;
};

export type ProductListItemResponse = {
  id: UUID;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  brand: string;
  rating: number;
  thumbnailUrl: string;
};

export type ProductDetailResponse = {
  id: UUID;
  sku: string;
  name: string;
  description: string;
  costPrice: number;
  price: number;
  discountPrice?: number;
  stock: number;
  brand: string;
  category: string;
  tags: string[];
  imageUrls: string[];
  rating: number;
  isFeatured?: boolean;
};

export type ProductUpdateResponse = {
  id: UUID;
  sku: string;
  name: string;
  description: string;
  costPrice: number;
  price: number;
  discountPrice?: number;
  stock: number;
  brandId: UUID;
  categoryId: UUID;
  thumbnailUrl: string;
  tags: string[];
  imageUrls: string[];
  isFeatured?: boolean;
};

export enum ProductSort {
  Default,
  PriceAsc,
  PriceDesc,
  Newest,
  Oldest,
}

export type GetListFilteredProductRequest = {
  minPrice?: number;
  maxPrice?: number;
  categories?: string;
  brands?: string;
  sort?: ProductSort;
} & BaseGetListRequest;

export type ProductRequest = z.infer<typeof productRequestSchema>;
