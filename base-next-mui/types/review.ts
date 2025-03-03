import { UUID } from "crypto";
import { BaseResponse, BaseGetListRequest } from "./base";
import { z } from "zod";

export type ReviewResponse = {
  id: UUID;
  userName: string;
  productName: string;
  rating: number;
  comment: string;
} & BaseResponse;

export type ReviewProductResponse = {
  id: UUID;
  userName: string;
  userImageUrl?: string;
  rating: number;
  comment: string;
  createdDate: Date;
};

export type GetListReviewByProductIdRequest = {
  productId: UUID;
} & BaseGetListRequest;

export const ReviewRequestSchema = z.object({
  productID: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;
