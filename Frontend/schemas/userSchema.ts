import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constant/common';
import { z } from 'zod';

export const userRequestSchema = z.object({
  id: z.string().optional(),
  userName: z
    .string()
    .min(1, { message: 'Tên đăng nhập không được để trống' })
    .max(100, { message: 'Tên đăng nhập không được vượt quá 100 ký tự' })
    .trim(),
  familyName: z
    .string()
    .max(100, { message: 'Họ không được vượt quá 100 ký tự' })
    .trim()
    .optional(),
  givenName: z
    .string()
    .min(1, { message: 'Tên không được để trống' })
    .max(100, { message: 'Tên không được vượt quá 100 ký tự' })
    .trim(),
  email: z
    .string({ message: 'Email không được để trống' })
    .email({ message: 'Email không hợp lệ' }),
  phoneNumber: z.string().optional(),
  password: z
    .string({ message: 'Mật khẩu không được để trống' })
    .min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }),
  roleId: z.string().uuid().optional(),
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

export const userRegisterSchema = z.object({
  userName: z
    .string()
    .min(1, { message: 'Tên đăng nhập không được để trống' })
    .max(100, { message: 'Tên đăng nhập không được vượt quá 100 ký tự' })
    .trim(),
  familyName: z.string().optional(),
  // .min(1, { message: 'Họ không được để trống' })
  // .max(100, { message: 'Họ không được vượt quá 100 ký tự' })
  // .trim(),
  givenName: z.string().optional(),
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .email({ message: 'Email không hợp lệ' }),
  phoneNumber: z.string().optional(),
  password: z
    .string()
    .min(1, { message: 'Mật khẩu không được để trống' })
    .min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }),
});

export const userLoginSchema = z.object({
  username: z.string().trim(),
  password: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: 'Mật khẩu cữ không được để trống' }),
    newPassword: z
      .string()
      .min(1, { message: 'Mật khẩu mới không được để trống' }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Xác nhận mật khẩu mới không được để trống' }),
  })
  .refine((obj) => obj.newPassword === obj.confirmNewPassword, {
    message: 'Mật khẩu mới và xác nhận mật khẩu mới phải giống nhau',
    path: ['newPassword', 'confirmNewPassword'],
  });

export const profileSchema = z.object({
  familyName: z.string().optional(),
  givenName: z.string().min(1, { message: 'Tên bắt buộc nhập' }),
  phoneNumber: z
    .string()
    .regex(/^(0|\+84)(\d{9,10})$/, {
      message:
        'Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx)',
    })
    .transform((value) => {
      // if it's +84, remove the +84 prefix add 0 to the beginning
      return value.replace('+84', '0');
    })
    .optional(),
  address: z.string().optional(),
  image: z.instanceof(File).optional(),
  isImageEdited: z.boolean().optional(),
});

export const emailSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
});
