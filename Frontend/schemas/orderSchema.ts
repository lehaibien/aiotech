import { PaymentMethods } from '@/types/order';
import { z } from 'zod';

export const checkoutFormSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().regex(/^(0|\+84)(\d{9,10})$/, {
    message:
      'Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx)',
  }),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  note: z.string().optional(),
  provider: z.nativeEnum(PaymentMethods),
});

export const checkoutRequestSchema = z.object({
  customerId: z.string().uuid(),
  tax: z.number(),
  totalPrice: z
    .number()
    .min(1, { message: 'Thành tiền phải lớn hơn hoặc bằng 0' }),
  name: z.string(),
  phoneNumber: z.string().regex(/^(0|\+84)(\d{9,10})$/, {
    message:
      'Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx)',
  }),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  note: z.string().optional(),
  provider: z.nativeEnum(PaymentMethods),
  orderItems: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z
        .number()
        .min(1, { message: 'Số lượng sản phẩm phải lớn hơn 0' }),
      price: z
        .number()
        .min(1, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' }),
    })
  ),
});
