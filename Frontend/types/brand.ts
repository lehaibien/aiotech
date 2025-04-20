import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constant/common';
import { UUID } from 'crypto';
import { z } from 'zod';
import { BaseResponse } from './base';

export type BrandResponse = {
  id: UUID;
  name: string;
  imageUrl: string;
} & BaseResponse;

export const BrandRequestSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(0, { message: 'Tên thương hiệu không được để trống' })
    .max(100, { message: 'Tên thương hiệu không được vượt quá 100 ký tự' })
    .trim(),
  image: z
    .any()
    .refine((value) => value instanceof File, {
      message: 'Ảnh không hợp lệ',
    })
    .refine((images) => images.size <= MAX_FILE_SIZE, {
      message: `Dung lượng ảnh không được vượt quá ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
    })
    .refine((images) => ACCEPTED_IMAGE_TYPES.includes(images.type), {
      message: `Định dạng ảnh không hợp lệ. Chỉ chấp nhận ${ACCEPTED_IMAGE_TYPES.join(
        ', '
      )}`,
    })
    .optional(),
});

export type BrandRequest = z.infer<typeof BrandRequestSchema>;
