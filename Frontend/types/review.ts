import { reviewRequestSchema } from '@/schemas/reviewSchema';
import { UUID } from "@/types";
import { z } from 'zod';
import { BaseGetListRequest, BaseResponse } from './base';

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

export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
