import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constant/common';
import { z } from 'zod';

export const productRequestSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z
    .string()
    .min(1, { message: 'Mã sản phẩm không được để trống' })
    .max(100, { message: 'Mã sản phẩm không được vượt quá 100 ký tự' })
    .trim(),
  name: z
    .string()
    .min(1, { message: 'Tên sản phẩm không được để trống' })
    .max(100, { message: 'Tên sản phẩm không được vượt quá 100 ký tự' })
    .trim(),
  description: z.string().optional(),
  price: z
    .number({ message: 'Giá sản phẩm không hợp lệ' })
    .min(0, { message: 'Giá sản phẩm phải không được nhỏ hơn 0' }),
  discountPrice: z
    .number({ message: 'Giá giảm giá không hợp lệ' })
    .min(0, { message: 'Giá giảm giá phải không được nhỏ hơn 0' })
    .optional(),
  stock: z
    .number({ message: 'Số lượng sản phẩm không hợp lệ' })
    .min(1, { message: 'Số lượng sản phẩm phải lớn hơn 0' }),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  images: z.array(
    z
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
  ),
  isFeatured: z.preprocess(
    (val) => (val === 'true' || val === 'false' ? val === 'true' : val),
    z.boolean().optional()
  ),
});
