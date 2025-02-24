import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constant/common";
import { UUID } from "crypto";
import { z } from "zod";

export type PostPreviewResponse = {
  id: UUID;
  title: string;
  imageUrl: string;
  createdDate: Date;
};

export type PostResponse = {
  id: UUID;
  title: string;
  content: string;
  imageUrl: string;
  isPublished: boolean;
  tags: string[];
  createdDate: Date;
};

export const PostRequestSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Tiêu đề phải có ít nhất 1 ký tự"),
  content: z.string().optional(),
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
  isPublished: z.preprocess(
    (val) => (val === "true" || val === "false" ? val === "true" : val),
    z.boolean().optional()
  ),
  tags: z.array(z.string()).optional(),
});

export type PostRequest = z.infer<typeof PostRequestSchema>;
