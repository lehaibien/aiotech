import {
  changePasswordSchema,
  emailSchema,
  profileSchema,
  userLoginSchema,
  userRegisterSchema,
  userRequestSchema,
} from '@/schemas/userSchema';
import { UUID } from 'crypto';
import { z } from 'zod';
import { BaseResponse } from './base';

export type UserResponse = {
  id: UUID;
  userName: string;
  familyName?: string;
  givenName: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  roleId?: UUID;
  role?: string;
  isLocked: boolean;
} & BaseResponse;

export type UserProfileResponse = {
  familyName: string;
  givenName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
};

export type UserLoginRequest = z.infer<typeof userLoginSchema>;
export type UserRegisterRequest = z.infer<typeof userRegisterSchema>;
export type UserRequest = z.infer<typeof userRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
