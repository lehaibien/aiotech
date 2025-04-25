import { BrandRequestSchema } from '@/schemas/brandSchema';
import { UUID } from "@/types";
import { z } from 'zod';
import { BaseResponse } from './base';

export type BrandResponse = {
  id: UUID;
  name: string;
  imageUrl: string;
} & BaseResponse;

export type BrandRequest = z.infer<typeof BrandRequestSchema>;
