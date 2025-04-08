import { UUID } from "crypto";
import { BaseResponse } from "./base";
import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  EMPTY_UUID,
  MAX_FILE_SIZE,
} from "@/constant/common";

export type CategoryResponse = {
  id: UUID;
  name: string;
  imageUrl: string;
} & BaseResponse;

export const CategoryRequestSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string({ message: "Tên thể loại không được để trống" })
    .max(100, { message: "Tên thể loại không được vượt quá 100 ký tự" })
    .trim(),
  image: z
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
    .optional(),
});

export type CategoryRequest = z.infer<typeof CategoryRequestSchema>;

export const CategoryRequestDefault: CategoryRequest = {
  id: EMPTY_UUID,
  name: "",
};
