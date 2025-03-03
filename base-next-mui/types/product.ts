import {
  ACCEPTED_IMAGE_TYPES,
  EMPTY_UUID,
  MAX_FILE_SIZE,
} from "@/constant/common";
import { UUID } from "crypto";
import { z } from "zod";
import { BaseGetListRequest } from "./base";

export type ProductDetailResponse = {
  id: UUID;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  tags: string[];
  imageUrls: string[];
  rating: number;
  isFeatured?: boolean;
};

export type ProductResponse = {
  id: UUID;
  sku: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageUrls: string[];
  rating: number;
  stock: number;
  createdDate: Date;
};

export type ProductUpdateResponse = {
  id: UUID;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: UUID;
  categoryId: UUID;
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

export type GetListProductRequest = {
  minPrice?: number;
  maxPrice?: number;
  categories?: string;
  brands?: string;
  sort?: ProductSort;
} & BaseGetListRequest;

export const ProductRequestSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z
    .string()
    .min(1, { message: "Mã sản phẩm không được để trống" })
    .max(100, { message: "Mã sản phẩm không được vượt quá 100 ký tự" })
    .trim(),
  name: z
    .string()
    .min(1, { message: "Tên sản phẩm không được để trống" })
    .max(100, { message: "Tên sản phẩm không được vượt quá 100 ký tự" })
    .trim(),
  description: z.string().optional(),
  price: z
    .number({ message: "Giá sản phẩm không hợp lệ" })
    .min(0, { message: "Giá sản phẩm phải không được nhỏ hơn 0" }),
  stock: z
    .number({ message: "Số lượng sản phẩm không hợp lệ" })
    .min(1, { message: "Số lượng sản phẩm phải lớn hơn 0" }),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  images: z.array(
    z
      .any()
      .refine((value) => value instanceof File, {
        message: "Ảnh không hợp lệ",
      })
      .refine((images) => images.size <= MAX_FILE_SIZE, {
        message: `Dung lượng ảnh không được vượt quá ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`,
      })
      .refine((images) => ACCEPTED_IMAGE_TYPES.includes(images.type), {
        message: `Định dạng ảnh không hợp lệ. Chỉ chấp nhận ${ACCEPTED_IMAGE_TYPES.join(
          ", "
        )}`,
      })
  ),
  isFeatured: z.preprocess(
    (val) => (val === "true" || val === "false" ? val === "true" : val),
    z.boolean().optional()
  ),
});

export type ProductRequest = z.infer<typeof ProductRequestSchema>;

export const ProductRequestDefault: ProductRequest = {
  id: EMPTY_UUID,
  sku: "",
  name: "",
  description: "",
  price: 0,
  stock: 0,
  brandId: EMPTY_UUID,
  categoryId: EMPTY_UUID,
  tags: [],
  images: [],
  isFeatured: false,
};
