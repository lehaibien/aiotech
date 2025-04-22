import { CategoryRequestSchema } from '@/schemas/categorySchema';
import { UUID } from "@/types";
import { z } from 'zod';
import { BaseResponse } from './base';

export type CategoryResponse = {
  id: UUID;
  name: string;
  imageUrl: string;
} & BaseResponse;

export type CategoryRequest = z.infer<typeof CategoryRequestSchema>;
