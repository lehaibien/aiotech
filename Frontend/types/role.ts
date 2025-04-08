import { UUID } from "crypto";
import { BaseResponse } from "./base";
import { z } from "zod";

export type RoleResponse = {
  id: UUID;
  name: string;
} & BaseResponse;

export const RoleRequestSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string({ message: "Tên vai trò không được để trống" })
    .max(100, { message: "Tên vai trò không được vượt quá 100 ký tự" })
    .trim(),
});

export type RoleRequest = z.infer<typeof RoleRequestSchema>;

export const RoleRequestDefault: RoleRequest = {
  id: "",
  name: "",
};
